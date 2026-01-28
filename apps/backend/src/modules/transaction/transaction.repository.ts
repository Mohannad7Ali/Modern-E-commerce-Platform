import { prisma } from '@/infra/database/prisma';
import { TRANSACTION_STATUS } from '@/generated/prisma-client/client';

export class TransactionRepository {
  constructor() {}
  async findMany() {
    return prisma.transaction.findMany();
  }

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            payment: true,
            shipment: true,
            user: true,
            address: true,
            orderItems: true
          }
        }
      }
    });
  }

  async createTransaction(data: any) {
    return prisma.transaction.create({
      data
    });
  }

  async updateTransaction(id: string, data: { status: TRANSACTION_STATUS }) {
    return prisma.transaction.update({
      where: { id },
      data
    });
  }

  async deleteTransaction(id: string) {
    return prisma.transaction.delete({
      where: { id }
    });
  }
}
