"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const feedbackSchema = z.object({
  topic: z.string().min(2, "Topic is required"),
  message: z.string().min(5, "Message is required"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
});

export type CreateFeedbackInput = z.infer<typeof feedbackSchema>;

export async function createFeedbackSubmission(input: CreateFeedbackInput) {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten() };
  }

  await prisma.feedbackSubmission.create({
    data: {
      topic: parsed.data.topic,
      message: parsed.data.message,
      email: parsed.data.email || null,
    },
  });

  return { success: true as const };
}

