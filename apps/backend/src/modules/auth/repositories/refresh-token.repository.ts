import { RefreshToken } from '@/generated/prisma-client/client';
import { prisma } from '@/infra/database/prisma';

export class RefreshTokenRepository {
  static create(data: { userId: string; token: string; expiresAt: Date }): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }
  static findValid(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findFirst({
      where: { token: token, revoked: false, expiresAt: { gt: new Date() } }
    });
  }
  static revoke(id: string): Promise<void> {
    return prisma.refreshToken
      .update({
        where: { id: id },
        data: { revoked: true }
      })
      .then(() => undefined);
  }
  static async revokeAllForUser(userId: string): Promise<number> {
    const result = await prisma.refreshToken.updateMany({
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
