import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Không tìm thấy tài nguyên';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Dữ liệu đã tồn tại';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Lỗi máy chủ nội bộ',
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Không tìm thấy đường dẫn - ${req.originalUrl}`);
  res.status(404);
  next(error);
};