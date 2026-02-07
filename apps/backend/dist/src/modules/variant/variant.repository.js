"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class VariantRepository {
    async findManyVariant(params) {
        const { where = {}, orderBy = { createdAt: 'desc' }, skip = 0, take = 10, select } = params;
        const { productSlug, ...restWhere } = where;
        const finalWhere = {
            ...restWhere,
            ...(productSlug
                ? {
                    product: {
                        slug: {
                            equals: productSlug,
                            mode: 'insensitive'
                        }
                    }
                }
                : {})
        };
        const queryOptions = {
            where: finalWhere,
            orderBy,
            skip,
            take
        };
        if (select) {
            queryOptions.select = select;
        }
        else {
            queryOptions.include = {
                product: true,
                attributes: {
                    include: {
                        attribute: true,
                        value: true
                    }
                }
            };
        }
        return await prisma_1.prisma.productVariant.findMany(queryOptions);
    }
    async countVariants(params) {
        const { where = {} } = params;
        return await prisma_1.prisma.productVariant.count({ where });
    }
    async findVariantById(id) {
        return await prisma_1.prisma.productVariant.findUnique({
            where: { id },
            include: {
                product: true,
                attributes: {
                    include: {
                        attribute: true,
                        value: true
                    }
                }
            }
        });
    }
    async findVariantBySku(sku) {
        return await prisma_1.prisma.productVariant.findUnique({
            where: { sku },
            include: {
                product: true,
                attributes: {
                    include: {
                        attribute: true,
                        value: true
                    }
                }
            }
        });
    }
    async createVariant(data) {
        const { attributes, ...variantData } = data;
        return prisma_1.prisma.productVariant.create({
            data: {
                ...variantData,
                attributes: {
                    create: attributes.map(attr => ({
                        attributeId: attr.attributeId,
                        valueId: attr.valueId
                    }))
                }
            }
        });
    }
    async updateVariant(id, data) {
        const { attributes, ...variantData } = data;
        return prisma_1.prisma.productVariant.update({
            where: { id },
            data: {
                ...variantData,
                ...(attributes
                    ? {
                        attributes: {
                            deleteMany: {},
                            create: attributes.map(attr => ({
                                attributeId: attr.attributeId,
                                valueId: attr.valueId
                            }))
                        }
                    }
                    : {})
            },
            include: {
                attributes: {
                    include: {
                        attribute: true,
                        value: true
                    }
                },
                product: true
            }
        });
    }
    async deleteVariant(id) {
        return prisma_1.prisma.productVariant.delete({
            where: { id }
        });
    }
}
exports.VariantRepository = VariantRepository;
