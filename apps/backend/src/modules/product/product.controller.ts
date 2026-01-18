import { Request, Response } from 'express';

import sendResponse from '@/shared/utils/sendResponse';
import { ProductService } from './product.service';

import { CheckParamsType } from '@/shared/utils/checkType';

export class ProductController {
  constructor(private productService: ProductService) {}
  create = async (req: Request, res: Response) => {
    const product = await this.productService.createProduct(req.body);
    sendResponse(res, 201, { message: 'Product Created Successfully', data: product });
  };
  getAll = async (_req: Request, res: Response) => {
    const products = await this.productService.getAll();
    sendResponse(res, 200, { message: 'Products Retrieved Successfully', data: products });
  };
  getBySlug = async (req: Request, res: Response) => {
    const slug = CheckParamsType(req.params.slug);
    const product = await this.productService.getBySlug(slug);
    sendResponse(res, 200, { message: 'Product Retrieved Successfully', data: product });
  };
  getById = async (req: Request, res: Response) => {
    const id = CheckParamsType(req.params.id);
    const product = await this.productService.getById(id);
    sendResponse(res, 200, { message: 'Product Retrieved Successfully', data: product });
  };
  update = async (req: Request, res: Response) => {
    const id = CheckParamsType(req.params.id);
    const product = await this.productService.update(id, req.body);
    sendResponse(res, 200, { message: 'Product Updated Successfully', data: product });
  };

  delete = async (req: Request, res: Response) => {
    const id = CheckParamsType(req.params.id);
    await this.productService.delete(id);
    sendResponse(res, 204, { message: 'Product Deleted Successfully' });
  };
}
