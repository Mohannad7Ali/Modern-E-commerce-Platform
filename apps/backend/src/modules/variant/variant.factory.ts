import { VariantController } from './variant.controller';
import { VariantRepository } from './variant.repository';
import { ProductRepository } from '../product/product.repository';
// import { AttributeRepository } from '../attribute/attribute.repository';
import { VariantService } from './variant.service';
export const makeVariantController = () => {
  const variantRepository = new VariantRepository();
  const productRepository = new ProductRepository();
  const variantService = new VariantService(variantRepository, productRepository);
  return new VariantController(variantService);
};
