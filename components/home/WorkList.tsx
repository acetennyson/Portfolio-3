"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../motion/Reveal";
import { subscribe } from "../../lib/ticker";

export type WorkItem = { id: string; title: string; blurb?: string; tags: string[]; year?: string; cover?: string; href: string; external: boolean };

/** Full-width case-study rows. On hover-capable devices a cover preview follows the cursor. */
export default function WorkList({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const prev = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const listRef = useRef<HTMLDivElement>(null);
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover.current) return;
    const move = (e: PointerEvent) => { target.current.x = e.clientX; target.current.y = e.clientY; };
    window.addEventListener("pointermove", move, { passive: true });
    const unsub = subscribe(() => {
      const el = prev.current;
      if (!el) return;
      pos.current.x += (target.current.x - pos.current.x) * 0.14;
      pos.current.y += (target.current.y - pos.current.y) * 0.14;
      const vx = (target.current.x - pos.current.x) * 0.04; // tilt with velocity
      el.style.transform = `translate3d(${pos.current.x + 28}px, ${pos.current.y - 110}px, 0) rotate(${Math.max(-8, Math.min(8, vx))}deg)`;
    });
    return () => { window.removeEventListener("pointermove", move); unsub(); };
  }, []);

  return (
    <>
      <div ref={listRef} className="n-work-list" onMouseLeave={() => setActive(null)}>
        {items.map((it, i) => {
          const inner = (
            <>
              <span className="n-work-idx label">{String(i + 1).padStart(2, "0")}</span>
              <span className="n-work-main">
                <span className="n-work-title">{it.title}</span>
                {it.blurb && <span className="n-work-blurb">{it.blurb}</span>}
                {it.cover && <img className="n-work-thumb" src={it.cover} alt="" loading="lazy" />}
              </span>
              <span className="n-work-tags label">{it.tags.map((t) => <span key={t}>{t}</span>)}</span>
              <span className="n-work-year label">{it.year}</span>
              <ArrowUpRight className="n-work-arrow" size={34} strokeWidth={1.4} aria-hidden />
            </>
          );
          return (
            <Reveal key={it.id} y={50} delay={i * 60}>
              {it.external ? (
                <a className="n-work-row" href={it.href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>{inner}</a>
              ) : (
                <Link className="n-work-row" href={it.href} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>{inner}</Link>
              )}
            </Reveal>
          );
        })}
      </div>

      <div ref={prev} className={`n-preview ${active !== null ? "is-on" : ""}`} aria-hidden>
        <div className="n-preview-inner">
          {items.map((it, i) => (
            it.cover ? <img key={it.id} src={it.cover} alt="" className={i === active ? "on" : ""} /> : <span key={it.id} className={`n-preview-ph ${i === active ? "on" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
          ))}
        </div>
      </div>
    </>
  );
}
