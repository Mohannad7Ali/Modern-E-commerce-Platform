"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logs_factory_1 = require("@/modules/logs/logs.factory");
const cart_repository_1 = require("../cart/cart.repository");
const cart_service_1 = require("../cart/cart.service");
const stripe_1 = __importDefault(require("@/infra/payment/stripe"));
const prisma_1 = require("@/infra/database/prisma");
const client_1 = require("@/generated/prisma-client/client");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const redis_1 = __importDefault(require("@/infra/cache/redis"));
class WebhookService {
    constructor() {
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.repo = new cart_repository_1.CartRepository();
        this.cartService = new cart_service_1.CartService(this.repo);
    }
    async calcOrderAmount(cart) {
        return cart.cartItem.reduce((sum, item) => {
            return sum + item.variant.price * item.quantity;
        }, 0);
    }
    async handleCheckoutCompletion(session) {
        const fullSession = await stripe_1.default.checkout.sessions.retrieve(session.id, {
            expand: ['customer_details', 'line_items']
        });
        const existingOrder = await prisma_1.prisma.order.findFirst({
            where: {
                id: fullSession.id
            }
        });
        if (existingOrder) {
            this.logsService.info('webhook - Dublicated event ignored', {
                sessionId: session.id
            });
            return {
                order: existingOrder,
                payment: null,
                transaction: null,
                shipment: null,
                address: null
            };
        }
        const userId = fullSession?.metadata?.userId;
        const cartId = fullSession?.metadata?.cartId;
        if (!cartId || !userId) {
            throw new AppError_1.default(400, 'Missing userId or cartId in session metadata');
        }
        const cart = await prisma_1.prisma.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: { include: { variant: { include: { product: true } } } } }
        });
        if (!cart || cart.cartItems.length === 0) {
            throw new AppError_1.default(400, 'Cart is empty or not found');
        }
        const amount = await this.calcOrderAmount(cart);
        if (Math.abs(amount - (fullSession.amount_total ?? 0) / 100) > 0.01) {
            throw new AppError_1.default(400, 'Amount mismatch between cart and session');
        }
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            //validate stock
            for (const item of cart.cartItems) {
                if (item.variant.stock < item.quantity) {
                    throw new AppError_1.default(400, `Insufficient stock for variant ${item.variant.sku}: only ${item.variant.stock} available`);
                }
            }
            //Create order and order items
            const order = await tx.order.create({
                data: {
                    id: fullSession.id,
                    userId,
                    amount,
                    status: 'PAID',
                    orderItems: {
                        create: cart.cartItems.map(item => ({
                            variantId: item.variant.id,
                            quantity: item.quantity,
                            price: item.variant.price
                        }))
                    }
                }
            });
            //create address
            let address;
            const customerAddress = fullSession.customer_details?.address;
            if (customerAddress) {
                address = await tx.address.create({
                    data: {
                        orderId: order.id,
                        userId,
                        city: customerAddress.city || 'N/A',
                        state: customerAddress.state || 'N/A',
                        country: customerAddress.country || 'N/A',
                        zip: customerAddress.postal_code || 'N/A',
                        street: customerAddress.line1 || 'N/A'
                    }
                });
            }
            //create payment
            const payment = await tx.payment.create({
                data: {
                    orderId: order.id,
                    userId,
                    method: fullSession.payment_method_types?.[0] || 'unknown',
                    amount,
                    status: client_1.PAYMENT_STATUS.PAID
                }
            });
            //create transaction
            const transaction = await tx.transaction.create({
                data: {
                    orderId: order.id,
                    status: client_1.TRANSACTION_STATUS.PENDING,
                    transactionDate: new Date()
                }
            });
            //create shipment
            const shipment = await tx.shipment.create({
                data: {
                    orderId: order.id,
                    carrier: 'Carrier_' + Math.random().toString(36).substring(2, 10),
                    trackingNumber: Math.random().toString(36).substring(2),
                    shippedDate: new Date(),
                    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
            //update variant stock and product sales
            for (const item of cart.cartItems) {
                const variant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                    select: { stock: true, product: { select: { id: true, salesCount: true } } }
                });
                if (!variant) {
                    throw new AppError_1.default(404, `Variant not found: ${item.variantId}`);
                }
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { decrement: item.quantity } }
                });
                await tx.product.update({
                    where: { id: item.variant.product.id },
                    data: { salesCount: { increment: item.quantity } }
                });
            }
            //clear cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            await tx.cart.update({
                where: { id: cart.id },
                data: { status: client_1.CART_STATUS.CONVERTED }
            });
            return { order, payment, transaction, shipment, address };
        });
        //post transaction action
        try {
            await redis_1.default.del('dashboard:year-range');
            const keys = await redis_1.default.keys('dashboard:stats:*');
            if (keys.length > 0)
                await redis_1.default.del(keys);
        }
        catch (error) {
            console.error(error);
        }
        this.cartService.logCartEvent(cart.id, 'CHECKOUT_COMPLETED', userId);
        this.logsService.info('Webhook - Order processed successfully', {
            userId,
            orderId: result.order.id,
            amount
        });
        return result;
    }
}
exports.default = WebhookService;
