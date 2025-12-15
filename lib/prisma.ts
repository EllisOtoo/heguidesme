import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });
}

const cachedPrisma = globalForPrisma.prisma;
const cachedPrismaLooksValid =
  !!cachedPrisma &&
  "product" in cachedPrisma &&
  "order" in cachedPrisma &&
  "session" in cachedPrisma &&
  "passwordResetToken" in cachedPrisma &&
  "contactSubmission" in cachedPrisma &&
  "feedbackSubmission" in cachedPrisma;

export const prisma = cachedPrismaLooksValid ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
