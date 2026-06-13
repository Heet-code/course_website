import { User, IUser } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { generateTokens } from './token.service';

export class AuthService {
  static async register(userData: { name: string; email: string; passwordHash: string; role?: 'student' | 'instructor' | 'admin' }): Promise<IUser> {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    const newUser = await User.create({
      name: userData.name,
      email: userData.email,
      passwordHash: userData.passwordHash, // This will be hashed by mongoose pre-save hook
      role: userData.role || 'student',
      avatarUrl: `https://images.unsplash.com/photo-${['1535713875002-d1d0cf377fde', '1494790108377-be9c29b29330', '1570295999919-56ceb5ecca61'][Math.floor(Math.random() * 3)]}?w=150`,
    });

    return newUser;
  }

  static async login(email: string, password: string, selectedRole: 'student' | 'instructor' | 'admin'): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Role check validation
    if (user.role !== selectedRole) {
      throw new ApiError(400, 'Selected role does not match these credentials.');
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);

    return { user, accessToken, refreshToken };
  }

  static async refresh(token: string): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string; role: string };
      
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
      return { accessToken, refreshToken, user };
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  }
}
