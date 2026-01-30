import { Router } from 'express';
import { makeAnalyticsController } from './analytics.factory';
import { requireAuth } from '@/shared/middlewares/protect.middleware';

const router = Router();
const controller = makeAnalyticsController();

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Endpoints for analytics and reporting
 */

/**
 * @swagger
 * /analytics/interactions:
 *   post:
 *     tags:
 *       - Analytics
 *     summary: Create interaction record
 *     description: Logs a new user interaction for analytics purposes.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               interactionType:
 *                 type: string
 *               interactionDetails:
 *                 type: string
 *     responses:
 *       201:
 *         description: Interaction successfully created.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.post('/interactions', requireAuth, controller.createInteraction);

/**
 * @swagger
 * /analytics/year-range:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get analytics for a year range
 *     description: Retrieves analytics data for a specified year range.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year to filter analytics
 *     responses:
 *       200:
 *         description: Analytics data for the specified year range.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get('/year-range', requireAuth, controller.getYearRange);

/**
 * @swagger
 * /analytics/export:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Export analytics data
 *     description: Exports the analytics data, typically for reporting or data analysis.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [overview, products, users, all]
 *         required: true
 *         description: Type of analytics to export
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, pdf, xlsx]
 *         required: true
 *         description: File format for export
 *       - in: query
 *         name: timePeriod
 *         schema:
 *           type: string
 *           enum: [last7days, lastMonth, lastYear, allTime, custom]
 *         required: true
 *         description: Time period for analytics
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Custom start date (required if timePeriod=custom)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Custom end date (required if timePeriod=custom)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Optional year filter
 *     responses:
 *       200:
 *         description: Analytics data successfully exported.
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get('/export', requireAuth, controller.exportAnalytics);

export default router;
