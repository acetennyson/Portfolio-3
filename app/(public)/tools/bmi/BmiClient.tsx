"use client";
import { useState } from "react";
import ToolShell from "../../../../components/shell/ToolShell";
import { getTool } from "../../../../lib/tools";

type Unit = "metric" | "imperial";

// `color` fills the gauge; `ink` is the readable text colour for the same band.
const CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "#60a5fa", ink: "#60a5fa", tip: "Consider consulting a nutritionist to reach a healthy weight." },
  { max: 25,   label: "Normal",      color: "var(--accent)", ink: "var(--accent-ink)", tip: "Great! Maintain your weight with balanced diet and exercise." },
  { max: 30,   label: "Overweight",  color: "#facc15", ink: "#facc15", tip: "Light lifestyle changes can bring you back to a healthy range." },
  { max: 35,   label: "Obese I",     color: "#fb923c", ink: "#fb923c", tip: "Consider speaking with a healthcare provider about a plan." },
  { max: 40,   label: "Obese II",    color: "#f87171", ink: "#f87171", tip: "Medical guidance is recommended." },
  { max: Infinity, label: "Obese III", color: "#e11d48", ink: "#e11d48", tip: "Please consult a doctor as soon as possible." },
];

function getCategory(bmi: number) {
  return CATEGORIES.find(c => bmi < c.max)!;
}

// needle angle: BMI 10 → -90°, BMI 40 → +90°
function bmiToAngle(bmi: number) {
  const clamped = Math.max(10, Math.min(40, bmi));
  return ((clamped - 10) / 30) * 180 - 90;
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  // angles are measured from straight up (-90 = far left, +90 = far right)
  const toXY = (d: number) => {
    const a = ((d - 90) * Math.PI) / 180;
    return { x: +(cx + r * Math.cos(a)).toFixed(2), y: +(cy + r * Math.sin(a)).toFixed(2) };
  };
  const s = toXY(startDeg), e = toXY(endDeg);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${endDeg - startDeg > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
}

const BANDS = [
  { from: 10, to: 18.5 }, { from: 18.5, to: 25 }, { from: 25, to: 30 }, { from: 30, to: 35 }, { from: 35, to: 40 },
];

function BMITracker() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLb, setWeightLb] = useState("");

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

  const hM = unit === "metric" ? parseFloat(height) / 100 : (parseFloat(heightFt) * 12 + parseFloat(heightIn || "0")) * 0.0254;
  let range = "";
  if (bmi && hM > 0) {
    const lo = 18.5 * hM * hM, hi = 24.9 * hM * hM;
    range = unit === "metric"
      ? `${lo.toFixed(1)}–${hi.toFixed(1)} kg`
      : `${(lo * 2.205).toFixed(0)}–${(hi * 2.205).toFixed(0)} lb`;
  }

  const cx = 120, cy = 112, r = 86;

  const form = (
    <div className="wb-panel bmi-form">
      <div className="wb-seg" role="radiogroup" aria-label="Units" style={{ alignSelf: "flex-start" }}>
        {(["metric", "imperial"] as Unit[]).map(u => (
          <button key={u} role="radio" aria-checked={unit === u} onClick={() => setUnit(u)} style={{ textTransform: "capitalize" }}>{u}</button>
        ))}
      </div>

      {unit === "metric" ? (
        <div className="bmi-pair">
          <label className="wb-field"><span>Height (cm)</span>
            <input className="wb-input" type="number" inputMode="decimal" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" />
          </label>
          <label className="wb-field"><span>Weight (kg)</span>
            <input className="wb-input" type="number" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" />
          </label>
        </div>
      ) : (
        <>
          <div className="bmi-pair">
            <label className="wb-field"><span>Height (ft)</span>
              <input className="wb-input" type="number" inputMode="decimal" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="5" />
            </label>
            <label className="wb-field"><span>Height (in)</span>
              <input className="wb-input" type="number" inputMode="decimal" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="9" />
            </label>
          </div>
          <label className="wb-field"><span>Weight (lb)</span>
            <input className="wb-input" type="number" inputMode="decimal" value={weightLb} onChange={e => setWeightLb(e.target.value)} placeholder="154" />
          </label>
        </>
      )}
      <p className="rail-empty" style={{ fontSize: ".78rem" }}>For adults 18 and over. BMI is a screening number, not a diagnosis.</p>
    </div>
  );

  return (
    <div className="bmi">
      {form}

      <div className="wb-panel bmi-out" aria-live="polite">
        <div className="bmi-gauge">
          <svg viewBox="0 0 240 148" role="img" aria-label={bmi ? `BMI ${bmi.toFixed(1)}, ${cat!.label}` : "BMI gauge, waiting for height and weight"}>
            {BANDS.map((b, i) => (
              <path key={i} d={arcPath(cx, cy, r, bmiToAngle(b.from), bmiToAngle(b.to))} fill="none"
                stroke={CATEGORIES[i].color} strokeWidth={14} opacity={cat ? (CATEGORIES[i] === cat ? 1 : 0.35) : 0.55} />
            ))}
            <g transform={`rotate(${angle}, ${cx}, ${cy})`} style={{ transition: "transform .6s cubic-bezier(.16,1,.3,1)" }}>
              <line x1={cx} y1={cy} x2={cx} y2={cy - r + 12} stroke="var(--fg)" strokeWidth={2.5} strokeLinecap="round" />
              <circle cx={cx} cy={cy} r={6} fill="var(--fg)" />
              <circle cx={cx} cy={cy} r={2.5} fill="var(--bg-card)" />
            </g>
            <text x={cx} y={cy + 28} textAnchor="middle" fontSize={26} fontWeight={700} fill={cat ? cat.ink : "var(--fg-muted)"} style={{ fontVariantNumeric: "tabular-nums" }}>
              {bmi ? bmi.toFixed(1) : "—"}
            </text>
            {[10, 18.5, 25, 30, 40].map((v) => {
              const a = ((bmiToAngle(v) - 90) * Math.PI) / 180;
              return (
                <text key={v} x={(cx + (r + 16) * Math.cos(a)).toFixed(1)} y={(cy + (r + 16) * Math.sin(a)).toFixed(1)}
                  textAnchor="middle" dominantBaseline="central" fontSize={8} fill="var(--fg-muted)">{v}</text>
              );
            })}
          </svg>
        </div>

        {bmi && cat ? (
          <>
            <span className="bmi-badge" style={{ color: cat.ink, borderColor: `color-mix(in srgb, ${cat.color} 50%, transparent)`, background: `color-mix(in srgb, ${cat.color} 14%, transparent)` }}>
              {cat.label}
            </span>
            <div className="bmi-facts">
              <div><small>Healthy range</small><b>18.5–24.9</b></div>
              {range && <div><small>Your healthy weight</small><b>{range}</b></div>}
            </div>
            <p className="bmi-tip">{cat.tip}</p>
          </>
        ) : (
          <p className="bmi-tip">Enter your height and weight to see where you sit on the scale.</p>
        )}
      </div>
    </div>
  );
}

export default function BmiClient() {
  return (
    <ToolShell tool={getTool("bmi")!} layout="bare">
      <BMITracker />
    </ToolShell>
  );
}
