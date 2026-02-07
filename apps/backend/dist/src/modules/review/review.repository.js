"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class ReviewRepository {
    async createReview(data) {
        return prisma_1.prisma.review.create({ data });
    }
    async findReviewsByProductId(productId, params) {
        const { skip = 0, take = 10 } = params;
        return prisma_1.prisma.review.findMany({
            where: { productId },
            include: { user: { select: { name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take
        });
    }
    async findReviewById(id) {
        return prisma_1.prisma.review.findUnique({
            where: { id },
            include: { user: { select: { name: true } } }
        });
    }
    async findReviewByUserAndProduct(userId, productId) {
        return prisma_1.prisma.review.findFirst({
            where: { userId, productId }
        });
    }
    async deleteReview(id) {
        return prisma_1.prisma.review.delete({
            where: { id }
        });
    }
    async updateProductRating(productId) {
        const reviews = await prisma_1.prisma.review.findMany({
            where: { productId },
            select: { rating: true }
        });
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
        return prisma_1.prisma.product.update({
            where: { id: productId },
            data: { averageRating, reviewCount }
        });
    }
}
exports.ReviewRepository = ReviewRepository;
