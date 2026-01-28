import { prisma } from '@/infra/database/prisma';

export class ShipmentRepository {
  async createShipment(data: {
    orderId: string;
    trackingNumber: string;
    shippedDate: Date;
    deliveryDate: Date;
    carrier: string;
  }) {
    const shipment = await prisma.shipment.create({
      data
    });
    return shipment;
  }
}
