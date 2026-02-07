"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configurePassport;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = require("@/infra/database/prisma");
const token_service_1 = require("@/modules/auth/utils/token.service");
function configurePassport() {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === 'production'
            ? process.env.GOOGLE_CALLBACK_URL_PROD
            : process.env.GOOGLE_CALLBACK_URL_DEV
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await prisma_1.prisma.user.findUnique({
                where: { email: profile.emails[0].value }
            });
            if (user && !user.googleId) {
                user = await prisma_1.prisma.user.update({
                    where: { email: profile.emails[0].value },
                    data: { googleId: profile.id, avatar: profile.photos[0]?.value || '' }
                });
            }
            if (!user) {
                user = await prisma_1.prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        googleId: profile.id,
                        avatar: profile.photos[0]?.value || ''
                    }
                });
            }
            const payload = {
                userId: user.id,
                role: 'USER'
            };
            const authUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                googleId: user.googleId,
                role: user.role,
                accessToken: token_service_1.TokenService.generateAccessToken(payload),
                refreshToken: token_service_1.TokenService.generateRefreshToken()
            };
            return done(null, authUser);
        }
        catch (error) {
            done(error);
        }
    }));
}
