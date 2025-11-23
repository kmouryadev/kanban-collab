import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

const errorMiddleware = (
  err: AppError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;

  response.status(status).json({
    message: err.message || "Internal Server Error"
  });
};

export default errorMiddleware;
