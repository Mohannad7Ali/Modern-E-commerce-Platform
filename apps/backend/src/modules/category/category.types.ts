// modules/category/category.types.ts

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
export default Category;
// modules/category/category.dto.ts

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
  images?: string[];
}

export interface UpdateCategory {
  name?: string;
  slug?: string;
  description?: string;
  images?: string[];
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  images: string[];
}
