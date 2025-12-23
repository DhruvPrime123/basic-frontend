"use client";

import { useState, useCallback } from "react";
import Script from "next/script";

interface RazorpayButtonProps {
  amount: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (response: {
    paymentId: string;
    orderId: string;
    signature: string;
  }) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function RazorpayButton({
  amount,
  currency = "INR",
  name,
  description,
  prefill,
  onSuccess,
  onError,
  className,
  children,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handlePayment = useCallback(async () => {
    if (!scriptLoaded) {
      onError?.("Razorpay SDK not loaded");
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId } = await response.json();

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: amount * 100,
        currency,
        name,
        description,
        order_id: orderId,
        handler: async (response) => {
          // Verify payment on backend
          const verifyResponse = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResult.verified) {
            onSuccess?.({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
          } else {
            onError?.("Payment verification failed");
          }
        },
        prefill,
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      onError?.(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }, [
    amount,
    currency,
    name,
    description,
    prefill,
    onSuccess,
    onError,
    scriptLoaded,
  ]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
        strategy="lazyOnload"
      />
      <button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className={
          className ||
          "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        }
      >
        {loading ? "Processing..." : children || "Pay Now"}
      </button>
    </>
  );
}
