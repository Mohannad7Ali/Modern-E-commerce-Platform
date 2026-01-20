import { VariantController } from './variant.controller';
import { VariantRepository } from './variant.repository';
// import { AttributeRepository } from '../attribute/attribute.repository';
import { VariantService } from './variant.service';
export const makeVariantController = () => {
  const variantRepository = new VariantRepository();
  const variantService = new VariantService(variantRepository);
  return new VariantController(variantService);
};
