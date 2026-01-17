// modules/category/category.dto.ts
import { IsString, IsOptional, IsArray, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  slug!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

// الـ Response DTO يبقى كـ Interface أو Class عادي لأنه لا يحتاج Validation
export interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  images: string[];
}
