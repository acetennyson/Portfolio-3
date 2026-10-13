"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WorkList, { type WorkItem } from "../home/WorkList";
import { getLenis } from "../../lib/motion";

const PER_PAGE = 6; // same page size as the previous projects page

export default function ProjectIndex({ items }: { items: WorkItem[] }) {
  const [tag, setTag] = useState("All");
  const [page, setPage] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const tags = useMemo(() => ["All", ...Array.from(new Set(items.flatMap((i) => i.tags)))], [items]);
  const filtered = useMemo(() => (tag === "All" ? items : items.filter((i) => i.tags.includes(tag))), [items, tag]);

  // Pagination logic kept from the original page
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const offset = safePage * PER_PAGE;
  const visible = filtered.slice(offset, offset + PER_PAGE);
  const pages = useMemo(() => {
    const p: (number | "...")[] = [];
    if (totalPages <= 5) { for (let i = 0; i < totalPages; i++) p.push(i); }
    else {
      p.push(0);
      if (safePage > 2) p.push("...");
      const start = Math.max(1, safePage - 1), end = Math.min(totalPages - 2, safePage + 1);
      for (let i = start; i <= end; i++) p.push(i);
      if (safePage < totalPages - 3) p.push("...");
      p.push(totalPages - 1);
    }
    return p;
  }, [safePage, totalPages]);
  const go = (p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1)));

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = topRef.current;
    if (!el) return;
    const l = getLenis();
    if (l) l.scrollTo(el, { offset: -110 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [safePage, tag]);

  return (
    <div ref={topRef}>
      {tags.length > 2 && (
        <div className="n-chips" role="group" aria-label="Filter by technology">
          {tags.map((t) => (
            <button key={t} type="button" aria-pressed={t === tag} className={t === tag ? "is-on" : ""} onClick={() => { setTag(t); setPage(0); }}>{t}</button>
          ))}
        </div>
      )}

      {visible.length ? (
        <WorkList key={`${tag}-${safePage}`} items={visible} startIndex={offset} />
      ) : (
        <p className="n-empty">No projects found. Check back later!</p>
      )}

      {totalPages > 1 && (
        <nav className="n-pager" aria-label="Pagination">
          <button onClick={() => go(safePage - 1)} disabled={safePage === 0} aria-label="Previous page"><ChevronLeft size={16} /></button>
          {pages.map((p, i) => p === "..." ? <span key={`d${i}`} aria-hidden>···</span> : (
            <button key={p} onClick={() => go(p)} className={p === safePage ? "is-on" : ""} aria-current={p === safePage ? "page" : undefined}>{p + 1}</button>
          ))}
          <button onClick={() => go(safePage + 1)} disabled={safePage >= totalPages - 1} aria-label="Next page"><ChevronRight size={16} /></button>
          <span className="label n-pager-note">Page {safePage + 1} of {totalPages} · {filtered.length} projects</span>
        </nav>
      )}
    </div>
  );
}
