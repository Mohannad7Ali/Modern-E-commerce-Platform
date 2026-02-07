"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_middleware_1 = require("@/shared/middlewares/protect.middleware");
const checkout_factory_1 = require("./checkout.factory");
const router = express_1.default.Router();
const checkoutController = (0, checkout_factory_1.makeCheckoutController)();
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
router.post('/', protect_middleware_1.requireAuth, checkoutController.initiateCheckout);
exports.default = router;
