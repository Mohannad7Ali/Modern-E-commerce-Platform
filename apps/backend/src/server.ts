import { createServer } from './app';
const PORT = process.env.PORT || 5000;
async function bootstrap() {
  const { httpServer } = await createServer();
  httpServer.listen(PORT, () => {
    console.log('\n\x1b[42m\x1b[30m\x1b[1m %s \x1b[0m', `🚀 Server is running on http://localhost:${PORT} `);
  });
  httpServer.on('error', err => {
    console.error('Server error:', err);
    process.exit(1);
  });
}
bootstrap();
