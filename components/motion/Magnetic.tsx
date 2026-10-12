"use client";
import { useEffect, useRef } from "react";
import { subscribe } from "../../lib/ticker";
import { prefersReducedMotion } from "../../lib/motion";

/** Wraps a child and pulls it toward the pointer. Disabled on touch and reduced motion. */
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let tx = 0, ty = 0, x = 0, y = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
    };
    const leave = () => { tx = 0; ty = 0; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    const unsub = subscribe(() => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      if (Math.abs(x - tx) < 0.05 && Math.abs(y - ty) < 0.05 && tx === 0 && ty === 0) {
        if (x !== 0 || y !== 0) { x = 0; y = 0; el.style.transform = ""; }
        return;
      }
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    });

    return () => {
      unsub();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.style.transform = "";
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
