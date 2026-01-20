import { prisma } from '@/infra/database/prisma';
import { Prisma } from '@/generated/prisma-client/client';
import { CreateVariantParams, FindManyVariantParams } from './variant.types';
export class VariantRepository {
  async findManyVariant(params: FindManyVariantParams) {
    const { where = {}, orderBy = { createdAt: 'desc' }, skip = 0, take = 10, select } = params;
    const { productSlug, ...restWhere } = where;
    const finalWhere: Prisma.ProductVariantWhereInput = {
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
    const queryOptions: Prisma.ProductVariantFindManyArgs = {
      where: finalWhere,
      orderBy,
      skip,
      take
    };
    if (select) {
      queryOptions.select = select;
    } else {
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
    return await prisma.productVariant.findMany(queryOptions);
  }
  async countVariants(params: { where?: Prisma.ProductVariantWhereInput }) {
    const { where = {} } = params;
    return await prisma.productVariant.count({ where });
  }
  async findVariantById(id: string) {
    return await prisma.productVariant.findUnique({
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
  async findVariantBySku(sku: string) {
    return await prisma.productVariant.findUnique({
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
  async createVariant(data: CreateVariantParams) {
    const { attributes, ...variantData } = data;
    return prisma.productVariant.create({
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
  async updateVariant(
    id: string,
    data: Partial<{
      sku: string;
      price: number;
      images?: string[];
      stock: number;
      lowStockThreshold?: number;
      barcode?: string;
      warehouseLocation?: string;
      attributes: { attributeId: string; valueId: string }[];
    }>
  ) {
    const { attributes, ...variantData } = data;
    return prisma.productVariant.update({
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

  async deleteVariant(id: string) {
    return prisma.productVariant.delete({
      where: { id }
    });
  }
  // async findRestockHistory(params: { variantId: string; skip?: number; take?: number }) {
  //   const { variantId, skip = 0, take = 10 } = params;
  //   return prisma.restock.findMany({
  //     where: { variantId },
  //     orderBy: { createdAt: 'desc' },
  //     skip,
  //     take,
  //     include: {
  //       variant: true,
  //       user: { select: { id: true, name: true } }
  //     }
  //   });
  // }

  // async countRestocks(params: { variantId: string }) {
  //   return prisma.restock.count({ where: { variantId: params.variantId } });
  // }
  // async createStockMovement(data: { variantId: string; quantity: number; reason: string; userId?: string }) {
  //   return prisma.stockMovement.create({
  //     data
  //   });
  // }
}
