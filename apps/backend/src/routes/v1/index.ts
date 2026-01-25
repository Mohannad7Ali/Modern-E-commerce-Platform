import authRoutes from '@/modules/auth/auth.route';
import userRoutes from '@/modules/user/user.routes';
import addressRoutes from '@/modules/address/address.routes';
import logRoutes from '@/modules/logs/logs.route';
import categoryRoutes from '@/modules/category/category.route';
import productRoutes from '@/modules/product/product.route';
import variantRoutes from '@/modules/variant/variant.route';
import attributeRoutes from '@/modules/attribute/attribute.route';
import { Router } from 'express';

export const ConfigureV1Routes = () => {
  const router = Router();
  router.use('/auth', authRoutes);
  router.use('/user', userRoutes);
  router.use('/address', addressRoutes);
  router.use('/auth', authRoutes);
  router.use('/logs', logRoutes);
  router.use('/categories', categoryRoutes);
  router.use('/products', productRoutes);
  router.use('/variants', variantRoutes);
  router.use('/attributes', attributeRoutes);
  return router;
};
