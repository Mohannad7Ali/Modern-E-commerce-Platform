import express from 'express';
import { requireAuth } from '@/shared/middlewares/protect.middleware';
import { makePaymentController } from './payment.factory';

const router = express.Router();
const paymentController = makePaymentController();
/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment managment
 */
/**
 * @swagger
 * /payments:
 *   get:
 *     tags: [Payment]
 *     summary: Get user's payments
 *     description: Retrieves a list of all payments made by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of payments.
 */
router.get('/', requireAuth, paymentController.getUserPayments);

/**
 * @swagger
 * /payments/{paymentId}:
 *   get:
 *     tags: [Payment]
 *     summary: Get payment details by ID
 *     description: Retrieves details of a specific payment by its ID.
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment details.
 *       404:
 *         description: Payment not found.
 */
router.get('/:paymentId', requireAuth, paymentController.getPaymentDetails);

/**
 * @swagger
 * /payments/{paymentId}:
 *   delete:
 *     tags: [Payment]
 *     summary: Delete payment by ID
 *     description: Deletes a specific payment by its ID.
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment deleted successfully.
 *       404:
 *         description: Payment not found.
 */
router.delete('/:paymentId', requireAuth, paymentController.deletePayment);

export default router;
