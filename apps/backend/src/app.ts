import express from 'express';

import dotenv from 'dotenv';
import { Server as HTTPServer } from 'http';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infra/swagger/swagger.config';
import { configureRoute } from './routes';
dotenv.config();

export const createServer = async function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  //await db connection
  const httpServer = new HTTPServer(app);

  // Example health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api', configureRoute());
  app.use(errorMiddleware);
  return { app, httpServer };
};
