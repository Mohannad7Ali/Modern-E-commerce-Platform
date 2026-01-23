// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import express from 'express';

import dotenv from 'dotenv';
import { Server as HTTPServer } from 'http';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infra/swagger/swagger.config';
import { configureRoute } from './routes';
import { upload } from '@/shared/middlewares/upload.middleware';
import { uploadToCloudinary } from './shared/utils/uploadToCloudinary';
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
  app.post('/testCloudinary', upload.array('images', 5), async (req, res) => {
    console.log('req.files: ', req.files);
    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];
    if (Array.isArray(files) && files.length > 0) {
      const uploadedImages = await uploadToCloudinary(files);
      imageUrls = uploadedImages.map(img => img.url).filter(Boolean);
    }
    res.json({ imageUrls }).status(200);
  });
  app.use('/api', configureRoute());
  app.use(errorMiddleware);
  return { app, httpServer };
};
