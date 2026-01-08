"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function TransferForm({ onTransferSuccess }: { onTransferSuccess?: () => void }) {
  const { user } = useUser();
  const [toEmail, setToEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toEmail,
          amount: parseInt(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Transfer completed successfully!" });
        setToEmail("");
        setAmount("");
        if (onTransferSuccess) {
          onTransferSuccess();
        }
      } else {
        setMessage({ type: "error", text: data.error || "Transfer failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to process transfer" });
      console.error("Transfer error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
        Transfer Coins
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="toEmail"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Recipient Email
          </label>
          <input
            id="toEmail"
            type="email"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            required
            className="h-12 rounded-lg border border-zinc-300 bg-transparent px-4 text-black outline-none transition-colors focus:border-black dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-400"
            placeholder="recipient@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="amount"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Amount (coins)
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="h-12 rounded-lg border border-zinc-300 bg-transparent px-4 text-black outline-none transition-colors focus:border-black dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-400"
            placeholder="100"
          />
        </div>
        {message && (
          <div
            className={`rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 items-center justify-center rounded-full bg-black px-5 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          {loading ? "Processing..." : "Send Coins"}
        </button>
      </form>
    </div>
  );
}
