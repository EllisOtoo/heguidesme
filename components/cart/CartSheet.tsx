"use client";

import { useCartStore } from "@/store/cart-store";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Create a utility for cn if not exists, inline for now to avoid errors
// In a real project, this would be in lib/utils.ts
function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function CartSheet() {
  const { 
    isOpen, 
    closeCart, 
    items, 
    removeItem, 
    updateQuantity, 
    getCartTotal 
  } = useCartStore();
  
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = getCartTotal();
  const formattedTotal = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(total / 100);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-[51] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-serif text-xl font-bold text-text-dark flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-text-light hover:text-text-dark hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
              <p className="text-text-light text-lg">Your cart is empty</p>
              <button 
                onClick={closeCart}
                className="text-primary-blue font-medium hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-32 bg-background-mist rounded-lg overflow-hidden flex-shrink-0">
                   {item.image ? (
                        <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                        />
                   ) : (
                       <div className="w-full h-full bg-gray-200" />
                   )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-serif font-medium text-text-dark line-clamp-2">
                        {item.name}
                        </h3>
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="text-text-light hover:text-red-500 p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-primary-blue font-semibold mt-1">
                        {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format((item.price * item.quantity) / 100)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-text-light hover:border-gray-300 transition-colors"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-text-light hover:border-gray-300 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-background-mist/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-light">Subtotal</span>
              <span className="font-serif text-2xl font-bold text-text-dark">{formattedTotal}</span>
            </div>
            <p className="text-xs text-text-light mb-6 text-center">
              Shipping calculated at checkout.
            </p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-primary-blue text-white text-center font-medium py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/10"
            >
              Secure Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
