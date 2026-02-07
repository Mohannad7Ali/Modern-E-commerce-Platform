"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class AddressRepository {
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
    async findAddressesByUserId(userId) {
        return prisma_1.prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findAddressById(addressId) {
        return prisma_1.prisma.address.findUnique({
            where: { id: addressId }
        });
    }
    async deleteAddress(addressId) {
        return prisma_1.prisma.address.delete({
            where: { id: addressId }
        });
    }
}
exports.AddressRepository = AddressRepository;
