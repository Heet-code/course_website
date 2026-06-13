import { z } from 'zod';

const lessonSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  duration: z.string(),
  description: z.string(),
  videoUrl: z.string().url(),
  resources: z.array(z.string()).default([]),
  isPreview: z.boolean().default(false),
});

const moduleSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  lessons: z.array(lessonSchema).default([]),
});

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    shortDescription: z.string().optional(),
    fullDescription: z.string().optional(),
    category: z.string().min(1),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
    duration: z.string().default('2h 00m'),
    isFree: z.boolean().default(true),
    price: z.number().default(0),
    originalPrice: z.number().optional(),
    modules: z.array(moduleSchema).default([]),
    certificateAvailable: z.boolean().default(true),
    outcomes: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    modelEmbedUrl: z.string().optional(),
    modelPath: z.string().optional(),
  }),
});
