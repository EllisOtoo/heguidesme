"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(1, "Enter your name").optional(),
    phone: z.string().min(7, "Enter a valid phone number").optional(),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/account";

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        email: values.email,
        password: values.password,
      }),
    });

    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!res.ok) {
      form.setError("root", {
        message: data?.error || "Unable to create account. Please try again.",
      });
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="font-serif text-3xl font-bold text-text-dark mb-2">
        Create your account
      </h1>
      <p className="text-text-light mb-8">
        Create an account to view your orders anytime.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">
            Name (optional)
          </label>
          <input
            {...form.register("name")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
            placeholder="Your name"
            autoComplete="name"
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">
            Phone (optional)
          </label>
          <input
            {...form.register("phone")}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
            placeholder="024..."
            autoComplete="tel"
          />
          {form.formState.errors.phone && (
            <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>
          )}
        </div>

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
            <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">Password</label>
          <input
            {...form.register("password")}
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-dark">
            Confirm password
          </label>
          <input
            {...form.register("confirmPassword")}
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.confirmPassword.message}
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
          {form.formState.isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-text-light mt-6">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(nextPath)}`}
          className="text-primary-blue font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

