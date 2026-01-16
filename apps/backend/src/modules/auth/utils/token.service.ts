import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { AccessTokenPayload } from './token.types';
import env from '@/config/env';
export class TokenService {
  private static accessTokenSecret = env.JWT_ACCESS_SECRET! || 'default_secret_key';
  private static accessTokenExpiresIn = '30m';
  private static REFRESH_TOKEN_TTL_DAYS = 30;
  //generate token function with payload , signature and options contains expiresin
  static generateAccessToken(payload: AccessTokenPayload): string {
    const options: SignOptions = {
      expiresIn: this.accessTokenExpiresIn as any
    };

    return jwt.sign({ ...payload }, this.accessTokenSecret, options);
  }
  // verirfy if token is valid with server signature and return payload
  static verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.accessTokenSecret) as AccessTokenPayload;
  }
  // generate refresh token useing cypto to make random string
  static generateRefreshToken(): { token: string; expiresAt: Date } {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_TTL_DAYS);
    return { token, expiresAt };
  }
  // hash refresh token to store it in database
  static hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
  static generatePasswordResetToken = () => {
    return crypto.randomUUID();
  };
}
