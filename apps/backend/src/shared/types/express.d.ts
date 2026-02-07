import { User as PrismaUser } from '@/generated/prisma-client/client';
export interface RequestUser {
  id: string;
  role: string;
}
declare global {
  namespace Express {
    interface User extends RequestUser {}
  }
}

export {};
