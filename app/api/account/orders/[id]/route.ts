import { NextResponse, type NextRequest } from "next/server";

import { requireCustomerFromRequest } from "@/lib/auth/request";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { customer, response } = await requireCustomerFromRequest(request);
  if (response) return response;

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, customerId: customer.id },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      totalAmount: true,
      status: true,
      reference: true,
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: { select: { id: true, name: true, slug: true } },
        },
      },
      shippingAddress: {
        select: {
          street: true,
          city: true,
          state: true,
          zip: true,
          country: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
