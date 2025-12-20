import { getOrderById } from "@/actions/account";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

type OrderResult = Awaited<ReturnType<typeof getOrderById>>;
type OrderType = NonNullable<OrderResult["order"]>;
type OrderItemType = OrderType["items"][number];

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const result = await getOrderById(id);

  if (!result.success || !result.order) {
    notFound();
  }

  const order: OrderType = result.order;

  const statusSteps = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div>
      <Link href="/account/orders" className="inline-flex items-center text-text-light hover:text-text-dark mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-dark mb-2">
            Order #{order.orderNumber}
          </h1>
          <p className="text-text-light">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`text-sm font-medium px-4 py-2 rounded-full ${
          order.status === "PAID" ? "bg-green-100 text-green-700" :
          order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
          order.status === "DELIVERED" ? "bg-purple-100 text-purple-700" :
          "bg-yellow-100 text-yellow-700"
        }`}>
          {order.status}
        </span>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary-blue transition-all"
            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
          />
          {statusSteps.map((step, index) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStepIndex ? "bg-primary-blue text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {index < currentStepIndex ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`text-xs mt-2 ${index <= currentStepIndex ? "text-text-dark" : "text-text-light"}`}>
                {step.charAt(0) + step.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-serif text-lg font-bold text-text-dark mb-4">Items</h2>
          <div className="divide-y divide-gray-100">
            {order.items.map((item: OrderItemType) => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images[0] ? (
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-dark">{item.product.name}</h3>
                  <p className="text-sm text-text-light">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text-dark">
                    {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(item.price / 100)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
            <span className="font-bold text-text-dark">Total</span>
            <span className="font-bold text-text-dark">
              {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(order.totalAmount / 100)}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          <h2 className="font-serif text-lg font-bold text-text-dark mb-4">Shipping Address</h2>
          {order.shippingAddress ? (
            <address className="not-italic text-text-light leading-relaxed">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}
              {order.shippingAddress.state && `, ${order.shippingAddress.state}`}<br />
              {order.shippingAddress.country}
            </address>
          ) : (
            <p className="text-text-light">No shipping address</p>
          )}
        </div>
      </div>
    </div>
  );
}
