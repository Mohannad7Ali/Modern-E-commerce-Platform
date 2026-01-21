import { prisma } from '@/infra/database/prisma';
import { Prisma } from '@/generated/prisma-client/client';
import { createAttr, createValue } from './attribute.types';
export class AttributeRepository {
  async createAttribute(data: createAttr) {
    return prisma.attribute.create({ data });
  }
  async createAttributeValue(data: createValue) {
    return prisma.attributeValue.create({ data });
  }
  async assignAttributeToCategory(data: { categoryId: string; attributeId: string; isRequired: boolean }) {
    return prisma.categoryAttribute.create({ data });
  }
  async findManyAttributes(params: {
    where?: Prisma.AttributeWhereInput;
    orderBy?: Prisma.AttributeOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    const { where, orderBy = { createdAt: 'desc' }, skip = 0, take = 10 } = params;
    return prisma.attribute.findMany({
      where: { ...where },
      orderBy: { ...orderBy },
      skip,
      take,
      include: { values: true, categories: { include: { category: true } } }
    });
  }
  async findAttributeById(id: string) {
    return prisma.attribute.findUnique({
      where: { id },
      include: { values: true }
    });
  }

  async findAttributeValueById(id: string) {
    return prisma.attributeValue.findUnique({
      where: { id },
      include: { attribute: true }
    });
  }

  async deleteAttribute(id: string) {
    return prisma.attribute.delete({ where: { id } });
  }

  async deleteAttributeValue(id: string) {
    return prisma.attributeValue.delete({ where: { id } });
  }
}
