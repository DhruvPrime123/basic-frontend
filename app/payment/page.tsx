"use client";

import { useState } from "react";
import Link from "next/link";
import RazorpayButton from "@/components/RazorpayButton";

export default function PaymentPage() {
  const [amount, setAmount] = useState(100);
  const [paymentStatus, setPaymentStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSuccess = (response: {
    paymentId: string;
    orderId: string;
    signature: string;
  }) => {
    setPaymentStatus({
      type: "success",
      message: `Payment successful! Payment ID: ${response.paymentId}`,
    });
  };

  const handleError = (error: string) => {
    setPaymentStatus({
      type: "error",
      message: error,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
        >
          &larr; Back to Home
        </Link>

        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            Make a Payment
          </h1>

          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Amount (INR)
            </label>
            <input
              type="number"
              id="amount"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <p className="text-lg font-medium text-zinc-900 dark:text-white">
              Total: ₹{amount.toLocaleString("en-IN")}
            </p>
          </div>

          <RazorpayButton
            amount={amount}
            name="Basic Frontend"
            description="Demo Payment"
            prefill={{
              name: "Test User",
              email: "test@example.com",
              contact: "9999999999",
            }}
            onSuccess={handleSuccess}
            onError={handleError}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Pay ₹{amount.toLocaleString("en-IN")}
          </RazorpayButton>

          {paymentStatus && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                paymentStatus.type === "success"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
              }`}
            >
              {paymentStatus.message}
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Test Card Details
          </h2>
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              <span className="font-medium">Card Number:</span> 4111 1111 1111
              1111
            </p>
            <p>
              <span className="font-medium">Expiry:</span> Any future date
            </p>
            <p>
              <span className="font-medium">CVV:</span> Any 3 digits
            </p>
            <p>
              <span className="font-medium">OTP:</span> Any 4+ digits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
