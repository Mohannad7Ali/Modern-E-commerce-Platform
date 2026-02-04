import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import { Server as HTTPServer } from 'http';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';

// Internal Imports
import redisClient, { connectRedis } from '@/infra/cache/redis';
import { swaggerSpec } from './infra/swagger/swagger.config';
import { configureRoute } from './routes';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { logRequest } from '@/shared/middlewares/logRequest';
import { upload } from '@/shared/middlewares/upload.middleware';
import { uploadToCloudinary } from './shared/utils/uploadToCloudinary';
import helmet from 'helmet';
import webhookRoutes from './modules/webhook/webhook.routes';
import { SocketManager } from '@/infra/socket/socket';
import { configureGraphQL } from '@/graphql/index';
/**
 * Server Factory Function
 * Organizes infrastructure, security, and routing
 */
export const createServer = async () => {
  const app: Application = express();
  const httpServer = new HTTPServer(app);
  // Initialize Socket.IO
  const socketManager = new SocketManager(httpServer);
  //Single Source of Truth only one io server
  const io = socketManager.getIO();
  // 0. setup webhook routes
  setupWebhookRoutes(app);

  // 1. Core Infrastructure & Security
  setupStandardMiddleware(app);
  setupSecurityMiddleware(app);

  // 2. Database & Cache Connections
  await connectRedis();
  setupSessionMiddleware(app);

  // 3. Documentation & Special Routes
  setupDocumentation(app);
  setupTestRoutes(app);

  // 4. API Routes
  app.use('/api', configureRoute(io));
  await configureGraphQL(app);
  // 5. Error Handling & Logging (Must be last)
  setupErrorHandling(app);

  return { app, httpServer };
};

/**
 * Basic Express configurations
 */
function setupStandardMiddleware(app: Application) {
  app.use(express.json());
  app.use(cookieParser());

  // Basic Health Check
  app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));
}

/**
 * CORS Configuration
 */
function setupSecurityMiddleware(app: Application) {
  // Add helmet at the top of security middleware
  // It sets secure HTTP headers by default
  app.use(helmet());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production'
          ? ['https://ecommerce.vercel.app']
          : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Apollo-Require-Preflight']
    })
  );
}

/**
 * Persistent Session Management with Redis
 */
function setupSessionMiddleware(app: Application) {
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix: 'sess:'
      }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: true,
      proxy: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 Days
      }
    })
  );
}

/**
 * Swagger Documentation Setup
 */
function setupDocumentation(app: Application) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

/**
 * Temporary/Test Routes (Cloudinary, etc.)
 */
function setupTestRoutes(app: Application) {
  app.post('/testCloudinary', upload.array('images', 5), async (req, res) => {
    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];
    if (Array.isArray(files) && files.length > 0) {
      const uploadedImages = await uploadToCloudinary(files);
      imageUrls = uploadedImages.map(img => img.url).filter(Boolean);
    }
    res.status(200).json({ imageUrls });
  });
}

/**
 * Global Error Handlers
 */
function setupErrorHandling(app: Application) {
  app.use(errorMiddleware);
  app.use(logRequest);
}

//webhook
function setupWebhookRoutes(app: Application) {
  // Basic
  app.use('/api/v1/webhook', bodyParser.raw({ type: 'application/json' }), webhookRoutes);
}
