import { Prisma } from '@/generated/prisma-client/client';
export interface FindManyVariantParams {
  where?: Prisma.ProductVariantWhereInput & { productSlug?: string };
  orderBy?: Prisma.ProductVariantOrderByWithRelationInput | Prisma.ProductVariantOrderByWithRelationInput[];
  skip?: number;
  take?: number;
  select?: Prisma.ProductVariantSelect;
}
export interface CreateVariantParams {
  productId: string;
  sku: string;
  price: number;
  images: string[];
  stock: number;
  lowStockThreshold?: number;
  barcode?: string;
  warehouseLocation?: string;
  attributes: { attributeId: string; valueId: string }[];
}
