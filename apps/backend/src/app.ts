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
import passport from 'passport';
import helmet from 'helmet';
import compression from 'compression';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';

import logger from '@/infra/logging/logger';
import configurePassport from './infra/passport/passport';

// Internal Imports
import redisClient, { connectRedis } from '@/infra/cache/redis';
import { swaggerSpec } from './infra/swagger/swagger.config';
import { configureRoute } from './routes';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { logRequest } from '@/shared/middlewares/logRequest';
import { upload } from '@/shared/middlewares/upload.middleware';
import { uploadToCloudinary } from './shared/utils/uploadToCloudinary';
import webhookRoutes from './modules/webhook/webhook.routes';
import { SocketManager } from '@/infra/socket/socket';
import { configureGraphQL } from '@/graphql/index';
import { connectDB } from './infra/database/prisma';
import systemRoutes from '@/modules/system/system.routes';

/**
 * Server Factory
 */
export const createServer = async () => {
  const app: Application = express();
  const httpServer = new HTTPServer(app);

  /* ===========================
    Database
  ============================ */
  await connectDB().catch(err => {
    console.error('❌ DB Connection Failed:', err);
    process.exit(1);
  });

  /* ===========================
    Socket.IO
  ============================ */
  const socketManager = new SocketManager(httpServer);
  const io = socketManager.getIO();

  /* ===========================
    Proxy (IMPORTANT for cookies)
  ============================ */
  app.set('trust proxy', 1);

  /* ===========================
    Webhooks (RAW BODY FIRST)
  ============================ */
  setupWebhookRoutes(app);

  /* ===========================
    Parsers
  ============================ */
  setupStandardMiddleware(app);

  /* ===========================
    Security
  ============================ */
  setupSecurityMiddleware(app);
  setupAdvancedSecurity(app);

  /* ===========================
    Redis + Session
  ============================ */
  await connectRedis();
  setupSessionMiddleware(app);

  /* ===========================
    Passport
  ============================ */
  app.use(passport.initialize());
  app.use(passport.session());
  configurePassport();

  /* ===========================
    Docs & Tests
  ============================ */
  setupDocumentation(app);
  setupTestRoutes(app);

  /* ===========================
    Routes
  ============================ */
  app.use('/api', configureRoute(io));

  /* ===========================
    GraphQL
  ============================ */
  await configureGraphQL(app);

  /* ===========================
    Errors
  ============================ */
  setupErrorHandling(app);

  return { app, httpServer };
};

/* =====================================================
  Middleware Setup
===================================================== */

function setupStandardMiddleware(app: Application) {
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    morgan('combined', {
      stream: {
        write: msg => logger.info(msg.trim())
      }
    })
  );
  // Health
  app.use('/', systemRoutes);
}

function setupSecurityMiddleware(app: Application) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            'https://apollo-server-landing-page.cdn.apollographql.com',
            'https://embeddable-sandbox.cdn.apollographql.com'
          ],
          'style-src': ["'self'", "'unsafe-inline'", 'https://embeddable-sandbox.cdn.apollographql.com'],
          'img-src': ["'self'", 'data:', 'https://apollo-server-landing-page.cdn.apollographql.com'],
          'manifest-src': ["'self'", 'https://apollo-server-landing-page.cdn.apollographql.com'],
          'frame-src': ["'self'", 'https://sandbox.embed.apollographql.com']
        }
      }
    })
  );

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

/* Extra enterprise security */
function setupAdvancedSecurity(app: Application) {
  app.use(ExpressMongoSanitize());

  app.use(
    hpp({
      whitelist: ['sort', 'filter', 'fields', 'page', 'limit']
    })
  );

  app.use(compression());
}

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
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  );
}

function setupDocumentation(app: Application) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

function setupTestRoutes(app: Application) {
  app.post('/testCloudinary', upload.array('images', 5), async (req, res) => {
    const files = req.files as Express.Multer.File[];

    let imageUrls: string[] = [];

    if (Array.isArray(files) && files.length) {
      const uploaded = await uploadToCloudinary(files);
      imageUrls = uploaded.map(img => img.url).filter(Boolean);
    }

    res.json({ imageUrls });
  });
}

function setupErrorHandling(app: Application) {
  app.use(errorMiddleware);
  app.use(logRequest);
}

function setupWebhookRoutes(app: Application) {
  app.use('/api/v1/webhook', bodyParser.raw({ type: 'application/json' }), webhookRoutes);
}
