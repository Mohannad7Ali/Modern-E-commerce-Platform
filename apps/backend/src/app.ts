// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import express from 'express';
import { logRequest } from '@/shared/middlewares/logRequest';
import dotenv from 'dotenv';
import { Server as HTTPServer } from 'http';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infra/swagger/swagger.config';
import { configureRoute } from './routes';
import { upload } from '@/shared/middlewares/upload.middleware';
import { uploadToCloudinary } from './shared/utils/uploadToCloudinary';
import cors from 'cors';
import { connectRedis } from '@/infra/cache/redis';
import redisClient from '@/infra/cache/redis';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
dotenv.config();

export const createServer = async function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  //await db connection
  const httpServer = new HTTPServer(app);

  // Preflight handler removed to avoid conflicts

  // CORS must be applied BEFORE GraphQL setup
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production'
          ? ['https://ecommerce.vercel.app']
          : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Apollo-Require-Preflight' // For GraphQL
      ]
    })
  );
  // Example health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  //-------------------------------------redis-------------------------------------------------
  // 1. Establish Redis Connection
  connectRedis();

  // 2. Configure Session Middleware
  app.use(
    session({
      // Initialize RedisStore with our pre-configured redisClient
      store: new RedisStore({
        client: redisClient,
        prefix: 'sess:' // Optional: adds a prefix to keys in Redis for organization
      }),

      // Secret key used to sign the session ID cookie
      secret: process.env.SESSION_SECRET!,

      // Forces the session to be saved back to the session store,
      // even if the session was never modified during the request.
      resave: false,

      // "true" is useful for tracking anonymous users (e.g., guest shopping carts)
      saveUninitialized: true,

      // Trust the reverse proxy (required for apps deployed on Render/Heroku/Railway)
      proxy: true,

      cookie: {
        httpOnly: true, // Prevents client-side JS from reading the cookie (XSS protection)

        // Cookie is only sent over HTTPS in production
        secure: process.env.NODE_ENV === 'production',

        // 'none' allows the cookie to be sent in cross-site requests (Frontend <-> Backend)
        sameSite: 'none',

        // Cookie life span: 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  );
  //-----------------------------------------------------------------------------------

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
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
  // Error and Logging
  app.use(errorMiddleware);
  app.use(logRequest);

  return { app, httpServer };
};
