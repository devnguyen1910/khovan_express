import mongoose from 'mongoose';
import { config } from './index';

// Simple logger for database connection
const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error || ''),
  warn: (message: string) => console.warn(`[WARN] ${message}`)
};

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.NODE_ENV === 'test' ? config.MONGODB_TEST_URI : config.MONGODB_URI;
    
    const conn = await mongoose.connect(mongoURI, {
      // These options are no longer needed in Mongoose 6+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected');
  } catch (error) {
    logger.error('Database disconnection error:', error);
  }
};