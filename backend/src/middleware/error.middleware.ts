import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import { env } from '../config/env';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[${req.method}] ${req.originalUrl} - Server Error: ${err.message}`, { stack: err.stack });
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  logger.error(`[${req.method}] ${req.originalUrl} - Unhandled Exception: ${err.message}`, { stack: err.stack });

  return res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
}
