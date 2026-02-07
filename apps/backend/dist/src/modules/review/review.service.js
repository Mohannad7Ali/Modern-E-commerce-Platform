"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const prisma_1 = require("@/infra/database/prisma");
class ReviewService {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async createReview(userId, data) {
        if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
            throw new AppError_1.default(400, 'Rating must be an integer between 1 and 5');
        }
        const product = await prisma_1.prisma.product.findUnique({
            where: { id: data.productId }
        });
        if (!product) {
            throw new AppError_1.default(404, 'Product not found');
        }
        const existingReview = await this.reviewRepository.findReviewByUserAndProduct(userId, data.productId);
        if (existingReview) {
            throw new AppError_1.default(400, 'You have already reviewed this product');
        }
        const review = await this.reviewRepository.createReview({
            userId,
            productId: data.productId,
            rating: data.rating,
            comment: data.comment
        });
        await this.reviewRepository.updateProductRating(data.productId);
        return review;
    }
    async getReviewsByProductId(productId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const reviews = await this.reviewRepository.findReviewsByProductId(productId, {
            skip,
            take: limit
        });
        const total = await prisma_1.prisma.review.count({ where: { productId } });
        const totalPages = Math.ceil(total / limit);
        return {
            reviews,
            total,
            totalPages,
            currentPage: page,
            resultsPerPage: limit
        };
    }
    async deleteReview(id, userId) {
        const review = await this.reviewRepository.findReviewById(id);
        if (!review) {
            throw new AppError_1.default(404, 'Review not found');
        }
        await this.reviewRepository.deleteReview(id);
        await this.reviewRepository.updateProductRating(review.productId);
        return { message: 'Review deleted successfully' };
    }
}
exports.ReviewService = ReviewService;
