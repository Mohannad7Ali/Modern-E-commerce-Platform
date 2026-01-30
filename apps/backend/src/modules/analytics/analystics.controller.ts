import { AnalyticsService } from './analytics.service';
import { Request, Response } from 'express';
import asyncHandler from '@/shared/utils/asyncHandler';
import sendResponse from '@/shared/utils/sendResponse';
import AppError from '@/shared/errors/AppError';
import { DateRangeQuery, ExportableData } from './analytics.types';
import { makeLogsService } from '../logs/logs.factory';
export class AnalyticsController {
  private logsService = makeLogsService();
  constructor(private analyticsService: AnalyticsService) {}
  createInteraction = asyncHandler(async (req: Request, res: Response) => {
    const { productId, type } = req.body;
    const user = req.user;
    const sessionId = req.session.id;

    const validTypes = ['view', 'click', 'other'];
    if (!type || !validTypes.includes(type)) {
      throw new AppError(400, 'Invalid interaction type. Use: view, click, or other.');
    }

    const interaction = await this.analyticsService.createInteraction({
      userId: user?.id,
      sessionId, // Always include sessionId
      productId,
      type
    });

    this.logsService.info('Interaction recorded', {
      userId: user?.id,
      sessionId,
      interactionType: type,
      productId
    });

    sendResponse(res, 200, {
      data: { interaction },
      message: 'Interaction recorded successfully'
    });
  });

  getYearRange = asyncHandler(async (req: Request, res: Response) => {
    const yearRange = await this.analyticsService.getYearRange();
    sendResponse(res, 200, {
      data: yearRange,
      message: 'Year range retrieved successfully'
    });
  });
}
