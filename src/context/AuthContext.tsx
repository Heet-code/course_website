import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockAuth } from '../lib/auth';
import { initializeStorage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, selectedRole?: UserRole, turnstileToken?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  signup: (name: string, email: string, role?: UserRole, turnstileToken?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize storage schemas and retrieve active sessions
  useEffect(() => {
    const init = async () => {
      try {
        initializeStorage();
        const activeUser = await mockAuth.getCurrentUser();
        if (activeUser) {
          setUser(activeUser);
        }
      } catch (err) {
        console.error('Failed to initialize mock authentication:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string, selectedRole?: UserRole, turnstileToken?: string) => {
    setLoading(true);
    try {
      const res = await mockAuth.login(email, password, selectedRole, turnstileToken);
      if (res.success && res.user) {
        setUser(res.user);
        // Sync in local storage for local templates routing
        localStorage.setItem('lms_session', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Authentication failed.' };
    } catch (err) {
      return { success: false, error: 'An unexpected authentication error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, role: UserRole = 'student', turnstileToken?: string) => {
    setLoading(true);
    try {
      const res = await mockAuth.signup(name, email, role, turnstileToken);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('lms_session', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, error: res.error || 'Signup failed.' };
    } catch (err) {
      return { success: false, error: 'An unexpected signup error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await mockAuth.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Persist in users list too
    try {
      const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
      const index = users.findIndex((u: User) => u.id === updatedUser.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('lms_users', JSON.stringify(users));
      }
      localStorage.setItem('lms_session', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to update user profile in storage:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
