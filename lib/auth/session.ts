import crypto from "crypto";

import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "hgm_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SESSION_SECRET");
  }
  return secret;
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(getSessionSecret(), "utf8")
    .update(token, "utf8")
    .digest("hex");
}

export async function createCustomerSession(customerId: string): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.session.create({
    data: { tokenHash, expiresAt, customerId },
    select: { id: true },
  });

  return { token, expiresAt };
}

export async function getCustomerFromSessionToken(token: string) {
  const tokenHash = hashSessionToken(token);

  const session = await prisma.session.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { customer: true },
  });

  if (!session) return null;

  return {
    customer: session.customer,
    sessionId: session.id,
    expiresAt: session.expiresAt,
  };
}

export async function revokeSessionToken(token: string) {
  const tokenHash = hashSessionToken(token);
  await prisma.session.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
