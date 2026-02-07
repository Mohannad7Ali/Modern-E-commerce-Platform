"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWebhookController = void 0;
const webhook_service_1 = __importDefault(require("./webhook.service"));
const webhook_controller_1 = __importDefault(require("./webhook.controller"));
const product_repository_1 = require("../product/product.repository");
const shipment_repository_1 = require("../shipment/shipment.repository");
const payment_repository_1 = require("../payment/payment.repository");
const order_repository_1 = __importDefault(require("../order/order.repository"));
const address_repository_1 = require("../address/address.repository");
const cart_repository_1 = require("../cart/cart.repository");
const transaction_repository_1 = require("../transaction/transaction.repository");
const makeWebhookController = () => {
    const productRepo = new product_repository_1.ProductRepository();
    const shipmentRepo = new shipment_repository_1.ShipmentRepository();
    const paymentRepo = new payment_repository_1.PaymentRepository();
    const orderRepo = new order_repository_1.default();
    const addressRepo = new address_repository_1.AddressRepository();
    const cartRepo = new cart_repository_1.CartRepository();
    const transactionRepo = new transaction_repository_1.TransactionRepository();
    const webhookService = new webhook_service_1.default();
    return new webhook_controller_1.default(webhookService);
};
exports.makeWebhookController = makeWebhookController;
