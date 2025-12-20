import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Quiet Time | Serene Scripture",
  description: "A fast, and serene online store dedicated to selling spiritual growth tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col"
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
