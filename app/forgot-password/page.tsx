"use client";

import { requestPasswordReset } from "@/actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await requestPasswordReset(data.email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-text-dark mb-4">Check Your Email</h1>
          <p className="text-text-light mb-8">
            If an account exists with that email, we&apos;ve sent you a password reset link.
            Please check your inbox and spam folder.
          </p>
          <Link href="/sign-in" className="text-primary-blue font-medium hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-text-dark mb-2">Forgot Password?</h1>
          <p className="text-text-light">Enter your email and we&apos;ll send you reset instructions</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">Email Address</label>
            <input
              {...form.register("email")}
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
              placeholder="you@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary-blue text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-text-light mt-8">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-primary-blue font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
