"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipment_factory_1 = require("./shipment.factory");
const optionalAuth_1 = __importDefault(require("@/shared/middlewares/optionalAuth"));
const router = express_1.default.Router();
const shipmentController = (0, shipment_factory_1.makeShipmentController)();
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
router.post('/', optionalAuth_1.default, shipmentController.createShipment);
exports.default = router;
