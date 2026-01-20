import { VariantService } from './variant.service';
import asyncHandler from '@/shared/utils/asyncHandler';
import { CheckParamsType } from '@/shared/utils/checkType';
import sendResponse from '@/shared/utils/sendResponse';
import { Request, Response, NextFunction } from 'express';
import AppError from '@/shared/errors/AppError';
import { uploadToCloudinary } from '@/shared/utils/uploadToCloudinary';
export class VariantController {
  constructor(private readonly variantService: VariantService) {}
  getAllVariants = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { variants, totalResults, totalPages, currentPage, resultsPerPage } =
      await this.variantService.getAllVariants(req.query);
    sendResponse(res, 200, {
      data: {
        variants,
        totalResults,
        totalPages,
        currentPage,
        resultsPerPage
      },
      message: 'Variants fetched successfully'
    });
  });
  getVariantById = asyncHandler(async (req: Request, res: Response) => {
    const variantId = CheckParamsType(req.params.id);
    const variant = await this.variantService.getVariantById(variantId);
    sendResponse(res, 200, {
      data: { variant },
      message: 'Variant fetched successfully'
    });
  });
  getVariantBySku = asyncHandler(async (req: Request, res: Response) => {
    const sku = CheckParamsType(req.params.sku);
    const variant = await this.variantService.getVariantBySku(sku);
    sendResponse(res, 200, {
      data: { variant },
      message: 'Variant fetched successfully'
    });
  });
  createVariant = asyncHandler(async (req: Request, res: Response) => {
    const { productId, sku, price, stock, lowStockThreshold, barcode, warehouseLocation, attributes } = req.body;
    let parsedAttributes;
    try {
      parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
      if (!Array.isArray(parsedAttributes)) {
        throw new AppError(400, 'Attributes must be an array');
      }
      parsedAttributes.forEach((attr: any, index: number) => {
        if (!attr.attributeId || !attr.valueId) {
          throw new AppError(400, `Invalid attribute structure at index ${index}`);
        }
      });
      const attributeIds = parsedAttributes.map((attr: any) => attr.attributeId);
      if (new Set(attributeIds).size !== attributeIds.length) {
        throw new AppError(400, 'Duplicate attributes in variant');
      }
    } catch (error) {
      throw new AppError(400, 'Invalid attributes format');
    }
    console.log('req.files: ', req.files);
    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];
    if (Array.isArray(files) && files.length > 0) {
      const uploadedImages = await uploadToCloudinary(files);
      imageUrls = uploadedImages.map(img => img.url).filter(Boolean);
    }

    const variant = await this.variantService.createVariant({
      productId,
      sku,
      price: Number(price),
      stock: Number(stock),
      lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : undefined,
      barcode,
      warehouseLocation,
      images: imageUrls,
      attributes: parsedAttributes
    });

    sendResponse(res, 201, { data: { variant }, message: 'Variant created successfully' });
  });

  updateVariant = asyncHandler(async (req: Request, res: Response) => {
    const variantId = CheckParamsType(req.params.id);
    const { sku, price, stock, lowStockThreshold, barcode, warehouseLocation, attributes } = req.body;
    let parsedAttributes;
    if (attributes) {
      try {
        parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
        if (!Array.isArray(parsedAttributes)) {
          throw new AppError(400, 'Attributes must be an array');
        }
        parsedAttributes.forEach((attr: any, index: number) => {
          if (!attr.attributeId || !attr.valueId) {
            throw new AppError(400, `Invalid attribute structure at index ${index}`);
          }
        });
        const attributeIds = parsedAttributes.map((attr: any) => attr.attributeId);
        if (new Set(attributeIds).size !== attributeIds.length) {
          throw new AppError(400, 'Duplicate attributes in variant');
        }
      } catch (error) {
        throw new AppError(400, 'Invalid attributes format');
      }
    }
    //TODO upload File
    const imageUrls = [''];
    const updateData = {
      ...(sku !== undefined && { sku }),
      ...(price !== undefined && { price: Number(price) }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold: Number(lowStockThreshold) }),
      ...(barcode !== undefined && { barcode }),
      ...(warehouseLocation !== undefined && { warehouseLocation }),
      ...(imageUrls.length > 0 && { images: imageUrls }),
      ...(parsedAttributes && { attributes: parsedAttributes })
    };
    const variant = await this.variantService.updateVariant(variantId, updateData);
    sendResponse(res, 200, {
      data: { variant },
      message: 'Variant updated successfully'
    });
  });
  deleteVariant = asyncHandler(async (req: Request, res: Response) => {
    const variantId = CheckParamsType(req.params.id);
    await this.variantService.deleteVariant(variantId);
    sendResponse(res, 200, { message: 'Variant deleted successfully' });
  });
}
