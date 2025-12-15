import { NextResponse, type NextRequest } from "next/server";

import { requireCustomerFromRequest } from "@/lib/auth/request";

export async function GET(request: NextRequest) {
  const { customer, response } = await requireCustomerFromRequest(request);
  if (response) return response;

  return NextResponse.json({
    customer: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      createdAt: customer.createdAt,
    },
  });
}

