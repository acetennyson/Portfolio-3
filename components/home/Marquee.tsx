"use client";
import { useEffect, useRef } from "react";
import { subscribe } from "../../lib/ticker";
import { prefersReducedMotion } from "../../lib/motion";

/** Infinite marquee whose speed is pushed by scroll velocity. */
export default function Marquee({ items, speed = 0.06, reverse = false, outline = false }: { items: string[]; speed?: number; reverse?: boolean; outline?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current, t = track.current;
    if (!w || !t || prefersReducedMotion()) return;
    let half = t.scrollWidth / 2;
    const ro = new ResizeObserver(() => (half = t.scrollWidth / 2));
    ro.observe(t);
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(w);
    let x = 0, lastY = window.scrollY, boost = 0;
    const dir = reverse ? 1 : -1;
    const unsub = subscribe((_t, dt) => {
      const y = window.scrollY;
      boost += (Math.min(Math.abs(y - lastY), 80) * 0.02 - boost) * 0.1; lastY = y;
      if (!visible) return;
      x += dir * (speed + boost * 0.12) * dt;
      if (x <= -half) x += half; else if (x > 0) x -= half;
      t.style.transform = `translate3d(${x}px,0,0)`;
    });
    return () => { ro.disconnect(); io.disconnect(); unsub(); };
  }, [speed, reverse]);

  const row = items.map((s, i) => (
    <span key={i} className="n-marq-item">{s}<i aria-hidden /></span>
  ));
  return (
    <div ref={wrap} className={`n-marq ${outline ? "is-outline" : ""}`} aria-hidden>
      <div ref={track} className="n-marq-track">{row}{row}</div>
    </div>
  );
}
