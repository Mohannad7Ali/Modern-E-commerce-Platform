import { Router } from 'express';
import os from 'node:os';
import process from 'node:process';
import { prisma } from '@/infra/database/prisma';
import { server } from 'typescript';

const router = Router();

router.get('/', async (_, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  let dbStatus = 'UP';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    dbStatus = 'DOWN';
  }

  const healthInfo = {
    message: 'E-commerce Server API is healthy',
    status: dbStatus === 'UP' ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    server: {
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      platform: process.platform,
      nodeVersion: process.version,
      cpuLoad: os.loadavg()
    },
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`
    },
    database: {
      status: dbStatus
    }
  };

  const httpStatus = dbStatus === 'UP' ? 200 : 503;
  res.status(httpStatus).json(healthInfo);
});

export default router;
