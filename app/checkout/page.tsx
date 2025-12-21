"use client";

import { createOrder } from "@/actions/create-order";
import { useCartStore } from "@/store/cart-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Validation Schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  region: z.string().min(2, "Region is required"),
  shippingOptionId: z.string().min(1, "Please select a shipping option"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface ShippingOption {
    id: string;
    name: string;
    description: string | null;
    price: number;
}

export default function CheckoutPage() {
  const { items, getCartTotal, hasHydrated } = useCartStore();
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(true);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
        shippingOptionId: "",
    }
  });

  const selectedShippingId = form.watch("shippingOptionId");

  useEffect(() => {
    async function fetchShipping() {
        try {
            const res = await fetch("/api/shipping");
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setShippingOptions(data);
                if (data.length > 0) {
                    form.setValue("shippingOptionId", data[0].id);
                }
            } else {
                console.error("Shipping API returned non-array data:", data);
                setShippingOptions([]);
            }
        } catch (error) {
            console.error("Failed to load shipping options", error);
            setShippingOptions([]);
        } finally {
            setIsLoadingShipping(false);
        }
    }
    fetchShipping();
  }, [form]);

  const subtotal = getCartTotal();
  const selectedShipping = Array.isArray(shippingOptions) 
    ? shippingOptions.find(opt => opt.id === selectedShippingId)
    : undefined;
    
  const shippingAmount = selectedShipping?.price || 0;
  const total = subtotal + shippingAmount;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
        const result = await createOrder({
            ...data,
            amount: total,
            shippingOptionId: data.shippingOptionId,
            items: items.map(item => ({
                id: item.id,
                variantId: item.variantId,
                slug: item.slug,
                quantity: item.quantity,
                price: item.price
            }))
        });

        if (result.success && result.paymentUrl) {
            window.location.assign(result.paymentUrl);
        } else {
            console.error("Payment Init Failed", result.error);
            alert("Failed to initialize payment. Please try again.");
        }
    } catch (error) {
        console.error("Checkout Error", error);
        alert("An unexpected error occurred.");
    }
  };

  if (!hasHydrated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-light">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-text-dark mb-4">Your Cart is Empty</h1>
        <p className="text-text-light mb-8">Looks like you have not added anything to your cart yet.</p>
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
                </select>
                 {form.formState.errors.region && (
                  <p className="text-red-500 text-xs">{form.formState.errors.region.message}</p>
                )}
              </div>
            </div>

            {/* Shipping Options Selection */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-serif text-lg font-bold text-text-dark">Shipping Method</h3>
                {isLoadingShipping ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-16 bg-gray-100 rounded-xl" />
                        <div className="h-16 bg-gray-100 rounded-xl" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {shippingOptions.map((option) => (
                            <label 
                                key={option.id}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                    selectedShippingId === option.id 
                                    ? "border-primary-blue bg-blue-50/30 ring-1 ring-primary-blue" 
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        value={option.id} 
                                        {...form.register("shippingOptionId")}
                                        className="w-4 h-4 text-primary-blue border-gray-300 focus:ring-primary-blue"
                                    />
                                    <div>
                                        <p className="font-medium text-text-dark text-sm">{option.name}</p>
                                        {option.description && (
                                            <p className="text-text-light text-xs">{option.description}</p>
                                        )}
                                    </div>
                                </div>
                                <p className="font-bold text-text-dark text-sm">
                                    {option.price === 0 ? "FREE" : new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(option.price / 100)}
                                </p>
                            </label>
                        ))}
                        {form.formState.errors.shippingOptionId && (
                            <p className="text-red-500 text-xs">{form.formState.errors.shippingOptionId.message}</p>
                        )}
                    </div>
                )}
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
              <div key={`${item.id}-${item.variantId || 'default'}`} className="flex gap-4">
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
                  {item.variantName && (
                    <p className="text-text-light text-[10px] mt-0.5">{item.variantName}</p>
                  )}
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
              <span>
                  {shippingAmount === 0 && selectedShippingId 
                    ? "FREE" 
                    : new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(shippingAmount / 100)}
              </span>
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
