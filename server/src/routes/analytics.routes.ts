import { Router } from 'express';
import { trackEvent } from '../controllers/analytics.controller';
import { optionalAuthenticate } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Apply a specific rate limiter for analytics to prevent spam
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 analytics events per `window`
  message: { success: false, message: 'Too many events created from this IP, please try again after a minute' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/event', analyticsLimiter, optionalAuthenticate, trackEvent);

export default router;
