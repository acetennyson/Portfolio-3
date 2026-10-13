"use client";
import { useEffect, useRef } from "react";
import { subscribe } from "../../lib/ticker";
import { prefersReducedMotion } from "../../lib/motion";

type Step = { step: string; title: string; desc: string };

/** Animated process list: a line fills with scroll and each step lights up as it passes mid-screen. */
export default function Process({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".n-step"));
    if (prefersReducedMotion()) { rows.forEach((r) => (r.dataset.active = "true")); el.style.setProperty("--p", "1"); return; }
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(el);
    let lastP = -1;
    const unsub = subscribe(() => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const mid = vh * 0.55;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      if (Math.abs(p - lastP) > 0.002) { lastP = p; el.style.setProperty("--p", p.toFixed(3)); }
      rows.forEach((row) => {
        const rr = row.getBoundingClientRect();
        const on = rr.top < mid;
        const v = on ? "true" : "false";
        if (row.dataset.active !== v) row.dataset.active = v;
      });
    });
    return () => { io.disconnect(); unsub(); };
  }, []);

  return (
    <div ref={root} className="n-process">
      {steps.map((s) => (
        <div key={s.step} className="n-step" data-active="false">
          <span className="n-step-num font-serif italic">{s.step}</span>
          <h3 className="n-step-title">{s.title}</h3>
          <p className="n-step-desc">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
