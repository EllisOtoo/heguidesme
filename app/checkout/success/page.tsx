"use client";

import { useCartStore } from "@/store/cart-store";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyOrderPayment } from "@/actions/verify-order";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// Separate component for reading search params to avoid de-opt
function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { clearCart } = useCartStore();
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">(() =>
    reference ? "verifying" : "error"
  );
  const [message, setMessage] = useState(() =>
    reference ? "Verifying your payment..." : "No payment reference found."
  );

  useEffect(() => {
    if (!reference) return;

    const verify = async () => {
      try {
        const result = await verifyOrderPayment(reference);
        if (result.success) {
            setStatus("success");
            clearCart();
        } else {
            console.error("Verification Error", result.error);
            setStatus("error");
            setMessage(result.error || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Verification Error", error);
        setStatus("error");
        setMessage("Payment verification failed.");
      }
    };

    verify();
  }, [reference, clearCart]);


  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      {status === "verifying" && (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mb-6"></div>
            <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">Verifying Payment</h1>
            <p className="text-text-light">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-accent-green" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-text-dark mb-4">Payment Successful!</h1>
            <p className="text-text-light mb-8">
                Thank you for your purchase. Your order has been confirmed and receipt sent to your email.
            </p>
            <Link href="/" className="bg-primary-blue text-white px-8 py-3 rounded-full hover:opacity-90 font-medium">
                Continue Shopping
            </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center">
             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-text-dark mb-4">Payment Failed</h1>
            <p className="text-text-light mb-8">
                {message || "We couldn't verify your payment. Please contact support if you were charged."}
            </p>
            <Link href="/checkout" className="bg-text-dark text-white px-8 py-3 rounded-full hover:opacity-90 font-medium">
                Try Again
            </Link>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
