"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const prisma_1 = require("@/infra/database/prisma");
class ProductRepository {
    async findManyProducts(params) {
        const { where = {}, orderBy = { createdAt: 'desc' }, skip = 0, take = 10, select } = params;
        const { categorySlug, ...restWhere } = where;
        const finalWhere = {
            ...restWhere,
            ...(categorySlug
                ? {
                    category: {
                        is: {
                            slug: {
                                equals: categorySlug,
                                mode: 'insensitive'
                            }
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
                variants: {
                    include: {
                        attributes: {
                            include: {
                                attribute: true,
                                value: true
                            }
                        }
                    }
                }
            };
        }
        return prisma_1.prisma.product.findMany(queryOptions);
    }
    async countProducts(params) {
        const { where = {} } = params;
        return prisma_1.prisma.product.count({ where });
    }
    async findProductById(id) {
        return prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: {
                    include: {
                        attributes: {
                            include: {
                                attribute: true,
                                value: true
                            }
                        }
                    }
                }
            }
        });
    }
    async findProductByName(name) {
        return prisma_1.prisma.product.findUnique({
            where: { name },
            select: {
                id: true,
                name: true,
                slug: true
            }
        });
    }
    async findProductBySlug(slug) {
        return prisma_1.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                variants: {
                    include: {
                        attributes: {
                            include: {
                                attribute: true,
                                value: true
                            }
                        }
                    }
                }
            }
        });
    }
    async findProductNameById(id) {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id },
            select: { name: true }
        });
        return product?.name || null;
    }
    async createProduct(data) {
        return prisma_1.prisma.product.create({
            data,
            include: {
                category: true,
                variants: {
                    include: {
                        attributes: { include: { attribute: true, value: true } }
                    }
                }
            }
        });
    }
    async createManyProducts(data) {
        return prisma_1.prisma.product.createMany({
            data,
            skipDuplicates: true
        });
    }
    async incrementSalesCount(id, quantity) {
        return prisma_1.prisma.product.update({
            where: { id },
            data: { salesCount: { increment: quantity } }
        });
    }
    async updateProduct(id, data) {
        return prisma_1.prisma.product.update({
            where: { id },
            data,
            include: {
                category: true,
                variants: {
                    include: {
                        attributes: {
                            include: {
                                attribute: true,
                                value: true
                            }
                        }
                    }
                }
            }
        });
    }
    async deleteProduct(id) {
        return prisma_1.prisma.product.delete({
            where: { id }
        });
    }
}
exports.ProductRepository = ProductRepository;
