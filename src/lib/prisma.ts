import { PrismaClient } from '@prisma/client';

// Set engine type to 'library' for Prisma v6
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
