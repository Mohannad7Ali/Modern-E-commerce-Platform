"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = __importDefault(require("@/config/env"));
const logger_1 = __importDefault(require("@/infra/logging/logger"));
async function bootstrap() {
    const { httpServer } = await (0, app_1.createServer)();
    httpServer.listen(env_1.default.PORT, () => {
        console.log('\n\x1b[42m\x1b[30m\x1b[1m %s \x1b[0m', `🚀 Server is running on http://localhost:${env_1.default.PORT} `);
    });
    httpServer.on('error', err => {
        logger_1.default.error('Server error:', err);
        process.exit(1);
    });
}
bootstrap();
