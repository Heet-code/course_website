import { app } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = () => {
  // 1. Start Listening immediately for Render health checks
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running in [${env.NODE_ENV}] mode on http://localhost:${env.PORT}`);
  });

  // 2. Connect to Database in the background
  connectDB().catch((err) => {
    console.error('❌ Failed to connect to MongoDB during startup:', err);
  });
};

startServer();
