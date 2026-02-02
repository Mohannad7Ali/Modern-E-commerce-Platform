import { productSchema } from '@/modules/product/graphql/productSchema';
import { mergeSchemas } from '@graphql-tools/schema';

export const combinedSchemas = mergeSchemas({
  schemas: [productSchema]
});
