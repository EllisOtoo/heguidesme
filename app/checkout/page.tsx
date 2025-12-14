"use client";

import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Validation Schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  region: z.string().min(2, "Region is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

import { createOrder } from "@/actions/create-order";

// ... (existing imports)

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  // Remove isSuccess state as we redirect away
  // const [isSuccess, setIsSuccess] = useState(false);

  // Hydration fix
  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const subtotal = getCartTotal();
  const shipping = 2500; // 25.00 GHS
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
        const result = await createOrder({
            ...data,
            amount: total,
            items: items.map(item => ({
                id: item.id,
                slug: item.slug,
                quantity: item.quantity,
                price: item.price
            }))
        });

        if (result.success && result.paymentUrl) {
            // Save cart items to local storage or session storage if needed for
            // post-payment verification (optional, or we rely on cart store persisting until clearCart is called on success page)
            window.location.href = result.paymentUrl;
        } else {
            console.error("Payment Init Failed", result.error);
            alert("Failed to initialize payment. Please try again.");
        }
    } catch (error) {
        console.error("Checkout Error", error);
        alert("An unexpected error occurred.");
    }
  };

  if (!isClient) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-text-dark mb-4">Your Cart is Empty</h1>
        <p className="text-text-light mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/" className="text-primary-blue font-medium hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Checkout Form */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-dark mb-8">Checkout</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">First Name</label>
                <input
                  {...form.register("firstName")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                  placeholder="John"
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-500 text-xs">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">Last Name</label>
                <input
                  {...form.register("lastName")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                  placeholder="Doe"
                />
                 {form.formState.errors.lastName && (
                  <p className="text-red-500 text-xs">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">Email Address</label>
              <input
                {...form.register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                placeholder="john@example.com"
              />
               {form.formState.errors.email && (
                  <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">Phone Number</label>
              <input
                {...form.register("phone")}
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                placeholder="024 123 4567"
              />
               {form.formState.errors.phone && (
                  <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">Delivery Address</label>
              <textarea
                {...form.register("address")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors h-24 resize-none"
                placeholder="Street name, House number, Landmark"
              />
               {form.formState.errors.address && (
                  <p className="text-red-500 text-xs">{form.formState.errors.address.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">City</label>
                <input
                  {...form.register("city")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                  placeholder="Accra"
                />
                 {form.formState.errors.city && (
                  <p className="text-red-500 text-xs">{form.formState.errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">Region</label>
                <select
                  {...form.register("region")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors bg-white"
                >
                    <option value="">Select Region</option>
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Central">Central</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Western">Western</option>
                    <option value="Volta">Volta</option>
                    <option value="Northern">Northern</option>
                    {/* Add others as needed */}
                </select>
                 {form.formState.errors.region && (
                  <p className="text-red-500 text-xs">{form.formState.errors.region.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-primary-blue text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity mt-8 text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {form.formState.isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-background-mist/30 p-8 rounded-2xl h-fit">
          <h2 className="font-serif text-xl font-bold text-text-dark mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                         <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                  
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-text-dark text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-text-light text-xs mt-1">
                    {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(item.price / 100)}
                  </p>
                </div>
                <p className="font-medium text-text-dark text-sm">
                    {new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format((item.price * item.quantity) / 100)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-text-light">
              <span>Subtotal</span>
              <span>{new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(subtotal / 100)}</span>
            </div>
            <div className="flex justify-between text-text-light">
              <span>Shipping</span>
              <span>{new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(shipping / 100)}</span>
            </div>
            <div className="flex justify-between text-text-dark font-bold text-lg pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>{new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(total / 100)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
