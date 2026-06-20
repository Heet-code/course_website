import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
    email: z.string().trim().email('Invalid email address').max(100, 'Email is too long'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
    role: z.enum(['student', 'instructor', 'admin']).default('student'),
    turnstileToken: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address').max(100),
    password: z.string().min(1, 'Password is required').max(100),
    selectedRole: z.enum(['student', 'instructor', 'admin']),
    turnstileToken: z.string().optional(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address').max(100),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  }),
});
