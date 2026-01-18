import { prisma } from '@/infra/database/prisma';
import { CreateProductDto, UpdateProductDto } from './product.dto';

export class ProductRepository {
  async create(product: CreateProductDto) {
    return prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images,
        categoryId: product.categoryId,
        isNew: product.isNew ?? false,
        isFeatured: product.isFeatured ?? false,
        isTrending: product.isTrending ?? false,
        isBestSeller: product.isBestSeller ?? false
      }
    });
  }
  async findAll() {
    return prisma.product.findMany({
      where: {},
      orderBy: { createdAt: 'desc' }
    });
  }

  findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug }
    });
  }

  findById(id: string) {
    return prisma.product.findUnique({
      where: { id }
    });
  }
  update(id: string, data: UpdateProductDto) {
    return prisma.product.update({
      where: { id },
      data
    });
  }

  delete(id: string) {
    return prisma.product.delete({
      where: { id }
    });
  }
}
