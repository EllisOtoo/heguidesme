import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, UNAUTHORIZED_RESPONSE } from "@/lib/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  // Validate status against enum-like values if necessary, 
  // but Prisma will also catch invalid values if we had an enum.
  // In the schema, status is a String with default "PENDING".

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
