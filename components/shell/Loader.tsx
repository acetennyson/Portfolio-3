"use client";
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { lockScroll, prefersReducedMotion } from "../../lib/motion";
import { siteConfig } from "../../lib/data";

function finish() {
  document.documentElement.dataset.loader = "done";
  try { sessionStorage.setItem("loaded", "1"); } catch {}
  window.dispatchEvent(new Event("app:ready"));
}

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.loader === "done") return;

    if (prefersReducedMotion()) { finish(); return; }

    lockScroll(true);
    let released = false;
    const release = () => { if (!released) { released = true; lockScroll(false); } };
    // Safety net: never trap the visitor behind the loader.
    const failsafe = window.setTimeout(() => { finish(); release(); }, 6000);

    try {
      const state = { v: 0 };
      animate(state, {
        v: 100,
        duration: 1900,
        ease: "inOutQuad",
        onUpdate: () => {
          const n = Math.round(state.v);
          if (num.current) num.current.textContent = String(n).padStart(3, "0");
          if (bar.current) bar.current.style.transform = `scaleX(${n / 100})`;
        },
        onComplete: () => {
          if (!root.current) return;
          animate(root.current, {
            translateY: ["0%", "-100%"],
            duration: 1000,
            ease: "inOutExpo",
            onComplete: () => { window.clearTimeout(failsafe); finish(); release(); },
          });
          // Let the hero start rising while the panel is still lifting.
          window.setTimeout(() => window.dispatchEvent(new Event("app:ready")), 450);
        },
      });
    } catch {
      window.clearTimeout(failsafe); finish(); release();
    }

    return () => { window.clearTimeout(failsafe); release(); };
  }, []);

  return (
    <div ref={root} className="loader" aria-hidden role="presentation">
      <div className="loader-top">
        <span>{siteConfig.name}</span>
        <span>Portfolio &mdash; {new Date().getFullYear()}</span>
      </div>
      <div className="loader-count">
        <span ref={num}>000</span>
        <span className="loader-pct">%</span>
      </div>
      <div className="loader-bar"><div ref={bar} /></div>
    </div>
  );
}
