"use client";

import { createFeedbackSubmission } from "@/actions/create-feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const feedbackSchema = z.object({
  topic: z.string().min(2, "Topic is required"),
  message: z.string().min(5, "Message is required"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { topic: "Product Feedback", message: "", email: "" },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const result = await createFeedbackSubmission(data);
    if (!result.success) {
      setErrorMessage("Please check the form and try again.");
      return;
    }

    setSuccessMessage("Thank you for your feedback.");
    form.reset({ topic: "Product Feedback", message: "", email: "" });
  };

  return (
    <div className="container mx-auto px-4 py-16">
       <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-text-dark mb-6 text-center">Share Your Thoughts</h1>
        <p className="text-text-light text-center mb-12">
          Your feedback helps us improve our journals and serve you better.
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           {successMessage && (
            <div className="rounded-xl border border-accent-green/40 bg-accent-green/10 p-4 text-sm text-text-dark">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
           <div>
            <label htmlFor="topic" className="block text-sm font-medium text-text-dark mb-2">Topic</label>
            <select 
              id="topic"
              {...form.register("topic")}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
            >
              <option>Product Feedback</option>
              <option>Website Issue</option>
              <option>Suggestion</option>
              <option>Other</option>
            </select>
            {form.formState.errors.topic && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.topic.message}</p>
            )}
          </div>
          
           <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2">Message</label>
            <textarea 
              id="message" 
              rows={5}
              {...form.register("message")}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="Tell us what you think..."
            />
            {form.formState.errors.message && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.message.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">Email (Optional)</label>
            <input 
              type="email" 
              id="email" 
              {...form.register("email")}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="If you'd like a reply"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary-blue text-white font-medium py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
