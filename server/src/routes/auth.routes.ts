import { Router } from 'express';
import { register, login, logout, refresh, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema';
import { authenticate, verifyTurnstile } from '../middleware/auth.middleware';
import { authRateLimiter, apiRateLimiter, forgotPasswordRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', authRateLimiter, verifyTurnstile, validate(registerSchema), register);
router.post('/login', authRateLimiter, verifyTurnstile, validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);

// Password Reset Flows
router.post('/forgot-password', forgotPasswordRateLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', forgotPasswordRateLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
