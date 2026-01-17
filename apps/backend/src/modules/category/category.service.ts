import AppError from '@/shared/errors/AppError';
import { CategoryRepository } from './category.repository';
import { CategoryResponse, CreateCategory, UpdateCategory } from './category.types';

export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}
  private toResponse(category: any): CategoryResponse {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      images: category.images
    };
  }

  async createCategory(data: CreateCategory): Promise<CategoryResponse> {
    const category = await this.categoryRepo.create(data);
    return this.toResponse(category);
  }
  async getCategories(): Promise<CategoryResponse[]> {
    const categories = await this.categoryRepo.findAll();
    return categories.map(category => this.toResponse(category));
  }
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    const category = await this.categoryRepo.findBySlug(slug);
    if (!category) {
      throw new AppError(404, 'Category not found');
    }
    return this.toResponse(category);
  }
  async updateCategory(id: string, dto: UpdateCategory): Promise<CategoryResponse> {
    const category = await this.categoryRepo.update(id, dto);
    return this.toResponse(category);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
