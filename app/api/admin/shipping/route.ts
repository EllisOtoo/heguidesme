import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, UNAUTHORIZED_RESPONSE } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  try {
    const shippingOptions = await prisma.shippingOption.findMany({
      orderBy: {
        price: "asc",
      },
    });

    return NextResponse.json(shippingOptions);
  } catch (error) {
    console.error("Failed to fetch shipping options:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  try {
    const body = await request.json();
    const { name, description, price } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const shippingOption = await prisma.shippingOption.create({
      data: {
        name,
        description,
        price,
      },
    });

    return NextResponse.json(shippingOption, { status: 201 });
  } catch (error) {
    console.error("Failed to create shipping option:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
