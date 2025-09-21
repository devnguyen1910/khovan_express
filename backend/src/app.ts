import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { config } from './config';
import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import logger from './utils/logger';

// Import routes
import inventoryRoutes from './routes/inventory';
import shipmentRoutes from './routes/shipments';
import supplierRoutes from './routes/suppliers';
import dashboardRoutes from './routes/dashboard';

const app = express();

// Connect to database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.'
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true
}));
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Kho Vận Express API đang hoạt động',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;