"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const slugify_1 = __importDefault(require("@/shared/utils/slugify"));
const ApiFeature_1 = __importDefault(require("@/shared/utils/ApiFeature"));
const prisma_1 = require("@/infra/database/prisma");
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async getAllCategories(queryString) {
        const apiFeatures = new ApiFeature_1.default(queryString).filter().sort().limitFields().paginate().build();
        const { where, orderBy, skip, take } = apiFeatures;
        const categories = await this.categoryRepository.findManyCategories({
            where,
            orderBy,
            skip,
            take,
            includeProducts: true
        });
        // const categoriesWithCounts = categories.map((category) => ({
        //   ...category,
        //   productCount: category.products?.length || 0,
        //   variantCount: category.products?.reduce((sum, product) => sum + (product.variants?.length || 0), 0) || 0,
        // }));
        return categories;
    }
    async getCategory(categoryId) {
        const category = await this.categoryRepository.findCategoryById(categoryId, true);
        if (!category) {
            throw new AppError_1.default(404, 'Category not found');
        }
        return {
            ...category,
            productCount: category.products?.length || 0
        };
    }
    async createCategory(data) {
        const slug = (0, slugify_1.default)(data.name);
        const existingCategory = await prisma_1.prisma.category.findUnique({ where: { slug } });
        if (existingCategory) {
            throw new AppError_1.default(400, 'Category with this name already exists');
        }
        // Validate attributes
        if (data.attributes) {
            for (const attr of data.attributes) {
                const attribute = await prisma_1.prisma.attribute.findUnique({ where: { id: attr.attributeId } });
                if (!attribute) {
                    throw new AppError_1.default(404, `Attribute not found: ${attr.attributeId}`);
                }
            }
        }
        const category = await this.categoryRepository.createCategory({
            name: data.name,
            slug,
            description: data.description,
            images: data.images,
            attributes: data.attributes
        });
        return { category };
    }
    async updateCategory(categoryId, data) {
        const category = await this.categoryRepository.findCategoryById(categoryId);
        if (!category) {
            throw new AppError_1.default(404, 'Category not found');
        }
        const slug = data.name ? (0, slugify_1.default)(data.name) : undefined;
        if (slug && slug !== category.slug) {
            const existingCategory = await prisma_1.prisma.category.findUnique({ where: { slug } });
            if (existingCategory) {
                throw new AppError_1.default(400, 'Category with this name already exists');
            }
        }
        const updatedCategory = await this.categoryRepository.updateCategory(categoryId, {
            name: data.name,
            slug,
            description: data.description,
            images: data.images
        });
        return { category: updatedCategory };
    }
    async deleteCategory(categoryId) {
        const category = await this.categoryRepository.findCategoryById(categoryId);
        if (!category) {
            throw new AppError_1.default(404, 'Category not found');
        }
        await this.categoryRepository.deleteCategory(categoryId);
    }
    async addCategoryAttribute(categoryId, attributeId, isRequired) {
        const category = await this.categoryRepository.findCategoryById(categoryId);
        if (!category) {
            throw new AppError_1.default(404, 'Category not found');
        }
        const attribute = await prisma_1.prisma.attribute.findUnique({ where: { id: attributeId } });
        if (!attribute) {
            throw new AppError_1.default(404, 'Attribute not found');
        }
        const existing = await prisma_1.prisma.categoryAttribute.findUnique({
            where: { categoryId_attributeId: { categoryId, attributeId } }
        });
        if (existing) {
            throw new AppError_1.default(400, 'Attribute already assigned to category');
        }
        const categoryAttribute = await this.categoryRepository.addCategoryAttribute(categoryId, attributeId, isRequired);
        return { categoryAttribute };
    }
    async removeCategoryAttribute(categoryId, attributeId) {
        const category = await this.categoryRepository.findCategoryById(categoryId);
        if (!category) {
            throw new AppError_1.default(404, 'Category not found');
        }
        const attribute = await prisma_1.prisma.attribute.findUnique({ where: { id: attributeId } });
        if (!attribute) {
            throw new AppError_1.default(404, 'Attribute not found');
        }
        await this.categoryRepository.removeCategoryAttribute(categoryId, attributeId);
    }
}
exports.CategoryService = CategoryService;
