import React from "react";
import { EmailForm } from "./EmailForm";

// Custom MDX components that can be used in blog posts.
//
// IMPORTANT: this file must NOT have a "use client" directive at the top.
// next-mdx-remote/rsc's <MDXRemote> compiles and renders MDX on the server,
// and resolves these components by destructuring them straight off this
// object at render time. If this module is marked "use client", Next
// treats every export from it (including this plain object) as a client
// reference, and the individual component properties no longer resolve on
// the server — which surfaces as "Expected component `X` to be defined"
// errors for whichever custom tag is used first in a post.
//
// Only EmailForm needs client-side state (useState), so it lives in its
// own "use client" file (./EmailForm.tsx) and is imported here as a plain
// value.
export const MDXComponents = {
  // Custom email collection form
  EmailForm,

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
