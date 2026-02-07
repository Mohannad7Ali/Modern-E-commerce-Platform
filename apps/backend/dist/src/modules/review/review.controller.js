"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const logs_factory_1 = require("../logs/logs.factory");
const checkType_1 = require("@/shared/utils/checkType");
class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.createReview = (0, asyncHandler_1.default)(async (req, res) => {
            const userId = req.user.id;
            const { productId, rating, comment } = req.body;
            const start = Date.now();
            const review = await this.reviewService.createReview(userId, {
                productId,
                rating,
                comment
            });
            (0, sendResponse_1.default)(res, 201, {
                data: review,
                message: 'Review created successfully'
            });
            this.logsService.info('Review created', {
                userId: req.user?.id,
                sessionId: req.session.id,
                timePeriod: Date.now() - start
            });
        });
        this.getReviewsByProductId = (0, asyncHandler_1.default)(async (req, res) => {
            const productId = (0, checkType_1.CheckParamsType)(req.params.productId);
            const { page, limit } = req.query;
            const result = await this.reviewService.getReviewsByProductId(productId, {
                page: Number(page),
                limit: Number(limit)
            });
            console.log('reviews result => ', result);
            (0, sendResponse_1.default)(res, 200, {
                data: result,
                message: 'Reviews fetched successfully'
            });
        });
        this.deleteReview = (0, asyncHandler_1.default)(async (req, res) => {
            const start = Date.now();
            const id = (0, checkType_1.CheckParamsType)(req.params.id);
            const userId = req.user.id;
            const result = await this.reviewService.deleteReview(id, userId);
            (0, sendResponse_1.default)(res, 200, result);
            this.logsService.info('Review deleted', {
                userId: req.user?.id,
                sessionId: req.session.id,
                timePeriod: Date.now() - start
            });
        });
    }
}
exports.ReviewController = ReviewController;
