import { productSchema } from '@/modules/product/graphql/productSchema';
import { analyticsSchema } from '@/modules/analytics/graphql/schema';
import { mergeSchemas } from '@graphql-tools/schema';

export const combinedSchemas = mergeSchemas({
  schemas: [productSchema, analyticsSchema]
});
