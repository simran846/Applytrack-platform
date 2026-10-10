import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

let redisClient: Redis | null = null;
let isRedisAvailable = false;

try {
  redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 2) {
        return null; // Stop retrying after 2 attempts
      }
      return Math.min(times * 100, 1000);
    }
  });

  redisClient.on('connect', () => {
    isRedisAvailable = true;
    logger.info(' Connected to Redis successfully');
  });

  redisClient.on('error', (err) => {
    isRedisAvailable = false;
    // Log once as warning in development rather than crashing
    if (env.NODE_ENV === 'development') {
      logger.warn(' Redis is not available locally. Background reminder jobs will run in direct mode: ' + err.message);
    }
  });
} catch (err) {
  isRedisAvailable = false;
}

export async function initRedis() {
  if (redisClient) {
    try {
      await redisClient.connect();
    } catch (e) {
      isRedisAvailable = false;
    }
  }
}

export { redisClient, isRedisAvailable };
