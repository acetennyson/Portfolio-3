"use client";
import { useEffect, useMemo, useRef } from "react";
import { subscribe } from "../../lib/ticker";
import { prefersReducedMotion } from "../../lib/motion";

type W = { w: string; em: boolean };
const parse = (text: string): W[] => {
  const out: W[] = [];
  text.split(/(\*[^*]+\*)/g).forEach((seg) => {
    if (!seg) return;
    const em = seg.startsWith("*") && seg.endsWith("*");
    (em ? seg.slice(1, -1) : seg).split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, em }));
  });
  return out;
};

/** Words light up one by one as the block scrolls through the viewport (scroll-scrubbed, reversible). */
export default function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = useMemo(() => parse(text), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>(".sw-w"));
    if (prefersReducedMotion()) { nodes.forEach((n) => (n.style.opacity = "1")); return; }

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "20% 0px" });
    io.observe(el);
    const last = new Float32Array(nodes.length).fill(-1);
    const unsub = subscribe(() => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top enters at ~85% of the viewport, 1 when its bottom reaches ~45%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      const n = nodes.length;
      nodes.forEach((node, i) => {
        const wp = Math.min(1, Math.max(0, p * (n + 5) - i) / 5);
        const o = 0.12 + 0.88 * wp;
        if (Math.abs(o - last[i]) > 0.01) { last[i] = o; node.style.opacity = o.toFixed(3); }
      });
    });
    return () => { io.disconnect(); unsub(); };
  }, [words]);

  return (
    <h2 ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      {words.map((x, i) => (
        <span key={i} aria-hidden>
          <span className={`sw-w ${x.em ? "font-serif italic font-normal" : ""}`} style={{ opacity: 0.12 }}>{x.w}</span>{" "}
        </span>
      ))}
    </h2>
  );
}
