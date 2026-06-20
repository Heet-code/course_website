import { z } from 'zod';

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    email: z.string().email('Please provide a valid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(150, 'Subject cannot exceed 150 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters'),
    turnstileToken: z.string().optional(),
  }),
});
