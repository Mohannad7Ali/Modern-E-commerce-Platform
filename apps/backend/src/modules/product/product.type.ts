// modules/product/product.types.ts

export interface Product {
  id: string;
  name: string;
  slug: string;
  images: string;
  description?: string | null;
  categoryId?: string | null;
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface ProductCreateInput {
  id: string;
  name: string;
  slug: string;
  images: string[];
  description?: string | null;
  categoryId?: string | null;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
}
