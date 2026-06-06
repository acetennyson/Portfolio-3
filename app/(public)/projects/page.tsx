"use client"

import { useState, useMemo } from "react";
import { getProjects } from "../../../firebase/firestore";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 6;

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getProjects().then(setAllProjects);
  }, []);

  const totalPages = Math.max(1, Math.ceil(allProjects.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const offset = safePage * PER_PAGE;
  const visible = allProjects.slice(offset, offset + PER_PAGE);

  const pages = useMemo(() => {
    const p: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) p.push(i);
    } else {
      p.push(0);
      if (safePage > 2) p.push("...");
      const start = Math.max(1, safePage - 1);
      const end = Math.min(totalPages - 2, safePage + 1);
      for (let i = start; i <= end; i++) p.push(i);
      if (safePage < totalPages - 3) p.push("...");
      p.push(totalPages - 1);
    }
    return p;
  }, [safePage, totalPages]);

  const go = (p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1)));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 grad-text">
          Port<span style={{ color: "var(--accent)" }}>folio</span>
        </h1>
        <p style={{ color: "var(--fg-muted)" }} className="max-w-2xl mx-auto">
          Explore all of my past and current projects below.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project: any) => (
          <div key={project.id}
            className="group relative overflow-hidden rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="aspect-video relative overflow-hidden" style={{ background: "var(--bg-card-hover)" }}>
              {project.coverImage ? (
                <img src={project.coverImage} alt={project.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-3xl font-black select-none grad-text opacity-20">
                  {String(visible.indexOf(project) + 1 + offset).padStart(2, "0")}
                </div>
              )}
              {project.featured && (
                <span className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold text-white btn-grad">
                  Featured
                </span>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg" style={{ color: "var(--fg)" }}>{project.title}</h3>
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--fg-muted)" }}>{project.description}</p>
              </div>
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies?.slice(0, 4).map((tech: string) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--bg-card-hover)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-card-hover)", color: "var(--fg-muted)" }}>
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-bold mt-3 transition-opacity hover:opacity-70"
                    style={{ color: "var(--accent)" }}>
                    View Project
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" />
                      <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {allProjects.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-xl" style={{ background: "var(--bg-card)", border: "1px dashed var(--border)", color: "var(--fg-muted)" }}>
            No projects found. Check back later!
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-1">
            <button onClick={() => go(safePage - 1)} disabled={safePage === 0}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20 enabled:hover:scale-110"
              style={{ color: "var(--fg-muted)" }}>
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {pages.map((p, i) =>
                p === "..." ? (
                  <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-xs" style={{ color: "var(--fg-muted)" }}>···</span>
                ) : (
                  <button key={p} onClick={() => go(p)}
                    className="w-9 h-9 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: p === safePage ? "var(--accent)" : "transparent",
                      color: p === safePage ? "#fff" : "var(--fg-muted)",
                    }}>
                    {p + 1}
                  </button>
                )
              )}
            </div>

            <button onClick={() => go(safePage + 1)} disabled={safePage >= totalPages - 1}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20 enabled:hover:scale-110"
              style={{ color: "var(--fg-muted)" }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
            Page {safePage + 1} of {totalPages}
            <span className="mx-1.5">·</span>
            {allProjects.length} projects
          </p>
        </div>
      )}
    </div>
  );
}
