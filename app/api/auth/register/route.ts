import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { hashPassword } from "@/lib/auth/password";
import {
  createCustomerSession,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
  phone: z.string().min(7).optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const passwordHash = await hashPassword(parsed.data.password);
  const name = parsed.data.name?.trim() || null;
  const phone = parsed.data.phone?.trim() || null;

  try {
    const existing = await prisma.customer.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });

    if (existing?.passwordHash) {
      return NextResponse.json(
        { error: "Account already exists. Please sign in." },
        { status: 409 }
      );
    }

    const customer = existing
      ? await prisma.customer.update({
          where: { id: existing.id },
          data: {
            ...(name ? { name } : {}),
            ...(phone ? { phone } : {}),
            passwordHash,
          },
          select: { id: true, email: true, name: true },
        })
      : await prisma.customer.create({
          data: { email, name, phone, passwordHash },
          select: { id: true, email: true, name: true },
        });

    const { token, expiresAt } = await createCustomerSession(customer.id);

    const response = NextResponse.json({
      ok: true,
      customer: { id: customer.id, email: customer.email, name: customer.name },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    const message = (error as Error)?.message ?? "";
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
