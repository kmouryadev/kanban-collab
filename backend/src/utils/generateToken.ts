import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  return jwt.sign(payload, secret, {
    expiresIn: '1d',
  });
};
