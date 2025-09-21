import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/khovan_express',
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/khovan_express_test',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // API Keys
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};