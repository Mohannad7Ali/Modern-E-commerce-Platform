"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class PaymentRepository {
    async createPayment(data) {
        return prisma_1.prisma.payment.create({
            data: {
                orderId: data.orderId,
                userId: data.userId,
                method: data.method,
                amount: data.amount,
                status: data.status
            }
        });
    }
    async findPaymentsByUserId(userId) {
        return prisma_1.prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findPaymentById(paymentId) {
        return prisma_1.prisma.payment.findUnique({
            where: { id: paymentId }
        });
    }
    async deletePayment(paymentId) {
        return prisma_1.prisma.payment.delete({
            where: { id: paymentId }
        });
    }
}
exports.PaymentRepository = PaymentRepository;
