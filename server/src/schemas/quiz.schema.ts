import { z } from 'zod';

const questionSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswerIndex: z.number().int().nonnegative(),
});

export const submitQuizSchema = z.object({
  body: z.object({
    answers: z.array(z.number().int().nonnegative()),
  }),
});

export const updateQuizSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    questions: z.array(questionSchema).min(1),
    passingScore: z.number().int().min(0).max(100).default(70),
  }),
});
