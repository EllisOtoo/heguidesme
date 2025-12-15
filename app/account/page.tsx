import Link from "next/link";

import { requireCustomer } from "@/lib/auth/server";

export default async function AccountHomePage() {
  const customer = await requireCustomer("/account");

  return (
    <div className="bg-background-mist/30 p-6 rounded-2xl">
      <h2 className="font-serif text-xl font-bold text-text-dark">
        Welcome{customer.name ? `, ${customer.name}` : ""}.
      </h2>
      <p className="text-text-light mt-2">
        View your past orders and check their status.
      </p>

      <div className="mt-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center justify-center bg-primary-blue text-white font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
        >
          View my orders
        </Link>
      </div>
    </div>
  );
}

