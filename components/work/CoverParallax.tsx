"use client";
import { useEffect, useRef } from "react";
import { subscribe } from "../../lib/ticker";
import { prefersReducedMotion, whenReady } from "../../lib/motion";
import PreviewMedia from "./PreviewMedia";

/** Large cover: curtain reveal on load, gentle parallax + scale while scrolling. */
export default function CoverParallax({ src, title, label, liveUrl, embed }: { src?: string; title: string; label: string; liveUrl?: string; embed?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current, im = img.current;
    if (!w || !im) return;
    if (prefersReducedMotion()) { w.classList.add("in"); return; }
    let cancelled = false;
    whenReady().then(() => { if (!cancelled) requestAnimationFrame(() => w.classList.add("in")); });
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(w);
    const unsub = subscribe(() => {
      if (!visible || embed) return;
      const r = w.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      im.style.transform = `translate3d(0, ${(p - 0.5) * -9}%, 0) scale(${1.14 - p * 0.06})`;
    });
    return () => { cancelled = true; io.disconnect(); unsub(); };
  }, [embed]);

  return (
    <div ref={wrap} className="cs-cover">
      <div ref={img} className={`cs-cover-img ${embed ? "is-live" : ""}`}>
        <PreviewMedia liveUrl={liveUrl} cover={src} title={title} label={label} embed={embed} />
      </div>
    </div>
  );
}
