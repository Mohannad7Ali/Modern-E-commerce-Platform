import express from 'express';
import dotenv from 'dotenv';
import { Server as HTTPServer } from 'http';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import authRoutes from './modules/auth/auth.route';
dotenv.config();

export const createServer = async function createServer() {
  const app = express();
  app.use(express.json());
  //await db connection
  const httpServer = new HTTPServer(app);

  // Example health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  app.use(errorMiddleware);

  app.use('/auth', authRoutes);
  return { app, httpServer };
};
