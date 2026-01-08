"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const COIN_PACKAGES = [
  { coins: 100, amount: 100, discount: 0 },
  { coins: 500, amount: 450, discount: 10 },
  { coins: 1000, amount: 850, discount: 15 },
];

export default function PurchasePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePurchase = async (coins: number, amount: number) => {
    setLoading(true);
    setMessage(null);

    try {
      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coins }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Payment Portal",
        description: `Purchase ${coins} coins`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                coins: coins,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              setMessage({
                type: "success",
                text: `Payment successful! ${coins} coins added to your account.`,
              });
            } else {
              setMessage({
                type: "error",
                text: verifyData.error || "Payment verification failed",
              });
            }
          } catch (error) {
            setMessage({ type: "error", text: "Payment verification failed" });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: user?.emailAddresses[0]?.emailAddress,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setMessage({ type: "error", text: "Payment cancelled" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Purchase error:", error);
      setMessage({ type: "error", text: "Failed to initiate purchase" });
      setLoading(false);
    }
  };

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
                  Purchase Coins
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Back to Dashboard
                </Link>
                <UserButton />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {message && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            {COIN_PACKAGES.map((pkg) => (
              <div
                key={pkg.coins}
                className="relative rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                {pkg.discount > 0 && (
                  <div className="absolute -top-3 right-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                    {pkg.discount}% OFF
                  </div>
                )}
                <div className="mb-4 text-center">
                  <div className="text-4xl font-bold text-black dark:text-zinc-50">
                    {pkg.coins}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">coins</div>
                </div>
                <div className="mb-6 text-center">
                  <div className="text-2xl font-semibold text-black dark:text-zinc-50">
                    ₹{pkg.amount}
                  </div>
                  {pkg.discount > 0 && (
                    <div className="text-xs text-zinc-500 line-through dark:text-zinc-400">
                      ₹{pkg.coins}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handlePurchase(pkg.coins, pkg.amount)}
                  disabled={loading}
                  className="w-full rounded-full bg-black py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                >
                  {loading ? "Processing..." : "Buy Now"}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
              Payment Information
            </h2>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>• Secure payment powered by Razorpay</li>
              <li>• Coins are added instantly after successful payment</li>
              <li>• All transactions are encrypted and secure</li>
              <li>• For any issues, contact support</li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}
