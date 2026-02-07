"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_factory_1 = __importDefault(require("./order.factory"));
const express_1 = __importDefault(require("express"));
const protect_middleware_1 = require("@/shared/middlewares/protect.middleware");
const requireRole_1 = require("@/shared/middlewares/requireRole");
const router = (0, express_1.default)();
const orderController = (0, order_factory_1.default)();
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
router.get('/', protect_middleware_1.requireAuth, (0, requireRole_1.requireRole)('ADMIN', 'SUPERADMIN'), orderController.getAllOrders);
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
router.get('/user', protect_middleware_1.requireAuth, orderController.getUserOrders);
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
router.get('/:orderId', protect_middleware_1.requireAuth, orderController.getOrderDetails);
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
router.post('/', protect_middleware_1.requireAuth, orderController.createOrder);
exports.default = router;
