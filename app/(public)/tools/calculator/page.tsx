"use client";
import { useState } from "react";

const buttons = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

const isOp = (v: string) => ["÷", "×", "−", "+"].includes(v);

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [fresh, setFresh] = useState(false);

  function press(val: string) {
    if (val === "C") { setDisplay("0"); setExpr(""); setFresh(false); return; }
    if (val === "⌫") { setDisplay(d => d.length > 1 ? d.slice(0, -1) : "0"); return; }
    if (val === "±") { setDisplay(d => d.startsWith("-") ? d.slice(1) : "-" + d); return; }
    if (val === "%") { setDisplay(d => String(parseFloat(d) / 100)); return; }

    if (val === "=") {
      try {
        const raw = (expr + display).replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
        const result = String(Function(`"use strict"; return (${raw})`)());
        setDisplay(result);
        setExpr("");
        setFresh(true);
      } catch { setDisplay("Error"); setExpr(""); }
      return;
    }

    if (isOp(val)) {
      setExpr(expr + display + val);
      setFresh(true);
      return;
    }

    if (fresh) { setDisplay(val === "." ? "0." : val); setFresh(false); return; }
    setDisplay(d => d === "0" && val !== "." ? val : d + val);
  }

  const btnStyle = (val: string) => {
    if (val === "=") return { background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))", color: "#fff" };
    if (isOp(val)) return { background: "rgba(139,92,246,0.15)", color: "var(--accent)", border: "1px solid rgba(139,92,246,0.25)" };
    if (["C", "±", "%"].includes(val)) return { background: "var(--bg-card-hover)", color: "var(--fg)", border: "1px solid var(--border)" };
    return { background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" };
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 32px 80px rgba(139,92,246,0.2)" }}>

        {/* display */}
        <div className="px-6 pt-8 pb-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 grad-bg" />
          <p className="text-xs mb-1 h-4 truncate text-right" style={{ color: "var(--fg-muted)" }}>
            {expr || " "}
          </p>
          <p className="text-5xl font-black tracking-tight text-right truncate" style={{ color: "var(--fg)" }}>
            {display}
          </p>
        </div>

        {/* buttons */}
        <div className="grid grid-cols-4 gap-2 p-4">
          {buttons.flat().map((val, i) => (
            <button
              key={i}
              onClick={() => press(val)}
              className={`rounded-2xl h-16 text-lg font-bold transition-all duration-150 active:scale-95 hover:opacity-80 ${val === "0" ? "" : ""}`}
              style={btnStyle(val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
