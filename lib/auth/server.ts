import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCustomerFromSessionToken, SESSION_COOKIE_NAME } from "./session";

export async function getCurrentCustomer() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await getCustomerFromSessionToken(token);
  return session?.customer ?? null;
}

export async function requireCustomer(nextPathname = "/account") {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect(`/login?next=${encodeURIComponent(nextPathname)}`);
  }
  return customer;
}

