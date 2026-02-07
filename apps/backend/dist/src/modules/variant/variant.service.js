"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantService = void 0;
const ApiFeature_1 = __importDefault(require("@/shared/utils/ApiFeature"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const prisma_1 = require("@/infra/database/prisma");
class VariantService {
    constructor(VariantRepository, ProductRepository) {
        this.VariantRepository = VariantRepository;
        this.ProductRepository = ProductRepository;
    }
    async getAllVariants(queryString) {
        const apiFeatures = new ApiFeature_1.default(queryString).filter().sort().limitFields().paginate().build();
        const { where, orderBy, skip, take, select } = apiFeatures;
        // const finalWhere = where ?? {};
        //Short-circuit evaluation
        const finalWhere = where && Object.keys(where).length > 0 ? where : {};
        const totalResults = await this.VariantRepository.countVariants({ where: finalWhere });
        // pagination calc
        const totalPages = Math.ceil(totalResults / take);
        const currentPage = Math.floor(skip / take) + 1;
        const variants = await this.VariantRepository.findManyVariant({
            where: finalWhere,
            orderBy: orderBy || { createdAt: 'desc' },
            skip,
            take,
            select
        });
        return {
            variants,
            totalResults,
            totalPages,
            currentPage,
            resultsPerPage: take
        };
    }
    async getVariantById(variantId) {
        const variant = await this.VariantRepository.findVariantById(variantId);
        if (!variant) {
            throw new AppError_1.default(404, 'Variant not found');
        }
        return variant;
    }
    async getVariantBySku(sku) {
        const variant = await this.VariantRepository.findVariantBySku(sku);
        if (!variant) {
            throw new AppError_1.default(404, 'Variant not found');
        }
        return variant;
    }
    async createVariant(data) {
        const { productId, attributes } = data;
        const product = await this.ProductRepository.findProductById(productId);
        if (!product) {
            throw new AppError_1.default(404, 'Product not found');
        }
        const existingVariant = await this.VariantRepository.findVariantBySku(data.sku);
        if (existingVariant) {
            throw new AppError_1.default(400, 'SKU already exists');
        }
        if (!attributes || attributes.length === 0) {
            throw new AppError_1.default(400, 'At least one attribute is required');
        }
        if (product.categoryId) {
            const requiredAttrs = await prisma_1.prisma.categoryAttribute.findMany({
                where: { categoryId: product.categoryId, isRequired: true }
            });
            const requiredAttributesIds = requiredAttrs.map(attr => attr.id);
            const variantAttributes = attributes.map(attr => attr.attributeId);
            const missingAttrs = requiredAttributesIds.filter(id => !variantAttributes.includes(id));
            if (missingAttrs.length > 0) {
                throw new AppError_1.default(400, `Variant is missing required attributes: ${missingAttrs.join(', ')}`);
            }
        }
        const AllAttributeIds = [...new Set(attributes.map(attr => attr.attributeId))];
        const existingAttributes = await prisma_1.prisma.attribute.findMany({
            where: { id: { in: AllAttributeIds } }
        });
        if (existingAttributes.length !== AllAttributeIds.length) {
            throw new AppError_1.default(400, 'One or more attributes are invalid');
        }
        const allValueIds = [...new Set(attributes.map(a => a.valueId))];
        const existingValues = await prisma_1.prisma.attributeValue.findMany({
            where: { id: { in: allValueIds } }
        });
        if (existingValues.length !== allValueIds.length) {
            throw new AppError_1.default(400, 'One or more attribute values are invalid');
        }
        if (new Set(AllAttributeIds).size !== AllAttributeIds.length) {
            throw new AppError_1.default(400, 'Duplicate attributes in variant');
        }
        // here we make a fingerprint for all this product variant to check if that variant with this attributes and values duplicated
        // get all variant for this product id
        const existingVariants = await prisma_1.prisma.productVariant.findMany({
            where: { productId },
            include: { attributes: true }
        });
        // make fingerprint to this input variant
        const newComboKey = attributes
            .map(a => `${a.attributeId}:${a.valueId}`)
            .sort()
            .join('|');
        // loop for all existing variant and make fingerprint for each one
        // if some variant have the same fingerprint to new variant we throw error
        const isDublicatedCompo = existingVariants.some(v => {
            const existingKey = v.attributes
                .map(a => `${a.attributeId}:${a.valueId}`)
                .sort()
                .join('|');
            return existingKey === newComboKey;
        });
        //this code protect db from unlogical input without it you will see many variant with same attr
        if (isDublicatedCompo) {
            throw new AppError_1.default(400, 'Duplicate attribute combination for this product');
        }
        return this.VariantRepository.createVariant(data);
    }
    async updateVariant(variantId, data) {
        const existingVariant = await this.VariantRepository.findVariantById(variantId);
        if (!existingVariant) {
            throw new AppError_1.default(404, 'Variant not found');
        }
        if (data.sku && data.sku !== existingVariant.sku) {
            const existingSku = await prisma_1.prisma.productVariant.findUnique({
                where: { sku: data.sku }
            });
            if (existingSku) {
                throw new AppError_1.default(400, 'SKU already exists');
            }
        }
        if (data.attributes) {
            if (data.attributes.length > 0) {
                throw new AppError_1.default(400, 'At least one attribute is required');
            }
            const product = await prisma_1.prisma.product.findUnique({
                where: { id: existingVariant.productId }
            });
            if (product?.categoryId) {
                const requiredAttributes = await prisma_1.prisma.categoryAttribute.findMany({
                    where: { categoryId: product.categoryId, isRequired: true },
                    select: { attributeId: true }
                });
                const requiredAttributesIds = requiredAttributes.map(a => a.attributeId);
                const variantAttrsIds = data.attributes.map(a => a.attributeId);
                const missingAttrs = requiredAttributesIds.filter(id => !variantAttrsIds.includes(id));
                if (missingAttrs.length > 0) {
                    throw new AppError_1.default(400, `Variant is missing required attributes: ${missingAttrs.join(', ')}`);
                }
            }
        }
        // check if user add attribute not true or exist in our db
        const allInputAttributeIds = [...new Set(data.attributes?.map(a => a.attributeId))];
        const existingAttributes = await prisma_1.prisma.attribute.findMany({
            where: { id: { in: allInputAttributeIds } }
        });
        if (existingAttributes.length !== allInputAttributeIds.length) {
            throw new AppError_1.default(400, 'One or more attributes are invalid');
        }
        // check if user add value not true or exist in our db
        const allInputValueIds = [...new Set(data.attributes?.map(a => a.valueId))];
        const existingvalues = await prisma_1.prisma.attributeValue.findMany({
            where: { id: { in: allInputValueIds } }
        });
        if (existingvalues.length !== allInputValueIds.length) {
            throw new AppError_1.default(400, 'One or more attribute values are invalid');
        }
        // check if user duplicate attribute to the same variant
        if (new Set(allInputAttributeIds).size !== allInputAttributeIds.length) {
            throw new AppError_1.default(400, 'Duplicate attribute in variant');
        }
        //check if there are other same variant with same attrs and values
        const existingVariants = await prisma_1.prisma.productVariant.findMany({
            where: {
                productId: existingVariant.productId,
                id: { not: variantId }
            },
            include: {
                attributes: true
            }
        });
        const newComboKey = data.attributes
            ?.map(a => `${a.attributeId}:${a.valueId}`)
            .sort()
            .join('|');
        const isDublicatedCompo = existingVariants.some(v => {
            v.attributes
                .map(a => `${a.attributeId}:${a.valueId}`)
                .sort()
                .join('|') === newComboKey;
        });
        if (isDublicatedCompo) {
            throw new AppError_1.default(400, 'Duplicate attribute combination for this product');
        }
        return this.VariantRepository.updateVariant(variantId, data);
    }
    async deleteVariant(variantId) {
        const variant = await this.VariantRepository.findVariantById(variantId);
        if (!variant) {
            throw new AppError_1.default(404, 'Variant not found');
        }
        await this.VariantRepository.deleteVariant(variantId);
    }
}
exports.VariantService = VariantService;
