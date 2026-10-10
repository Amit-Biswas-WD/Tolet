import mongoose from 'mongoose';
import { ENV } from './env';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB connected successfully to ${ENV.MONGO_URI}`);
  } catch (err) {
    console.warn(`[Database] Note: Could not establish MongoDB connection (${(err as Error).message}).`);
    console.warn(`[Database] The API will run with in-memory fallback state for development stability.`);
  }
}
