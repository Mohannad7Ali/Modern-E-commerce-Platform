"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = require("@/shared/utils/analytics");
const interactionAnalytics = {
    Query: {
        interactionAnalytics: async (_, { params }, { prisma }) => {
            const { timePeriod, year, startDate, endDate } = params;
            const { currentStartDate, yearStart, yearEnd } = (0, analytics_1.getDateRange)({
                timePeriod,
                year,
                startDate,
                endDate
            });
            const interactions = await prisma.interaction.findMany({
                where: {
                    createdAt: {
                        ...(currentStartDate && { gte: currentStartDate }),
                        ...(endDate && { lte: new Date(endDate) }),
                        ...(yearStart && { gte: yearStart }),
                        ...(yearEnd && { lte: yearEnd })
                    }
                },
                include: { product: true }
            });
            const totalInteractions = interactions.length;
            const byType = {
                views: interactions.filter(i => i.type.toLowerCase() === 'view').length,
                clicks: interactions.filter(i => i.type.toLowerCase() === 'click').length,
                others: interactions.filter(i => !['view', 'click'].includes(i.type.toLowerCase())).length
            };
            const productViews = {};
            for (const interaction of interactions) {
                if (interaction.type.toLowerCase() === 'view' && interaction.productId) {
                    if (!productViews[interaction.productId]) {
                        productViews[interaction.productId] = {
                            name: interaction.product?.name || 'Unknown',
                            count: 0
                        };
                    }
                    productViews[interaction.productId].count += 1;
                }
            }
            const mostViewedProducts = Object.entries(productViews)
                .map(([productId, data]) => ({
                productId,
                productName: data.name,
                viewCount: data.count
            }))
                .sort((a, b) => b.viewCount - a.viewCount)
                .slice(0, 5);
            return {
                totalInteractions,
                byType,
                mostViewedProducts
            };
        }
    }
};
exports.default = interactionAnalytics;
