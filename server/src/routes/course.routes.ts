import { Router } from 'express';
import {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  changeCourseStatus,
} from '../controllers/course.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCourseSchema } from '../schemas/course.schema';

const router = Router();

// Public course routes
router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);

// Instructor-only course designer routes
router.post('/', authenticate, authorize('instructor', 'admin'), validate(createCourseSchema), createCourse);
router.put('/:id', authenticate, authorize('instructor', 'admin'), validate(createCourseSchema), updateCourse);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourse);
router.patch('/:id/status', authenticate, authorize('instructor', 'admin'), changeCourseStatus);

export default router;
