import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Checks if the current session belongs to the designated admin.
 * The admin email is defined in the ADMIN_EMAIL environment variable.
 */
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!session?.user?.email) {
    return false;
  }

  if (!adminEmail) {
    console.error("ADMIN_EMAIL is not defined in environment variables");
    return false;
  }

  return session.user.email === adminEmail;
}

/**
 * A helper to return a standard 403 response if not admin.
 */
export const UNAUTHORIZED_RESPONSE = new Response(
  JSON.stringify({ error: "Unauthorized. Admin access only." }),
  { status: 403, headers: { "Content-Type": "application/json" } }
);

/**
 * A helper to return a standard 401 response if not authenticated.
 */
export const UNAUTHENTICATED_RESPONSE = new Response(
  JSON.stringify({ error: "Unauthenticated. Please sign in." }),
  { status: 401, headers: { "Content-Type": "application/json" } }
);
