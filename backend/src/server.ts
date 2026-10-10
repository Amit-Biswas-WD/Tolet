import { createApp } from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';

async function bootstrap() {
  await connectDB();

  const app = createApp();

  const server = app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`  ToLet.com Backend API Server is running`);
    console.log(`  URL: http://localhost:${ENV.PORT}`);
    console.log(`  Health: http://localhost:${ENV.PORT}/api/health`);
    console.log(`  Environment: ${ENV.NODE_ENV}`);
    console.log(`=======================================================`);
  });

  const shutdown = () => {
    console.log('[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] Closed remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
