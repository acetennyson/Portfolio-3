"use client";

import React from "react";
import { usePostOptional } from "./PostContext";

export function EmailForm({ campaign, placeholder = "Enter your email" }: { campaign?: string; placeholder?: string }) {
  const post = usePostOptional();
  // Use campaign if provided, otherwise fall back to post slug, or default to 'general'
  const subscribeCampaign = campaign || post?.slug || 'general';
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, campaign: subscribeCampaign }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
      
      // Reset success state after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-8 p-6 rounded bg-[var(--bg-card)] border border-[var(--border)]">
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
          className="px-6 py-2 rounded bg-[var(--accent)] text-[var(--on-accent)] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {status === "loading" ? "Sending..." : status === "success" ? "Subscribed!" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">{errorMessage || "Something went wrong. Please try again."}</p>
      )}
      {status === "success" && (
        <p className="mt-2 text-sm text-[var(--accent)]">Successfully subscribed! Check your email.</p>
      )}
    </form>
  );
}
