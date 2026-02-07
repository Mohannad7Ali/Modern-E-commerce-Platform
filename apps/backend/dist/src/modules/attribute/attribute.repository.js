"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class AttributeRepository {
    async createAttribute(data) {
        return prisma_1.prisma.attribute.create({ data });
    }
    async createAttributeValue(data) {
        return prisma_1.prisma.attributeValue.create({ data });
    }
    async assignAttributeToCategory(data) {
        return prisma_1.prisma.categoryAttribute.create({ data });
    }
    async findManyAttributes(params) {
        const { where, orderBy = { createdAt: 'desc' }, skip = 0, take = 10 } = params;
        return prisma_1.prisma.attribute.findMany({
            where: { ...where },
            orderBy: { ...orderBy },
            skip,
            take,
            include: { values: true, categories: { include: { category: true } } }
        });
    }
    async findAttributeById(id) {
        return prisma_1.prisma.attribute.findUnique({
            where: { id },
            include: { values: true }
        });
    }
    async findAttributeByName(name) {
        return prisma_1.prisma.attribute.findUnique({
            where: { name },
            include: { values: true }
        });
    }
    async findAttributeValueById(id) {
        return prisma_1.prisma.attributeValue.findUnique({
            where: { id },
            include: { attribute: true }
        });
    }
    async findValueInAttribute(attributeId, value) {
        return prisma_1.prisma.attributeValue.findFirst({
            where: { attributeId, value },
            include: { attribute: true }
        });
    }
    async checkCategoryAssignment(categoryId, attributeId) {
        return prisma_1.prisma.categoryAttribute.findFirst({
            where: { attributeId, categoryId },
            include: { attribute: true }
        });
    }
    async isAttributeInUse(attributeId) {
        const usedInCategory = await prisma_1.prisma.categoryAttribute.findFirst({
            where: { attributeId },
            include: { attribute: true }
        });
        const usedInVarint = await prisma_1.prisma.productVariantAttribute.findFirst({
            where: { attributeId },
            include: { attribute: true }
        });
        if (usedInCategory || usedInVarint) {
            return true;
        }
        return false;
    }
    async deleteAttribute(id) {
        return prisma_1.prisma.attribute.delete({ where: { id } });
    }
    async deleteAttributeValue(id) {
        return prisma_1.prisma.attributeValue.delete({ where: { id } });
    }
}
exports.AttributeRepository = AttributeRepository;
