import { Router } from 'express';
import { getStudentDashboard, getInstructorDashboard, getAdminDashboard, getAnalyticsSummary } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.use(authenticate);

// Student Dashboard (Students only)
router.get('/student', authorize('student', 'admin'), getStudentDashboard);

// Instructor Dashboard (Instructors & Admins)
router.get('/instructor', authorize('instructor', 'admin'), getInstructorDashboard);

// Admin Dashboard (Admins only)
router.get('/admin', authorize('admin'), getAdminDashboard);

// Admin Analytics Summary (Admins only)
router.get('/admin/analytics-summary', authorize('admin'), getAnalyticsSummary);

export default router;
