"use client";

import { getProfile, updateProfile } from "@/actions/account";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";

const profileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function loadProfile() {
      const result = await getProfile();
      if (result.success && result.profile) {
        setEmail(result.profile.email);
        form.reset({
          name: result.profile.name || "",
          phone: result.profile.phone || "",
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [form]);

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setSuccess(false);

    const result = await updateProfile(data);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-text-dark mb-8">Profile</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm">
              Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-text-light">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">Full Name</label>
            <input
              {...form.register("name")}
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark">Phone Number</label>
            <input
              {...form.register("phone")}
              type="tel"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue outline-none transition-colors"
              placeholder="024 123 4567"
            />
          </div>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-primary-blue text-white font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
