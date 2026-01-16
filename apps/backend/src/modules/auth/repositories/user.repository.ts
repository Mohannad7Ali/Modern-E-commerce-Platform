import { prisma } from '@/infra/database/prisma';
import type { User } from '@/generated/prisma-client/client';
export class UserRepository {
  //we don't use async await explicity because here short way make process faster by few milliseconds and we here just get data and pass it to service
  static findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
  async findUserByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
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
  static findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }
  static updatePassword(userId: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }
  static createUser(data: {
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN' | 'SUPERADMIN';
    name: string | undefined;
  }) {
    return prisma.user.create({
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
