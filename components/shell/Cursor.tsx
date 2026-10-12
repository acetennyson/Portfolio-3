"use client";
import { useEffect, useRef } from "react";
import { subscribe } from "../../lib/ticker";
import { prefersReducedMotion } from "../../lib/motion";

const HOVER_SEL = "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const d = dot.current, r = ring.current;
    if (!fine || prefersReducedMotion() || !d || !r) return;

    document.documentElement.classList.add("has-cursor");
    let mx = -100, my = -100, rx = -100, ry = -100, scale = 1, targetScale = 1, shown = false;

    const move = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; rx = mx; ry = my; d.style.opacity = "1"; r.style.opacity = "1"; }
      targetScale = (e.target as Element | null)?.closest?.(HOVER_SEL) ? 2.4 : 1;
    };
    const out = () => { d.style.opacity = "0"; r.style.opacity = "0"; shown = false; };
    const down = () => { targetScale *= 0.8; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", out);
    window.addEventListener("pointerdown", down);

    const unsub = subscribe(() => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      scale += (targetScale - scale) * 0.18;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    });

    return () => {
      unsub();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", out);
      window.removeEventListener("pointerdown", down);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden className="cursor-ring" />
      <div ref={dot} aria-hidden className="cursor-dot" />
    </>
  );
}
