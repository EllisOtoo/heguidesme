import { getMyOrders } from "@/actions/account";
import Link from "next/link";

type OrdersResult = Awaited<ReturnType<typeof getMyOrders>>;
type OrderType = NonNullable<OrdersResult["orders"]>[number];

export default async function OrdersPage() {
  const result = await getMyOrders();
  const orders: OrderType[] = result.orders || [];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-text-dark mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-text-dark mb-2">No orders yet</h2>
          <p className="text-text-light mb-6">When you place an order, it will appear here.</p>
          <Link
            href="/"
            className="inline-block bg-primary-blue text-white font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-medium text-text-dark">Order #{order.orderNumber}</h2>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      order.status === "PAID" ? "bg-green-100 text-green-700" :
                      order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                      order.status === "DELIVERED" ? "bg-purple-100 text-purple-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-light">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-dark">
                    {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(order.totalAmount / 100)}
                  </p>
                  <p className="text-sm text-text-light">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
