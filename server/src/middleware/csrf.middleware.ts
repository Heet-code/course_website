import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export const verifyCsrf: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If in development, skip or allow
  if (env.NODE_ENV === 'development') {
    return next();
  }

  // Ensure request is not from another site for mutation methods
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  const expectedOrigin = env.CLIENT_URL;

  // Simple origin/referer verification
  if (
    (origin && origin !== expectedOrigin) ||
    (!origin && referer && !referer.startsWith(expectedOrigin))
  ) {
    return next(new ApiError(403, 'CSRF state verification failed'));
  }

  next();
};

export default verifyCsrf;
