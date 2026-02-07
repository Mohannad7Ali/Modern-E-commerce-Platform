"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationTokenRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
exports.verificationTokenRepository = {
    create(data) {
        return prisma_1.prisma.verificationToken.create({ data });
    },
    findValid(token, type) {
        return prisma_1.prisma.verificationToken.findFirst({
            where: {
                token,
                type,
                expiresAt: { gt: new Date() }
            }
        });
    },
    deleteById(id) {
        return prisma_1.prisma.verificationToken.delete({ where: { id } });
    },
    deleteAllForUser(userId, type) {
        return prisma_1.prisma.verificationToken.deleteMany({
            where: { userId, type }
        });
    }
};
