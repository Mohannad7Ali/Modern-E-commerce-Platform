"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const logs_factory_1 = require("../logs/logs.factory");
const constants_1 = require("@/shared/constants");
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.signup = (0, asyncHandler_1.default)(async (req, res) => {
            const { name, email, password, role } = req.body;
            const { user, accessToken, refreshToken } = await this.authService.registerUser({ name, email, password, role });
            const start = Date.now();
            this.setTokens(res, accessToken, refreshToken);
            (0, sendResponse_1.default)(res, 201, {
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
        this.signin = (0, asyncHandler_1.default)(async (req, res) => {
            const start = Date.now();
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await this.authService.signin({ email, password });
            this.logsService.info('Sign in', {
                userId: user.id,
                sessionId: req.session?.id || 'no session',
                timePeriod: Date.now() - start
            });
            this.setTokens(res, accessToken, refreshToken);
            (0, sendResponse_1.default)(res, 200, {
                data: {
                    user: { id: user.id, name: user.name, role: user.role, avatar: user.avatar }
                },
                message: 'User logged in successfully'
            });
        });
        this.refresh = (0, asyncHandler_1.default)(async (req, res) => {
            const oldRefreshToken = req.cookies?.refreshToken;
            const role = req.user?.role;
            if (!oldRefreshToken) {
                throw new AppError_1.default(401, 'Refresh token is missing');
            }
            const { accessToken, refreshToken } = await this.authService.refreshTokens(oldRefreshToken, role);
            this.setTokens(res, accessToken, refreshToken);
            (0, sendResponse_1.default)(res, 200, { message: 'Token refreshed successfully' });
        });
        this.signout = (0, asyncHandler_1.default)(async (req, res) => {
            const refreshToken = req.cookies?.refreshToken;
            const userId = req.user?.id;
            const start = Date.now();
            if (refreshToken) {
                await this.authService.signout(refreshToken);
            }
            res.clearCookie('accessToken').clearCookie('refreshToken');
            (0, sendResponse_1.default)(res, 200, { message: 'Logged out successfully' });
            this.logsService.info('Sign out', {
                userId,
                sessionId: req.session.id,
                timePeriod: Date.now() - start
            });
        });
        this.me = (0, asyncHandler_1.default)(async (req, res) => {
            const user = req.user;
            (0, sendResponse_1.default)(res, 200, { data: { user } });
        });
        this.forgotPassword = (0, asyncHandler_1.default)(async (req, res) => {
            const { email } = req.body;
            const userId = req.user?.id;
            const start = Date.now();
            await this.authService.forgotPasswordService(email);
            (0, sendResponse_1.default)(res, 200, {
                message: 'If the email exists, a reset link was sent'
            });
            this.logsService.info('Forgot Password', {
                userId,
                sessionId: req.session.id,
                timePeriod: Date.now() - start
            });
        });
        this.resetPassword = (0, asyncHandler_1.default)(async (req, res) => {
            const { token, newPassword } = req.body;
            const userId = req.user?.id;
            const start = Date.now();
            await this.authService.resetPasswordService(token, newPassword);
            (0, sendResponse_1.default)(res, 200, { message: 'Password reset successfully' });
            this.logsService.info('Reset Password', {
                userId,
                sessionId: req.session.id,
                timePeriod: Date.now() - start
            });
        });
    }
    // helper
    setTokens(res, accessToken, refreshToken) {
        res.cookie('accessToken', accessToken, {
            ...constants_1.cookieOptions,
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            ...constants_1.cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }
}
exports.AuthController = AuthController;
