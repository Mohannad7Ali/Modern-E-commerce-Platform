import { Request, Response } from 'express';
import asyncHandler from '@/shared/utils/asyncHandler';
import sendResponse from '@/shared/utils/sendResponse';
import { ReviewService } from './review.service';
import { makeLogsService } from '../logs/logs.factory';
import { CheckParamsType } from '@/shared/utils/checkType';

export class ReviewController {
  private logsService = makeLogsService();
  constructor(private reviewService: ReviewService) {}

  createReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { productId, rating, comment } = req.body;
    const start = Date.now();

    const review = await this.reviewService.createReview(userId, {
      productId,
      rating,
      comment
    });

    sendResponse(res, 201, {
      data: review,
      message: 'Review created successfully'
    });

    this.logsService.info('Review created', {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - start
    });
  });

  getReviewsByProductId = asyncHandler(async (req: Request, res: Response) => {
    const productId = CheckParamsType(req.params.productId);
    const { page, limit } = req.query;

    const result = await this.reviewService.getReviewsByProductId(productId, {
      page: Number(page),
      limit: Number(limit)
    });
    console.log('reviews result => ', result);

    sendResponse(res, 200, {
      data: result,
      message: 'Reviews fetched successfully'
    });
  });

  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const start = Date.now();
    const id = CheckParamsType(req.params.id);
    const userId = req.user!.id;

    const result = await this.reviewService.deleteReview(id, userId);

    sendResponse(res, 200, result);

    this.logsService.info('Review deleted', {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - start
    });
  });
}
