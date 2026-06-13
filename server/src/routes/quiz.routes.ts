import { Router } from 'express';
import { submitQuiz, updateCourseQuiz } from '../controllers/quiz.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { submitQuizSchema, updateQuizSchema } from '../schemas/quiz.schema';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/:courseId/submit', validate(submitQuizSchema), submitQuiz);
router.put('/:courseId/update', authorize('instructor', 'admin'), validate(updateQuizSchema), updateCourseQuiz);

export default router;
