import { staticProjects } from "./data";
import type { WorkItem } from "../components/home/WorkList";

/** Plain, serialisable view of a project (Firestore Timestamps etc. never reach client components). */
export type ProjectView = {
  id: string; title: string; description: string; tags: string[]; year: string; cover?: string;
  liveUrl?: string; githubUrl?: string; role?: string; client?: string; status?: string; featured: boolean;
  blocks: any[]; gallery: string[];
};

const dateStr = (d: any): string => {
  try {
    if (d?.toDate) return new Date(d.toDate()).getFullYear().toString();
    if (d instanceof Date) return d.getFullYear().toString();
    const m = String(d || "").match(/\d{4}/);
    return m ? m[0] : "";
  } catch { return ""; }
};

export function projectView(p: any): ProjectView {
  const url = (u: any) => (typeof u === "string" && u && u !== "#" ? u : undefined);
  return {
    id: String(p.id),
    title: p.title || "Untitled",
    description: p.description || "",
    tags: Array.isArray(p.technologies) ? p.technologies : [],
    year: p.year ? String(p.year) : dateStr(p.createdAt),
    cover: p.coverImage || undefined,
    liveUrl: url(p.liveUrl),
    githubUrl: url(p.githubUrl),
    role: p.role || undefined,
    client: p.client || undefined,
    status: p.status || undefined,
    featured: !!p.featured,
    blocks: Array.isArray(p.blocks) ? p.blocks : [],
    gallery: Array.isArray(p.gallery) ? p.gallery.filter((g: any) => typeof g === "string") : [],
  };
}

export function workItem(v: ProjectView): WorkItem {
  return { id: v.id, title: v.title, blurb: v.description, tags: v.tags, year: v.year, cover: v.cover, live: v.liveUrl, href: `/projects/${v.id}`, external: false };
}

/** Firebase first (featured first), static fallback when the collection is empty. */
export function resolveProjects(live: any[]): ProjectView[] {
  const list = (live.length ? live : staticProjects).map(projectView);
  return list.sort((a, b) => Number(b.featured) - Number(a.featured));
}
