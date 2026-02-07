"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class ShipmentRepository {
    async createShipment(data) {
        const shipment = await prisma_1.prisma.shipment.create({
            data
        });
        return shipment;
    }
}
exports.ShipmentRepository = ShipmentRepository;
