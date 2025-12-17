export default function ContactPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl px-8 py-16 bg-white dark:bg-black">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Contact Us
        </h1>
        <div className="flex flex-col gap-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          <p>
            We&apos;d love to hear from you. Get in touch with us using the
            information below or send us a message.
          </p>
        </div>
        <form className="mt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="h-12 rounded-lg border border-black/[.08] bg-transparent px-4 text-black dark:border-white/[.145] dark:text-zinc-50"
              placeholder="Your name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="h-12 rounded-lg border border-black/[.08] bg-transparent px-4 text-black dark:border-white/[.145] dark:text-zinc-50"
              placeholder="your@email.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="rounded-lg border border-black/[.08] bg-transparent px-4 py-3 text-black dark:border-white/[.145] dark:text-zinc-50"
              placeholder="Your message"
            />
          </div>
          <button
            type="submit"
            className="h-12 rounded-full bg-foreground px-5 font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Send Message
          </button>
        </form>
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
