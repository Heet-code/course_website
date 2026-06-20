import { Router } from 'express';
import { subscribe } from '../controllers/newsletter.controller';
import { apiRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/', apiRateLimiter, subscribe);

export default router;
