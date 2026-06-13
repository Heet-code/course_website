import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { sanitizeUser } from '../utils/sanitizeUser';
import { asyncHandler } from '../utils/asyncHandler';

export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const users = await User.find().sort({ createdAt: -1 });
  const sanitizedUsers = users.map((u) => sanitizeUser(u));
  res
    .status(200)
    .json(new ApiResponse(200, sanitizedUsers, 'Users retrieved successfully'));
});

export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res
    .status(200)
    .json(new ApiResponse(200, sanitizeUser(user), 'User retrieved successfully'));
});

export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id || req.user?._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check authorization (only self or admin can update)
  if (req.user?.role !== 'admin' && req.user?._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Unauthorized operation');
  }

  const { name, bio, title, avatarUrl } = req.body;
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (title !== undefined) user.title = title;
  if (avatarUrl) user.avatarUrl = avatarUrl;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, sanitizeUser(user), 'User updated successfully'));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await User.deleteOne({ _id: user._id });

  res
    .status(200)
    .json(new ApiResponse(200, null, 'User deleted successfully'));
});

export const changeUserRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { role } = req.body;
  if (role) {
    user.role = role;
    await user.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, sanitizeUser(user), 'User role updated successfully'));
});
