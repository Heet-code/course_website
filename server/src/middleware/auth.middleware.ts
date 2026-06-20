import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new ApiError(401, 'Authentication token required');
    }

    try {
      const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as {
        id: string;
        role: string;
      };

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError(401, 'User associated with this token not found');
      }

      req.user = user;
      next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Authentication token has expired');
      }
      throw new ApiError(401, 'Invalid authentication token');
    }
  }
);

export const optionalAuthenticate: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      return next();
    }
    try {
      const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as {
        id: string;
        role: string;
      };
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
      next();
    } catch (err) {
      // Fail silently for optional auth
      next();
    }
  }
);

export const verifyTurnstile: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const isProd = env.NODE_ENV === 'production';
    const token = req.body?.turnstileToken;

    if (env.TURNSTILE_BYPASS === 'true') {
      return next();
    }

    // In production, we require the token.
    if (isProd && !token) {
      throw new ApiError(400, 'Security verification token (Turnstile) is required');
    }

    if (!token) {
      return next();
    }

    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: req.ip,
        }),
      });

      const data = await response.json() as { success: boolean; 'error-codes'?: string[] };

      if (!data.success) {
        const errors = data['error-codes'] || [];
        if (errors.includes('invalid-input-response')) {
          throw new ApiError(400, 'Security verification failed. Please refresh the page and try again.');
        }
        throw new ApiError(400, `Security verification failed: ${errors.join(', ') || 'invalid token'}`);
      }

      next();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(500, `Failed to verify security token: ${err.message}`);
    }
  }
);

export default authenticate;
