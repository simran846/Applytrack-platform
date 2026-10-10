import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDB, prisma } from './config/db';
import { initRedis, redisClient } from './config/redis';

async function bootstrap() {
  await connectDB();
  await initRedis();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 ApplyTrack Backend Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`📚 Swagger Documentation available at http://localhost:${env.PORT}/api/docs`);
    logger.info(`🩺 Health Check endpoint available at http://localhost:${env.PORT}/health`);
  });

  // Graceful Shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      logger.info(`Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await prisma.$disconnect();
          logger.info('Prisma disconnected from MySQL.');
          if (redisClient) {
            await redisClient.quit();
            logger.info('Redis client disconnected.');
          }
        } catch (err) {
          logger.error('Error during shutdown: ' + (err as Error).message);
        }
        process.exit(0);
      });
    });
  });
}

bootstrap().catch((err) => {
  logger.error('Fatal error during startup: ' + err.message, { stack: err.stack });
  process.exit(1);
});
