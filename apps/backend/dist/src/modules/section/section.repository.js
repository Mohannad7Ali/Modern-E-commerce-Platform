"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class SectionRepository {
    async findAll() {
        return prisma_1.prisma.section.findMany();
    }
    async findHero() {
        return prisma_1.prisma.section.findFirst({ where: { type: 'HERO' } });
    }
    async findPromo() {
        return prisma_1.prisma.section.findFirst({ where: { type: 'PROMOTIONAL' } });
    }
    async findArrivals() {
        return prisma_1.prisma.section.findFirst({ where: { type: 'NEW_ARRIVALS' } });
    }
    async findBenefits() {
        return prisma_1.prisma.section.findFirst({ where: { type: 'BENEFITS' } });
    }
    async create(data) {
        return prisma_1.prisma.section.create({ data });
    }
    async findById(id) {
        return prisma_1.prisma.section.findUnique({ where: { id } });
    }
    async update(type, data) {
        return prisma_1.prisma.section.updateMany({
            where: { type },
            data
        });
    }
    async deleteByType(type) {
        return prisma_1.prisma.section.deleteMany({ where: { type } });
    }
}
exports.SectionRepository = SectionRepository;
