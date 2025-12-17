export default function AboutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl px-8 py-16 bg-white dark:bg-black">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          About Us
        </h1>
        <div className="flex flex-col gap-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          <p>
            Welcome to our application. We are dedicated to building great
            software that helps people accomplish their goals.
          </p>
          <p>
            Our team is passionate about creating intuitive, performant, and
            accessible web experiences using modern technologies like Next.js
            and React.
          </p>
          <p>
            If you have any questions or feedback, we&apos;d love to hear from
            you.
          </p>
        </div>
        <div className="mt-12">
          <a
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
}
