"use client";
import { useState, useEffect, useCallback } from "react";

// ── Category definitions ──────────────────────────────────────────────────────

type Unit = { label: string; factor?: number; toBase?: (v: number) => number; fromBase?: (v: number) => number };
type Category = { name: string; emoji: string; units: Unit[] };

const CATEGORIES: Category[] = [
  {
    name: "Length", emoji: "📏",
    units: [
      { label: "Metre (m)", factor: 1 },
      { label: "Kilometre (km)", factor: 1000 },
      { label: "Centimetre (cm)", factor: 0.01 },
      { label: "Millimetre (mm)", factor: 0.001 },
      { label: "Mile (mi)", factor: 1609.344 },
      { label: "Yard (yd)", factor: 0.9144 },
      { label: "Foot (ft)", factor: 0.3048 },
      { label: "Inch (in)", factor: 0.0254 },
      { label: "Nautical Mile", factor: 1852 },
      { label: "Light Year", factor: 9.461e15 },
    ],
  },
  {
    name: "Weight", emoji: "⚖️",
    units: [
      { label: "Kilogram (kg)", factor: 1 },
      { label: "Gram (g)", factor: 0.001 },
      { label: "Milligram (mg)", factor: 1e-6 },
      { label: "Tonne (t)", factor: 1000 },
      { label: "Pound (lb)", factor: 0.453592 },
      { label: "Ounce (oz)", factor: 0.0283495 },
      { label: "Stone (st)", factor: 6.35029 },
    ],
  },
  {
    name: "Temperature", emoji: "🌡️",
    units: [
      { label: "Celsius (°C)", toBase: v => v, fromBase: v => v },
      { label: "Fahrenheit (°F)", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { label: "Kelvin (K)", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
      { label: "Rankine (°R)", toBase: v => (v - 491.67) * 5 / 9, fromBase: v => (v + 273.15) * 9 / 5 },
    ],
  },
  {
    name: "Time", emoji: "⏱️",
    units: [
      { label: "Second (s)", factor: 1 },
      { label: "Millisecond (ms)", factor: 0.001 },
      { label: "Microsecond (μs)", factor: 1e-6 },
      { label: "Minute (min)", factor: 60 },
      { label: "Hour (h)", factor: 3600 },
      { label: "Day", factor: 86400 },
      { label: "Week", factor: 604800 },
      { label: "Month (avg)", factor: 2629800 },
      { label: "Year", factor: 31557600 },
    ],
  },
  {
    name: "Area", emoji: "🗺️",
    units: [
      { label: "Square Metre (m²)", factor: 1 },
      { label: "Square Kilometre (km²)", factor: 1e6 },
      { label: "Square Mile (mi²)", factor: 2589988.11 },
      { label: "Square Foot (ft²)", factor: 0.092903 },
      { label: "Square Inch (in²)", factor: 0.00064516 },
      { label: "Hectare (ha)", factor: 10000 },
      { label: "Acre", factor: 4046.86 },
    ],
  },
  {
    name: "Volume", emoji: "🧪",
    units: [
      { label: "Litre (L)", factor: 1 },
      { label: "Millilitre (mL)", factor: 0.001 },
      { label: "Cubic Metre (m³)", factor: 1000 },
      { label: "Gallon (US)", factor: 3.78541 },
      { label: "Gallon (UK)", factor: 4.54609 },
      { label: "Fluid Ounce (US)", factor: 0.0295735 },
      { label: "Cup (US)", factor: 0.236588 },
      { label: "Pint (US)", factor: 0.473176 },
      { label: "Tablespoon", factor: 0.0147868 },
      { label: "Teaspoon", factor: 0.00492892 },
    ],
  },
  {
    name: "Speed", emoji: "🚀",
    units: [
      { label: "m/s", factor: 1 },
      { label: "km/h", factor: 1 / 3.6 },
      { label: "mph", factor: 0.44704 },
      { label: "Knot", factor: 0.514444 },
      { label: "Mach (sea level)", factor: 340.29 },
      { label: "Speed of Light", factor: 299792458 },
    ],
  },
  {
    name: "Data", emoji: "💾",
    units: [
      { label: "Byte (B)", factor: 1 },
      { label: "Kilobyte (KB)", factor: 1024 },
      { label: "Megabyte (MB)", factor: 1048576 },
      { label: "Gigabyte (GB)", factor: 1073741824 },
      { label: "Terabyte (TB)", factor: 1099511627776 },
      { label: "Bit", factor: 0.125 },
      { label: "Kilobit (Kb)", factor: 128 },
      { label: "Megabit (Mb)", factor: 131072 },
      { label: "Gigabit (Gb)", factor: 134217728 },
    ],
  },
  {
    name: "Pressure", emoji: "🔵",
    units: [
      { label: "Pascal (Pa)", factor: 1 },
      { label: "Kilopascal (kPa)", factor: 1000 },
      { label: "Bar", factor: 100000 },
      { label: "PSI", factor: 6894.76 },
      { label: "Atmosphere (atm)", factor: 101325 },
      { label: "mmHg (Torr)", factor: 133.322 },
    ],
  },
  {
    name: "Energy", emoji: "⚡",
    units: [
      { label: "Joule (J)", factor: 1 },
      { label: "Kilojoule (kJ)", factor: 1000 },
      { label: "Calorie (cal)", factor: 4.184 },
      { label: "Kilocalorie (kcal)", factor: 4184 },
      { label: "Watt-hour (Wh)", factor: 3600 },
      { label: "kWh", factor: 3600000 },
      { label: "BTU", factor: 1055.06 },
      { label: "Electronvolt (eV)", factor: 1.602e-19 },
    ],
  },
  {
    name: "Currency", emoji: "💱",
    units: [], // populated dynamically
  },
];

function convert(value: number, from: Unit, to: Unit): number {
  if (from.toBase && to.fromBase) {
    return to.fromBase(from.toBase(value));
  }
  const base = value * (from.factor ?? 1);
  return base / (to.factor ?? 1);
}

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
  const s = parseFloat(n.toPrecision(10)).toString();
  return s;
}

export default function UniversalConverter() {
  const [catIdx, setCatIdx] = useState(0);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [input, setInput] = useState("1");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [ratesLoading, setRatesLoading] = useState(false);

  const cat = CATEGORIES[catIdx];
  const isCurrency = cat.name === "Currency";

  // load currency rates once
  useEffect(() => {
    if (!isCurrency || Object.keys(rates).length) return;
    setRatesLoading(true);
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(d => { if (d.rates) setRates(d.rates); })
      .catch(() => {})
      .finally(() => setRatesLoading(false));
  }, [isCurrency, rates]);

  // build currency units from rates
  const currencyUnits: Unit[] = Object.entries(rates).map(([code, rate]) => ({
    label: code,
    factor: 1 / rate, // relative to USD base
  }));

  const units = isCurrency ? currencyUnits : cat.units;
  const fromUnit = units[fromIdx] ?? units[0];
  const toUnit = units[toIdx] ?? units[1];

  const result = fromUnit && toUnit ? fmt(convert(parseFloat(input) || 0, fromUnit, toUnit)) : "—";

  function switchCat(i: number) {
    setCatIdx(i); setFromIdx(0); setToIdx(1); setInput("1");
  }

  function swap() {
    setFromIdx(toIdx); setToIdx(fromIdx);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Tool</p>
        <h1 className="text-4xl font-black tracking-tight grad-text">Universal Converter</h1>
      </div>

      {/* category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <button key={c.name} onClick={() => switchCat(i)}
            className="rounded-full px-3 py-1.5 text-xs font-bold transition-all"
            style={catIdx === i
              ? { background: "linear-gradient(135deg,var(--grad-start),var(--grad-end))", color: "#fff" }
              : { background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* converter card */}
      <div className="card p-6 space-y-5">
        {isCurrency && ratesLoading && (
          <p className="text-xs text-center animate-pulse" style={{ color: "var(--fg-muted)" }}>Loading exchange rates…</p>
        )}

        {/* from */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 rounded-xl px-4 py-3 text-lg font-bold outline-none"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}
            />
            <select value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))}
              className="rounded-xl px-3 py-3 text-sm font-semibold outline-none flex-1"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}>
              {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* swap button */}
        <div className="flex justify-center">
          <button onClick={swap}
            className="rounded-full w-10 h-10 flex items-center justify-center text-lg transition-all hover:scale-110 grad-bg text-white font-bold">
            ⇅
          </button>
        </div>

        {/* to */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>To</label>
          <div className="flex gap-2">
            <div className="flex-1 rounded-xl px-4 py-3 text-lg font-black select-all"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--accent)" }}>
              {result}
            </div>
            <select value={toIdx} onChange={e => setToIdx(Number(e.target.value))}
              className="rounded-xl px-3 py-3 text-sm font-semibold outline-none flex-1"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}>
              {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* formula hint */}
        {fromUnit && toUnit && (
          <p className="text-xs text-center" style={{ color: "var(--fg-muted)" }}>
            1 {fromUnit.label} = {fmt(convert(1, fromUnit, toUnit))} {toUnit.label}
          </p>
        )}
      </div>

      {/* quick reference — all units */}
      {units.length > 0 && !isCurrency && (
        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--fg-muted)" }}>All {cat.name} Units</p>
          <div className="grid grid-cols-2 gap-2">
            {units.map((u, i) => {
              const val = fmt(convert(parseFloat(input) || 0, fromUnit, u));
              return (
                <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: i === fromIdx ? "rgba(139,92,246,0.1)" : "var(--bg-card-hover)", border: "1px solid var(--border)" }}>
                  <span className="text-xs" style={{ color: "var(--fg-muted)" }}>{u.label}</span>
                  <span className="text-sm font-bold" style={{ color: i === fromIdx ? "var(--accent)" : "var(--fg)" }}>{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
