"use client";

import { createContactSubmission } from "@/actions/create-contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const result = await createContactSubmission(data);
    if (!result.success) {
      setErrorMessage("Please check the form and try again.");
      return;
    }

    setSuccessMessage("Message received. We will get back to you soon.");
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-text-dark mb-6 text-center">Contact Us</h1>
        <p className="text-text-light text-center mb-12">
          Have a question about your order or our products? We would love to hear from you.
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
            <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              {...form.register("name")}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="Your name"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              {...form.register("email")}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="you@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2">Message</label>
            <textarea 
              id="message" 
              rows={5}
              {...form.register("message")}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="How can we help?"
            />
            {form.formState.errors.message && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.message.message}</p>
            )}
          </div>
          <button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary-blue text-white font-medium py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
