import { CorsOptions } from 'cors';
import { env } from './env';

const whitelist = [
  env.CLIENT_URL,
  'https://course-website-pages.kalthiyaheet.workers.dev',
  'https://www.thelearningcollective.com',
  'http://localhost:5173'
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Strictly verify origin. Block missing origins (like postman or curl) in production.
    if (!origin) {
      if (env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS configuration - Missing origin'));
    }

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
