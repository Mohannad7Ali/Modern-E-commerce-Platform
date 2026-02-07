"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = require("@/shared/utils/analytics");
const revenueAnalytics = {
    Query: {
        revenueAnalytics: async (_, { params }, { prisma }) => {
            const { timePeriod, year, startDate, endDate } = params;
            const { currentStartDate, previousStartDate, previousEndDate, yearStart, yearEnd } = (0, analytics_1.getDateRange)({
                timePeriod,
                year,
                startDate,
                endDate
            });
            const currentOrders = await (0, analytics_1.fetchData)(prisma, 'order', 'orderDate', currentStartDate, endDate, yearStart, yearEnd);
            const currentOrderItems = await (0, analytics_1.fetchData)(prisma, 'orderItem', 'createdAt', currentStartDate, endDate, yearStart, yearEnd, undefined, { variant: true });
            const fetchPrevious = (0, analytics_1.shouldFetchPreviousPeriod)(timePeriod);
            const previousOrders = fetchPrevious
                ? await (0, analytics_1.fetchData)(prisma, 'order', 'orderDate', previousStartDate, previousEndDate, yearStart, yearEnd)
                : [];
            const previousOrderItems = fetchPrevious
                ? await (0, analytics_1.fetchData)(prisma, 'orderItem', 'createdAt', previousStartDate, previousEndDate, yearStart, yearEnd, undefined, { variant: true })
                : [];
            const currentMetrics = (0, analytics_1.calculateMetrics)(currentOrders, currentOrderItems, []);
            const previousMetrics = (0, analytics_1.calculateMetrics)(previousOrders, previousOrderItems, []);
            const changes = (0, analytics_1.calculateChanges)(currentMetrics, previousMetrics, fetchPrevious);
            const ordersForTrends = await (0, analytics_1.fetchData)(prisma, 'order', 'createdAt', yearStart, yearEnd);
            const orderItemsForTrends = await (0, analytics_1.fetchData)(prisma, 'orderItem', 'createdAt', yearStart, yearEnd, undefined);
            const usersForTrends = await (0, analytics_1.fetchData)(prisma, 'user', 'createdAt', yearStart, yearEnd);
            const monthlyTrends = (0, analytics_1.aggregateMonthlyTrends)(ordersForTrends, orderItemsForTrends, usersForTrends);
            return {
                totalRevenue: Number(currentMetrics.totalRevenue.toFixed(2)),
                changes: {
                    revenue: changes.revenue
                },
                monthlyTrends
            };
        }
    }
};
exports.default = revenueAnalytics;
