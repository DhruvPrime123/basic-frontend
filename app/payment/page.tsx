"use client";

import { useState } from "react";
import RazorpayPayment from "@/components/RazorpayPayment";

export default function PaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSuccess = (paymentId: string, orderId: string) => {
    setPaymentStatus({
      type: "success",
      message: `Payment successful! Payment ID: ${paymentId}`,
    });
    console.log("Payment successful:", { paymentId, orderId });
  };

  const handleFailure = (error: string) => {
    setPaymentStatus({
      type: "error",
      message: error,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md px-8 py-12 bg-white dark:bg-black">
        <h1 className="mb-4 text-center text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Checkout
        </h1>
        <p className="mb-8 text-center text-zinc-600 dark:text-zinc-400">
          Complete your purchase securely with Razorpay
        </p>

        <div className="mb-8 rounded-lg border border-black/[.08] p-6 dark:border-white/[.145]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-600 dark:text-zinc-400">Product</span>
            <span className="font-medium text-black dark:text-zinc-50">Sample Product</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-600 dark:text-zinc-400">Quantity</span>
            <span className="font-medium text-black dark:text-zinc-50">1</span>
          </div>
          <div className="border-t border-black/[.08] dark:border-white/[.145] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-black dark:text-zinc-50">Total</span>
              <span className="text-lg font-semibold text-black dark:text-zinc-50">₹499</span>
            </div>
          </div>
        </div>

        {paymentStatus.type && (
          <div
            className={`mb-6 rounded-lg p-4 text-center ${
              paymentStatus.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {paymentStatus.message}
          </div>
        )}

        <RazorpayPayment
          amount={499}
          productName="Sample Product"
          productDescription="Demo purchase for testing Razorpay integration"
          prefill={{
            name: "",
            email: "",
            contact: "",
          }}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
        />

        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Payments are securely processed by Razorpay
        </p>
      </main>
    </div>
  );
}
