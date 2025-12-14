"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message is required"),
});

export type CreateContactInput = z.infer<typeof contactSchema>;

export async function createContactSubmission(input: CreateContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten() };
  }

  await prisma.contactSubmission.create({
    data: parsed.data,
  });

  return { success: true as const };
}

