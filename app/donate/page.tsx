"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

// Preset donation amounts in GHS
const PRESET_AMOUNTS = [100, 200, 500, 1000];

export default function DonatePage() {
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");

  const router = useRouter();

  const handleDonate = () => {
    const finalAmount =
      typeof amount === "number" ? amount : Number(customAmount);

    if (!finalAmount || finalAmount <= 0) return;

    // Redirect to donation checkout with amount in cents as URL param
    router.push(`/donate/checkout?amount=${finalAmount * 100}`);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </div>
        </div>

        <h1 className="font-serif text-4xl font-bold text-text-dark mb-4">
          Support Our Mission
        </h1>
        <p className="text-text-light mb-12 text-lg">
          Your generous contribution helps us continue to provide resources for
          spiritual growth and community support.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="font-serif text-xl font-semibold mb-6 text-left">
            Select an Amount
          </h2>

          {/* Preset Amounts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setCustomAmount("");
                }}
                className={`py-4 rounded-xl font-medium transition-all border-2 ${
                  amount === preset
                    ? "border-primary-blue bg-primary-blue/5 text-primary-blue"
                    : "border-gray-100 hover:border-primary-blue/50 text-text-dark"
                }`}
              >
                GH₵{preset}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-8 text-left">
            <label className="block text-sm font-medium text-text-light mb-2">
              Or enter a custom amount (GHS)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light font-medium">
                GH₵
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount("");
                }}
                placeholder="0.00"
                className="w-full pl-14 pr-4 py-4 rounded-xl border border-gray-200 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 outline-none transition-all text-lg font-medium"
              />
            </div>
          </div>

          <button
            onClick={handleDonate}
            disabled={!amount && !customAmount}
            className="w-full bg-primary-blue text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-blue-500/20"
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
}
