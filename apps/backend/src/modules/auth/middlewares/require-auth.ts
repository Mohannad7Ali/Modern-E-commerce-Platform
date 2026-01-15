import { Request, Response, NextFunction } from 'express';

import { TokenService } from '../tokens/token.service';
interface JwtPayload {
  userId: string;
  role: string;
}
export function requireAuth(req: Request, _: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
  }

  const payload = TokenService.verifyAccessToken(token) as JwtPayload;

  req.user = {
    id: payload.userId,
    role: payload.role
  };

  next();
}
