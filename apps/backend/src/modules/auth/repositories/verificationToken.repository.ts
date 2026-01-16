import { prisma } from '@/infra/database/prisma';
import { VERIFICATION_TYPE } from '@/generated/prisma-client/client';

export const verificationTokenRepository = {
  create(data: { token: string; userId: string; type: VERIFICATION_TYPE; expiresAt: Date }) {
    return prisma.verificationToken.create({ data });
  },

  findValid(token: string, type: VERIFICATION_TYPE) {
    return prisma.verificationToken.findFirst({
      where: {
        token,
        type,
        expiresAt: { gt: new Date() }
      }
    });
  },

  deleteById(id: string) {
    return prisma.verificationToken.delete({ where: { id } });
  },

  deleteAllForUser(userId: string, type: VERIFICATION_TYPE) {
    return prisma.verificationToken.deleteMany({
      where: { userId, type }
    });
  }
};
