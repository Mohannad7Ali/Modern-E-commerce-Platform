import slugify from '@/shared/utils/slugify';
import { AttributeRepository } from './attribute.repository';
import AppError from '@/shared/errors/AppError';
import ApiFeatures from '@/shared/utils/ApiFeature';

export class AttributeService {
  constructor(private readonly attrRepo: AttributeRepository) {}
  async createAttribute(data: { name: string }) {
    const slug = slugify(data.name);
    return await this.attrRepo.createAttribute({ ...data, slug });
  }
  async CreateAttributeValue(data: { value: string; attributeId: string }) {
    const slug = slugify(data.value);
    return await this.attrRepo.createAttributeValue({ ...data, slug });
  }
  async assignAttributeToCategory(data: { categoryId: string; attributeId: string; isRequired: boolean }) {
    return await this.attrRepo.assignAttributeToCategory(data);
  }
  async findManyAttributes(queryString: Record<string, any>) {
    const params = new ApiFeatures(queryString).filter().sort().limitFields().paginate().build();
    return await this.attrRepo.findManyAttributes(params);
  }
  async getAttribute(id: string) {
    const attribute = await this.attrRepo.findAttributeById(id);
    if (!attribute) {
      throw new AppError(404, 'Attribute not found');
    }
    return attribute;
  }

  async deleteAttribute(id: string) {
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
