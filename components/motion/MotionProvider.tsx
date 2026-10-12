"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { subscribe } from "../../lib/ticker";
import { setLenis, prefersReducedMotion } from "../../lib/motion";

export default function MotionProvider() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true });
    setLenis(lenis);
    const unsub = subscribe((time) => lenis.raf(time));
    return () => {
      unsub();
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
