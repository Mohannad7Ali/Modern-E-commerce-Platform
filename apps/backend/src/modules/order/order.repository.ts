import { prisma } from '@/infra/database/prisma';
// import { Prisma } from '@/generated/prisma-client/client';
export default class OrderRepository {
  async findAllOrders() {
    return await prisma.order.findMany({
      orderBy: { orderDate: 'desc' },
      include: { orderItems: { include: { variant: { include: { product: true } } } } }
    });
  }
  async findOrdersByUserId(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { orderDate: 'desc' },
      include: { orderItems: { include: { variant: { include: { product: true } } } } }
    });
  }
  async findOrderById(orderId: string) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { variant: { include: { product: true } } } }
        // payment: true,
        // address: true,
        // shipment: true,
        // transaction: true
      }
    });
  }
  async createOrder(data: {
    userId: string;
    amount: number;
    orderItems: { variantId: string; quantity: number; price: number }[];
  }) {
    return await prisma.$transaction(async tx => {
      //validate stock for all variant
      for (const item of data.orderItems) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stock: true, product: { select: { id: true, salesCount: true } } }
        });
        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for variant ${item.variantId}: only ${variant.stock} available`);
        }
      }
      //create order
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          amount: data.amount,
          orderItems: {
            create: data.orderItems.map(item => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });
      // update stock and sales count
      for (const item of data.orderItems) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stock: true, product: { select: { id: true, salesCount: true } } }
        });
        if (variant) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: variant.stock - item.quantity }
          });
          await tx.product.update({
            where: { id: variant.product.id },
            data: { salesCount: variant.product.salesCount + item.quantity }
          });
        }
      }
      return order;
    });
  }
}
