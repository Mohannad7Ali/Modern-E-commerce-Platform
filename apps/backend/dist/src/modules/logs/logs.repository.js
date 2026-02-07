"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class LogsRepository {
    constructor() { }
    async getLogs() {
        return prisma_1.prisma.log.findMany({
            take: 100,
            orderBy: { createdAt: 'desc' }
        });
    }
    async getLogById(id) {
        return prisma_1.prisma.log.findUnique({
            where: { id }
        });
    }
    async getLogsByLevel(level) {
        return prisma_1.prisma.log.findMany({
            where: { level }
        });
    }
    async deleteLog(id) {
        return prisma_1.prisma.log.delete({
            where: { id }
        });
    }
    async clearLogs() {
        return prisma_1.prisma.log.deleteMany();
    }
    async createLog(data) {
        return prisma_1.prisma.log.create({
            data: {
                level: data.level,
                message: data.message,
                context: data.context
            }
        });
    }
}
exports.LogsRepository = LogsRepository;
