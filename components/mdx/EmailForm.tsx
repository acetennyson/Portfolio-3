"use client";

import React from "react";

// Custom email collection form (needs client state, so it lives in its own
// "use client" module — keep MDXComponents.tsx itself free of "use client"
// so it stays a plain, server-resolvable object for next-mdx-remote/rsc).
export function EmailForm({ campaign, placeholder = "Enter your email" }: { campaign: string; placeholder?: string }) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Implement your email collection logic
    // Could integrate with Firebase, Mailchimp, ConvertKit, etc.
    console.log("Email submitted:", { email, campaign });

    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-6 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === "loading" || status === "success"}
          className="flex-1 px-4 py-2 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="px-6 py-2 rounded bg-[var(--accent)] text-[var(--accent-fg)] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {status === "loading" ? "Sending..." : status === "success" ? "Subscribed!" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
