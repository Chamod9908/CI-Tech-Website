import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

let prismaInstance: PrismaClient;

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL or POSTGRES_URL is not set!');
}

function createPrismaClient() {
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 20,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    transactionOptions: {
      maxWait: 15000, // Wait up to 15 seconds to acquire connection
      timeout: 30000, // Allow transaction up to 30 seconds to finish
    },
  });
}

if (process.env.NODE_ENV === 'production') {
  prismaInstance = createPrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
