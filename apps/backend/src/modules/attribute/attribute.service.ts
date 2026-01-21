import slugify from '@/shared/utils/slugify';
import { AttributeRepository } from './attribute.repository';
import AppError from '@/shared/errors/AppError';
import ApiFeatures from '@/shared/utils/ApiFeature';
import { prisma } from '@/infra/database/prisma';

export class AttributeService {
  constructor(private readonly attrRepo: AttributeRepository) {}

  async createAttribute(data: { name: string }) {
    // 1. Check if attribute name already exists to prevent duplicates
    const existing = await this.attrRepo.findAttributeByName(data.name);
    if (existing) {
      throw new AppError(400, `Attribute with name "${data.name}" already exists`);
    }

    const slug = slugify(data.name);
    return await this.attrRepo.createAttribute({ ...data, slug });
  }

  async CreateAttributeValue(data: { value: string; attributeId: string }) {
    // 2. Ensure the parent attribute exists before adding a value to it
    const attribute = await this.attrRepo.findAttributeById(data.attributeId);
    if (!attribute) {
      throw new AppError(404, 'Parent attribute not found');
    }

    // 3. Prevent duplicate values within the same attribute (e.g., don't add "Red" twice)
    const existingValue = await this.attrRepo.findValueInAttribute(data.attributeId, data.value);
    if (existingValue) {
      throw new AppError(400, `Value "${data.value}" already exists for this attribute`);
    }

    const slug = slugify(data.value);
    return await this.attrRepo.createAttributeValue({ ...data, slug });
  }

  async assignAttributeToCategory(data: { categoryId: string; attributeId: string; isRequired: boolean }) {
    // 4. Validation: check if the relationship already exists
    const alreadyAssigned = await this.attrRepo.checkCategoryAssignment(data.categoryId, data.attributeId);
    if (alreadyAssigned) {
      throw new AppError(400, 'This attribute is already assigned to this category');
    }

    return await this.attrRepo.assignAttributeToCategory(data);
  }

  async findManyAttributes(queryString: Record<string, any>) {
    // 5. Using ApiFeatures for advanced filtering and pagination
    const features = new ApiFeatures(queryString).filter().sort().limitFields().paginate();
    const params = features.build();

    const attributes = await this.attrRepo.findManyAttributes(params);
    const totalResults = await prisma.attribute.count({ where: params.where });
    // Return structured data for the controller
    return {
      attributes,
      totalResults,
      totalPages: Math.ceil(totalResults / (params.limit || 10)),
      currentPage: params.page || 1
    };
  }

  async getAttribute(id: string) {
    const attribute = await this.attrRepo.findAttributeById(id);
    if (!attribute) {
      throw new AppError(404, 'Attribute not found');
    }
    return attribute;
  }

  async deleteAttribute(id: string) {
    // 6. Security check: Don't delete if attribute is linked to products (Optional but recommended)
    const isUsed = await this.attrRepo.isAttributeInUse(id);
    if (isUsed) {
      throw new AppError(400, 'Cannot delete attribute because it is linked to existing products');
    }

    const attribute = await this.attrRepo.findAttributeById(id);
    if (!attribute) {
      throw new AppError(404, 'Attribute not found');
    }
    await this.attrRepo.deleteAttribute(id);
  }

  async deleteAttributeValue(id: string) {
    const attributeValue = await this.attrRepo.findAttributeValueById(id);
    if (!attributeValue) {
      throw new AppError(404, 'Attribute value not found');
    }
    await this.attrRepo.deleteAttributeValue(id);
  }
}
