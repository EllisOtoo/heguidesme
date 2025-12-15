import Link from "next/link";
import { notFound } from "next/navigation";

import { requireCustomer } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

const money = new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" });

type Props = { params: Promise<{ id: string }> };

export default async function AccountOrderDetailPage({ params }: Props) {
  const customer = await requireCustomer("/account/orders");
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, customerId: customer.id },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      totalAmount: true,
      status: true,
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          product: { select: { name: true, slug: true } },
        },
      },
      shippingAddress: {
        select: { street: true, city: true, state: true, zip: true, country: true },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/account/orders" className="text-primary-blue font-medium hover:underline text-sm">
          ← Back to orders
        </Link>
        <h2 className="font-serif text-2xl font-bold text-text-dark mt-3">
          Order #{order.orderNumber}
        </h2>
        <p className="text-text-light mt-1">
          Status: <span className="text-text-dark font-medium">{order.status}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-serif text-lg font-bold text-text-dark mb-4">Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-text-dark font-medium">{item.product.name}</p>
                <p className="text-text-light text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="text-text-dark font-medium">
                {money.format((item.price * item.quantity) / 100)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-5 pt-4 flex items-center justify-between">
          <p className="text-text-dark font-bold">Total</p>
          <p className="text-text-dark font-bold">{money.format(order.totalAmount / 100)}</p>
        </div>
      </div>

      <div className="bg-background-mist/30 rounded-2xl p-6">
        <h3 className="font-serif text-lg font-bold text-text-dark mb-3">
          Shipping address
        </h3>
        {order.shippingAddress ? (
          <div className="text-text-dark">
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}
              {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}
              {order.shippingAddress.zip ? ` ${order.shippingAddress.zip}` : ""}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        ) : (
          <p className="text-text-light">No shipping address saved for this order.</p>
        )}
      </div>
    </div>
  );
}

