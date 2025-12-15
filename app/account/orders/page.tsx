import Link from "next/link";

import { requireCustomer } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

const money = new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" });

export default async function AccountOrdersPage() {
  const customer = await requireCustomer("/account/orders");

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      totalAmount: true,
      status: true,
    },
  });

  if (orders.length === 0) {
    return (
      <div className="bg-background-mist/30 p-6 rounded-2xl">
        <h2 className="font-serif text-xl font-bold text-text-dark">No orders yet</h2>
        <p className="text-text-light mt-2">
          When you place an order, it will show up here.
        </p>
        <Link href="/" className="text-primary-blue font-medium hover:underline mt-4 inline-block">
          Go shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-primary-blue/30 hover:shadow-sm transition"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-text-dark font-medium">
                Order #{order.orderNumber}
              </p>
              <p className="text-text-light text-sm mt-1">
                {order.createdAt.toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-dark font-medium">{money.format(order.totalAmount / 100)}</p>
              <p className="text-text-light text-sm mt-1">{order.status}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

