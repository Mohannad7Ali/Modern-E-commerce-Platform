import { prisma } from '@/infra/database/prisma';
import { ROLE } from '@/generated/prisma-client/client';
import { hashPassword } from '../auth/utils/password';
/**
 * Repository responsible ONLY for User table operations.
 * No auth, no tokens, no password reset logic here.
 */
export class UserRepository {
  /** Get all users (admin usage) */
  async findAllUsers() {
    return prisma.user.findMany({
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
  async findUserById(id: string) {
    return prisma.user.findUnique({
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
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  /** Update user own profile */
  async updateProfile(
    id: string,
    data: {
      name?: string;
      avatar?: string;
    }
  ) {
    return prisma.user.update({
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
  async updateEmail(id: string, email: string) {
    return prisma.user.update({
      where: { id },
      data: {
        email,
        isEmailVerified: false
      }
    });
  }

  /** Admin update (role, verification flags, etc.) */
  async adminUpdateUser(
    id: string,
    data: {
      role?: ROLE;
      isEmailVerified?: boolean;
    }
  ) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  /** Delete user */
  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  /** Count users by role (used to protect last SUPERADMIN) */
  async countUsersByRole(role: ROLE) {
    return prisma.user.count({ where: { role } });
  }
  async createUser(data: { name: string; email: string; password: string; role: string }) {
    // Hash the password before storing
    const hashedPassword = await hashPassword(data.password);

    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role as any
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
