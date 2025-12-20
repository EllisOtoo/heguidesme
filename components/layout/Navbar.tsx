"use client";

import { useCartStore } from "@/store/cart-store";
import { ShoppingBag, User, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import CartSheet from "../cart/CartSheet";

const navLinks = [
  { href: "/", label: "Shop" },
  { href: "/donate", label: "Donate" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/feedback", label: "Feedback" },
  { href: "/contact", label: "Contact Us" },
  { href: "/outlets", label: "Outlets" },
];

const Navbar = () => {
  const { toggleCart, getCartCount, hasHydrated } = useCartStore();
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background-paper/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-2 text-text-dark hover:text-primary-blue transition-colors md:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo_hgm_withtext.png"
              alt="He Guides Me"
              width={150}
              height={93}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions (User / Cart) */}
          <div className="flex items-center space-x-4">
            {/* User Auth - Desktop */}
            {status === "loading" ? (
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse hidden sm:block" />
            ) : session ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-text-dark hover:text-primary-blue transition-colors"
                  aria-label="Account menu"
                >
                  <User className="w-6 h-6" />
                </button>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-text-dark font-medium truncate">
                          {session.user?.name || session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-text-dark hover:bg-gray-50"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-text-dark hover:bg-gray-50"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors hidden sm:inline-block"
              >
                Sign In
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="p-2 text-text-dark hover:text-primary-blue transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {hasHydrated && getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-green text-text-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Image
            src="/images/logo_hgm_withtext.png"
            alt="He Guides Me"
            width={120}
            height={74}
          />
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 text-text-dark hover:text-primary-blue transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info on Mobile */}
        {session && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-text-light">Signed in as</p>
            <p className="text-sm font-medium text-text-dark truncate">
              {session.user?.name || session.user?.email}
            </p>
          </div>
        )}

        {/* Mobile Nav Links */}
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-text-dark hover:bg-gray-50 rounded-xl transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 my-3" />

          {session ? (
            <>
              <Link
                href="/account"
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-3 text-text-dark hover:bg-gray-50 rounded-xl transition-colors"
              >
                My Account
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-3 text-text-dark hover:bg-gray-50 rounded-xl transition-colors"
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-3 text-primary-blue font-medium hover:bg-blue-50 rounded-xl transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>

      <CartSheet />
    </>
  );
};

export default Navbar;
