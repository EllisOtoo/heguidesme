import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getMyOrders } from "@/actions/account";

type OrdersResult = Awaited<ReturnType<typeof getMyOrders>>;
type OrderType = NonNullable<OrdersResult["orders"]>[number];

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const ordersResult = await getMyOrders();
  const recentOrders: OrderType[] = ordersResult.orders?.slice(0, 3) || [];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-text-dark mb-8">
        Hello, {session?.user?.name?.split(" ")[0] || "there"}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-serif text-lg font-bold text-text-dark mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link
              href="/account/orders"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-text-dark">View all orders</span>
              <svg className="w-5 h-5 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/account/profile"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-text-dark">Update profile</span>
              <svg className="w-5 h-5 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/account/addresses"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-text-dark">Manage addresses</span>
              <svg className="w-5 h-5 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-serif text-lg font-bold text-text-dark mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-light mb-4">No orders yet</p>
              <Link href="/" className="text-primary-blue font-medium hover:underline">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-text-dark">Order #{order.orderNumber}</p>
                    <p className="text-sm text-text-light">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    order.status === "PAID" ? "bg-green-100 text-green-700" :
                    order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                    order.status === "DELIVERED" ? "bg-purple-100 text-purple-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
