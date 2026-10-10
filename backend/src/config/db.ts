import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from './logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const databaseUrl = env.NODE_ENV === 'test' && env.TEST_DATABASE_URL 
  ? env.TEST_DATABASE_URL 
  : env.DATABASE_URL;

export const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function connectDB() {
  try {
    await prisma.$connect();
    logger.info(' Connected to MySQL database successfully via Prisma');
  } catch (error) {
    logger.error(' Database connection failed: ' + (error as Error).message);
    process.exit(1);
  }
}
