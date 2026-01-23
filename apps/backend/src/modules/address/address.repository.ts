import { Prisma } from '@/generated/prisma-client/client';
import { prisma } from '@/infra/database/prisma';

export class AddressRepository {
  // NOTE:
  // Address-Order relation will be finalized during Checkout phase.
  // Current implementation is intentionally minimal.

  // async createAddress(
  //   data: {
  //     orderId: string;
  //     userId: string;
  //     street: string;
  //     city: string;
  //     state: string;
  //     country: string;
  //     zip: string;
  //   },
  //   tx?: Prisma.TransactionClient
  // ) {
  //   return tx?.address.create({
  //     data: {
  //       orderId: data.orderId,
  //       userId: data.userId,
  //       city: data.city,
  //       state: data.state,
  //       street: data.street,
  //       country: data.country,
  //       zip: data.zip
  //     }
  //   });
  // }
  async findAddressesByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAddressById(addressId: string) {
    return prisma.address.findUnique({
      where: { id: addressId }
    });
  }

  async deleteAddress(addressId: string) {
    return prisma.address.delete({
      where: { id: addressId }
    });
  }
}
