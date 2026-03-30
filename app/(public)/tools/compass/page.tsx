"use client";
import { useEffect, useRef, useState } from "react";

function getCardinal(deg: number) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function Compass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);
  const smoothRef = useRef(0);
  const rafRef = useRef(0);
  const targetRef = useRef(0);

  useEffect(() => {
    if (!("DeviceOrientationEvent" in window)) {
      setSupported(false); return;
    }

    function onOrientation(e: DeviceOrientationEvent) {
      let deg: number | null = null;
      // iOS
      if ((e as any).webkitCompassHeading != null) {
        deg = (e as any).webkitCompassHeading;
      } else if (e.alpha != null) {
        deg = 360 - e.alpha;
      }
      if (deg != null) targetRef.current = deg;
    }

    // iOS 13+ requires permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any).requestPermission()
        .then((state: string) => {
          if (state === "granted") window.addEventListener("deviceorientation", onOrientation);
          else setError("Permission denied. Allow motion access in Settings.");
        })
        .catch(() => setError("Could not request motion permission."));
    } else {
      window.addEventListener("deviceorientation", onOrientation);
    }

    // smooth animation loop
    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      // shortest-path interpolation
      let diff = targetRef.current - smoothRef.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      smoothRef.current = (smoothRef.current + diff * 0.1 + 360) % 360;
      setHeading(Math.round(smoothRef.current));
    }
    animate();

    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const deg = heading ?? 0;
  const cardinal = getCardinal(deg);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Tool</p>
        <h1 className="text-4xl font-black tracking-tight grad-text">Compass</h1>
      </div>

      {!supported && (
        <p className="text-sm text-red-400">Device orientation not supported on this device/browser.</p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* compass ring */}
      <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
        {/* outer glow ring */}
        <div className="absolute inset-0 rounded-full grad-bg opacity-20 blur-2xl" />

        {/* static ring with cardinal labels */}
        <div className="absolute inset-0 rounded-full" style={{ border: "2px solid var(--border)" }}>
          {["N","E","S","W"].map((dir, i) => {
            const angle = i * 90;
            const rad = (angle - 90) * Math.PI / 180;
            const r = 118;
            const x = 140 + r * Math.cos(rad);
            const y = 140 + r * Math.sin(rad);
            return (
              <span key={dir} className="absolute text-xs font-black"
                style={{
                  left: x, top: y,
                  transform: "translate(-50%,-50%)",
                  color: dir === "N" ? "var(--accent)" : "var(--fg-muted)",
                }}>
                {dir}
              </span>
            );
          })}
          {/* tick marks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const rad = (angle - 90) * Math.PI / 180;
            const isMajor = angle % 45 === 0;
            const r1 = isMajor ? 100 : 104, r2 = 108;
            return (
              <svg key={i} className="absolute inset-0 w-full h-full" viewBox="0 0 280 280" suppressHydrationWarning>
                <line
                  suppressHydrationWarning
                  x1={140 + r1 * Math.cos(rad)} y1={140 + r1 * Math.sin(rad)}
                  x2={140 + r2 * Math.cos(rad)} y2={140 + r2 * Math.sin(rad)}
                  stroke={isMajor ? "var(--accent)" : "var(--border)"}
                  strokeWidth={isMajor ? 2 : 1}
                />
              </svg>
            );
          })}
        </div>

        {/* rotating needle */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${deg}deg)`, transition: "transform 0.05s linear" }}>
          <svg width="280" height="280" viewBox="0 0 280 280">
            {/* north — red */}
            <polygon points="140,50 133,140 147,140" fill="url(#needleRed)" />
            {/* south — muted */}
            <polygon points="140,230 133,140 147,140" fill="var(--fg-muted)" opacity="0.5" />
            <defs>
              <linearGradient id="needleRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--grad-start)" />
                <stop offset="100%" stopColor="var(--grad-end)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* center dot */}
        <div className="absolute w-4 h-4 rounded-full grad-bg z-10"
          style={{ boxShadow: "0 0 12px rgba(139,92,246,0.8)" }} />

        {/* center readout */}
        <div className="absolute" style={{ bottom: -60 }}>
          <div className="text-center">
            <span className="text-5xl font-black grad-text">{deg}°</span>
            <span className="ml-2 text-2xl font-black" style={{ color: "var(--fg-muted)" }}>{cardinal}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-xs text-center" style={{ color: "var(--fg-muted)" }}>
        {heading === null
          ? "Waiting for orientation data — requires a device with a gyroscope/compass"
          : `Pointing ${cardinal} · ${deg}°`}
      </div>

      <p className="text-xs text-center max-w-xs" style={{ color: "var(--fg-muted)" }}>
        Works on mobile and laptops with gyroscopes (e.g. Surface, some MacBooks on Safari).
        Most desktop browsers block orientation access even if hardware is present.
      </p>
    </div>
  );
}
