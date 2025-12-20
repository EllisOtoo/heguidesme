import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in?callbackUrl=/account");
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="bg-background-mist/30 rounded-2xl p-6">
              <div className="mb-6">
                <p className="text-sm text-text-light">Welcome back,</p>
                <p className="font-medium text-text-dark truncate">
                  {session.user?.name || session.user?.email}
                </p>
              </div>
              <nav className="space-y-1">
                <Link
                  href="/account"
                  className="block px-4 py-2.5 rounded-xl text-text-dark hover:bg-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/account/orders"
                  className="block px-4 py-2.5 rounded-xl text-text-dark hover:bg-white transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  href="/account/profile"
                  className="block px-4 py-2.5 rounded-xl text-text-dark hover:bg-white transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/account/addresses"
                  className="block px-4 py-2.5 rounded-xl text-text-dark hover:bg-white transition-colors"
                >
                  Addresses
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
