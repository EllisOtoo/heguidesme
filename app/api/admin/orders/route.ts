import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, UNAUTHORIZED_RESPONSE } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
