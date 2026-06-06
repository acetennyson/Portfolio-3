"use client";
import { useState } from "react";

type Unit = "metric" | "imperial";

const CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "#60a5fa", tip: "Consider consulting a nutritionist to reach a healthy weight." },
  { max: 25,   label: "Normal",      color: "#4ade80", tip: "Great! Maintain your weight with balanced diet and exercise." },
  { max: 30,   label: "Overweight",  color: "#facc15", tip: "Light lifestyle changes can bring you back to a healthy range." },
  { max: 35,   label: "Obese I",     color: "#fb923c", tip: "Consider speaking with a healthcare provider about a plan." },
  { max: 40,   label: "Obese II",    color: "#f87171", tip: "Medical guidance is recommended." },
  { max: Infinity, label: "Obese III", color: "#e11d48", tip: "Please consult a doctor as soon as possible." },
];

function getCategory(bmi: number) {
  return CATEGORIES.find(c => bmi < c.max)!;
}

// needle angle: BMI 10 → -90°, BMI 40 → +90°
function bmiToAngle(bmi: number) {
  const clamped = Math.max(10, Math.min(40, bmi));
  return ((clamped - 10) / 30) * 180 - 90;
}

export default function BMITracker() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLb, setWeightLb] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male"|"female">("male");

  let bmi: number | null = null;
  if (unit === "metric") {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) bmi = w / (h * h);
  } else {
    const h = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
    const w = parseFloat(weightLb);
    if (h > 0 && w > 0) bmi = (w / (h * h)) * 703;
  }

  const cat = bmi ? getCategory(bmi) : null;
  const angle = bmi ? bmiToAngle(bmi) : -90;

  // gauge arc segments
  const gaugeSegs = [
    { start: -90, end: -30, color: "#60a5fa" },  // <18.5
    { start: -30, end: 30,  color: "#4ade80" },  // 18.5-25
    { start: 30,  end: 66,  color: "#facc15" },  // 25-30
    { start: 66,  end: 90,  color: "#fb923c" },  // 30-35
  ];

  function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const s = (startDeg * Math.PI) / 180;
    const e = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const cx = 120, cy = 110, r = 80;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Tool</p>
        <h1 className="text-4xl font-black tracking-tight grad-text">BMI Tracker</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>Body Mass Index calculator with health insights</p>
      </div>

      {/* unit toggle */}
      <div className="flex rounded-2xl p-1 gap-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {(["metric","imperial"] as Unit[]).map(u => (
          <button key={u} onClick={() => setUnit(u)}
            className="flex-1 rounded-xl py-2 text-sm font-bold capitalize transition-all"
            style={unit === u
              ? { background: "linear-gradient(135deg,var(--grad-start),var(--grad-end))", color: "#fff" }
              : { color: "var(--fg-muted)" }}>
            {u}
          </button>
        ))}
      </div>

      {/* inputs */}
      <div className="card p-6 space-y-4">
        {/* height */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--fg-muted)" }}>
            Height {unit === "metric" ? "(cm)" : "(ft / in)"}
          </label>
          {unit === "metric" ? (
            <input type="number" value={height} onChange={e => setHeight(e.target.value)}
              placeholder="e.g. 175"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}/>
          ) : (
            <div className="flex gap-2">
              <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)}
                placeholder="ft" className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}/>
              <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                placeholder="in" className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
                style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}/>
            </div>
          )}
        </div>

        {/* weight */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--fg-muted)" }}>
            Weight {unit === "metric" ? "(kg)" : "(lbs)"}
          </label>
          {unit === "metric" ? (
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 70"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}/>
          ) : (
            <input type="number" value={weightLb} onChange={e => setWeightLb(e.target.value)}
              placeholder="e.g. 154"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}/>
          )}
        </div>

        {/* age + sex */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--fg-muted)" }}>Age</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)}
              placeholder="e.g. 25"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}/>
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "var(--fg-muted)" }}>Sex</label>
            <div className="flex gap-2">
              {(["male","female"] as const).map(s => (
                <button key={s} onClick={() => setSex(s)}
                  className="flex-1 rounded-xl py-3 text-sm font-bold capitalize transition-all"
                  style={sex === s
                    ? { background: "linear-gradient(135deg,var(--grad-start),var(--grad-end))", color: "#fff" }
                    : { background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* result */}
      {bmi && cat && (
        <div className="card p-6 space-y-6">
          {/* gauge */}
          <div className="flex justify-center">
            <svg width={240} height={130} viewBox="0 0 240 130" suppressHydrationWarning>
              {/* track */}
              <path d={arcPath(cx,cy,r,-90,90)} fill="none" stroke="var(--border)" strokeWidth={14} strokeLinecap="round"/>
              {/* colored segments */}
              {gaugeSegs.map((seg,i) => (
                <path key={i} suppressHydrationWarning d={arcPath(cx,cy,r,seg.start,seg.end)} fill="none"
                  stroke={seg.color} strokeWidth={14} strokeLinecap="butt" opacity={0.85}/>
              ))}
              {/* needle */}
              <g suppressHydrationWarning transform={`rotate(${angle}, ${cx}, ${cy})`}>
                <line x1={cx} y1={cy} x2={cx + r - 10} y2={cy} stroke="var(--fg)" strokeWidth={2.5} strokeLinecap="round"/>
                <circle cx={cx} cy={cy} r={6} fill={cat.color}/>
                <circle cx={cx} cy={cy} r={3} fill="var(--bg-card)"/>
              </g>
              {/* BMI value */}
              <text x={cx} y={cy + 22} textAnchor="middle" fontSize={22} fontWeight="900"
                fill={cat.color}>{bmi.toFixed(1)}</text>
              <text x={cx} y={cy + 36} textAnchor="middle" fontSize={9} fill="var(--fg-muted)" letterSpacing={1}>BMI</text>
              {/* scale labels */}
              {[{v:10,a:-90},{v:18.5,a:-30},{v:25,a:30},{v:30,a:66},{v:40,a:90}].map(({v,a}) => {
                const rad = (a * Math.PI) / 180;
                const lr = r + 14;
                return <text key={v} suppressHydrationWarning
                  x={cx + lr * Math.cos(rad)} y={cy + lr * Math.sin(rad)}
                  textAnchor="middle" dominantBaseline="central" fontSize={7} fill="var(--fg-muted)">{v}</text>;
              })}
            </svg>
          </div>

          {/* category badge */}
          <div className="text-center">
            <span className="inline-block rounded-full px-5 py-2 text-sm font-black"
              style={{ background: cat.color + "22", color: cat.color, border: `1px solid ${cat.color}55` }}>
              {cat.label}
            </span>
          </div>

          {/* stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "BMI", value: bmi.toFixed(1) },
              { label: "Category", value: cat.label },
              { label: "Healthy Range", value: "18.5–24.9" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--fg-muted)" }}>{label}</p>
                <p className="text-sm font-black" style={{ color: "var(--fg)" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* healthy weight range */}
          {(() => {
            const hM = unit === "metric" ? parseFloat(height) / 100 : (parseFloat(heightFt) * 12 + parseFloat(heightIn || "0")) * 0.0254;
            if (!hM) return null;
            const lo = (18.5 * hM * hM).toFixed(1);
            const hi = (24.9 * hM * hM).toFixed(1);
            const loDisp = unit === "metric" ? `${lo} kg` : `${(parseFloat(lo) * 2.205).toFixed(1)} lbs`;
            const hiDisp = unit === "metric" ? `${hi} kg` : `${(parseFloat(hi) * 2.205).toFixed(1)} lbs`;
            return (
              <div className="rounded-xl p-4 text-center"
                style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--fg-muted)" }}>Your healthy weight range</p>
                <p className="text-lg font-black" style={{ color: "#4ade80" }}>{loDisp} – {hiDisp}</p>
              </div>
            );
          })()}

          {/* tip */}
          <div className="rounded-xl p-4 flex gap-3 items-start"
            style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)" }}>
            <span className="text-xl">💡</span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{cat.tip}</p>
          </div>

          {/* BMI scale bar */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--fg-muted)" }}>BMI Scale</p>
            <div className="flex rounded-full overflow-hidden h-3">
              {CATEGORIES.slice(0,-1).map((c,i) => (
                <div key={i} className="flex-1" style={{ background: c.color, opacity: 0.8 }}/>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {["<18.5","18.5","25","30","35","40+"].map(l => (
                <span key={l} className="text-xs" style={{ color: "var(--fg-muted)" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
