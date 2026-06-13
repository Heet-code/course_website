import { User, UserRole } from '../types';
import { getUsers, setUsers, setSession, getSession } from './storage';
import { safeRequest } from './apiClient';

// Helper mock network delay for fallback
export const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms));

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SignupData {
  name: string;
  email: string;
  passwordConfirm: string; // for form compliance
  role?: UserRole; // default to student
}

// Local mock fallback implementation (only runs if backend is offline in DEV)
const mockLogin = async (email: string, password: string): Promise<LoginResponse> => {
  await delay(400);
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const matchedUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!matchedUser) {
    return { success: false, error: 'User account not found.' };
  }

  let isValid = false;
  if (normalizedEmail === 'student@thelearningcollective.com' && password === 'student123') isValid = true;
  else if (normalizedEmail === 'instructor@thelearningcollective.com' && password === 'instructor123') isValid = true;
  else if (normalizedEmail === 'admin@thelearningcollective.com' && password === 'admin123') isValid = true;
  else if (!['student@thelearningcollective.com', 'instructor@thelearningcollective.com', 'admin@thelearningcollective.com'].includes(normalizedEmail) && password.length >= 6) {
    isValid = true;
  }

  if (!isValid) {
    return { success: false, error: 'Invalid password. Please try again.' };
  }

  setSession(matchedUser);
  return { success: true, user: matchedUser };
};

const mockSignup = async (name: string, email: string, role: UserRole = 'student'): Promise<LoginResponse> => {
  await delay(500);
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newUser: User = {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name,
    email: normalizedEmail,
    role,
    avatarUrl: `https://images.unsplash.com/photo-${['1535713875002-d1d0cf377fde', '1494790108377-be9c29b29330', '1570295999919-56ceb5ecca61'][Math.floor(Math.random() * 3)]}?w=150`,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  };

  const updatedUsers = [...users, newUser];
  setUsers(updatedUsers);
  setSession(newUser);

  return { success: true, user: newUser };
};

const mockLogout = async (): Promise<void> => {
  await delay(200);
  setSession(null);
};

const mockGetCurrentUser = (): User | null => {
  return getSession();
};

export const mockAuth = {
  // Login method
  async login(email: string, password: string, selectedRole: UserRole = 'student'): Promise<LoginResponse> {
    try {
      const responseUser = await safeRequest<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, selectedRole }),
      }, async () => {
        const fallbackRes = await mockLogin(email, password);
        if (!fallbackRes.success || !fallbackRes.user) {
          throw new Error(fallbackRes.error || 'Auth failed');
        }
        return fallbackRes.user;
      });

      return { success: true, user: responseUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication failed' };
    }
  },

  // Signup method (creates student account)
  async signup(name: string, email: string, role: UserRole = 'student'): Promise<LoginResponse> {
    try {
      const responseUser = await safeRequest<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password: email.split('@')[0] + '123', role }),
      }, async () => {
        const fallbackRes = await mockSignup(name, email, role);
        if (!fallbackRes.success || !fallbackRes.user) {
          throw new Error(fallbackRes.error || 'Signup failed');
        }
        return fallbackRes.user;
      });

      return { success: true, user: responseUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  },

  // Logout method
  async logout(): Promise<void> {
    await safeRequest<void>('/auth/logout', {
      method: 'POST',
    }, async () => {
      await mockLogout();
    });
  },

  // Check current session status
  async getCurrentUser(): Promise<User | null> {
    return await safeRequest<User | null>('/auth/me', {
      method: 'GET',
    }, async () => {
      return mockGetCurrentUser();
    }).catch(() => null);
  }
};
