"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Transaction } from "@/types";

export default function TransactionHistory() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/user/transactions");
        const data = await response.json();
        setTransactions(data.transactions);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
        Recent Transactions
      </h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black dark:text-zinc-50">
                  {transaction.type === "purchase"
                    ? "Purchased Coins"
                    : transaction.fromUserId === user?.id
                    ? "Sent to user"
                    : "Received from user"}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(transaction.timestamp).toLocaleString()}
                </span>
              </div>
              <span
                className={`text-sm font-semibold ${
                  transaction.type === "purchase" || transaction.toUserId === user?.id
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {transaction.type === "purchase" || transaction.toUserId === user?.id ? "+" : "-"}
                {transaction.amount} coins
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
