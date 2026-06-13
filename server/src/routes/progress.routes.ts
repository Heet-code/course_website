import { Router } from 'express';
import { getProgress, completeLesson, uncompleteLesson } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/:courseId', getProgress);
router.patch('/:courseId/lesson/:lessonId/complete', completeLesson);
router.patch('/:courseId/lesson/:lessonId/uncomplete', uncompleteLesson);

export default router;
