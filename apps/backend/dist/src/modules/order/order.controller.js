"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const checkType_1 = require("@/shared/utils/checkType");
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.getAllOrders = (0, asyncHandler_1.default)(async (req, res) => {
            const orders = await this.orderService.getAllOrders();
            (0, sendResponse_1.default)(res, 200, { data: { orders }, message: 'Orders retrieved successfully' });
        });
        this.getUserOrders = (0, asyncHandler_1.default)(async (req, res) => {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.default(400, 'User not found');
            }
            const orders = await this.orderService.getUserOrders(userId);
            (0, sendResponse_1.default)(res, 200, { data: { orders }, message: 'Orders retrieved successfully' });
        });
        this.getOrderDetails = (0, asyncHandler_1.default)(async (req, res) => {
            const orderId = (0, checkType_1.CheckParamsType)(req.params?.orderId);
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.default(400, 'User not found');
            }
            const order = await this.orderService.getOrderDetails(orderId, userId);
            (0, sendResponse_1.default)(res, 200, {
                data: { order },
                message: 'Order details retrieved successfully'
            });
        });
        this.createOrder = (0, asyncHandler_1.default)(async (req, res) => {
            const userId = req.user?.id;
            const { cartId } = req.body;
            if (!userId) {
                throw new AppError_1.default(400, 'User not found');
            }
            if (!cartId) {
                throw new AppError_1.default(400, 'Cart ID is required');
            }
            const order = await this.orderService.createOrderFromCart(userId, cartId);
            (0, sendResponse_1.default)(res, 201, {
                data: { order },
                message: 'Order created successfully'
            });
        });
    }
}
exports.default = OrderController;
