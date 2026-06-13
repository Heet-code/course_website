import { CorsOptions } from 'cors';
import { env } from './env';

const whitelist = [env.CLIENT_URL];

// Helper to check if origin is in whitelist or is relative / local
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Check if development, or if request has no origin (like mobile apps, postman, server-to-server)
    if (!origin || whitelist.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS configuration'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
