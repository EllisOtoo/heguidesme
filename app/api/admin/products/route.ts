import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, UNAUTHORIZED_RESPONSE } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
