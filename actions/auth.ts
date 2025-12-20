"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface RegisterParams {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export async function register(params: RegisterParams) {
  try {
    const { email, password, name, phone } = params;

    // Check if customer already exists with a password
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer?.passwordHash) {
      return { success: false, error: "An account with this email already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    if (existingCustomer) {
      // Upgrade guest customer to registered account
      await prisma.customer.update({
        where: { email },
        data: { passwordHash, name: name || existingCustomer.name, phone: phone || existingCustomer.phone },
      });
    } else {
      // Create new customer
      await prisma.customer.create({
        data: { email, passwordHash, name, phone },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    // Generate token (we don't reveal if email exists)
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Check if customer exists (but don't reveal this to the user)
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (customer) {
      // Delete any existing tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: { email },
      });

      // Create new token
      await prisma.passwordResetToken.create({
        data: { email, tokenHash, expiresAt },
      });

      // TODO: Send email with reset link
      // For development, log the token
      console.log(`Password reset link: /reset-password?token=${token}`);
    }

    // Always return success to not reveal if email exists
    return { success: true };
  } catch (error) {
    console.error("Password reset request error:", error);
    return { success: false, error: "Failed to process request" };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken) {
      return { success: false, error: "Invalid or expired reset link" };
    }

    if (resetToken.usedAt) {
      return { success: false, error: "This reset link has already been used" };
    }

    if (new Date() > resetToken.expiresAt) {
      return { success: false, error: "This reset link has expired" };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.customer.update({
        where: { email: resetToken.email },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
