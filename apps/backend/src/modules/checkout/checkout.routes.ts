import express from 'express';
import { requireAuth } from '@/shared/middlewares/protect.middleware';
import { makeCheckoutController } from './checkout.factory';

const router = express.Router();
const checkoutController = makeCheckoutController();
/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Checkout routes
 */

/**
 * @swagger
 * /checkout:
 *   post:
 *     tags: [Checkout]
 *     summary: Initiate checkout
 *     description: Initiates the checkout process for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   addressLine1:
 *                     type: string
 *                   addressLine2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *     responses:
 *       200:
 *         description: Checkout successfully initiated.
 *       400:
 *         description: Invalid input data or missing required fields.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.post('/', requireAuth, checkoutController.initiateCheckout);

export default router;
