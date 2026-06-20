import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller';
import { validate } from '../middleware/validate.middleware';
import { contactSchema } from '../schemas/contact.schema';
import { verifyTurnstile } from '../middleware/auth.middleware';
import { contactRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/', contactRateLimiter, verifyTurnstile, validate(contactSchema), submitContact);

export default router;
