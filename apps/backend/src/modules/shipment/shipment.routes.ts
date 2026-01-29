import express from 'express';
import { makeShipmentController } from './shipment.factory';
import optionalAuth from '@/shared/middlewares/optionalAuth';

const router = express.Router();
const shipmentController = makeShipmentController();

/**
 * @swagger
 * tags:
 *   - name: Shipments
 *     description: Shipment and delivery operations
 */

/**
 * @swagger
 * /shipments:
 *   post:
 *     tags: [Shipments]
 *     summary: Create a new shipment
 *     description: Creates a new shipment. Authentication is optional.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destination
 *               - items
 *               - shippingMethod
 *             properties:
 *               destination:
 *                 type: string
 *                 example: "Damascus, Syria"
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["item1", "item2"]
 *               shippingMethod:
 *                 type: string
 *                 example: "EXPRESS"
 *     responses:
 *       201:
 *         description: Shipment created successfully.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.post('/', optionalAuth, shipmentController.createShipment);

export default router;
