import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, UNAUTHORIZED_RESPONSE } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  try {
    const feedback = await prisma.feedbackSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Failed to fetch feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
