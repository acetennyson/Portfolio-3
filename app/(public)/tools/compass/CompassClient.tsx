"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Info, Navigation, Smartphone } from "lucide-react";
import ToolShell from "../../../../components/shell/ToolShell";
import { getTool } from "../../../../lib/tools";

function getCardinal(deg: number) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

/** checking → live | unavailable;  prompt (iOS asks permission on a tap) → live | denied */
type Status = "checking" | "prompt" | "live" | "unavailable" | "denied";

type IOSOrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type IOSOrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

const pt = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: +(r * Math.cos(a)).toFixed(2), y: +(r * Math.sin(a)).toFixed(2) };
};

function Dial({ deg }: { deg: number }) {
  return (
    <svg viewBox="-150 -150 300 300" aria-hidden>
      <circle r="146" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
      {/* fixed heading marker */}
      <path d="M -7 -149 L 7 -149 L 0 -135 Z" fill="var(--accent)" />
      <g transform={`rotate(${-deg})`}>
        {Array.from({ length: 72 }).map((_, i) => {
          const a = i * 5;
          const major = a % 45 === 0;
          const p1 = pt(major ? 118 : 126, a), p2 = pt(134, a);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={a === 0 ? "var(--accent)" : major ? "var(--fg)" : "var(--fg-muted)"}
              strokeOpacity={major ? 1 : 0.5} strokeWidth={a === 0 ? 3 : major ? 2 : 1} />
          );
        })}
        {([["N", 0], ["E", 90], ["S", 180], ["W", 270]] as const).map(([d, a]) => {
          const p = pt(100, a);
          return (
            <text key={d} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 20 }}
              fill={d === "N" ? "var(--accent-ink)" : "var(--fg-muted)"}>{d}</text>
          );
        })}
        {/* north needle */}
        <polygon points="0,-82 -6,0 6,0" fill="var(--accent)" />
        <polygon points="0,82 -6,0 6,0" fill="var(--fg-muted)" opacity="0.35" />
      </g>
      <circle r="5" fill="var(--bg-card)" stroke="var(--fg)" strokeWidth="1.5" />
    </svg>
  );
}

function Compass() {
  const [heading, setHeading] = useState(0);
  const [status, setStatus] = useState<Status>("checking");
  const [copied, setCopied] = useState(false);
  const targetRef = useRef(0);
  const smoothRef = useRef(0);
  const rafRef = useRef(0);
  const liveRef = useRef(false);
  const gotAbsRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

  const begin = useCallback(() => {
    const onReading = (e: Event, absolute: boolean) => {
      const ev = e as IOSOrientationEvent;
      let deg: number | null = null;
      if (ev.webkitCompassHeading != null) deg = ev.webkitCompassHeading; // iOS: already true heading
      else if (ev.alpha != null) deg = 360 - ev.alpha;
      if (deg == null || Number.isNaN(deg)) return;
      if (absolute) gotAbsRef.current = true;
      else if (gotAbsRef.current) return; // prefer the north-referenced stream once we've seen it
      targetRef.current = deg;
      if (!liveRef.current) { liveRef.current = true; setStatus("live"); }
    };
    const onAbs = (e: Event) => onReading(e, true);
    const onRel = (e: Event) => onReading(e, false);
    window.addEventListener("deviceorientationabsolute", onAbs);
    window.addEventListener("deviceorientation", onRel);

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (!liveRef.current) return;
      let diff = targetRef.current - smoothRef.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      smoothRef.current = (smoothRef.current + diff * 0.12 + 360) % 360;
      setHeading(Math.round(smoothRef.current) % 360);
    };
    tick();

    // Desktop browsers expose the API but never send a reading: call that "no sensor".
    const timer = window.setTimeout(() => { if (!liveRef.current) setStatus("unavailable"); }, 1800);

    cleanupRef.current = () => {
      window.removeEventListener("deviceorientationabsolute", onAbs);
      window.removeEventListener("deviceorientation", onRel);
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!("DeviceOrientationEvent" in window)) { setStatus("unavailable"); return; }
    const Ctor = DeviceOrientationEvent as IOSOrientationCtor;
    if (typeof Ctor.requestPermission === "function") { setStatus("prompt"); } // needs a tap, can't ask on load
    else begin();
    return () => cleanupRef.current();
  }, [begin]);

  async function enable() {
    const Ctor = DeviceOrientationEvent as IOSOrientationCtor;
    try {
      const res = await Ctor.requestPermission!();
      if (res === "granted") { setStatus("checking"); begin(); }
      else setStatus("denied");
    } catch { setStatus("denied"); }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked: the link is also visible in the address bar */ }
  }

  const live = status === "live";
  const cardinal = getCardinal(heading);
  const secure = typeof window === "undefined" ? true : window.isSecureContext;

  const statusText: Record<Status, string> = {
    checking: "Looking for a sensor…",
    prompt: "Waiting for permission",
    live: "Sensor connected",
    unavailable: "No sensor detected",
    denied: "Permission denied",
  };

  const aside = (
    <>
      <div className="rail-block">
        <h2 className="label">Sensor</h2>
        <ul className="rail-list">
          <li>Status <b>{statusText[status]}</b></li>
          <li>Reading <b>{live ? `${heading}° ${cardinal}` : "—"}</b></li>
        </ul>
      </div>
      <div className="rail-block">
        <h2 className="label">Works on</h2>
        <p className="rail-empty">
          Phones and tablets, plus a few laptops with a magnetometer. Most desktop browsers have no
          heading sensor, so open this page on your phone. The dial drifts near magnets and metal;
          sweep the phone in a figure eight to recalibrate.
        </p>
      </div>
    </>
  );

  return (
    <ToolShell tool={getTool("compass")!} aside={aside}>
      <div className="compass" data-live={live}>
        <div className="compass-dial" role="img" aria-label={live ? `Heading ${heading} degrees, ${cardinal}` : "Compass, no reading"}>
          <Dial deg={live ? heading : 0} />
        </div>

        {live && (
          <div className="compass-read" aria-hidden>
            <strong>{heading}°</strong>
            <span>{cardinal}</span>
          </div>
        )}

        {(status === "unavailable" || status === "denied" || status === "prompt") && (
          <div className="wb-state" style={{ position: "absolute", inset: 0, justifyContent: "center" }} role="status">
            {status === "prompt" ? (
              <>
                <Navigation size={32} strokeWidth={1.3} aria-hidden />
                <h2>Allow motion access</h2>
                <p>iOS asks before a page can read the compass.</p>
                <button className="wb-btn" onClick={enable}>Enable compass</button>
              </>
            ) : status === "denied" ? (
              <>
                <Info size={32} strokeWidth={1.3} aria-hidden />
                <h2>Motion access is off</h2>
                <p>Allow Motion &amp; Orientation access for this site in your browser settings, then reload the page.</p>
              </>
            ) : (
              <>
                <Smartphone size={32} strokeWidth={1.3} aria-hidden />
                <h2>This device has no compass</h2>
                <p>
                  {secure
                    ? "Open this page on a phone or tablet to get a live heading."
                    : "Sensors only work on secure (https) pages. Load this page over https on a phone or tablet."}
                </p>
                <button className="wb-btn wb-btn-line" onClick={copyLink}>
                  {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                  {copied ? "Link copied" : "Copy page link"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}

export default function CompassClient() {
  return <Compass />;
}
