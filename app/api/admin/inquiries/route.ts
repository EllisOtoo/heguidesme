import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, UNAUTHORIZED_RESPONSE } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  try {
    const inquiries = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
