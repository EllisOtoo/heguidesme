import { NextResponse, type NextRequest } from "next/server";

import { requireCustomerFromRequest } from "@/lib/auth/request";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { customer, response } = await requireCustomerFromRequest(request);
  if (response) return response;

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      totalAmount: true,
      status: true,
      reference: true,
      _count: { select: { items: true } },
    },
  });

  return NextResponse.json({ orders });
}

