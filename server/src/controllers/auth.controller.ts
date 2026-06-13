import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { setTokenCookies, clearTokenCookies } from '../services/token.service';
import { ApiResponse } from '../utils/ApiResponse';
import { sanitizeUser } from '../utils/sanitizeUser';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  const user = await AuthService.register({ name, email, passwordHash: password, role });
  
  res
    .status(201)
    .json(new ApiResponse(201, sanitizeUser(user), 'User registered successfully'));
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password, selectedRole } = req.body;
  
  const { user, accessToken, refreshToken } = await AuthService.login(email, password, selectedRole);
  
  setTokenCookies(res, accessToken, refreshToken);

  res
    .status(200)
    .json(new ApiResponse(200, sanitizeUser(user), 'Login successful'));
});

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  clearTokenCookies(res);
  res
    .status(200)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(401, 'Refresh token required');
  }

  const { accessToken, refreshToken, user } = await AuthService.refresh(token);
  setTokenCookies(res, accessToken, refreshToken);

  res
    .status(200)
    .json(new ApiResponse(200, sanitizeUser(user), 'Token refreshed successfully'));
});

export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }
  res
    .status(200)
    .json(new ApiResponse(200, sanitizeUser(req.user), 'User retrieved successfully'));
});
