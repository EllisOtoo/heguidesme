"use client";

import { resetPassword } from "@/actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setError(null);
    const result = await resetPassword(token, data.password);

    if (!result.success) {
      setError(result.error || "Failed to reset password");
    } else {
      setSuccess(true);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-text-dark mb-4">Invalid Link</h1>
          <p className="text-text-light mb-8">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="text-primary-blue font-medium hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-text-dark mb-4">Password Reset!</h1>
          <p className="text-text-light mb-8">
            Your password has been successfully reset.
          </p>
          <Link href="/sign-in" className="inline-block bg-primary-blue text-white font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-text-dark mb-2">Reset Password</h1>
          <p className="text-text-light">Enter your new password below</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">New Password</label>
            <input
              {...form.register("password")}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
              placeholder="••••••••"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">Confirm New Password</label>
            <input
              {...form.register("confirmPassword")}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
              placeholder="••••••••"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-red-500 text-xs">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary-blue text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
