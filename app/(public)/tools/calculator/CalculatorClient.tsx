"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ToolShell from "../../../../components/shell/ToolShell";
import { getTool } from "../../../../lib/tools";

type Kind = "num" | "op" | "fn" | "eq";
const keys: { v: string; k: Kind }[] = [
  { v: "C", k: "fn" }, { v: "±", k: "fn" }, { v: "%", k: "fn" }, { v: "÷", k: "op" },
  { v: "7", k: "num" }, { v: "8", k: "num" }, { v: "9", k: "num" }, { v: "×", k: "op" },
  { v: "4", k: "num" }, { v: "5", k: "num" }, { v: "6", k: "num" }, { v: "−", k: "op" },
  { v: "1", k: "num" }, { v: "2", k: "num" }, { v: "3", k: "num" }, { v: "+", k: "op" },
  { v: "0", k: "num" }, { v: ".", k: "num" }, { v: "⌫", k: "fn" }, { v: "=", k: "eq" },
];

const isOp = (v: string) => ["÷", "×", "−", "+"].includes(v);

/** Physical keyboard → calculator key. */
const KEYMAP: Record<string, string> = {
  "/": "÷", "*": "×", "x": "×", "-": "−", "+": "+", "Enter": "=", "=": "=",
  "Backspace": "⌫", "Escape": "C", "Delete": "C", "%": "%", ".": ".", ",": ".",
};

interface Particle { id: number; x: number; y: number; vx: number; vy: number; hot: boolean; size: number }
interface Ripple { id: number; key: number; x: number; y: number }
interface Entry { expr: string; result: string }

