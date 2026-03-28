"use client";
import { useState, useRef, useCallback } from "react";

const buttons = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

const isOp = (v: string) => ["÷", "×", "−", "+"].includes(v);

interface Particle { id: number; x: number; y: number; vx: number; vy: number; color: string; size: number; }
interface Ripple { id: number; x: number; y: number; }

const COLORS = ["#8b5cf6", "#3b82f6", "#ec4899", "#06b6d4", "#a78bfa"];

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [fresh, setFresh] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [resultFlash, setResultFlash] = useState(false);
  const pidRef = useRef(0);

  const spawnParticles = useCallback((x: number, y: number, count = 8) => {
    const newP: Particle[] = Array.from({ length: count }, () => ({
      id: pidRef.current++,
      x, y,
      vx: (Math.random() - 0.5) * 120,
      vy: (Math.random() - 0.8) * 120,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 5 + 3,
    }));
    setParticles(p => [...p, ...newP]);
    setTimeout(() => setParticles(p => p.filter(pt => !newP.find(n => n.id === pt.id))), 700);
  }, []);

  const spawnRipple = useCallback((x: number, y: number) => {
    const id = pidRef.current++;
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
  }, []);

  function press(val: string, e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    spawnRipple(cx, cy);

    if (val === "=") {
      spawnParticles(e.clientX, e.clientY, 16);
      try {
        const raw = (expr + display).replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
        const result = String(Function(`"use strict"; return (${raw})`)());
        setDisplay(result); setExpr(""); setFresh(true);
        setResultFlash(true);
        setTimeout(() => setResultFlash(false), 400);
      } catch { setDisplay("Error"); setExpr(""); }
      return;
    }

    spawnParticles(e.clientX, e.clientY, isOp(val) ? 6 : 3);

    if (val === "C") { setDisplay("0"); setExpr(""); setFresh(false); return; }
    if (val === "⌫") { setDisplay(d => d.length > 1 ? d.slice(0, -1) : "0"); return; }
    if (val === "±") { setDisplay(d => d.startsWith("-") ? d.slice(1) : "-" + d); return; }
    if (val === "%") { setDisplay(d => String(parseFloat(d) / 100)); return; }
    if (isOp(val)) { setExpr(expr + display + val); setFresh(true); return; }
    if (fresh) { setDisplay(val === "." ? "0." : val); setFresh(false); return; }
    setDisplay(d => d === "0" && val !== "." ? val : d + val);
  }

  const btnStyle = (val: string): React.CSSProperties => {
    if (val === "=") return { background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))", color: "#fff" };
    if (isOp(val)) return { background: "rgba(139,92,246,0.15)", color: "var(--accent)", border: "1px solid rgba(139,92,246,0.25)" };
    if (["C", "±", "%"].includes(val)) return { background: "var(--bg-card-hover)", color: "var(--fg)", border: "1px solid var(--border)" };
    return { background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" };
  };

  return (
    <>
      <style>{`
        @keyframes particle-fly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--vx), var(--vy)) scale(0); opacity: 0; }
        }
        @keyframes ripple-expand {
          0%   { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes border-spin {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes result-flash {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        .calc-border {
          background: linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899, #06b6d4, #8b5cf6);
          background-size: 200% 100%;
          animation: border-spin 3s linear infinite;
          padding: 2px;
          border-radius: 1.75rem;
        }
        .result-flash { animation: result-flash 0.4s ease; }
      `}</style>

      {/* fixed particle layer */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {particles.map(p => (
          <div key={p.id} style={{
            position: "absolute",
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.color,
            // @ts-expect-error css vars
            "--vx": `${p.vx}px`, "--vy": `${p.vy}px`,
            animation: "particle-fly 0.7s ease-out forwards",
          }} />
        ))}
      </div>

      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="calc-border shadow-2xl w-full" style={{ maxWidth: 380, boxShadow: "0 32px 80px rgba(139,92,246,0.3)" }}>
          <div className="rounded-[1.6rem] overflow-hidden w-full" style={{ background: "var(--bg-card)" }}>

            {/* display */}
            <div className="px-8 pt-10 pb-8 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 grad-bg" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-10" style={{ background: "var(--grad-end)" }} />
              <p className="text-xs mb-1 h-4 truncate text-right font-mono" style={{ color: "var(--fg-muted)" }}>
                {expr || " "}
              </p>
              <p className={`font-black tracking-tight text-right break-all transition-all ${resultFlash ? "result-flash grad-text" : ""} ${display.length > 10 ? "text-3xl" : display.length > 7 ? "text-4xl" : "text-5xl"}`}
                style={resultFlash ? {} : { color: "var(--fg)" }}>
                {display}
              </p>
            </div>

            {/* buttons */}
            <div className="grid grid-cols-4 gap-3 p-5">
              {buttons.flat().map((val, i) => (
                <button
                  key={i}
                  onClick={(e) => press(val, e)}
                  className="relative rounded-2xl h-18 text-xl font-bold transition-all duration-150 active:scale-90 hover:brightness-125 overflow-hidden"
                  style={{ ...btnStyle(val), height: "4.5rem" }}
                >
                  {/* ripple */}
                  {ripples.map(r => (
                    <span key={r.id} style={{
                      position: "absolute",
                      left: r.x - 20, top: r.y - 20,
                      width: 40, height: 40,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)",
                      animation: "ripple-expand 0.6s ease-out forwards",
                      pointerEvents: "none",
                    }} />
                  ))}
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
