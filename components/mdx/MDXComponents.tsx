"use client";

import React from "react";

// Custom MDX components that can be used in blog posts
export const MDXComponents = {
  // Custom email collection form
  EmailForm: ({ campaign, placeholder = "Enter your email" }: { campaign: string; placeholder?: string }) => {
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
  },

  // Custom callout/alert boxes
  Callout: ({ type = "info", children }: { type?: "info" | "warning" | "error" | "success"; children: React.ReactNode }) => {
    const styles = {
      info: "border-blue-500 bg-blue-500/10",
      warning: "border-yellow-500 bg-yellow-500/10",
      error: "border-red-500 bg-red-500/10",
      success: "border-green-500 bg-green-500/10",
    };

    const icons = {
      info: "ℹ️",
      warning: "⚠️",
      error: "❌",
      success: "✅",
    };

    return (
      <div className={`my-6 p-4 border-l-4 rounded-r ${styles[type]}`}>
        <div className="flex gap-3">
          <span className="text-xl leading-none">{icons[type]}</span>
          <div className="flex-1 space-y-2">{children}</div>
        </div>
      </div>
    );
  },

  // Two-column layout
  TwoColumn: ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="my-8 grid md:grid-cols-2 gap-6">
        {children}
      </div>
    );
  },

  // Column wrapper (for use inside TwoColumn)
  Column: ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
      <div className={`p-6 rounded-lg bg-[var(--surface)] border border-[var(--border)] ${className}`}>
        {children}
      </div>
    );
  },

  // Code block with title
  CodeBlock: ({ title, children, language }: { title?: string; children: React.ReactNode; language?: string }) => {
    return (
      <div className="my-6 rounded-lg overflow-hidden border border-[var(--border)]">
        {title && (
          <div className="px-4 py-2 bg-[var(--surface)] border-b border-[var(--border)] font-mono text-sm text-[var(--fg-muted)]">
            {title}
          </div>
        )}
        <pre className="p-4 overflow-x-auto bg-[var(--bg)]">
          <code className={language ? `language-${language}` : ""}>{children}</code>
        </pre>
      </div>
    );
  },

  // Image with caption
  Figure: ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => {
    return (
      <figure className="my-8">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="rounded-xl w-full object-cover border border-[var(--border)]"
        />
        {caption && (
          <figcaption className="text-sm text-center mt-3 text-[var(--fg-muted)]">{caption}</figcaption>
        )}
      </figure>
    );
  },

  // Video embed
  Video: ({ src, title = "Video" }: { src: string; title?: string }) => {
    return (
      <div className="my-8 aspect-video rounded-xl overflow-hidden border border-[var(--border)]">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  },

  // Highlight box for important text
  Highlight: ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="my-6 p-6 rounded-lg bg-[var(--accent)]/10 border-2 border-[var(--accent)]">
        <div className="text-lg font-medium">{children}</div>
      </div>
    );
  },
};
