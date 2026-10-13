"use client";
import { useMemo, useState } from "react";
import WorkList from "../home/WorkList";
import type { BlogView } from "../../lib/blog";
import { blogWorkItem } from "../../lib/blog";

export default function BlogIndex({ items }: { items: BlogView[] }) {
  const [tag, setTag] = useState("All");

  const tags = useMemo(() => ["All", ...Array.from(new Set(items.flatMap((i) => i.tags)))], [items]);
  const filtered = useMemo(() => (tag === "All" ? items : items.filter((i) => i.tags.includes(tag))), [items, tag]);
  const workItems = useMemo(() => filtered.map(blogWorkItem), [filtered]);

  return (
    <div>
      {tags.length > 2 && (
        <div className="n-chips" role="group" aria-label="Filter by tag">
          {tags.map((t) => (
            <button key={t} type="button" aria-pressed={t === tag} className={t === tag ? "is-on" : ""} onClick={() => setTag(t)}>{t}</button>
          ))}
        </div>
      )}

      {workItems.length ? (
        <WorkList key={tag} items={workItems} />
      ) : (
        <p className="n-empty">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}
