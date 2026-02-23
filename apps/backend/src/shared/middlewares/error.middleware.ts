/**
 * Error Middleware:
 * This file catches any errors that happen in our routes.
 * It sends a clean JSON response to the user instead of crashing the server.
 */

import { Request, Response, NextFunction } from 'express';
import logger from '@/infra/logging/logger';
import env from '@/config/env';
export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    stack: env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
/**
 * Why we don't use 'next':
 * In Express error handlers, 'next' is used to pass the error to the "next" error middleware.
 * Since this is our LAST safety net, we don't need to pass the error further.
 * We finish the request here by sending the 'res.json'.
 */
