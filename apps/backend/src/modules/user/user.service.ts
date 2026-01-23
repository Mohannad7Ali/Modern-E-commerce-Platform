import AppError from '@/shared/errors/AppError';
import { ROLE } from '@/generated/prisma-client/client';
import { UserRepository } from './user.repository';

/**
 * Business logic layer for user-related operations.
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers() {
    return this.userRepository.findAllUsers();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  /** Update logged-in user profile */
  async updateMe(
    userId: string,
    data: {
      name?: string;
      avatar?: string;
    }
  ) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new AppError(404, 'User not found');

    return this.userRepository.updateProfile(userId, data);
  }

  /** Admin: delete user */
  async deleteUser(targetUserId: string, currentUserId: string) {
    if (targetUserId === currentUserId) {
      throw new AppError(400, 'You cannot delete your own account');
    }

    const user = await this.userRepository.findUserById(targetUserId);
    if (!user) throw new AppError(404, 'User not found');

    if (user.role === 'SUPERADMIN') {
      const count = await this.userRepository.countUsersByRole(ROLE.SUPERADMIN);
      if (count <= 1) {
        throw new AppError(400, 'Cannot delete the last SuperAdmin');
      }
    }
    const currentUser = await this.userRepository.findUserById(currentUserId);
    if (currentUser?.role === ROLE.USER) {
      throw new AppError(403, 'Only Admin Can delete users');
    }

    await this.userRepository.deleteUser(targetUserId);
  }

  /** Admin: change user role */
  async updateUserRole(targetUserId: string, role: ROLE) {
    const user = await this.userRepository.findUserById(targetUserId);
    if (!user) throw new AppError(404, 'User not found');

    return this.userRepository.adminUpdateUser(targetUserId, { role });
  }
  async createAdmin(
    adminData: {
      name: string;
      email: string;
      password: string;
    },
    createdByUserId: string
  ) {
    const creator = await this.userRepository.findUserById(createdByUserId);

    if (!creator) {
      throw new AppError(404, 'Creator user not found');
    }

    if (creator.role !== 'SUPERADMIN') {
      throw new AppError(403, 'Only SuperAdmins can create new admins');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findUserByEmail(adminData.email);
    if (existingUser) {
      throw new AppError(400, 'User with this email already exists');
    }

    // Create new admin with ADMIN role (not SUPERADMIN)
    const newAdmin = await this.userRepository.createUser({
      ...adminData,
      role: 'ADMIN'
    });

    return newAdmin;
  }
}
