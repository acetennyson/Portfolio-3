"use client";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../lib/motion";

/** Vertical role rotator: slides the column up one row, then silently resets at the loop point. */
export default function RoleSwitcher({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const [snap, setSnap] = useState(false);
  const reduced = useRef(false);
  const list = [...roles, roles[0]];

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    if (reduced.current) return;
    const t = window.setInterval(() => { setSnap(false); setI((n) => n + 1); }, 2400);
    return () => window.clearInterval(t);
  }, []);

  return (
    <span className="role-switch" aria-label={roles.join(", ")}>
      <span
        className="role-col"
        aria-hidden
        style={{ transform: `translateY(${-i * 100}%)`, transition: snap ? "none" : undefined }}
        onTransitionEnd={() => {
          if (i >= roles.length) { setSnap(true); setI(0); }
        }}
      >
        {list.map((r, k) => <span key={k}>{r}</span>)}
      </span>
    </span>
  );
}
