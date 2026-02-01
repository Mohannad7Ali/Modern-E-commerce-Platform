import express from 'express';
import { ConfigureV1Routes } from './v1';
import { Server as WebSocketServer } from 'socket.io';
export const configureRoute = (io: WebSocketServer) => {
  const router = express.Router();
  router.use('/v1', ConfigureV1Routes(io));
  return router;
};
