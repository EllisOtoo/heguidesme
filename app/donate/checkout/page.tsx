"use client";

import { createDonation } from "@/actions/create-donation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Heart, ArrowLeft } from "lucide-react";

// Validation Schema - no shipping fields for donations
const donationCheckoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationCheckoutSchema>;

function DonationCheckoutContent() {
  const searchParams = useSearchParams();
  const amountParam = searchParams.get("amount");
  const amount = amountParam ? parseInt(amountParam, 10) : 0;

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationCheckoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: DonationFormData) => {
    if (amount <= 0) {
      alert("Invalid donation amount. Please go back and select an amount.");
      return;
    }

    try {
      const result = await createDonation({
        ...data,
        amount,
      });

      if (result.success && result.paymentUrl) {
        window.location.assign(result.paymentUrl);
      } else {
        console.error("Payment Init Failed", result.error);
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Donation Checkout Error", error);
      alert("An unexpected error occurred.");
    }
  };

  // No amount specified
  if (amount <= 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-text-dark mb-4">
          No Donation Amount Selected
        </h1>
        <p className="text-text-light mb-8">
          Please select a donation amount first.
        </p>
        <Link
          href="/donate"
          className="text-primary-blue font-medium hover:underline"
        >
          Go to Donation Page
        </Link>
      </div>
    );
  }

  const formattedAmount = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount / 100);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 text-text-light hover:text-text-dark mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Amount</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-text-dark mb-2">
            Complete Your Donation
          </h1>
          <p className="text-text-light">
            You&apos;re donating{" "}
            <span className="font-bold text-text-dark">{formattedAmount}</span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-serif text-xl font-semibold mb-6">
            Your Information
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">
                  First Name
                </label>
                <input
                  {...form.register("firstName")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                  placeholder="John"
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">
                  Last Name
                </label>
                <input
                  {...form.register("lastName")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                  placeholder="Doe"
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">
                Email Address
              </label>
              <input
                {...form.register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                placeholder="john@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.email.message}
                </p>
              )}
              <p className="text-xs text-text-light">
                We&apos;ll send your donation receipt here
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">
                Phone Number
              </label>
              <input
                {...form.register("phone")}
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                placeholder="024 123 4567"
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">
                Message <span className="text-text-light">(Optional)</span>
              </label>
              <textarea
                {...form.register("message")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors h-24 resize-none"
                placeholder="Share why you're supporting us..."
              />
            </div>

            {/* Order Summary */}
            <div className="bg-background-mist/30 p-6 rounded-xl mt-6">
              <div className="flex justify-between items-center">
                <span className="text-text-light">Donation Amount</span>
                <span className="font-bold text-text-dark text-lg">
                  {formattedAmount}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-primary-blue text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {form.formState.isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Complete Donation
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-light mt-6">
          Your payment is secured by Paystack. We never store your card details.
        </p>
      </div>
    </div>
  );
}

export default function DonateCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-light">Loading checkout...</p>
        </div>
      }
    >
      <DonationCheckoutContent />
    </Suspense>
  );
}
