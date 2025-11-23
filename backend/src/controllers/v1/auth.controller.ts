import { Request, Response } from "express";
import { registerUser, loginUser } from "../../services/v1/auth.service";

export const register = async (request: Request, response: Response) => {
  const { name, email, password } = request.body;

  const registerdUser = await registerUser(name, email, password);

  if (registerdUser.error) {
    return response.status(registerdUser.status).json({ message: registerdUser.error });
  }

  return response.status(registerdUser.status).json({
    message: registerdUser.message,
  });
};

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  const loginedUser = await loginUser(email, password);

  if (loginedUser.error) {
    return response.status(loginedUser.status).json({ message: loginedUser.error });
  }

  return response.status(loginedUser.status).json({
    message: loginedUser.message,
    token: loginedUser.token,
    user: loginedUser.user,
  });
};
