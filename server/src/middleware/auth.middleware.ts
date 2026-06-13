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

export default authenticate;
