"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = makeOrderController;
const order_repository_1 = __importDefault(require("./order.repository"));
const order_service_1 = __importDefault(require("./order.service"));
const order_controller_1 = __importDefault(require("./order.controller"));
function makeOrderController() {
    const orderRepository = new order_repository_1.default();
    const orderService = new order_service_1.default(orderRepository);
    const orderController = new order_controller_1.default(orderService);
    return orderController;
}
