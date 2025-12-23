"use client";

import { useState, useCallback } from "react";
import Script from "next/script";

interface RazorpayPaymentProps {
  amount: number;
  productName?: string;
  productDescription?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (paymentId: string, orderId: string) => void;
  onFailure?: (error: string) => void;
}

export default function RazorpayPayment({
  amount,
  productName = "Product",
  productDescription = "Purchase",
  prefill,
  onSuccess,
  onFailure,
}: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handlePayment = useCallback(async () => {
    if (!scriptLoaded) {
      onFailure?.("Payment gateway is loading. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        throw new Error("Razorpay key not configured");
      }

      // Initialize Razorpay checkout
      const options: RazorpayOptions = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: productName,
        description: productDescription,
        order_id: orderData.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
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

            const verifyData = await verifyResponse.json();

            if (verifyData.verified) {
              onSuccess?.(response.razorpay_payment_id, response.razorpay_order_id);
            } else {
              onFailure?.("Payment verification failed");
            }
          } catch {
            onFailure?.("Error verifying payment");
          }
        },
        prefill: prefill,
        theme: {
          color: "#171717",
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
      const errorMessage = error instanceof Error ? error.message : "Payment failed";
      onFailure?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [amount, productName, productDescription, prefill, onSuccess, onFailure, scriptLoaded]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {loading ? "Processing..." : `Pay ₹${amount.toLocaleString("en-IN")}`}
      </button>
    </>
  );
}
