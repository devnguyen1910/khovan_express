import app from './app';
import { config } from './config';
import logger from './utils/logger';

const server = app.listen(config.PORT, () => {
  logger.info(`
    🚀 Kho Vận Express API Server
    📍 Mode: ${config.NODE_ENV}
    🌐 Port: ${config.PORT}
    📊 Health: http://localhost:${config.PORT}/api/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions  
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
  });
});