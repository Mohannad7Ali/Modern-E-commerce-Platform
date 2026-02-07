"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("@/infra/database/prisma");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async getAllOrders() {
        const orders = await this.orderRepository.findAllOrders();
        if (!orders || orders.length === 0) {
            return new AppError_1.default(404, 'No orders found');
        }
        return orders;
    }
    async getOrderById(orderId) {
        const order = await this.orderRepository.findOrderById(orderId);
        if (!order) {
            return new AppError_1.default(404, 'No orders found');
        }
        return order;
    }
    async getUserOrders(userId) {
        const orders = await this.orderRepository.findOrdersByUserId(userId);
        if (!orders || orders.length === 0) {
            return new AppError_1.default(404, 'No orders found for this user');
        }
        return orders;
    }
    async getOrderDetails(orderId, userId) {
        const order = await prisma_1.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new AppError_1.default(404, 'Order not found');
        }
        if (order.userId !== userId) {
            return new AppError_1.default(403, 'You are not authorized to view this order');
        }
        return order;
    }
    async createOrderFromCart(cartId, userId) {
        const cart = await prisma_1.prisma.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: { include: { variant: { include: { product: true } } } } }
        });
        if (!cart || cart.cartItems.length === 0) {
            throw new AppError_1.default(400, 'Cart is empty or not found');
        }
        if (cart.userId !== userId) {
            throw new AppError_1.default(403, 'You are not authorized to access this cart');
        }
        const amount = cart.cartItems.reduce((sum, item) => sum + item.quantity * item.variant.price, 0);
        const orderItems = cart.cartItems.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant.price
        }));
        return this.orderRepository.createOrder({
            userId,
            amount,
            orderItems
        });
    }
}
exports.default = OrderService;
