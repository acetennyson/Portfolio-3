"use client";
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { prefersReducedMotion, whenReady } from "../../lib/motion";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    const play = () =>
      animate(el, { opacity: [0, 1], translateY: [y, 0], duration: 1100, delay, ease: "outExpo" });

    whenReady().then(() => {
      if (cancelled) return;
      if (immediate) return play();
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            play();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(el);
    });
    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, [delay, y, immediate]);

  return (
    <div ref={ref} className={`rv ${className}`}>
      {children}
    </div>
  );
}
