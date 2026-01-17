import { prisma } from '@/infra/database/prisma';
import { CreateCategory } from './category.types';
import { UpdateCategory } from './category.types';

export class CategoryRepository {
  async create(data: CreateCategory) {
    return prisma.category.create({
      data
    });
  }
  async findAll() {
    return prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  }
  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug }
    });
  }
  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id }
    });
  }
  async update(id: string, data: UpdateCategory) {
    return prisma.category.update({
      where: { id },
      data
    });
  }
  async delete(id: string) {
    return prisma.category.delete({
      where: { id }
    });
  }
}
