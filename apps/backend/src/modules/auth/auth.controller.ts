import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { makeLogsService } from '../logs/logs.factory';
import { cookieOptions } from '@/shared/constants';
import sendResponse from '@/shared/utils/sendResponse';
import AppError from '@/shared/errors/AppError';
import asyncHandler from '@/shared/utils/asyncHandler';

export class AuthController {
  private logsService = makeLogsService();

  constructor(private authService: AuthService) {}

  signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const { user, accessToken, refreshToken } = await this.authService.registerUser({ name, email, password, role });
    const start = Date.now();

    this.setTokens(res, accessToken, refreshToken);

    sendResponse(res, 201, {
      message: 'User registered successfully',
      data: {
        user: { id: user.id, name: user.name, role: user.role, avatar: user.avatar || null }
      }
    });
    this.logsService.info('Register', {
      userId: user.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - start
    });
  });

  signin = asyncHandler(async (req: Request, res: Response) => {
    const start = Date.now();
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await this.authService.signin({ email, password });

    this.logsService.info('Sign in', {
      userId: user.id,
      sessionId: req.session?.id || 'no session',
      timePeriod: Date.now() - start
    });

    this.setTokens(res, accessToken, refreshToken);

    sendResponse(res, 200, {
      data: {
        user: { id: user.id, name: user.name, role: user.role, avatar: user.avatar }
      },
      message: 'User logged in successfully'
    });
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      throw new AppError(401, 'Refresh token is missing');
    }

    const { accessToken, refreshToken } = await this.authService.refreshTokens(oldRefreshToken);

    this.setTokens(res, accessToken, refreshToken);

    sendResponse(res, 200, { message: 'Token refreshed successfully' });
  });

  signout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    const userId = req.user?.id;
    const start = Date.now();
    if (refreshToken) {
      await this.authService.signout(refreshToken);
    }

    res.clearCookie('accessToken').clearCookie('refreshToken');

    sendResponse(res, 200, { message: 'Logged out successfully' });
    this.logsService.info('Sign out', {
      userId,
      sessionId: req.session.id,
      timePeriod: Date.now() - start
    });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    sendResponse(res, 200, { data: { user } });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const userId = req.user?.id;
    const start = Date.now();
    await this.authService.forgotPasswordService(email);

    sendResponse(res, 200, {
      message: 'If the email exists, a reset link was sent'
    });
    this.logsService.info('Forgot Password', {
      userId,
      sessionId: req.session.id,
      timePeriod: Date.now() - start
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    const userId = req.user?.id;
    const start = Date.now();
    await this.authService.resetPasswordService(token, newPassword);

    sendResponse(res, 200, { message: 'Password reset successfully' });
    this.logsService.info('Reset Password', {
      userId,
      sessionId: req.session.id,
      timePeriod: Date.now() - start
    });
  });

  // helper
  private setTokens(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }
}
