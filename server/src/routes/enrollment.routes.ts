import { Router } from 'express';
import { enrollInCourse, getMyEnrollments, getCourseEnrollment } from '../controllers/enrollment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/:courseId', enrollInCourse);
router.get('/me', getMyEnrollments);
router.get('/course/:courseId', getCourseEnrollment);

export default router;
