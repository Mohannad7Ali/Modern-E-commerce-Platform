"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class TransactionRepository {
    constructor() { }
    async findMany() {
        return prisma_1.prisma.transaction.findMany();
    }
    async findById(id) {
        return prisma_1.prisma.transaction.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        payment: true,
                        shipment: true,
                        user: true,
                        address: true,
                        orderItems: true
                    }
                }
            }
        });
    }
    async createTransaction(data) {
        return prisma_1.prisma.transaction.create({
            data
        });
    }
    async updateTransaction(id, data) {
        return prisma_1.prisma.transaction.update({
            where: { id },
            data
        });
    }
    async deleteTransaction(id) {
        return prisma_1.prisma.transaction.delete({
            where: { id }
        });
    }
}
exports.TransactionRepository = TransactionRepository;
