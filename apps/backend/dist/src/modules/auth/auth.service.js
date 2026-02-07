"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = require("./repositories/user.repository");
const refresh_token_repository_1 = require("./repositories/refresh-token.repository");
const token_service_1 = require("./utils/token.service");
const auth_errors_1 = require("./auth.errors");
const password_1 = require("./utils/password");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const BadRequestError_1 = __importDefault(require("@/shared/errors/BadRequestError"));
const verificationToken_repository_1 = require("./repositories/verificationToken.repository");
const client_1 = require("@/generated/prisma-client/client");
const mailer_1 = require("@/shared/utils/mailer");
const passwordReset_1 = __importDefault(require("@/shared/templates/passwordReset"));
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.forgotPasswordService = async (email) => {
            const user = await user_repository_1.UserRepository.findUserByEmail(email);
            // Security: لا نكشف وجود الإيميل
            if (!user)
                return;
            await verificationToken_repository_1.verificationTokenRepository.deleteAllForUser(user.id, client_1.VERIFICATION_TYPE.PASSWORD_RESET);
            const token = token_service_1.TokenService.generatePasswordResetToken();
            await verificationToken_repository_1.verificationTokenRepository.create({
                token,
                userId: user.id,
                type: client_1.VERIFICATION_TYPE.PASSWORD_RESET,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            });
            const resetUrl = `${process.env.CLIENT_URL}/password-reset/${token}`;
            const htmlTemplate = (0, passwordReset_1.default)(resetUrl, token);
            await (0, mailer_1.sendEmail)({
                to: user.email,
                subject: 'Reset your password',
                html: htmlTemplate,
                text: 'Reset your password'
            });
            console.log(`RESET LINK: /reset-password?token=${token}`);
        };
        this.resetPasswordService = async (token, newPassword) => {
            const record = await verificationToken_repository_1.verificationTokenRepository.findValid(token, client_1.VERIFICATION_TYPE.PASSWORD_RESET);
            if (!record) {
                throw new Error('Invalid or expired token');
            }
            const hashedPassword = await (0, password_1.hashPassword)(newPassword);
            await user_repository_1.UserRepository.updatePassword(record.userId, hashedPassword);
            // logout from all devices
            await refresh_token_repository_1.RefreshTokenRepository.revokeAllForUser(record.userId);
            await verificationToken_repository_1.verificationTokenRepository.deleteById(record.id);
        };
    }
    // this function issue access and refresh tokens and store hashed refresh token in database
    async issueTokens(userId, role) {
        //generate access token and refresh token
        const accessToken = token_service_1.TokenService.generateAccessToken({ userId, role });
        const { token, expiresAt } = token_service_1.TokenService.generateRefreshToken();
        //hash refreshtoken and store it
        const hashToken = token_service_1.TokenService.hashRefreshToken(token);
        await refresh_token_repository_1.RefreshTokenRepository.create({ userId, token: hashToken, expiresAt: expiresAt });
        // return token for login or register
        return { accessToken, refreshToken: token };
    }
    //this function register new user
    async registerUser({ name, email, password }) {
        const existingUser = await user_repository_1.UserRepository.findUserByEmail(email);
        if (existingUser) {
            throw new AppError_1.default(409, 'This email already exists, please log in instead.');
        }
        const passwordHash = await (0, password_1.hashPassword)(password);
        const user = await user_repository_1.UserRepository.createUser({ email: email, password: passwordHash, name: name, role: 'USER' }); // Ignore any role passed from client for security
        const tokens = await this.issueTokens(user.id, user.role);
        return { user: { ...user }, ...tokens };
    }
    // this function login user and issue tokens
    async signin({ email, password }) {
        const user = await user_repository_1.UserRepository.findUserByEmail(email);
        if (!user || !user.password) {
            throw new BadRequestError_1.default('Email or password is incorrect.');
        }
        const isPasswordValid = await (0, password_1.verifyPassword)(password, user.password);
        if (!isPasswordValid)
            throw new BadRequestError_1.default('Email or password is incorrect.');
        const tokens = await this.issueTokens(user.id, user.role);
        return { user: { ...user }, ...tokens };
    }
    // this function refresh tokens using refresh token
    async refreshTokens(oldRefreshToken, role) {
        const tokenHash = token_service_1.TokenService.hashRefreshToken(oldRefreshToken);
        const storedToken = await refresh_token_repository_1.RefreshTokenRepository.findValid(tokenHash);
        if (!storedToken)
            throw new auth_errors_1.InvalidRefreshTokenError();
        await refresh_token_repository_1.RefreshTokenRepository.revoke(storedToken.id);
        const tokens = await this.issueTokens(storedToken.userId, role);
        return { ...tokens };
    }
    // this function logout user by revoking refresh token
    async signout(refreshToken) {
        const tokenHash = token_service_1.TokenService.hashRefreshToken(refreshToken);
        const storedToken = await refresh_token_repository_1.RefreshTokenRepository.findValid(tokenHash);
        if (storedToken) {
            await refresh_token_repository_1.RefreshTokenRepository.revoke(storedToken.id);
        }
        return { message: 'User logged out successfully' };
    }
}
exports.AuthService = AuthService;
