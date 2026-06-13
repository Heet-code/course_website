import { Router } from 'express';
import { getStudentDashboard, getInstructorDashboard, getAdminDashboard } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/student', authorize('student'), getStudentDashboard);
router.get('/instructor', authorize('instructor'), getInstructorDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);

export default router;
