if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}
import { createServer } from './app';
import env from '@/config/env';
import logger from '@/infra/logging/logger';

async function bootstrap() {
  const { httpServer } = await createServer();
  httpServer.listen(env.PORT, () => {
    console.log('\n\x1b[42m\x1b[30m\x1b[1m %s \x1b[0m', `🚀 Server is running on http://localhost:${env.PORT} `);
  });
  httpServer.on('error', err => {
    logger.error('Server error:', err);
    process.exit(1);
  });
}
bootstrap();
