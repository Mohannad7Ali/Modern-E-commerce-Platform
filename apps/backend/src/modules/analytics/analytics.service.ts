import { AnalyticsRepository } from './analytics.repository';
import { prisma } from '@/infra/database/prisma';
import { DateRangeQuery, AnalyticsOverview, ProductPerformance, UserAnalytics } from './analytics.types';
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}
  async createInteraction(data: { userId?: string; productId?: string; sessionId?: string; type: string }) {
    return this.analyticsRepository.createInteraction({
      userId: data.userId,
      sessionId: data.sessionId,
      productId: data.productId,
      type: data.type
    });
  }

  private getDateRange(query: DateRangeQuery): {
    startDate: Date;
    endDate: Date;
  } {
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now);

    switch (query.timePeriod) {
      case 'last7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'lastMonth':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'lastYear':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'allTime':
        startDate = new Date(0);
        break;
      case 'custom':
        if (!query.startDate || !query.endDate) {
          throw new Error('Custom range requires startDate and endDate');
        }
        startDate = query.startDate;
        endDate = query.endDate;
        break;
      default:
        throw new Error('Invalid timePeriod');
    }

    return { startDate, endDate };
  }
  private getPreviousPeriod(query: DateRangeQuery): {
    startDate: Date;
    endDate: Date;
  } {
    const { startDate, endDate } = this.getDateRange(query);
    const duration = endDate.getTime() - startDate.getTime();
    return {
      startDate: new Date(startDate.getTime() - duration),
      endDate: new Date(startDate.getTime() - 1)
    };
  }
  private async getMonthlyTrends(startDate: Date, endDate: Date) {
    // جلب كل الطلبات في الفترة المحددة بطلب واحد فقط
    const allOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      include: { orderItems: true }
    });

    const months: {
      labels: string[];
      revenue: number[];
      orders: number[];
      sales: number[];
      users: number[];
    } = {
      labels: [],
      revenue: [],
      orders: [],
      sales: [],
      users: []
    };
    let current = new Date(startDate);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = current.getMonth();

      //  فلترة البيانات في الذاكرة بدلاً من طلبها من القاعدة كل مرة
      const filteredOrders = allOrders.filter(
        o => o.createdAt.getFullYear() === year && o.createdAt.getMonth() === month
      );

      months.labels.push(`${year}-${month + 1}`);
      months.revenue.push(filteredOrders.reduce((sum, o) => sum + o.amount, 0));
      months.orders.push(filteredOrders.length);
      months.sales.push(filteredOrders.reduce((sum, o) => sum + o.orderItems.length, 0));
      months.users.push(new Set(filteredOrders.map(o => o.userId)).size);

      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }
  async getAnalyticsOverview(query: DateRangeQuery): Promise<AnalyticsOverview> {
    const { startDate, endDate } = this.getDateRange(query);
    // fetch orders in this range date
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      include: { orderItems: true }
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.orderItems.length, 0);
    const totalUsers = new Set(orders.map(order => order.userId)).size;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    // Calculate changes (example: compare to previous period)
    const prevPeriod = this.getPreviousPeriod(query);
    const prevOrders = await prisma.order.findMany({
      where: { createdAt: { gte: prevPeriod.startDate, lte: prevPeriod.endDate } },
      include: { orderItems: true }
    });
    const prevTotalRevenue = prevOrders.reduce((sum, order) => sum + order.amount, 0);
    const prevTotalOrders = prevOrders.length;
    const prevTotalSales = prevOrders.reduce((sum, order) => sum + order.orderItems.length, 0);
    const prevTotalUsers = new Set(prevOrders.map(order => order.userId)).size;
    const prevAverageOrderValue = prevTotalOrders > 0 ? prevTotalRevenue / prevTotalOrders : 0;

    // Monthly trends (example: group by month)
    const monthlyTrends = await this.getMonthlyTrends(startDate, endDate);
    return {
      totalRevenue,
      totalOrders,
      totalSales,
      totalUsers,
      averageOrderValue,
      changes: {
        revenue: prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : null,
        orders: prevTotalOrders > 0 ? ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100 : null,
        sales: prevTotalSales > 0 ? ((totalSales - prevTotalSales) / prevTotalSales) * 100 : null,
        users: prevTotalUsers > 0 ? ((totalUsers - prevTotalUsers) / prevTotalUsers) * 100 : null,
        averageOrderValue:
          prevAverageOrderValue > 0 ? ((averageOrderValue - prevAverageOrderValue) / prevAverageOrderValue) * 100 : null
      },
      monthlyTrends
    };
  }
  async getProductPerformance(query: DateRangeQuery): Promise<ProductPerformance[]> {
    const { startDate, endDate } = this.getDateRange(query);

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          status: 'PAID'
        }
      },
      include: { variant: true }
    });

    const productMap = new Map<string, ProductPerformance>();
    for (const item of orderItems) {
      const productId = item.variantId;
      const existing = productMap.get(productId) || {
        id: productId,
        name: item.variant.sku,
        quantity: 0,
        revenue: 0
      };
      existing.quantity += item.quantity;
      existing.revenue += item.quantity * item.price;
      productMap.set(productId, existing);
    }

    return Array.from(productMap.values());
  }
  async getUserAnalytics(query: DateRangeQuery): Promise<UserAnalytics> {
    const { startDate, endDate } = this.getDateRange(query);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { user: true, orderItems: true }
    });

    const totalUsers = new Set(orders.map(order => order.userId)).size;
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const uniqueUsers = new Set(orders.map(order => order.userId));
    // calc user that buy more than once
    const userOrderCounts = new Map<string, number>();
    orders.forEach(order => {
      const count = userOrderCounts.get(order.userId) || 0;
      userOrderCounts.set(order.userId, count + 1);
    });
    const repeatUsersIds = Array.from(userOrderCounts.entries())
      .filter(([userId, count]) => count > 1)
      .map(([userId, count]) => userId);
    const repeatUsersCount = repeatUsersIds.length;
    //نسبة الولاء (العملاء الذين اشتروا أكثر من مرة)
    const retentionRate = uniqueUsers.size > 0 ? (repeatUsersIds.length / uniqueUsers.size) * 100 : 0;
    // متوسط انفاق العملاء
    const lifetimeValue = uniqueUsers.size > 0 ? totalRevenue / uniqueUsers.size : 0;
    // معدل عودة العملاء للشراء مرة أخرى
    const repeatPurchaseRate = uniqueUsers.size > 0 ? (repeatUsersCount / uniqueUsers.size) * 100 : 0;
    // Engagement score (example: based on interactions)
    const interactions = await prisma.interaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    const engagementScore = interactions.length / (uniqueUsers.size || 1);
    // Changes
    const prevPeriod = this.getPreviousPeriod(query);
    const prevOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: prevPeriod.startDate,
          lte: prevPeriod.endDate
        }
      }
    });
    const prevTotalUsers = new Set(prevOrders.map(order => order.userId)).size;
    const usersChange = prevTotalUsers > 0 ? ((totalUsers - prevTotalUsers) / prevTotalUsers) * 100 : null;

    // top users
    const userOrders = orders.reduce((acc, order) => {
      const userId = order.userId;
      const existing = acc.get(userId) || {
        id: userId,
        name: order.user.name,
        email: order.user.email,
        orderCount: 0,
        totalSpent: 0,
        engagmentScore: 0
      };
      existing.orderCount++;
      existing.totalSpent += order.amount;
      existing.engagmentScore += interactions.filter(i => i.userId === userId).length;
      acc.set(userId, existing);
      return acc;
    }, new Map<string, any>());
    const topUsers = Array.from(userOrders.values())
      .sort((a, b) => a.totalSpent - b.totalSpent)
      .slice(0, 5);
    // Interaction trends
    const interactionTrends = await this.getInteractionTrends(startDate, endDate);
    return {
      totalUsers,
      totalRevenue,
      retentionRate,
      lifetimeValue,
      repeatPurchaseRate,
      engagementScore,
      changes: { users: usersChange },
      topUsers,
      interactionTrends
    };
  }
  private async getInteractionTrends(startDate: Date, endDate: Date) {
    //  جلب كل التفاعلات باستعلام واحدة فقط
    const allInteractions = await prisma.interaction.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    });

    const trends: {
      labels: string[];
      views: number[];
      clicks: number[];
      others: number[];
    } = {
      labels: [],
      views: [],
      clicks: [],
      others: []
    };
    let current = new Date(startDate);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = current.getMonth();

      // فلترة البيانات من المصفوفة الموجودة في الذاكرة
      const monthlyData = allInteractions.filter(
        i => i.createdAt.getFullYear() === year && i.createdAt.getMonth() === month
      );

      trends.labels.push(`${year}-${month + 1}`);

      //  حساب الأرقام لكل نوع
      trends.views.push(monthlyData.filter(i => i.type === 'view').length);
      trends.clicks.push(monthlyData.filter(i => i.type === 'click').length);
      trends.others.push(monthlyData.filter(i => i.type === 'other').length);

      current.setMonth(current.getMonth() + 1);
    }

    return trends;
  }
  async getYearRange(): Promise<{ minYear: number; maxYear: number }> {
    const orders = await prisma.order.aggregate({
      _min: { createdAt: true },
      _max: { createdAt: true }
    });
    const minYear = orders._min.createdAt?.getFullYear() || new Date().getFullYear();
    const maxYear = orders._max.createdAt?.getFullYear() || new Date().getFullYear();
    return { minYear, maxYear };
  }
}
