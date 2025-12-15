"use client";

import { useCartStore } from "@/store/cart-store";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import CartSheet from "../cart/CartSheet";

const Navbar = () => {
  const { toggleCart, getCartCount, hasHydrated } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background-paper/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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
            <Link
              href="/"
              className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/donate"
              className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors"
            >
              Donate
            </Link>
            <Link
              href="/testimonials"
              className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/feedback"
              className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors"
            >
              Feedback
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/outlets"
              className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors"
            >
              Outlets
            </Link>
          </nav>

          {/* Actions (Cart / Mobile Menu Placeholder) */}
          <div className="flex items-center space-x-4">
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
      <CartSheet />
    </>
  );
};

export default Navbar;
