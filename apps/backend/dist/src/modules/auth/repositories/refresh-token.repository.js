"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class RefreshTokenRepository {
    static create(data) {
        return prisma_1.prisma.refreshToken.create({ data });
    }
    static findValid(token) {
        return prisma_1.prisma.refreshToken.findFirst({
            where: { token: token, revoked: false, expiresAt: { gt: new Date() } }
        });
    }
    static revoke(id) {
        return prisma_1.prisma.refreshToken
            .update({
            where: { id: id },
            data: { revoked: true }
        })
            .then(() => undefined);
    }
    static async revokeAllForUser(userId) {
        const result = await prisma_1.prisma.refreshToken.updateMany({
            where: {
                userId: userId,
                revoked: false
            },
            data: {
                revoked: true
            }
        });
        return result.count;
    }
}
exports.RefreshTokenRepository = RefreshTokenRepository;
