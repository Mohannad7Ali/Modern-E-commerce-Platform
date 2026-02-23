import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TokenService } from './utils/token.service';
import { InvalidRefreshTokenError } from './auth.errors';
import { hashPassword, verifyPassword } from './utils/password';
import { Role } from './utils/token.types';
import { AuthResponse, RegisterUserParams, SignInParams } from './auth.types';
import AppError from '@/shared/errors/AppError';
import BadRequestError from '@/shared/errors/BadRequestError';
import { verificationTokenRepository } from './repositories/verificationToken.repository';
import { VERIFICATION_TYPE } from '@/generated/prisma-client/client';
import { sendEmail } from '@/shared/utils/mailer';
import passwordResetTemplate from '@/shared/templates/passwordReset';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  // this function issue access and refresh tokens and store hashed refresh token in database
  private async issueTokens(userId: string, role: Role) {
    //generate access token and refresh token
    const accessToken = TokenService.generateAccessToken({ userId, role });
    const { token, expiresAt } = TokenService.generateRefreshToken();
    //hash refreshtoken and store it
    const hashToken = TokenService.hashRefreshToken(token);
    await RefreshTokenRepository.create({ userId, token: hashToken, expiresAt: expiresAt });
    // return token for login or register
    return { accessToken, refreshToken: token };
  }
  //this function register new user
  async registerUser({ name, email, password }: RegisterUserParams): Promise<AuthResponse> {
    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError(409, 'This email already exists, please log in instead.');
    }
    const passwordHash = await hashPassword(password);
    const user = await UserRepository.createUser({ email: email, password: passwordHash, name: name, role: 'USER' }); // Ignore any role passed from client for security
    const tokens = await this.issueTokens(user.id, user.role);
    return { user: { ...user }, ...tokens } as AuthResponse;
  }
  // this function login user and issue tokens
  async signin({ email, password }: SignInParams): Promise<AuthResponse> {
    const user = await UserRepository.findUserByEmail(email);
    if (!user || !user.password) {
      throw new BadRequestError('Email or password is incorrect.');
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) throw new BadRequestError('Email or password is incorrect.');
    const tokens = await this.issueTokens(user.id, user.role);
    return { user: { ...user }, ...tokens } as AuthResponse;
  }
  // this function refresh tokens using refresh token
  async refreshTokens(oldRefreshToken: string, role: Role) {
    const tokenHash = TokenService.hashRefreshToken(oldRefreshToken);
    const storedToken = await RefreshTokenRepository.findValid(tokenHash);
    if (!storedToken) throw new InvalidRefreshTokenError();
    await RefreshTokenRepository.revoke(storedToken.id);

    const tokens = await this.issueTokens(storedToken.userId, role);
    return { ...tokens };
  }
  // this function logout user by revoking refresh token
  async signout(refreshToken: string): Promise<{ message: string }> {
    const tokenHash = TokenService.hashRefreshToken(refreshToken);
    const storedToken = await RefreshTokenRepository.findValid(tokenHash);
    if (storedToken) {
      await RefreshTokenRepository.revoke(storedToken.id);
    }
    return { message: 'User logged out successfully' };
  }

  forgotPasswordService = async (email: string) => {
    const user = await UserRepository.findUserByEmail(email);

    // Security: لا نكشف وجود الإيميل
    if (!user) return;

    await verificationTokenRepository.deleteAllForUser(user.id, VERIFICATION_TYPE.PASSWORD_RESET);

    const token = TokenService.generatePasswordResetToken();

    await verificationTokenRepository.create({
      token,
      userId: user.id,
      type: VERIFICATION_TYPE.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });
    const resetUrl =
      process.env.NODE_ENV === 'development'
        ? `${process.env.CLIENT_URL_DEV}/password-reset/${token}`
        : `${process.env.CLIENT_URL_PROD}/password-reset/${token}`;

    const htmlTemplate = passwordResetTemplate(resetUrl, token);

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: htmlTemplate,
      text: 'Reset your password'
    });
    console.log(`RESET LINK: /reset-password?token=${token}`);
  };

  resetPasswordService = async (token: string, newPassword: string) => {
    const record = await verificationTokenRepository.findValid(token, VERIFICATION_TYPE.PASSWORD_RESET);

    if (!record) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await hashPassword(newPassword);

    await UserRepository.updatePassword(record.userId, hashedPassword);

    // logout from all devices
    await RefreshTokenRepository.revokeAllForUser(record.userId);

    await verificationTokenRepository.deleteById(record.id);
  };
}
