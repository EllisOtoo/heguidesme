import type { ReactNode } from "react";

import Link from "next/link";

import { LogoutButton } from "@/components/account/logout-button";
import { requireCustomer } from "@/lib/auth/server";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const customer = await requireCustomer("/account");

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-dark">Account</h1>
          <p className="text-text-light mt-1">{customer.email}</p>
        </div>
        <LogoutButton />
      </div>

      <nav className="flex gap-4 mb-8 text-sm">
        <Link href="/account" className="text-primary-blue font-medium hover:underline">
          Overview
        </Link>
        <Link
          href="/account/orders"
          className="text-primary-blue font-medium hover:underline"
        >
          Orders
        </Link>
      </nav>

      {children}
    </div>
  );
}

