import { Request, Response } from 'express';
import { AuthService } from './services/auth.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const
};

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;

    const tokens = await AuthService.register({ email, password });

    res
      .cookie('accessToken', tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000
      })
      .cookie('refreshToken', tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(201)
      .json({ message: 'Registered successfully' });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const tokens = await AuthService.login({ email, password });

    res
      .cookie('accessToken', tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000
      })
      .cookie('refreshToken', tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ message: 'Logged in successfully' });
  }

  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Missing refresh token' });
    }

    const tokens = await AuthService.refreshTokens(refreshToken);

    res
      .cookie('accessToken', tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000
      })
      .cookie('refreshToken', tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ message: 'Token refreshed' });
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }
    res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' });
  }
}
