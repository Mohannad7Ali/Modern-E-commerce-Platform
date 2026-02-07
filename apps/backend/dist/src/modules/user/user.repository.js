"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
const password_1 = require("../auth/utils/password");
/**
 * Repository responsible ONLY for User table operations.
 * No auth, no tokens, no password reset logic here.
 */
class UserRepository {
    /** Get all users (admin usage) */
    async findAllUsers() {
        return prisma_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                createdAt: true
            }
        });
    }
    /** Get single user by id (public profile fields only) */
    async findUserById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true
            }
        });
    }
    /** Internal usage (admin / services) */
    async findUserByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    /** Update user own profile */
    async updateProfile(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true
            }
        });
    }
    /** Change email (verification handled in Auth module) */
    async updateEmail(id, email) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                email,
                isEmailVerified: false
            }
        });
    }
    /** Admin update (role, verification flags, etc.) */
    async adminUpdateUser(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data
        });
    }
    /** Delete user */
    async deleteUser(id) {
        return prisma_1.prisma.user.delete({ where: { id } });
    }
    /** Count users by role (used to protect last SUPERADMIN) */
    async countUsersByRole(role) {
        return prisma_1.prisma.user.count({ where: { role } });
    }
    async createUser(data) {
        // Hash the password before storing
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        return await prisma_1.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                role: data.role
            },
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