const tidy = (n: number) => (Number.isFinite(n) ? String(parseFloat(n.toPrecision(12))) : "Error");

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [fresh, setFresh] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [flash, setFlash] = useState(false);
  const [history, setHistory] = useState<Entry[]>([]);
  const pidRef = useRef(0);
  const keysRef = useRef<HTMLDivElement>(null);

  const spawnParticles = useCallback((x: number, y: number, count: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const batch: Particle[] = Array.from({ length: count }, () => ({
      id: pidRef.current++, x, y,
      vx: (Math.random() - 0.5) * 140, vy: (Math.random() - 0.8) * 140,
      hot: Math.random() > 0.35, size: Math.random() * 4 + 3,
    }));
    setParticles((p) => [...p, ...batch]);
    setTimeout(() => setParticles((p) => p.filter((pt) => !batch.some((n) => n.id === pt.id))), 700);
  }, []);

  const spawnRipple = useCallback((key: number, x: number, y: number) => {
    const id = pidRef.current++;
    setRipples((r) => [...r, { id, key, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
  }, []);

  function press(val: string, index: number, el: HTMLElement | null, cx?: number, cy?: number) {
    if (el) {
      const rect = el.getBoundingClientRect();
      const px = cx ?? rect.left + rect.width / 2;
      const py = cy ?? rect.top + rect.height / 2;
      spawnRipple(index, px - rect.left, py - rect.top);
      if (val === "=") spawnParticles(px, py, 14);
    }

    if (val === "=") {
      try {
        const raw = (expr + display).replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
        const result = tidy(Number(Function(`"use strict"; return (${raw})`)()));
        if (result === "Error") throw new Error("not finite");
        setHistory((h) => [{ expr: `${expr}${display}`, result }, ...h].slice(0, 8));
        setDisplay(result); setExpr(""); setFresh(true);
        setFlash(true);
        setTimeout(() => setFlash(false), 450);
      } catch { setDisplay("Error"); setExpr(""); setFresh(true); }
      return;
    }

    if (val === "C") { setDisplay("0"); setExpr(""); setFresh(false); return; }
    if (val === "⌫") {
      setDisplay((d) => {
        if (d === "Error") return "0";
        if (fresh) return d; // a finished result or a pending operator isn't editable
        return d.length <= 1 || (d.length === 2 && d.startsWith("-")) ? "0" : d.slice(0, -1);
      });
      return;
    }
    if (val === "±") { setDisplay((d) => (d === "Error" ? d : d.startsWith("-") ? d.slice(1) : d === "0" ? d : "-" + d)); return; }
    if (val === "%") { setDisplay((d) => (d === "Error" ? d : tidy(parseFloat(d) / 100))); return; }
    if (isOp(val)) {
      if (display === "Error") return;
      // typing an operator straight after another swaps it instead of stacking
      if (fresh && expr && isOp(expr.slice(-1))) { setExpr(expr.slice(0, -1) + val); return; }
      setExpr(expr + display + val); setFresh(true); return;
    }
    if (fresh) { setDisplay(val === "." ? "0." : val); setFresh(false); return; }
    if (val === "." && display.includes(".")) return;
    if (display.replace(/[-.]/g, "").length >= 15) return;
    setDisplay((d) => (d === "0" && val !== "." ? val : d + val));
  }

  // keep the latest `press` reachable from the one keydown listener
  const pressRef = useRef(press);
  pressRef.current = press;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (e.key === "Enter" && t && (t.tagName === "BUTTON" || t.tagName === "A")) return; // native click handles it
      const val = /^[0-9]$/.test(e.key) ? e.key : KEYMAP[e.key];
      if (!val) return;
      const index = keys.findIndex((k) => k.v === val);
      if (index < 0) return;
      e.preventDefault();
      const el = keysRef.current?.children[index] as HTMLElement | undefined;
      pressRef.current(val, index, el ?? null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const len = display.length;
  const size = len > 12 ? 1.9 : len > 9 ? 2.5 : len > 6 ? 3.2 : 4;

  const aside = (
    <>
      <div className="rail-block">
        <h2 className="label">Keyboard</h2>
        <ul className="rail-list">
          <li>Digits and operators <b><kbd className="k">0–9</kbd> <kbd className="k">+ − * /</kbd></b></li>
          <li>Equals <b><kbd className="k">Enter</kbd></b></li>
          <li>Delete last digit <b><kbd className="k">Backspace</kbd></b></li>
          <li>Clear <b><kbd className="k">Esc</kbd></b></li>
        </ul>
      </div>
      <div className="rail-block">
        <h2 className="label">Recent</h2>
        {history.length === 0 ? (
          <p className="rail-empty">Finished sums show up here. Tap one to bring its result back.</p>
        ) : (
          <div>
            {history.map((h, i) => (
              <button key={i} className="hist-row" onClick={() => { setDisplay(h.result); setExpr(""); setFresh(true); }}>
                <small>{h.expr}</small>
                <span />
                <b>= {h.result}</b>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <ToolShell tool={getTool("calculator")!} aside={aside}>
      <div aria-hidden style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 50, overflow: "hidden" }}>
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute", left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: "50%",
              background: p.hot ? "var(--accent)" : "var(--fg)",
              "--vx": `${p.vx}px`, "--vy": `${p.vy}px`,
              animation: "ck-fly .7s ease-out forwards",
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="calc">
        <div className="calc-body" data-flash={flash}>
          <div className="calc-screen" aria-live="polite">
            <div className="calc-expr">{expr || "\u00A0"}</div>
            <div className="calc-out" data-flash={flash} style={{ fontSize: `min(${size}rem, 9dvh)` }}>{display}</div>
          </div>
          <div className="calc-keys" ref={keysRef}>
            {keys.map((key, i) => (
              <button
                key={key.v}
                className="ck"
                data-k={key.k}
                aria-label={key.v === "⌫" ? "Backspace" : key.v === "C" ? "Clear" : undefined}
                onClick={(e) => press(key.v, i, e.currentTarget, e.clientX || undefined, e.clientY || undefined)}
              >
                {ripples.filter((r) => r.key === i).map((r) => (
                  <span key={r.id} className="ck-ripple" style={{ left: r.x, top: r.y }} />
                ))}
                {key.v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

export default function CalculatorClient() {
  return <Calculator />;
}
