import { Router } from 'express';
import { issueCertificate, getCertificateByCredential, getMyCertificates } from '../controllers/certificate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public validation of certificate credentials
router.get('/validate/:credentialId', getCertificateByCredential);

// Authenticated student routes
router.post('/issue/:courseId', authenticate, issueCertificate);
router.get('/me', authenticate, getMyCertificates);

export default router;
