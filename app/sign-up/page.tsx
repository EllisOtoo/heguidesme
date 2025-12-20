"use client";

import { register } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  name: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);

    const result = await register({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
    });

    if (!result.success) {
      setError(result.error || "Failed to create account");
      return;
    }

    // Auto sign in after registration
    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      router.push("/sign-in?message=Account created successfully. Please sign in.");
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-text-dark mb-2">Create Account</h1>
          <p className="text-text-light">Join us to track your orders and more</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">Email Address *</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">Name</label>
              <input
                {...form.register("name")}
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-dark">Phone</label>
              <input
                {...form.register("phone")}
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
                placeholder="024 123 4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">Password *</label>
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
            <label className="text-sm font-medium text-text-dark">Confirm Password *</label>
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
            {form.formState.isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-text-light mt-8">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary-blue font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
