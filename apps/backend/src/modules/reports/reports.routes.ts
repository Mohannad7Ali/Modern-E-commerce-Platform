import { Router } from 'express';
import { makeReportsController } from './reports.factory';
import { requireAuth } from '@/shared/middlewares/protect.middleware';

const router = Router();
const controller = makeReportsController();
/**
 * @swagger
 * tags:
 *   - name: Reports
 *     description: Endpoints for analytics and reporting
 */
/**
 * @swagger
 * /reports/generate:
 *   get:
 *     tags: [Reports]
 *     summary: Generate a report
 *     description: Generates a report for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report generated successfully.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get('/generate', requireAuth, controller.generateReport);

export default router;
