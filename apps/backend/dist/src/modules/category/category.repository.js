"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class CategoryRepository {
    async findManyCategories(params) {
        const { where, orderBy, skip, take, includeProducts } = params;
        return prisma_1.prisma.category.findMany({
            where,
            orderBy: orderBy || { createdAt: 'desc' },
            skip,
            take,
            include: {
                attributes: { include: { attribute: { include: { values: true } } } },
                products: includeProducts
                    ? { include: { variants: { select: { id: true, sku: true, price: true, stock: true } } } }
                    : false
            }
        });
    }
    async findCategoryById(id, includeProducts = false) {
        return prisma_1.prisma.category.findUnique({
            where: { id },
            include: {
                attributes: { include: { attribute: { include: { values: true } } } },
                products: includeProducts
                    ? { include: { variants: { select: { id: true, sku: true, price: true, stock: true } } } }
                    : false
            }
        });
    }
    async createCategory(data) {
        return prisma_1.prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                images: data.images,
                attributes: data.attributes
                    ? {
                        create: data.attributes.map(attr => ({
                            attributeId: attr.attributeId,
                            isRequired: attr.isRequired
                        }))
                    }
                    : undefined
            }
        });
    }
    async updateCategory(id, data) {
        return prisma_1.prisma.category.update({
            where: { id },
            data
        });
    }
    async deleteCategory(id) {
        return prisma_1.prisma.category.delete({
            where: { id }
        });
    }
    async addCategoryAttribute(categoryId, attributeId, isRequired) {
        return prisma_1.prisma.categoryAttribute.create({
            data: {
                categoryId,
                attributeId,
                isRequired
            }
        });
    }
    async removeCategoryAttribute(categoryId, attributeId) {
        return prisma_1.prisma.categoryAttribute.delete({
            where: { categoryId_attributeId: { categoryId, attributeId } }
        });
    }
}
exports.CategoryRepository = CategoryRepository;
