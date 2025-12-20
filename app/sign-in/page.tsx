"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-text-dark mb-2">Welcome Back</h1>
          <p className="text-text-light">Sign in to access your account</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

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

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">Password</label>
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

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-primary-blue hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary-blue text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-text-light mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary-blue font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
