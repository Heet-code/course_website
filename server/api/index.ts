import app from '../src/app';
import { connectDB } from '../src/config/db';

// Ensure database connection is established
connectDB();

export default app;
