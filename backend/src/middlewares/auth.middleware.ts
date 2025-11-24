import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error";
import { HTTP } from "../constants/httpCodes";
import { MESSAGES } from "../constants/messages";
import UserModel from "../models/User.model";
import type { UserPayload } from "../types/userPayload";

interface JwtPayload {
  id: string;
  email?: string;
  name?: string;
  exp?: number;
}

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(
      createError(HTTP.UNAUTHORIZED, MESSAGES.USER.INVALID_CREDENTIALS)
    );
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await UserModel.findById(decoded.id).select("_id name email");

    if (!user) {
      return next(createError(HTTP.UNAUTHORIZED, MESSAGES.USER.NOT_FOUND));
    }

    const payload: UserPayload = {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
    };

    req.user = payload;

    return next();
  } catch (err: unknown) {
    if (err?.name === "TokenExpiredError") {
      return next(createError(HTTP.UNAUTHORIZED, MESSAGES.USER.TOKEN_EXPIRED));
    }

    return next(
      createError(HTTP.UNAUTHORIZED, MESSAGES.USER.INVALID_CREDENTIALS)
    );
  }
};

export default requireAuth;
