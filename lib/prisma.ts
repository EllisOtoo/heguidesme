import { PrismaClient } from "../prisma/generated/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: ["query"],
  });
}

const cachedPrisma = globalForPrisma.prisma;
const cachedPrismaLooksValid =
  !!cachedPrisma &&
  "product" in cachedPrisma &&
  "order" in cachedPrisma &&
  "contactSubmission" in cachedPrisma &&
  "feedbackSubmission" in cachedPrisma &&
  "shippingOption" in cachedPrisma;

export const prisma = cachedPrismaLooksValid ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
