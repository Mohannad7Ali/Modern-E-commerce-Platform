"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = require("connect-redis");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("@/infra/logging/logger"));
const passport_2 = __importDefault(require("./infra/passport/passport"));
// Internal Imports
const redis_1 = __importStar(require("@/infra/cache/redis"));
const swagger_config_1 = require("./infra/swagger/swagger.config");
const routes_1 = require("./routes");
const error_middleware_1 = require("./shared/middlewares/error.middleware");
const logRequest_1 = require("@/shared/middlewares/logRequest");
const upload_middleware_1 = require("@/shared/middlewares/upload.middleware");
const uploadToCloudinary_1 = require("./shared/utils/uploadToCloudinary");
const webhook_routes_1 = __importDefault(require("./modules/webhook/webhook.routes"));
const socket_1 = require("@/infra/socket/socket");
const index_1 = require("@/graphql/index");
const prisma_1 = require("./infra/database/prisma");
/**
 * Server Factory
 */
const createServer = async () => {
    const app = (0, express_1.default)();
    const httpServer = new http_1.Server(app);
    /* ===========================
      Database
    ============================ */
    await (0, prisma_1.connectDB)().catch(err => {
        console.error('❌ DB Connection Failed:', err);
        process.exit(1);
    });
    /* ===========================
      Socket.IO
    ============================ */
    const socketManager = new socket_1.SocketManager(httpServer);
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
    await (0, redis_1.connectRedis)();
    setupSessionMiddleware(app);
    /* ===========================
      Passport
    ============================ */
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    (0, passport_2.default)();
    /* ===========================
      Docs & Tests
    ============================ */
    setupDocumentation(app);
    setupTestRoutes(app);
    /* ===========================
      Routes
    ============================ */
    app.use('/api', (0, routes_1.configureRoute)(io));
    /* ===========================
      GraphQL
    ============================ */
    await (0, index_1.configureGraphQL)(app);
    /* ===========================
      Errors
    ============================ */
    setupErrorHandling(app);
    return { app, httpServer };
};
exports.createServer = createServer;
/* =====================================================
  Middleware Setup
===================================================== */
function setupStandardMiddleware(app) {
    app.use(express_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
    // Health
    app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date() }));
}
function setupSecurityMiddleware(app) {
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: process.env.NODE_ENV === 'production'
            ? ['https://ecommerce.vercel.app']
            : ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Apollo-Require-Preflight']
    }));
}
/* Extra enterprise security */
function setupAdvancedSecurity(app) {
    app.use((0, express_mongo_sanitize_1.default)());
    app.use((0, hpp_1.default)({
        whitelist: ['sort', 'filter', 'fields', 'page', 'limit']
    }));
    app.use((0, compression_1.default)());
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write: msg => logger_1.default.info(msg.trim())
        }
    }));
}
function setupSessionMiddleware(app) {
    app.use((0, express_session_1.default)({
        store: new connect_redis_1.RedisStore({
            client: redis_1.default,
            prefix: 'sess:'
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        proxy: true,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }));
}
function setupDocumentation(app) {
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec));
    app.get('/swagger.json', (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swagger_config_1.swaggerSpec);
    });
}
function setupTestRoutes(app) {
    app.post('/testCloudinary', upload_middleware_1.upload.array('images', 5), async (req, res) => {
        const files = req.files;
        let imageUrls = [];
        if (Array.isArray(files) && files.length) {
            const uploaded = await (0, uploadToCloudinary_1.uploadToCloudinary)(files);
            imageUrls = uploaded.map(img => img.url).filter(Boolean);
        }
        res.json({ imageUrls });
    });
}
function setupErrorHandling(app) {
    app.use(error_middleware_1.errorMiddleware);
    app.use(logRequest_1.logRequest);
}
function setupWebhookRoutes(app) {
    app.use('/api/v1/webhook', body_parser_1.default.raw({ type: 'application/json' }), webhook_routes_1.default);
}
