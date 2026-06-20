import { Router } from 'express';
import { subscribe } from '../controllers/newsletter.controller';
import { rateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/', rateLimiter, subscribe);

export default router;
