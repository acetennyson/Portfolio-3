"use client";
import { useState, useEffect } from "react";
import { ArrowUpDown, Check, Copy, X } from "lucide-react";
import ToolShell from "../../../../components/shell/ToolShell";
import { getTool } from "../../../../lib/tools";

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

function UniversalConverter() {
  const [catIdx, setCatIdx] = useState(0);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [input, setInput] = useState("1");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesFailed, setRatesFailed] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [copied, setCopied] = useState(false);

  const cat = CATEGORIES[catIdx];
  const isCurrency = cat.name === "Currency";

  // load currency rates once
  useEffect(() => {
    if (!isCurrency || Object.keys(rates).length) return;
    setRatesLoading(true); setRatesFailed(false);
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(d => { if (d.rates) setRates(d.rates); else setRatesFailed(true); })
      .catch(() => setRatesFailed(true))
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
    setCatIdx(i); setFromIdx(0); setToIdx(1); setInput("1"); setSheet(false);
  }

  function swap() {
    setFromIdx(toIdx); setToIdx(fromIdx);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  const unitList = (
    <div className="cv-units-list">
      {units.map((u, i) => (
        <div key={i} className="cv-unit" data-on={i === fromIdx}>
          <span>{u.label}</span>
          <b>{fmt(convert(parseFloat(input) || 0, fromUnit, u))}</b>
        </div>
      ))}
    </div>
  );
  const showUnits = units.length > 0 && !isCurrency && !!fromUnit;

  return (
    <div className="cv">
      <div className="cv-cats" role="group" aria-label="Category">
        {CATEGORIES.map((c, i) => (
          <button key={c.name} className="cv-cat" aria-pressed={catIdx === i} onClick={() => switchCat(i)}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="cv-main">
        <div className="wb-panel cv-box">
          {isCurrency && ratesLoading && (
            <p className="cv-formula" role="status">Loading exchange rates…</p>
          )}
          {isCurrency && ratesFailed && (
            <p className="cv-formula" role="alert" style={{ color: "#f87171" }}>
              Couldn’t load exchange rates. Check your connection and pick Currency again.
            </p>
          )}

          <div className="wb-field">
            <span>From</span>
            <div className="cv-row">
              <input
                className="wb-input cv-num"
                type="number"
                inputMode="decimal"
                value={input}
                onChange={e => setInput(e.target.value)}
                aria-label="Amount to convert"
              />
              <select className="wb-input" value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))} aria-label="From unit">
                {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <button className="cv-swap" onClick={swap} aria-label="Swap units"><ArrowUpDown size={18} /></button>

          <div className="wb-field">
            <span>To</span>
            <div className="cv-row">
              <button className="cv-res" onClick={copy} title="Copy result" aria-label={`Result ${result}. Copy`}>
                <strong>{result}</strong>
                {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              </button>
              <select className="wb-input" value={toIdx} onChange={e => setToIdx(Number(e.target.value))} aria-label="To unit">
                {units.map((u, i) => <option key={i} value={i}>{u.label}</option>)}
              </select>
            </div>
          </div>

          {fromUnit && toUnit && (
            <p className="cv-formula">1 {fromUnit.label} = {fmt(convert(1, fromUnit, toUnit))} {toUnit.label}</p>
          )}
        </div>

        {showUnits && (
          <button className="wb-btn wb-btn-line cv-units-btn" onClick={() => setSheet(true)}>
            All {cat.name.toLowerCase()} units
          </button>
        )}
      </div>

      {/* desktop: every unit at a glance */}
      <div className="wb-panel cv-units">
        {showUnits ? (
          <>
            <div className="cv-units-head">
              <span className="label">All {cat.name} units</span>
              <span className="label">{input || 0} {fromUnit.label.split(" (")[0]}</span>
            </div>
            <div className="wb-scroll">{unitList}</div>
          </>
        ) : (
          <div className="wb-state">
            <p>{isCurrency ? "Rates come from open.er-api.com and update daily." : "Pick a category to see every unit."}</p>
          </div>
        )}
      </div>

      {/* mobile: the same list as a sheet */}
      {sheet && showUnits && (
        <div className="cv-sheet" onClick={() => setSheet(false)}>
          <div className="cv-sheet-in" role="dialog" aria-label={`All ${cat.name} units`} onClick={e => e.stopPropagation()}>
            <div className="cv-units-head">
              <span className="label">All {cat.name} units</span>
              <button className="wc-x" style={{ opacity: 1, position: "static" }} onClick={() => setSheet(false)} aria-label="Close"><X size={14} /></button>
            </div>
            <div className="wb-scroll">{unitList}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConverterClient() {
  return (
    <ToolShell tool={getTool("converter")!} layout="bare">
      <UniversalConverter />
    </ToolShell>
  );
}
