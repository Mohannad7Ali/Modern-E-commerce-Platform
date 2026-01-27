import makeOrderController from './order.factory';
import Router from 'express';
import { requireAuth } from '@/shared/middlewares/protect.middleware';
import { requireRole } from '@/shared/middlewares/requireRole';

const router = Router();
const orderController = makeOrderController();
/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order routes
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Order]
 *     description: Retrieves all orders in the system. Accessible only by admins and superadmins.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all orders.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 *       403:
 *         description: Forbidden. User does not have the required role.
 */
router.get('/', requireAuth, requireRole('ADMIN', 'SUPERADMIN'), orderController.getAllOrders);

/**
 * @swagger
 * /orders/user:
 *   get:
 *     summary: Get user orders
 *     tags: [Order]
 *     description: Retrieves all orders placed by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders placed by the user.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get('/user', requireAuth, orderController.getUserOrders);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     tags: [Order]
 *     description: Retrieves detailed information about a specific order.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The details of the specified order.
 *       404:
 *         description: Order not found.
 *       401:
 *         description: Unauthorized. Token is invalid or missing.
 */
router.get('/:orderId', requireAuth, orderController.getOrderDetails);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order from cart
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *             properties:
 *               cartId:
 *                 type: string
 *                 example: "ckv123abc456"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid cart ID
 */
router.post('/', requireAuth, orderController.createOrder);
export default router;
