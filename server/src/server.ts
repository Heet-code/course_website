import { app } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  // 1. Connect to Database
  await connectDB();

  // 2. Start Listening
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running in [${env.NODE_ENV}] mode on http://localhost:${env.PORT}`);
  });
};

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
