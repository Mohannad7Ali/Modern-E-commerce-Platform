import { Request, Response } from 'express';
import { AuthService } from './auth.service';

import { cookieOptions } from '@/shared/constants/index';
import sendResponse from '@/shared/utils/sendResponse';
import AppError from '@/shared/errors/AppError';

export class AuthController {
  static async signup(req: Request, res: Response) {
    const { name, email, password, role } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.registerUser({ name, email, password, role });

    res
      .cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000
      })
      .cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

    sendResponse(res, 201, {
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar || null
        }
      }
    });
  }

  static async signin(req: Request, res: Response) {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.signin({ email, password });

    res
      .cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000
      })
      .cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    sendResponse(res, 200, {
      data: {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      },
      message: 'User logged in successfully'
    });
  }

  static async refresh(req: Request, res: Response) {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      throw new AppError(401, 'Refresh token is missing');
    }

    const { accessToken, refreshToken } = await AuthService.refreshTokens(oldRefreshToken);

    res
      .cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000
      })
      .cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ message: 'Token refreshed successfully' });
  }

  static async signout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await AuthService.signout(refreshToken);
    }
    res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' });
  }
  static async me(req: Request, res: Response) {
    const user = req.user;
    res.json({ user });
  }
  static forgotPassword = async (req, res) => {
    const { email } = req.body;

    await AuthService.forgotPasswordService(email);

    res.status(200).json({
      message: 'If the email exists, a reset link was sent'
    });
  };

  static resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    await AuthService.resetPasswordService(token, newPassword);

    res.status(200).json({
      message: 'Password reset successfully'
    });
  };
}
