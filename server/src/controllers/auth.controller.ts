import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AuthService } from '../services/auth.service';
import { setTokenCookies, clearTokenCookies } from '../services/token.service';
import { emailService } from '../services/email.service';
import { User } from '../models/User.model';
import { ApiResponse } from '../utils/ApiResponse';
import { sanitizeUser } from '../utils/sanitizeUser';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  const user = await AuthService.register({ name, email, passwordHash: password, role });
  
  // Send welcome email (non-blocking)
  emailService.sendWelcomeEmail(user.email, user.name);

  res
    .status(201)
    .json(new ApiResponse(201, sanitizeUser(user), 'User registered successfully'));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Return a generic message even if the email doesn't exist to prevent email enumeration
    res.status(200).json(new ApiResponse(200, null, 'If an account with that email exists, a reset link has been sent.'));
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // Send the email with the unhashed token
  await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

  res.status(200).json(new ApiResponse(200, null, 'If an account with that email exists, a reset link has been sent.'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }, // Check if token has not expired
  });

  if (!user) {
    throw new ApiError(400, 'Token is invalid or has expired');
  }

  // Set the new password - the pre-save hook in User model will hash it automatically
  user.passwordHash = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password has been reset successfully. You can now log in.'));
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
