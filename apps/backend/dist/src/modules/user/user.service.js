"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const client_1 = require("@/generated/prisma-client/client");
/**
 * Business logic layer for user-related operations.
 */
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        return this.userRepository.findAllUsers();
    }
    async getUserById(id) {
        const user = await this.userRepository.findUserById(id);
        if (!user)
            throw new AppError_1.default(404, 'User not found');
        return user;
    }
    async getUserByEmail(email) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new AppError_1.default(404, 'User not found');
        }
        return user;
    }
    async getMe(userId) {
        const user = await this.userRepository.findUserById(userId);
        if (!user)
            throw new AppError_1.default(404, 'User not found');
        return user;
    }
    /** Update logged-in user profile */
    async updateMe(userId, data) {
        const user = await this.userRepository.findUserById(userId);
        if (!user)
            throw new AppError_1.default(404, 'User not found');
        return this.userRepository.updateProfile(userId, data);
    }
    /** Admin: delete user */
    async deleteUser(targetUserId, currentUserId) {
        if (targetUserId === currentUserId) {
            throw new AppError_1.default(400, 'You cannot delete your own account');
        }
        const user = await this.userRepository.findUserById(targetUserId);
        if (!user)
            throw new AppError_1.default(404, 'User not found');
        if (user.role === 'SUPERADMIN') {
            const count = await this.userRepository.countUsersByRole(client_1.ROLE.SUPERADMIN);
            if (count <= 1) {
                throw new AppError_1.default(400, 'Cannot delete the last SuperAdmin');
            }
        }
        const currentUser = await this.userRepository.findUserById(currentUserId);
        if (currentUser?.role === client_1.ROLE.USER) {
            throw new AppError_1.default(403, 'Only Admin Can delete users');
        }
        await this.userRepository.deleteUser(targetUserId);
    }
    /** Admin: change user role */
    async updateUserRole(targetUserId, role) {
        const user = await this.userRepository.findUserById(targetUserId);
        if (!user)
            throw new AppError_1.default(404, 'User not found');
        return this.userRepository.adminUpdateUser(targetUserId, { role });
    }
    async createAdmin(adminData, createdByUserId) {
        const creator = await this.userRepository.findUserById(createdByUserId);
        if (!creator) {
            throw new AppError_1.default(404, 'Creator user not found');
        }
        if (creator.role !== 'SUPERADMIN') {
            throw new AppError_1.default(403, 'Only SuperAdmins can create new admins');
        }
        // Check if user already exists
        const existingUser = await this.userRepository.findUserByEmail(adminData.email);
        if (existingUser) {
            throw new AppError_1.default(400, 'User with this email already exists');
        }
        // Create new admin with ADMIN role (not SUPERADMIN)
        const newAdmin = await this.userRepository.createUser({
            ...adminData,
            role: 'ADMIN'
        });
        return newAdmin;
    }
}
exports.UserService = UserService;
