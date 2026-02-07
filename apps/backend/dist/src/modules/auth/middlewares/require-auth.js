"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const token_service_1 = require("../utils/token.service");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const user_repository_1 = require("../repositories/user.repository");
function requireAuth(req, _, next) {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return next(new AppError_1.default(401, 'Unauthorized, please log in'));
        }
        const payload = token_service_1.TokenService.verifyAccessToken(token);
        const user = user_repository_1.UserRepository.findUserById(payload.userId);
        if (!user) {
            return next(new AppError_1.default(401, 'User no longer exists.'));
        }
        req.user = {
            id: payload.userId,
            role: payload.role
        };
        next();
    }
    catch (error) {
        console.log(error);
        return next(new AppError_1.default(401, 'Invalid access token, please log in'));
    }
}
