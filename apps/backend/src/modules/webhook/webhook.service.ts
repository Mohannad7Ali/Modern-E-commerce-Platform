import { makeLogsService } from '@/modules/logs/logs.factory';
import { CartRepository } from '../cart/cart.repository';
import { CartService } from '../cart/cart.service';
import Stripe from '@/infra/payment/stripe';
import { prisma } from '@/infra/database/prisma';
import { CART_STATUS, PAYMENT_STATUS, TRANSACTION_STATUS } from '@/generated/prisma-client/client';
import AppError from '@/shared/errors/AppError';
import redisClient from '@/infra/cache/redis';

export default class WebhookService {
  private logsService = makeLogsService();
  private repo = new CartRepository();
  private cartService = new CartService(this.repo);

  private async calcOrderAmount(cart: any) {
    return cart.cartItem.reduce((sum: number, item: any) => {
      return sum + item.variant.price * item.quantity;
    }, 0);
  }

  async handleCheckoutCompletion(session: any) {
    const fullSession = await Stripe.checkout.sessions.retrieve(session.id, {
      expand: ['customer_details', 'line_items']
    });
    const existingOrder = await prisma.order.findFirst({
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
      throw new AppError(400, 'Missing userId or cartId in session metadata');
    }
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: { include: { variant: { include: { product: true } } } } }
    });
    if (!cart || cart.cartItems.length === 0) {
      throw new AppError(400, 'Cart is empty or not found');
    }
    const amount = await this.calcOrderAmount(cart);
    if (Math.abs(amount - (fullSession.amount_total ?? 0) / 100) > 0.01) {
      throw new AppError(400, 'Amount mismatch between cart and session');
    }

    const result = await prisma.$transaction(async tx => {
      //validate stock
      for (const item of cart.cartItems) {
        if (item.variant.stock < item.quantity) {
          throw new AppError(
            400,
            `Insufficient stock for variant ${item.variant.sku}: only ${item.variant.stock} available`
          );
        }
      }
      //Create order and order items
      const order = await tx.order.create({
        data: {
          id: fullSession.id,
          userId,
          amount,
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
          status: PAYMENT_STATUS.PAID
        }
      });
      //create transaction
      const transaction = await tx.transaction.create({
        data: {
          orderId: order.id,
          status: TRANSACTION_STATUS.PENDING,
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
          throw new AppError(404, `Variant not found: ${item.variantId}`);
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
        data: { status: CART_STATUS.CONVERTED }
      });

      return { order, payment, transaction, shipment, address };
    });
    //post transaction action
    try {
      await redisClient.del('dashboard:year-range');
      const keys = await redisClient.keys('dashboard:stats:*');
      if (keys.length > 0) await redisClient.del(keys);
    } catch (error) {
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
