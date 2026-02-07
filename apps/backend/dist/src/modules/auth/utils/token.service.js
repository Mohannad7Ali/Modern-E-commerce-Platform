"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = __importDefault(require("@/config/env"));
class TokenService {
    //generate token function with payload , signature and options contains expiresin
    static generateAccessToken(payload) {
        const options = {
            expiresIn: this.accessTokenExpiresIn
        };
        return jsonwebtoken_1.default.sign({ ...payload }, this.accessTokenSecret, options);
    }
    // verirfy if token is valid with server signature and return payload
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, this.accessTokenSecret);
    }
    // generate refresh token useing cypto to make random string
    static generateRefreshToken() {
        const token = crypto_1.default.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_TTL_DAYS);
        return { token, expiresAt };
    }
    // hash refresh token to store it in database
    static hashRefreshToken(token) {
        return crypto_1.default.createHash('sha256').update(token).digest('hex');
    }
}
exports.TokenService = TokenService;
TokenService.accessTokenSecret = env_1.default.JWT_ACCESS_SECRET || 'default_secret_key';
TokenService.accessTokenExpiresIn = '30m';
TokenService.REFRESH_TOKEN_TTL_DAYS = 30;
TokenService.generatePasswordResetToken = () => {
    return crypto_1.default.randomUUID();
};
