import authRoutes from '@/modules/auth/auth.route';
import categoryRoutes from '@/modules/category/category.route';
import variantRoutes from '@/modules/variant/variant.route';
import { Router } from 'express';

export const ConfigureV1Routes = () => {
  const router = Router();
  router.use('/auth', authRoutes);
  router.use('/categories', categoryRoutes);
  router.use('/variants', variantRoutes);
  return router;
};
