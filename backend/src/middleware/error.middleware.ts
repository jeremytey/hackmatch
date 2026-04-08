import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/app.error';
import { logger } from '../lib/logger';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  
  if (err instanceof AppError) {
    logger.warn(`Operational error ${err.statusCode}: ${err.message}`);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // For unexpected errors, we log the error and return a generic message to the client.
  logger.error(`Unexpected error: ${err.message}`, { stack: err.stack });
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};