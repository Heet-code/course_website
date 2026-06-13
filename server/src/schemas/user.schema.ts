import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    bio: z.string().optional(),
    title: z.string().optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

export const adminUpdateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    role: z.enum(['student', 'instructor', 'admin']).optional(),
    bio: z.string().optional(),
    title: z.string().optional(),
  }),
});
