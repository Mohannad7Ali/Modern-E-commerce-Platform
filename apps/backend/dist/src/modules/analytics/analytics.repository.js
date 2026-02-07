"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class AnalyticsRepository {
    async getOrderYearRange() {
        const orders = await prisma_1.prisma.order.findMany({
            select: { orderDate: true },
            orderBy: { orderDate: 'asc' }
        });
        let years = [...new Set(orders.map(o => o.orderDate.getFullYear()))];
        return years;
    }
    async getOrdersByTimePeriod(start, end, yearStart, yearEnd) {
        return prisma_1.prisma.order.findMany({
            where: {
                orderDate: {
                    gte: start || yearStart,
                    lte: end || yearEnd
                }
            },
            include: { user: true }
        });
    }
    async getOrderItemsByTimePeriod(start, end, yearStart, yearEnd, category) {
        return await prisma_1.prisma.orderItem.findMany({
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
    async getUsersByTimePeriod(start, end, yearStart, yearEnd) {
        return await prisma_1.prisma.user.findMany({
            where: {
                createdAt: {
                    gte: start || yearStart,
                    lte: end || yearEnd
                }
            },
            include: { orders: true }
        });
    }
    async getInteractionsByTimePeriod(start, end, yearStart, yearEnd) {
        return await prisma_1.prisma.interaction.findMany({
            where: {
                createdAt: {
                    gte: start || yearStart,
                    lte: end || yearEnd
                }
            },
            include: { user: true, product: true }
        });
    }
    async createInteraction(data) {
        return await prisma_1.prisma.interaction.create({
            data: {
                userId: data.userId,
                sessionId: data.sessionId,
                productId: data.productId,
                type: data.type
            }
        });
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
