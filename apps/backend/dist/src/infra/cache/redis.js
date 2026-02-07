"use strict";
/**
 * WHY REDIS?
 * 1. Reliability: Sessions won't be lost if the server restarts or crashes.
 * 2. Scalability: Multiple server instances can share the same session data.
 * 3. Performance: Redis is ultra-fast for reading/writing session data (Cart IDs, User IDs).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
/**
 * Initialize Redis client with Cloud credentials
 * We use 'socket' for more granular control over the connection
 */
const redisClient = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 10922
    }
});
// Event listener for connection errors
redisClient.on('error', err => console.log('❌ Redis Client Error:', err));
// Event listener for successful connection
redisClient.on('connect', () => console.log('✅ Redis Cloud Connected Successfully!'));
/**
 * Function to be called in the main entry point (app.ts)
 * to establish connection before starting the server
 */
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};
exports.connectRedis = connectRedis;
exports.default = redisClient;
