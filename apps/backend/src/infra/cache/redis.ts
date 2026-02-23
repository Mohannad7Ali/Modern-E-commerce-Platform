/**
 * WHY REDIS?
 * 1. Reliability: Sessions won't be lost if the server restarts or crashes.
 * 2. Scalability: Multiple server instances can share the same session data.
 * 3. Performance: Redis is ultra-fast for reading/writing session data (Cart IDs, User IDs).
 */

import { createClient } from 'redis';

/**
 * Initialize Redis client with Cloud credentials
 * We use 'socket' for more granular control over the connection
 */
const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 10922,
      reconnectStrategy: (retries) => {
      if (retries > 10) return new Error('Redis reconnection failed');
      return Math.min(retries * 100, 3000); 
    }

  }
});
// const redisClient = createClient({
//   url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
// });
// // Event listener for connection errors
redisClient.on('error', err => console.log('❌ Redis Client Error:', err));

// Event listener for successful connection
redisClient.on('connect', () => console.log('✅ Redis Cloud Connected Successfully!'));

/**
 * Function to be called in the main entry point (app.ts)
 * to establish connection before starting the server
 */
export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;
