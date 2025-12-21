"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyOrderPayment } from "@/actions/verify-order";
import { Heart, XCircle, Share2, Home } from "lucide-react";
import Link from "next/link";

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(() =>
    reference ? "verifying" : "error"
  );
  const [message, setMessage] = useState(() =>
    reference ? "Verifying your donation..." : "No payment reference found."
  );

  useEffect(() => {
    if (!reference) return;

    const verify = async () => {
      try {
        const result = await verifyOrderPayment(reference);
        if (result.success) {
          setStatus("success");
        } else {
          console.error("Verification Error", result.error);
          setStatus("error");
          setMessage(result.error || "Donation verification failed.");
        }
      } catch (error) {
        console.error("Verification Error", error);
        setStatus("error");
        setMessage("Donation verification failed.");
      }
    };

    verify();
  }, [reference]);

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      {status === "verifying" && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-6" />
          <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">
            Verifying Donation
          </h1>
          <p className="text-text-light">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          {/* Animated Heart */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-red-500 fill-red-500 animate-pulse" />
            </div>
            {/* Sparkles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-pink-400 rounded-full animate-ping delay-150" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-text-dark mb-4">
            Thank You!
          </h1>
          <p className="text-text-light mb-2 text-lg">
            Your generous donation has been received.
          </p>
          <p className="text-text-light mb-8">
            Thank you for donating and supporting this Christian app development.
You are part early testers and on inputs on our next milestone. 
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <Link
              href="/"
              className="flex-1 bg-primary-blue text-white px-6 py-3 rounded-full hover:opacity-90 font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "I just donated to HeGuidesMe",
                    text: "I just made a donation to support HeGuidesMe's mission. Consider joining me!",
                    url: window.location.origin + "/donate",
                  });
                }
              }}
              className="flex-1 border border-gray-200 text-text-dark px-6 py-3 rounded-full hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Impact Message */}
          <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl text-left">
            <h3 className="font-serif font-bold text-text-dark mb-2">
              Your Impact
            </h3>
            <p className="text-sm text-text-light">
              Every donation helps us provide resources for spiritual growth,
              support community initiatives, and spread the message of hope and
              guidance to more people.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-text-dark mb-4">
            Donation Failed
          </h1>
          <p className="text-text-light mb-8">
            {message ||
              "We couldn't verify your donation. Please contact support if you were charged."}
          </p>
          <Link
            href="/donate"
            className="bg-text-dark text-white px-8 py-3 rounded-full hover:opacity-90 font-medium"
          >
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center">
          <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-light">Loading...</p>
        </div>
      }
    >
      <DonationSuccessContent />
    </Suspense>
  );
}
