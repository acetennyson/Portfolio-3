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
  /** ISO 8601 publish time (what search engines want), undefined if the post has no usable date. */
  iso?: string;
  /** ISO 8601 last-modified time, if the post records one. */
  updatedIso?: string;
  cover?: string;
};

/** Firestore Timestamp | Date | {seconds} | ISO string -> Date (or null). */
export function toDate(value: any): Date | null {
  try {
    if (!value) return null;
    if (typeof value.toDate === "function") return value.toDate();
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
    if (typeof value === "string" || typeof value === "number") {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
  } catch {}
  return null;
}

/** Strip markdown / MDX / HTML down to readable plain text. */
export function plainText(content: unknown): string {
  if (typeof content !== "string") return "";
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-+*]\s+/gm, "")
    .replace(/[*_`>~|]/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Meta description: the excerpt if there is one, else the start of the post, trimmed to ~155 chars on a word boundary. */
export function describe(excerpt: string | undefined, content: unknown, fallback: string, max = 155): string {
  const text = (excerpt && excerpt.trim()) || plainText(content) || fallback;
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 60)).replace(/[\s.,;:!-]+$/, "")}…`;
}

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
    iso: toDate(b.createdAt)?.toISOString(),
    updatedIso: toDate(b.updatedAt)?.toISOString(),
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
