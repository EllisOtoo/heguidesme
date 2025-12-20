import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const shippingOptions = await prisma.shippingOption.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
      select: {
          id: true,
          name: true,
          description: true,
          price: true,
      }
    });

    return NextResponse.json(shippingOptions);
  } catch (error) {
    console.error("Failed to fetch public shipping options:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
