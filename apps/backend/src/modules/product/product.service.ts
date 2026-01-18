import AppError from '@/shared/errors/AppError';
import { ProductRepository } from './product.repository';
import slugify from '@/shared/utils/slugify';
import { CreateProductDto, UpdateProductDto } from './product.dto';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  async createProduct(data: CreateProductDto) {
    return await this.productRepository.create(data);
  }
  async getAll() {
    return await this.productRepository.findAll();
  }
  async getBySlug(slug: string) {
    const Slug = slugify(slug);
    const product = await this.productRepository.findBySlug(Slug);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }
    return product;
  }
  async getById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.productRepository.update(id, dto);
  }

  async delete(id: string) {
    await this.productRepository.delete(id);
  }
}
