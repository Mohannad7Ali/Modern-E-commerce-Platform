import { prisma } from '@/infra/database/prisma';
export class AnalyticsRepository {
  async getOrderYearRange() {
    const orders = await prisma.order.findMany({
      select: { orderDate: true },
      orderBy: { orderDate: 'asc' }
    });
    let years = [...new Set(orders.map(o => o.orderDate.getFullYear()))];
    return years;
  }
  async getOrdersByTimePeriod(start?: Date, end?: Date, yearStart?: Date, yearEnd?: Date) {
    return prisma.order.findMany({
      where: {
        orderDate: {
          gte: start || yearStart,
          lte: end || yearEnd
        }
      },
      include: { user: true }
    });
  }

  async getOrderItemsByTimePeriod(start?: Date, end?: Date, yearStart?: Date, yearEnd?: Date, category?: string) {
    return await prisma.orderItem.findMany({
      where: {
        createdAt: {
          gte: start || yearStart,
          lte: end || yearEnd
        },
        ...(category && {
          category: {
            name: category
          }
        })
      },
      include: {
        variant: true
      }
    });
  }
  async getUsersByTimePeriod(start?: Date, end?: Date, yearStart?: Date, yearEnd?: Date) {
    return await prisma.user.findMany({
      where: {
        createdAt: {
          gte: start || yearStart,
          lte: end || yearEnd
        }
      },
      include: { orders: true }
    });
  }
  async getInteractionsByTimePeriod(start?: Date, end?: Date, yearStart?: Date, yearEnd?: Date) {
    return await prisma.interaction.findMany({
      where: {
        createdAt: {
          gte: start || yearStart,
          lte: end || yearEnd
        }
      },
      include: { user: true, product: true }
    });
  }
  async createInteraction(data: { userId?: string; sessionId?: string; productId?: string; type: string }) {
    return await prisma.interaction.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        productId: data.productId,
        type: data.type
      }
    });
  }
}
