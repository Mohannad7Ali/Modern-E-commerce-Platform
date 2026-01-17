import { Request, Response, NextFunction } from 'express';
import AppError from '@/shared/errors/AppError';

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new AppError(401, 'Unauthorized'));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new AppError(403, 'Forbidden'));
    }

    next();
  };
}
