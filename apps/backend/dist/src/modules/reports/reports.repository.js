"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class ReportsRepository {
    async createReport(data) {
        return prisma_1.prisma.report.create({
            data: {
                type: data.type,
                format: data.format,
                userId: data.userId,
                parameters: data.parameters,
                filePath: data.filePath,
                createdAt: new Date()
            }
        });
    }
}
exports.ReportsRepository = ReportsRepository;
