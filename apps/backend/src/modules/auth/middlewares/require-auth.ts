import { Request, Response, NextFunction } from 'express';

import { TokenService } from '../utils/token.service';
import AppError from '@/shared/errors/AppError';
import { UserRepository } from '../repositories/user.repository';
interface JwtPayload {
  userId: string;
  role: string;
}
export function requireAuth(req: Request, _: Response, next: NextFunction) {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new AppError(401, 'Unauthorized, please log in'));
    }

    const payload = TokenService.verifyAccessToken(token) as JwtPayload;
    const user = UserRepository.findUserById(payload.userId);
    if (!user) {
      return next(new AppError(401, 'User no longer exists.'));
    }
    req.user = {
      id: payload.userId,
      role: payload.role
    };

    next();
  } catch (error) {
    console.log(error);
    return next(new AppError(401, 'Invalid access token, please log in'));
  }
}
