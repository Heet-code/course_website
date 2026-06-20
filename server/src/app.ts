import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { corsOptions } from './config/cors';
import { apiRateLimiter } from './middleware/rateLimit.middleware';
import { verifyCsrf } from './middleware/csrf.middleware';
import { errorHandler } from './middleware/error.middleware';

// Routes imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import categoryRoutes from './routes/category.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import progressRoutes from './routes/progress.routes';
import quizRoutes from './routes/quiz.routes';
import certificateRoutes from './routes/certificate.routes';
import dashboardRoutes from './routes/dashboard.routes';
import contactRoutes from './routes/contact.routes';
import analyticsRoutes from './routes/analytics.routes';
import newsletterRoutes from './routes/newsletter.routes';

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://challenges.cloudflare.com", "https://static.cloudflareinsights.com", "'unsafe-inline'"],
      frameSrc: ["'self'", "https://challenges.cloudflare.com"],
      connectSrc: [
        "'self'", 
        "https://skillcohort-api.onrender.com", 
        "https://challenges.cloudflare.com"
      ],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' })); // JSON payload limit

// Logger Middleware
app.use(morgan('dev'));

// CSRF & Rate Limiting Guard for Mutating Calls
app.use('/api', apiRateLimiter);

// Health check endpoint (must bypass CSRF so Render can ping it)
import { env } from './config/env';
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API is healthy',
    environment: env.NODE_ENV
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.use('/api', verifyCsrf);

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Catch-all 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized error handler
app.use(errorHandler);

export { app };
export default app;
