"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/account";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!res.ok) {
      form.setError("root", {
        message: data?.error || "Unable to sign in. Please try again.",
      });
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="font-serif text-3xl font-bold text-text-dark mb-2">
        Sign in
      </h1>
      <p className="text-text-light mb-8">
        Access your orders and account details.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Email</label>
          <input
            {...form.register("email")}
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
            placeholder="you@example.com"
            autoComplete="email"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Password</label>
          <input
            {...form.register("password")}
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {form.formState.errors.root?.message && (
          <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-primary-blue text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-text-light mt-6">
        No account yet?{" "}
        <Link
          href={`/register?next=${encodeURIComponent(nextPath)}`}
          className="text-primary-blue font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

