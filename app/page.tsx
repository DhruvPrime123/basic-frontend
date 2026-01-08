import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 px-8 py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">
          Payment Transfer Portal
        </h1>
        <p className="max-w-2xl text-xl leading-8 text-zinc-600 dark:text-zinc-400">
          A secure and fast way to transfer coins between users. Start with 100
          free coins and purchase more as needed.
        </p>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/sign-up"
            className="flex h-12 items-center justify-center rounded-full bg-black px-8 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-full border border-solid border-zinc-300 px-8 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
              100 Free Coins
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Every new user starts with 100 coins to get started
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
              Real-time Transfers
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Transfer coins instantly with WebSocket technology
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
              Secure Payments
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Purchase more coins securely via Razorpay
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
