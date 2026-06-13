import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, authorize('admin'), createCategory);

export default router;
