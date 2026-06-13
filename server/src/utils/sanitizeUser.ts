import { IUser } from '../models/User.model';

export interface ISafeUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatarUrl?: string;
  bio?: string;
  title?: string;
  joinedDate: string;
}

export const sanitizeUser = (user: IUser): ISafeUser => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    title: user.title,
    joinedDate: user.joinedDate.toISOString(),
  };
};

export default sanitizeUser;
