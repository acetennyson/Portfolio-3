"use client";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { prefersReducedMotion } from "../../lib/motion";

// WebGL only ever loads client-side, lazily (Next 16: ssr:false must live in a client component).
const BlockSceneInner = dynamic(() => import("./BlockSceneInner"), {
  ssr: false,
  loading: () => <div className="hero-stage" aria-hidden />,
});

type Mode = "pending" | "3d" | "fallback";

function canUseWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Static composition used for reduced motion, data-saver / 2G, or no WebGL.
const FALLBACK_BLOCKS = [
  { x: "62%", y: "62%", s: 150, r: -8, c: "#2b2b30" },
  { x: "74%", y: "52%", s: 110, r: 12, c: "#e9e5dc" },
  { x: "56%", y: "78%", s: 120, r: 6, c: "#232327" },
  { x: "82%", y: "74%", s: 170, r: -4, c: "#303036" },
  { x: "69%", y: "36%", s: 92, r: 20, c: "#c6ff3d" },
  { x: "90%", y: "56%", s: 84, r: -14, c: "#26262a" },
];

function Fallback() {
  return (
    <div className="hero-stage hero-fallback" aria-hidden>
      {FALLBACK_BLOCKS.map((b, i) => (
        <span
          key={i}
          className="fb"
          style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: b.c, transform: `translate(-50%,-50%) rotate(${b.r}deg)` }}
        />
      ))}
    </div>
  );
}

export default function BlockScene() {
  const [mode, setMode] = useState<Mode>("pending");
  // Stable identity: the scene effect depends on onFail, so an inline arrow would rebuild the whole WebGL scene on re-render.
  const onFail = useCallback(() => { console.warn("[hero] onFail from BlockSceneInner"); setMode("fallback"); }, []);

  useEffect(() => {
    const conn = (navigator as any).connection;
    const slow = !!conn?.saveData || ["slow-2g", "2g"].includes(conn?.effectiveType);
    console.warn("[hero] gate", { reduced: prefersReducedMotion(), slow, webgl: canUseWebGL() });
    if (prefersReducedMotion() || slow || !canUseWebGL()) {
      setMode("fallback");
      return;
    }
    // Defer the heavy chunk until the browser is idle so it never competes with the hero text / LCP.
    const go = () => setMode("3d");
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(go, { timeout: 800 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const t = setTimeout(go, 250);
    return () => clearTimeout(t);
  }, []);

  if (mode === "fallback") return <Fallback />;
  if (mode === "pending") return <div className="hero-stage" aria-hidden />;
  return <BlockSceneInner onFail={onFail} />;
}
