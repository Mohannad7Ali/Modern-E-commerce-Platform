"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeService = void 0;
const slugify_1 = __importDefault(require("@/shared/utils/slugify"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const ApiFeature_1 = __importDefault(require("@/shared/utils/ApiFeature"));
const prisma_1 = require("@/infra/database/prisma");
class AttributeService {
    constructor(attrRepo) {
        this.attrRepo = attrRepo;
    }
    async createAttribute(data) {
        // 1. Check if attribute name already exists to prevent duplicates
        const existing = await this.attrRepo.findAttributeByName(data.name);
        if (existing) {
            throw new AppError_1.default(400, `Attribute with name "${data.name}" already exists`);
        }
        const slug = (0, slugify_1.default)(data.name);
        return await this.attrRepo.createAttribute({ ...data, slug });
    }
    async CreateAttributeValue(data) {
        // 2. Ensure the parent attribute exists before adding a value to it
        const attribute = await this.attrRepo.findAttributeById(data.attributeId);
        if (!attribute) {
            throw new AppError_1.default(404, 'Parent attribute not found');
        }
        // 3. Prevent duplicate values within the same attribute (e.g., don't add "Red" twice)
        const existingValue = await this.attrRepo.findValueInAttribute(data.attributeId, data.value);
        if (existingValue) {
            throw new AppError_1.default(400, `Value "${data.value}" already exists for this attribute`);
        }
        const slug = (0, slugify_1.default)(data.value);
        return await this.attrRepo.createAttributeValue({ ...data, slug });
    }
    async assignAttributeToCategory(data) {
        // 4. Validation: check if the relationship already exists
        const alreadyAssigned = await this.attrRepo.checkCategoryAssignment(data.categoryId, data.attributeId);
        if (alreadyAssigned) {
            throw new AppError_1.default(400, 'This attribute is already assigned to this category');
        }
        return await this.attrRepo.assignAttributeToCategory(data);
    }
    async findManyAttributes(queryString) {
        // 5. Using ApiFeatures for advanced filtering and pagination
        const features = new ApiFeature_1.default(queryString).filter().sort().limitFields().paginate();
        const params = features.build();
        const attributes = await this.attrRepo.findManyAttributes(params);
        const totalResults = await prisma_1.prisma.attribute.count({ where: params.where });
        // Return structured data for the controller
        return {
            attributes,
            totalResults,
            totalPages: Math.ceil(totalResults / (params.limit || 10)),
            currentPage: params.page || 1
        };
    }
    async getAttribute(id) {
        const attribute = await this.attrRepo.findAttributeById(id);
        if (!attribute) {
            throw new AppError_1.default(404, 'Attribute not found');
        }
        return attribute;
    }
    async deleteAttribute(id) {
        // 6. Security check: Don't delete if attribute is linked to products (Optional but recommended)
        const isUsed = await this.attrRepo.isAttributeInUse(id);
        if (isUsed) {
            throw new AppError_1.default(400, 'Cannot delete attribute because it is linked to existing products');
        }
        const attribute = await this.attrRepo.findAttributeById(id);
        if (!attribute) {
            throw new AppError_1.default(404, 'Attribute not found');
        }
        await this.attrRepo.deleteAttribute(id);
    }
    async deleteAttributeValue(id) {
        const attributeValue = await this.attrRepo.findAttributeValueById(id);
        if (!attributeValue) {
            throw new AppError_1.default(404, 'Attribute value not found');
        }
        await this.attrRepo.deleteAttributeValue(id);
    }
}
exports.AttributeService = AttributeService;
