import type { WorkItem } from "../components/home/WorkList";

/** Plain, serialisable view of a blog post (Firestore Timestamps etc. never reach client components). */
export type BlogView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  dateLabel: string;
  cover?: string;
};

export function formatDate(date: any): string {
  try {
    if (date?.toDate) return new Date(date.toDate()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    if (date instanceof Date) return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {}
  return "Just now";
}

function shortDate(date: any): string {
  try {
    if (date?.toDate) return new Date(date.toDate()).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    if (date instanceof Date) return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  } catch {}
  return "";
}

export function blogView(b: any): BlogView {
  return {
    id: String(b.id),
    slug: b.slug,
    title: b.title || "Untitled",
    excerpt: b.excerpt || "",
    tags: Array.isArray(b.tags) ? b.tags : [],
    date: formatDate(b.createdAt),
    dateLabel: shortDate(b.createdAt),
    cover: b.coverImage || undefined,
  };
}

export function blogWorkItem(v: BlogView): WorkItem {
  return { id: v.id, title: v.title, blurb: v.excerpt, tags: v.tags, year: v.dateLabel, cover: v.cover, href: `/blog/${v.slug}`, external: false };
}

/** Rough reading time from plain text or HTML content. */
export function readingTime(content: unknown): string {
  const text = typeof content === "string" ? content.replace(/<[^>]*>/g, " ") : "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}
