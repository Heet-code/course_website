import { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { AnalyticsEvent } from '../models/AnalyticsEvent.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

// Zod schema for validating the incoming analytics payload
const analyticsPayloadSchema = z.object({
  eventName: z.enum([
    'page_view_manual',
    'course_card_click',
    'course_detail_view',
    'enroll_click',
    'pricing_cta_click',
    'signup_click',
    'login_success',
    'login_role_selected',
    'contact_submit_success',
    'newsletter_submit_success',
    'certificate_generate_click'
  ]),
  sourcePage: z.string().optional(),
  courseSlug: z.string().optional(),
  role: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  anonymousId: z.string().optional()
});

// Helper to sanitize metadata deeply and limit size
const sanitizeMetadata = (meta: any): any => {
  if (!meta) return undefined;
  
  // Convert to string to check size and avoid huge payloads
  const metaString = JSON.stringify(meta);
  if (metaString.length > 2000) {
    return { error: 'metadata_too_large' };
  }

  // Parse back to object, stripping any keys that sound sensitive
  const parsed = JSON.parse(metaString);
  const sensitiveKeys = ['password', 'email', 'token', 'jwt', 'message', 'certificateId', 'creditCard'];
  
  const clean = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return;
    for (const key of Object.keys(obj)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        clean(obj[key]);
      }
    }
  };
  
  clean(parsed);
  return parsed;
};

// IP Hashing to avoid storing raw PII
import { env } from '../config/env';

const hashIp = (ip?: string): string | undefined => {
  if (!ip) return undefined;
  const salt = env.ANALYTICS_HASH_SALT;
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
};

export const trackEvent = asyncHandler(async (req: Request, res: Response) => {
  try {
    // 1. Validate payload
    const parsed = analyticsPayloadSchema.parse(req.body);

    // 2. Extract safe identifiers
    // Only use userId from backend JWT verification (req.user), NEVER trust frontend
    const userId = req.user ? req.user.id : undefined;
    const ipHash = hashIp(req.ip);
    const userAgent = req.headers['user-agent'];

    // 3. Sanitize metadata
    const cleanMetadata = sanitizeMetadata(parsed.metadata);

    // 4. Save event safely
    await AnalyticsEvent.create({
      eventName: parsed.eventName,
      sourcePage: parsed.sourcePage,
      courseSlug: parsed.courseSlug,
      role: parsed.role || (req.user ? req.user.role : undefined),
      metadata: cleanMetadata,
      userId,
      anonymousId: parsed.anonymousId,
      userAgent,
      ipHash
    });

    // 5. Always return generic success without internal data
    res.status(200).json({ success: true });
  } catch (error) {
    // Fail silently from client perspective if analytics fails validation
    console.warn('[Analytics Error]', error instanceof z.ZodError ? error.errors : error);
    res.status(200).json({ success: false, message: 'event_ignored' });
  }
});
