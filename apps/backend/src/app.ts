import express from 'express';
import dotenv from 'dotenv';
import { Server as HTTPServer } from 'http';
dotenv.config();

export const createServer = async function createServer() {
  const app = express();
  app.use(express.json());
  //await db connection
  const httpServer = new HTTPServer(app);

  // Example health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  return { app, httpServer };
};
