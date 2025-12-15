import { NextResponse, type NextRequest } from "next/server";

import { getCustomerFromSessionToken, SESSION_COOKIE_NAME } from "./session";

export async function requireCustomerFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return {
      customer: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }

  let session: Awaited<ReturnType<typeof getCustomerFromSessionToken>>;
  try {
    session = await getCustomerFromSessionToken(token);
  } catch {
    return {
      customer: null,
      response: NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      ),
    } as const;
  }
  if (!session) {
    return {
      customer: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }

  return { customer: session.customer, response: null } as const;
}
