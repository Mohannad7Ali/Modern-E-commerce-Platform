import { prisma } from '@/infra/database/prisma';
import type { User } from '@/generated/prisma-client/client';
export class UserRepository {
  //we don't use async await explicity because here short way make process faster by few milliseconds and we here just get data and pass it to service
  static findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
  static findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }
  static create(data: { email: string; passwordHash: string; role?: 'USER' | 'ADMIN' | 'SUPERADMIN' }): Promise<User> {
    return prisma.user.create({ data });
  }
}
