"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class UserRepository {
    //we don't use async await explicity because here short way make process faster by few milliseconds and we here just get data and pass it to service
    static findUserByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    async findUserByEmailWithPassword(email) {
        return prisma_1.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                password: true,
                role: true,
                name: true,
                email: true,
                avatar: true
            }
        });
    }
    static findUserById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id }
        });
    }
    static updatePassword(userId, hashedPassword) {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
    }
    static createUser(data) {
        return prisma_1.prisma.user.create({
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true
            }
        });
    }
}
exports.UserRepository = UserRepository;
