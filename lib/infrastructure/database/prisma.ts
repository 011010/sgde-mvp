import { PrismaClient } from "@prisma/client";
import { env } from "@/config/env.config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.app.isDevelopment ? ["query", "error", "warn"] : ["error"],
  });

if (env.app.isDevelopment) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
