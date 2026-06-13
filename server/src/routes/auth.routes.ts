import { Router } from 'express';
import { register, login, logout, refresh, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authenticate, verifyTurnstile } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', authRateLimiter, verifyTurnstile, validate(registerSchema), register);
router.post('/login', authRateLimiter, verifyTurnstile, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);

export default router;
