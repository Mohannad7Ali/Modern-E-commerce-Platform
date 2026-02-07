"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_factory_1 = require("./reports.factory");
const protect_middleware_1 = require("@/shared/middlewares/protect.middleware");
const router = (0, express_1.Router)();
const controller = (0, reports_factory_1.makeReportsController)();
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
router.get('/generate', protect_middleware_1.requireAuth, controller.generateReport);
exports.default = router;
