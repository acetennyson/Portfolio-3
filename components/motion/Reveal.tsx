"use client";
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { onEnterView, prefersReducedMotion, whenReadySafe } from "../../lib/motion";

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

    // `.js .rv { opacity: 0 }` hides us; this is the one place that undoes it.
    const show = () => {
      el.style.opacity = "1";
      el.style.transform = "";
    };

    if (prefersReducedMotion()) {
      show();
      return;
    }

    let cancelled = false;
    let stop: (() => void) | null = null;

    const play = (alreadyPassed = false) => {
      if (cancelled) return;
      if (alreadyPassed) return show();
      // Big blocks (whole articles) fade only: sliding 600px of text looks broken
      // and a lingering transform would trap sticky/fixed descendants.
      const tall = el.offsetHeight > window.innerHeight * 1.5;
      try {
        animate(el, {
          opacity: [0, 1],
          ...(tall ? {} : { translateY: [y, 0] }),
          duration: tall ? 600 : 1100,
          delay,
          ease: "outExpo",
          onComplete: show, // drop the leftover transform, pin opacity to 1
        });
      } catch {
        show(); // animation failed -> never leave content invisible
      }
    };

    whenReadySafe().then(() => {
      if (cancelled) return;
      if (immediate) return play();
      stop = onEnterView(el, play);
    });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, [delay, y, immediate]);

  return (
    <div ref={ref} className={`rv ${className}`}>
      {children}
    </div>
  );
}
