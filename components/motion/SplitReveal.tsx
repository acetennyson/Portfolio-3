"use client";
import { useEffect, useMemo, useRef } from "react";
import { animate, stagger } from "animejs";
import { onEnterView, prefersReducedMotion, whenReadySafe } from "../../lib/motion";

type Props = {
  text: string; // "I build things *people love*"  -> *x* renders as italic serif accent
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  /** wait for the loader, then play on mount instead of on scroll-into-view */
  immediate?: boolean;
};

type Word = { w: string; em: boolean; br?: boolean };

function parse(text: string): Word[] {
  const out: Word[] = [];
  text.split("\n").forEach((line, li, lines) => {
    line.split(/(\*[^*]+\*)/g).forEach((seg) => {
      if (!seg) return;
      const em = seg.startsWith("*") && seg.endsWith("*");
      const clean = em ? seg.slice(1, -1) : seg;
      clean.split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, em }));
    });
    if (li < lines.length - 1) out.push({ w: "", em: false, br: true });
  });
  return out;
}

export default function SplitReveal({
  text,
  as: Tag = "div",
  className = "",
  delay = 0,
  stagger: step = 70,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const words = useMemo(() => parse(text), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = Array.from(el.querySelectorAll<HTMLElement>(".sr-i"));

    if (prefersReducedMotion()) {
      inners.forEach((n) => (n.style.transform = "none"));
      return;
    }

    let cancelled = false;
    let stop: (() => void) | null = null;

    const play = (alreadyPassed = false) => {
      if (cancelled) return;
      if (alreadyPassed) {
        inners.forEach((n) => (n.style.transform = "none"));
        return;
      }
      animate(inners, {
        translateY: ["112%", "0%"],
        duration: 1100,
        delay: stagger(step, { start: delay }),
        ease: "outExpo",
      });
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
  }, [delay, step, immediate, text]);

  return (
    <Tag ref={ref as never} className={className} aria-label={text.replace(/\*/g, "").replace(/\n/g, " ")}>
      {words.map((x, i) =>
        x.br ? (
          <br key={i} aria-hidden />
        ) : (
          <span key={i} aria-hidden>
            <span className="sr-w">
              <span className={`sr-i ${x.em ? "font-serif italic font-normal tracking-normal" : ""}`}>{x.w}</span>
            </span>{" "}
          </span>
        )
      )}
    </Tag>
  );
}
