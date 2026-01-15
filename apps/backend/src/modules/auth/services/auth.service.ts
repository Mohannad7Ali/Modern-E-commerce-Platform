import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { TokenService } from '../tokens/token.service';
import { EmailAlreadyExistsError, InvalidCredentialsError, InvalidRefreshTokenError } from '../auth.errors';
import { hashPassword, verifyPassword } from '../utils/password';
import { Role } from '../tokens/token.types';
export class AuthService {
  // this function issue access and refresh tokens and store hashed refresh token in database
  private static async issueTokens(userId: string, role: Role) {
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
  static async register(data: { email: string; password: string }) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new InvalidCredentialsError();
    }
    const passwordHash = await hashPassword(data.password);
    const user = await UserRepository.create({ email: data.email, passwordHash });
    return this.issueTokens(user.id, user.role);
  }
  // this function login user and issue tokens
  static async login(data: { email: string; password: string }) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user || !user.password) {
      throw new InvalidCredentialsError();
    }

    const valid = await verifyPassword(data.password, user.password);
    if (!valid) throw new InvalidCredentialsError();
    return this.issueTokens(user.id, user.role);
  }
  // this function refresh tokens using refresh token
  static async refreshTokens(refreshToken: string) {
    const tokenHash = TokenService.hashRefreshToken(refreshToken);
    const storedToken = await RefreshTokenRepository.findValid(tokenHash);
    if (!storedToken) throw new InvalidRefreshTokenError();
    await RefreshTokenRepository.revoke(storedToken.id);
    return this.issueTokens(storedToken.userId, 'USER');
  }
  // this function logout user by revoking refresh token
  static async logout(refreshToken: string) {
    const tokenHash = TokenService.hashRefreshToken(refreshToken);
    const storedToken = await RefreshTokenRepository.findValid(tokenHash);
    if (storedToken) {
      await RefreshTokenRepository.revoke(storedToken.id);
    }
  }
}
