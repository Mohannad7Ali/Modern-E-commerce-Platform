// src/infra/database/prisma.ts
/**
 * This file sets up the Prisma Client (v7) using a Singleton pattern.
 * It uses the PostgreSQL adapter to manage database connections efficiently,
 * especially important for environments like Next.js or Neon.
 */

import { Pool } from 'pg'; // Standard PostgreSQL driver
import { PrismaPg } from '@prisma/adapter-pg'; // The bridge between Prisma and pg
import { PrismaClient } from '@/generated/prisma-client/client'; // Your generated client
import env from '@/config/env';

// -----------------------------
// 1. Setup PostgreSQL Connection Pool
// -----------------------------
/**
 * We use a 'Pool' to manage multiple connections to the database.
 * This is better for performance than opening a new connection for every request.
 */
const pool = new Pool({
  connectionString: env.DATABASE_URL // Use connection string
});

// -----------------------------
// 2. Create the Adapter
// -----------------------------
/**
 * Prisma 7 uses "Driver Adapters".
 * We wrap our 'pool' inside PrismaPg so Prisma knows how to talk to Postgres.
 */
const adapter = new PrismaPg(pool);

// -----------------------------
// 3. Singleton Pattern setup
// -----------------------------
/**
 * In development, tools like Next.js reload the code frequently.
 * We store the prisma instance in 'globalThis' to prevent creating
 * hundreds of new connections every time the code reloads.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// -----------------------------
// 4. Instantiate Prisma Client
// -----------------------------
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // Use the adapter we created above
    // Only log queries in development mode to keep production logs clean
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

// -----------------------------
// 5. Save instance to global scope
// -----------------------------
if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Summary:
 * - We use 'pg' Pool for stable connections.
 * - We use 'PrismaPg' adapter as required by Prisma 7.
 * - We use 'globalThis' to avoid "too many connections" errors during development.
 */
