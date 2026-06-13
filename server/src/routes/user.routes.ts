import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, changeUserRole } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateUserSchema, adminUpdateUserSchema } from '../schemas/user.schema';

const router = Router();

// Self profile update
router.put('/me', authenticate, validate(updateUserSchema), updateUser);

// Admin-only user moderation routes
router.get('/', authenticate, authorize('admin'), getUsers);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.put('/:id', authenticate, authorize('admin'), validate(adminUpdateUserSchema), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
router.patch('/:id/role', authenticate, authorize('admin'), changeUserRole);

export default router;
