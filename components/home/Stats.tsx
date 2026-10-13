"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/motion";

type Stat = { value: string; label: string };
const split = (v: string) => { const m = v.match(/^(\d+)(.*)$/); return m ? { n: parseInt(m[1], 10), suffix: m[2] } : { n: 0, suffix: v }; };

/** Count-up numbers that run once when scrolled into view. */
export default function Stats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const nums = Array.from(root.querySelectorAll<HTMLElement>("[data-n]"));
    if (prefersReducedMotion()) { nums.forEach((el) => (el.textContent = el.dataset.n!)); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1900;
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        const eased = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        nums.forEach((el) => (el.textContent = String(Math.round(Number(el.dataset.n) * eased))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(root);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className="n-stats">
      {stats.map((s) => {
        const { n, suffix } = split(s.value);
        return (
          <div key={s.label} className="n-stat">
            <div className="n-stat-num"><span data-n={n}>0</span><em className="font-serif italic font-normal">{suffix}</em></div>
            <p className="label">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}
