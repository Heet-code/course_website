import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || error.status || 500;
    let message = error.message || 'Internal Server Error';

    // Intercept MongoDB unique constraint violations safely
    if (err.name === 'MongoServerError' && err.code === 11000) {
      statusCode = 400;
      message = 'A record with that information already exists.';
    } else if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Invalid input data.';
    } else if (statusCode === 500 && env.NODE_ENV === 'production') {
      // Obscure all internal 500 stack trace messages in production
      message = 'An unexpected internal error occurred.';
    }

    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;
