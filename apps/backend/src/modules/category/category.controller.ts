// modules/category/category.controller.ts

import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import slugify from '@/shared/utils/slugify';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  create = async (req: Request, res: Response): Promise<void> => {
    const category = await this.categoryService.createCategory(req.body);
    res.status(201).json(category);
  };
  getAll = async (_req: Request, res: Response) => {
    const categories = await this.categoryService.getCategories();
    res.json(categories);
  };
  getBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    if (typeof slug !== 'string') {
      return res.status(400).json({ message: 'Invalid slug format' });
    }
    const Slug = slugify(slug);
    const category = await this.categoryService.getCategoryBySlug(Slug);
    res.json(category);
  };
  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    const category = await this.categoryService.updateCategory(id, req.body);
    res.json(category);
  };
  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid slug format' });
    }
    await this.categoryService.deleteCategory(id);
    res.status(204).json({ message: 'deleted successfully' });
  };
}
