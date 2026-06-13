import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log('🔄 Reusing existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    isConnected = true;
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`, error);
    if (env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};
