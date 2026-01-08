"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { io, Socket } from "socket.io-client";

export default function BalanceDisplay() {
  const { user } = useUser();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch initial balance
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/user/balance");
        const data = await response.json();
        setBalance(data.coins);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setLoading(false);
      }
    };

    fetchBalance();

    // Connect to WebSocket
    const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("WebSocket connected");
      socketInstance.emit("join", user.id);
    });

    socketInstance.on("balance-update", (data: { balance: number }) => {
      console.log("Balance updated:", data.balance);
      setBalance(data.balance);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Your Balance
      </h2>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-black dark:text-zinc-50">
          {balance !== null ? balance : "—"}
        </span>
        <span className="text-xl text-zinc-600 dark:text-zinc-400">coins</span>
      </div>
    </div>
  );
}
