"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class PaymentService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async getUserPayments(userId) {
        const payments = await this.paymentRepository.findPaymentsByUserId(userId);
        if (!payments || payments.length === 0) {
            throw new AppError_1.default(404, 'No payments found for this user');
        }
        return payments;
    }
    async getPaymentDetails(paymentId, userId) {
        const payment = await this.paymentRepository.findPaymentById(paymentId);
        if (!payment) {
            throw new AppError_1.default(404, 'Payment not found');
        }
        if (payment.userId !== userId) {
            throw new AppError_1.default(403, 'You are not authorized to view this payment');
        }
        return payment;
    }
    async deletePayment(paymentId) {
        const payment = await this.paymentRepository.findPaymentById(paymentId);
        if (!payment) {
            throw new AppError_1.default(404, 'Payment not found');
        }
        return this.paymentRepository.deletePayment(paymentId);
    }
}
exports.PaymentService = PaymentService;
