import authRoutes from '@/modules/auth/auth.route';
import { Router } from 'express';

export const ConfigureV1Routes = () => {
  const router = Router();
  router.use('/auth', authRoutes);
  return router;
};
