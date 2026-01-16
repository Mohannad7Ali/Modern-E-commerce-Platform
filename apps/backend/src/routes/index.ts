import express from 'express';
import { ConfigureV1Routes } from './v1';
export const configureRoute = () => {
  const router = express.Router();
  router.use('/v1', ConfigureV1Routes());
  return router;
};
