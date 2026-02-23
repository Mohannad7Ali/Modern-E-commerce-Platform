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
  connectionString: env.DATABASE_URL, // Use connection string
  max: 10, // أقصى عدد اتصالات متزامنة
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // ارفع الوقت إلى 10 ثوانٍ
  ssl: {
    rejectUnauthorized: false // لضمان عدم فشل التوثيق الأمني في بيئة التطوير
  },
  keepAlive: true // لإبقاء الاتصال حياً
});

// التعامل مع أخطاء الـ Pool المفاجئة لكي لا ينهار السيرفر
pool.on('error', err => {
  console.error('Unexpected error on idle client', err);
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

// -----------------------------
// 6. Database Connection Helper
// -----------------------------
/**
 * Function to manually trigger and verify the database connection.
 * We use the singleton 'prisma' instance defined above.
 */
export const connectDB = async () => {
  try {
    // نستخدم الـ singleton instance الذي أنشأناه بالأعلى
    await prisma.$connect();
    console.log('✅ Neon Database connected successfully via Prisma Adapter.');
    console.log(process.env.DATABASE_URL);
  } catch (error) {
    console.error('❌ Failed to connect to Neon Database:');
    console.error(error);
    // في بيئة الإنتاج، قد ترغب في إنهاء العملية إذا فشل الاتصال بالقاعدة
    // process.exit(1);
  }
};

/**
 * Summary:
 * - We use 'pg' Pool for stable connections.
 * - We use 'PrismaPg' adapter as required by Prisma 7.
 * - We use 'globalThis' to avoid "too many connections" errors during development.
 * - Added 'connectDB' to verify the connection during server startup.
 */

export default prisma;
