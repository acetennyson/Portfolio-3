"use client";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const TIMEZONES = [
  { city: "New York", tz: "America/New_York", flag: "🇺🇸" },
  { city: "Los Angeles", tz: "America/Los_Angeles", flag: "🇺🇸" },
  { city: "Chicago", tz: "America/Chicago", flag: "🇺🇸" },
  { city: "London", tz: "Europe/London", flag: "🇬🇧" },
  { city: "Paris", tz: "Europe/Paris", flag: "🇫🇷" },
  { city: "Berlin", tz: "Europe/Berlin", flag: "🇩🇪" },
  { city: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
  { city: "Mumbai", tz: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Singapore", tz: "Asia/Singapore", flag: "🇸🇬" },
  { city: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
  { city: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺" },
  { city: "São Paulo", tz: "America/Sao_Paulo", flag: "🇧🇷" },
  { city: "Toronto", tz: "America/Toronto", flag: "🇨🇦" },
  { city: "Mexico City", tz: "America/Mexico_City", flag: "🇲🇽" },
  { city: "Cairo", tz: "Africa/Cairo", flag: "🇪🇬" },
  { city: "Lagos", tz: "Africa/Lagos", flag: "🇳🇬" },
  { city: "Nairobi", tz: "Africa/Nairobi", flag: "🇰🇪" },
  { city: "Yaoundé", tz: "Africa/Douala", flag: "🇨🇲" },
  { city: "Douala", tz: "Africa/Douala", flag: "🇨🇲" },
  { city: "Abidjan", tz: "Africa/Abidjan", flag: "🇨🇮" },
  { city: "Accra", tz: "Africa/Accra", flag: "🇬🇭" },
  { city: "Dakar", tz: "Africa/Dakar", flag: "🇸🇳" },
  { city: "Johannesburg", tz: "Africa/Johannesburg", flag: "🇿🇦" },
  { city: "Addis Ababa", tz: "Africa/Addis_Ababa", flag: "🇪🇹" },
  { city: "Casablanca", tz: "Africa/Casablanca", flag: "🇲🇦" },
  { city: "Tunis", tz: "Africa/Tunis", flag: "🇹🇳" },
  { city: "Algiers", tz: "Africa/Algiers", flag: "🇩🇿" },
  { city: "Khartoum", tz: "Africa/Khartoum", flag: "🇸🇩" },
  { city: "Kinshasa", tz: "Africa/Kinshasa", flag: "🇨🇩" },
  { city: "Lusaka", tz: "Africa/Lusaka", flag: "🇿🇲" },
  { city: "Harare", tz: "Africa/Harare", flag: "🇿🇼" },
  { city: "Kampala", tz: "Africa/Kampala", flag: "🇺🇬" },
  { city: "Dar es Salaam", tz: "Africa/Dar_es_Salaam", flag: "🇹🇿" },
  { city: "Maputo", tz: "Africa/Maputo", flag: "🇲🇿" },
  { city: "Luanda", tz: "Africa/Luanda", flag: "🇦🇴" },
  { city: "Moscow", tz: "Europe/Moscow", flag: "🇷🇺" },
  { city: "Beijing", tz: "Asia/Shanghai", flag: "🇨🇳" },
  { city: "Seoul", tz: "Asia/Seoul", flag: "🇰🇷" },
  { city: "Jakarta", tz: "Asia/Jakarta", flag: "🇮🇩" },
  { city: "Karachi", tz: "Asia/Karachi", flag: "🇵🇰" },
  { city: "Riyadh", tz: "Asia/Riyadh", flag: "🇸🇦" },
  { city: "Istanbul", tz: "Europe/Istanbul", flag: "🇹🇷" },
  { city: "Amsterdam", tz: "Europe/Amsterdam", flag: "🇳🇱" },
  { city: "Zurich", tz: "Europe/Zurich", flag: "🇨🇭" },
  { city: "Madrid", tz: "Europe/Madrid", flag: "🇪🇸" },
  { city: "Rome", tz: "Europe/Rome", flag: "🇮🇹" },
  { city: "Athens", tz: "Europe/Athens", flag: "🇬🇷" },
  { city: "Warsaw", tz: "Europe/Warsaw", flag: "🇵🇱" },
  { city: "Stockholm", tz: "Europe/Stockholm", flag: "🇸🇪" },
  { city: "Oslo", tz: "Europe/Oslo", flag: "🇳🇴" },
  { city: "Helsinki", tz: "Europe/Helsinki", flag: "🇫🇮" },
  { city: "Lisbon", tz: "Europe/Lisbon", flag: "🇵🇹" },
  { city: "Bucharest", tz: "Europe/Bucharest", flag: "🇷🇴" },
  { city: "Kiev", tz: "Europe/Kiev", flag: "🇺🇦" },
  { city: "Bangkok", tz: "Asia/Bangkok", flag: "🇹🇭" },
  { city: "Ho Chi Minh", tz: "Asia/Ho_Chi_Minh", flag: "🇻🇳" },
  { city: "Dhaka", tz: "Asia/Dhaka", flag: "🇧🇩" },
  { city: "Colombo", tz: "Asia/Colombo", flag: "🇱🇰" },
  { city: "Kathmandu", tz: "Asia/Kathmandu", flag: "🇳🇵" },
  { city: "Tashkent", tz: "Asia/Tashkent", flag: "🇺🇿" },
  { city: "Tehran", tz: "Asia/Tehran", flag: "🇮🇷" },
  { city: "Baghdad", tz: "Asia/Baghdad", flag: "🇮🇶" },
  { city: "Beirut", tz: "Asia/Beirut", flag: "🇱🇧" },
  { city: "Tel Aviv", tz: "Asia/Jerusalem", flag: "🇮🇱" },
  { city: "Kabul", tz: "Asia/Kabul", flag: "🇦🇫" },
  { city: "Auckland", tz: "Pacific/Auckland", flag: "🇳🇿" },
  { city: "Honolulu", tz: "Pacific/Honolulu", flag: "🇺🇸" },
  { city: "Fiji", tz: "Pacific/Fiji", flag: "🇫🇯" },
  { city: "Buenos Aires", tz: "America/Argentina/Buenos_Aires", flag: "🇦🇷" },
  { city: "Santiago", tz: "America/Santiago", flag: "🇨🇱" },
  { city: "Bogotá", tz: "America/Bogota", flag: "🇨🇴" },
  { city: "Lima", tz: "America/Lima", flag: "🇵🇪" },
  { city: "Caracas", tz: "America/Caracas", flag: "🇻🇪" },
  { city: "Denver", tz: "America/Denver", flag: "🇺🇸" },
  { city: "Phoenix", tz: "America/Phoenix", flag: "🇺🇸" },
  { city: "Anchorage", tz: "America/Anchorage", flag: "🇺🇸" },
  { city: "UTC", tz: "UTC", flag: "🌐" },
];

type ClockStyle = "rolex" | "analog" | "skeleton" | "digital" | "minimal";

function getTime(tz: string) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour: "numeric", minute: "2-digit", second: "2-digit",
    hour12: false, weekday: "short", month: "short", day: "numeric",
  }).formatToParts(now);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "";
  const h = parseInt(get("hour")) % 24;
  const m = parseInt(get("minute"));
  const s = parseInt(get("second"));
  const timeStr = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  const dateStr = `${get("weekday")}, ${get("month")} ${get("day")}`;
  const dayNum = new Intl.DateTimeFormat("en-US", { timeZone: tz, day: "numeric" }).format(now);
  const isDay = h >= 6 && h < 20;
  return { h, m, s, timeStr, dateStr, isDay, dayNum };
}

// ── ROLEX SUBMARINER-INSPIRED ─────────────────────────────────────────────────
function RolexClock({ h, m, s, dayNum, size = 220 }: { h: number; m: number; s: number; dayNum: string; size?: number }) {
  const cx = size / 2, cy = size / 2;
  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hrDeg = (h % 12) * 30 + m * 0.5;

  // radii layers
  const rOuter = size / 2 - 2;       // outer case edge
  const rBezelOuter = rOuter - 4;    // bezel outer
  const rBezelInner = rOuter - 18;   // bezel inner / crystal edge
  const rDial = rBezelInner - 2;     // dial face
  const rMinTrack = rDial - 8;       // minute track ring
  const rIndexOuter = rDial - 10;    // hour index outer
  const rIndexInner = rDial - 22;    // hour index inner

  const toRad = (deg: number) => (deg - 90) * Math.PI / 180;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto" suppressHydrationWarning>
      <defs>
        {/* case gradient — brushed steel */}
        <radialGradient id="rCase" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#e8e8e8"/>
          <stop offset="40%" stopColor="#b0b0b0"/>
          <stop offset="100%" stopColor="#606060"/>
        </radialGradient>
        {/* bezel — black ceramic */}
        <radialGradient id="rBezel" cx="50%" cy="20%">
          <stop offset="0%" stopColor="#2a2a2a"/>
          <stop offset="100%" stopColor="#0a0a0a"/>
        </radialGradient>
        {/* dial — deep black/green submariner */}
        <radialGradient id="rDial" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#0d2818"/>
          <stop offset="60%" stopColor="#071510"/>
          <stop offset="100%" stopColor="#030a08"/>
        </radialGradient>
        {/* gold gradient for hands/indices */}
        <linearGradient id="rGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe066"/>
          <stop offset="40%" stopColor="#ffd700"/>
          <stop offset="100%" stopColor="#b8860b"/>
        </linearGradient>
        {/* lume — green glow */}
        <filter id="rLume">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="rGlow">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="rShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.7"/>
        </filter>
        {/* crystal glare */}
        <linearGradient id="rGlare" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)"/>
          <stop offset="50%" stopColor="rgba(255,255,255,0.03)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>

      {/* ── OUTER CASE (brushed steel) ── */}
      <circle cx={cx} cy={cy} r={rOuter} fill="url(#rCase)"/>
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#888" strokeWidth={0.5}/>
      {/* case lugs suggestion — top/bottom highlights */}
      <ellipse cx={cx} cy={cy - rOuter + 3} rx={12} ry={4} fill="rgba(255,255,255,0.15)"/>
      <ellipse cx={cx} cy={cy + rOuter - 3} rx={12} ry={4} fill="rgba(0,0,0,0.3)"/>

      {/* ── BEZEL (black ceramic with 60 pip markers) ── */}
      <circle cx={cx} cy={cy} r={rBezelOuter} fill="url(#rBezel)"/>
      {/* bezel pip markers */}
      {Array.from({length: 60}).map((_, i) => {
        const a = toRad(i * 6 + 90);
        const isMaj = i % 5 === 0;
        const r1 = rBezelOuter - 1, r2 = rBezelOuter - (isMaj ? 10 : 5);
        return <line key={i} suppressHydrationWarning
          x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
          x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
          stroke={isMaj ? "#ffd700" : "rgba(255,255,255,0.4)"}
          strokeWidth={isMaj ? 2 : 0.8}/>;
      })}
      {/* bezel numbers at 0/15/30/45 */}
      {[{n:"0",a:0},{n:"15",a:90},{n:"30",a:180},{n:"45",a:270}].map(({n,a}) => {
        const rad = toRad(a + 90);
        const rr = rBezelOuter - 14;
        return <text key={n} suppressHydrationWarning
          x={cx + rr * Math.cos(rad)} y={cy + rr * Math.sin(rad)}
          textAnchor="middle" dominantBaseline="central"
          fontSize={a === 0 ? 9 : 6} fontWeight="bold" fill="#ffd700"
          transform={`rotate(${a}, ${cx + rr * Math.cos(rad)}, ${cy + rr * Math.sin(rad)})`}>
          {n}
        </text>;
      })}
      {/* bezel inner ring */}
      <circle cx={cx} cy={cy} r={rBezelInner} fill="none" stroke="#333" strokeWidth={1.5}/>

      {/* ── DIAL FACE ── */}
      <circle cx={cx} cy={cy} r={rDial} fill="url(#rDial)"/>

      {/* minute track ring */}
      <circle cx={cx} cy={cy} r={rMinTrack} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5}/>

      {/* minute dots on track */}
      {Array.from({length: 60}).map((_, i) => {
        if (i % 5 === 0) return null;
        const a = toRad(i * 6 + 90);
        const rr = rMinTrack;
        return <circle key={i} suppressHydrationWarning
          cx={cx + rr * Math.cos(a)} cy={cy + rr * Math.sin(a)}
          r={0.8} fill="rgba(255,255,255,0.3)"/>;
      })}

      {/* ── HOUR INDICES (rectangular luminous) ── */}
      {Array.from({length: 12}).map((_, i) => {
        if (i === 0) return null; // 12 replaced by triangle
        const a = toRad(i * 30 + 90);
        const midR = (rIndexOuter + rIndexInner) / 2;
        const len = rIndexOuter - rIndexInner;
        const w = i % 3 === 0 ? 7 : 4;
        const x1 = cx + rIndexOuter * Math.cos(a), y1 = cy + rIndexOuter * Math.sin(a);
        const x2 = cx + rIndexInner * Math.cos(a), y2 = cy + rIndexInner * Math.sin(a);
        return (
          <g key={i} filter="url(#rLume)">
            <line suppressHydrationWarning x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#c8f0c0" strokeWidth={w} strokeLinecap="square" opacity={0.9}/>
            <line suppressHydrationWarning x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(180,255,160,0.4)" strokeWidth={w + 2} strokeLinecap="square"/>
          </g>
        );
      })}

      {/* 12 o'clock triangle */}
      {(() => {
        const tipR = rIndexInner, baseR = rIndexOuter;
        const tipX = cx, tipY = cy - tipR;
        const baseL = cx - 6, baseR2 = cx + 6;
        const baseY = cy - baseR;
        return (
          <g filter="url(#rLume)">
            <polygon suppressHydrationWarning
              points={`${tipX},${tipY} ${baseL},${baseY} ${baseR2},${baseY}`}
              fill="#c8f0c0" opacity={0.9}/>
            <polygon suppressHydrationWarning
              points={`${tipX},${tipY} ${baseL},${baseY} ${baseR2},${baseY}`}
              fill="rgba(180,255,160,0.3)" transform="scale(1.1)" style={{transformOrigin:`${cx}px ${cy}px`}}/>
          </g>
        );
      })()}

      {/* ── DATE WINDOW at 3 o'clock ── */}
      <rect x={cx + rDial * 0.52} y={cy - 9} width={20} height={18} rx={2}
        fill="#f0ede0" stroke="#888" strokeWidth={0.8}/>
      <rect x={cx + rDial * 0.52 + 1} y={cy - 8} width={18} height={16} rx={1.5} fill="#fff"/>
      <text suppressHydrationWarning
        x={cx + rDial * 0.52 + 10} y={cy + 1}
        textAnchor="middle" dominantBaseline="central"
        fontSize={8} fontWeight="bold" fill="#111">{dayNum}</text>

      {/* ── BRAND TEXT ── */}
      <text x={cx} y={cy - 28} textAnchor="middle" fontSize={7} fontWeight="bold"
        fill="#ffd700" letterSpacing={2} opacity={0.9}>ROLEX</text>
      <text x={cx} y={cy - 19} textAnchor="middle" fontSize={4.5}
        fill="rgba(255,255,255,0.5)" letterSpacing={1}>SUBMARINER</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize={4}
        fill="rgba(255,255,255,0.3)" letterSpacing={0.5}>SUPERLATIVE CHRONOMETER</text>
      <text x={cx} y={cy + 36} textAnchor="middle" fontSize={4}
        fill="rgba(255,255,255,0.3)" letterSpacing={0.5}>OFFICIALLY CERTIFIED</text>

      {/* ── CROWN LOGO (simplified) ── */}
      <g transform={`translate(${cx}, ${cy - 10})`} opacity={0.7}>
        {[-6,-3,0,3,6].map((x, i) => (
          <circle key={i} cx={x} cy={i % 2 === 0 ? -3 : -1} r={i % 2 === 0 ? 2 : 1.5} fill="#ffd700"/>
        ))}
        <rect x={-7} y={0} width={14} height={2} rx={1} fill="#ffd700"/>
      </g>

      {/* ── HOUR HAND (dauphine, gold) ── */}
      <g suppressHydrationWarning filter="url(#rShadow)" transform={`rotate(${hrDeg}, ${cx}, ${cy})`}>
        <polygon suppressHydrationWarning
          points={`${cx},${cy - (rDial - 38)} ${cx - 6},${cy - 10} ${cx - 3},${cy + 14} ${cx + 3},${cy + 14} ${cx + 6},${cy - 10}`}
          fill="url(#rGold)"/>
        <polygon suppressHydrationWarning
          points={`${cx},${cy - (rDial - 38)} ${cx - 2},${cy - 10} ${cx + 2},${cy - 10}`}
          fill="rgba(255,255,255,0.4)"/>
      </g>

      {/* ── MINUTE HAND (longer dauphine) ── */}
      <g suppressHydrationWarning filter="url(#rShadow)" transform={`rotate(${minDeg}, ${cx}, ${cy})`}>
        <polygon suppressHydrationWarning
          points={`${cx},${cy - (rDial - 16)} ${cx - 4.5},${cy - 8} ${cx - 2.5},${cy + 16} ${cx + 2.5},${cy + 16} ${cx + 4.5},${cy - 8}`}
          fill="url(#rGold)"/>
        <polygon suppressHydrationWarning
          points={`${cx},${cy - (rDial - 16)} ${cx - 1.5},${cy - 8} ${cx + 1.5},${cy - 8}`}
          fill="rgba(255,255,255,0.4)"/>
      </g>

      {/* ── SECOND HAND (red/orange sweep with counterweight) ── */}
      <g suppressHydrationWarning transform={`rotate(${secDeg}, ${cx}, ${cy})`}>
        <line suppressHydrationWarning
          x1={cx} y1={cy + 20}
          x2={cx} y2={cy - (rDial - 14)}
          stroke="#e63000" strokeWidth={1.2} strokeLinecap="round"/>
        <circle cx={cx} cy={cy + 14} r={4} fill="#e63000"/>
        <circle cx={cx} cy={cy + 14} r={2} fill="#ff4400"/>
      </g>

      {/* ── CENTER CAP ── */}
      <circle cx={cx} cy={cy} r={5} fill="url(#rGold)" filter="url(#rShadow)"/>
      <circle cx={cx} cy={cy} r={2.5} fill="#b8860b"/>
      <circle cx={cx} cy={cy} r={1} fill="#ffe066"/>

      {/* ── CRYSTAL GLARE (sapphire reflection) ── */}
      <ellipse cx={cx - 15} cy={cy - 20} rx={25} ry={40}
        fill="url(#rGlare)" transform={`rotate(-20, ${cx}, ${cy})`} opacity={0.6}/>
    </svg>
  );
}

// ── SKELETON CLOCK ────────────────────────────────────────────────────────────
function SkeletonClock({ h, m, s, size = 140 }: { h: number; m: number; s: number; size?: number }) {
  const cx = size/2, cy = size/2, r = size/2 - 4;
  const secDeg = s*6, minDeg = m*6+s*0.1, hrDeg = (h%12)*30+m*0.5;
  const toRad = (d: number) => (d-90)*Math.PI/180;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto" suppressHydrationWarning>
      <defs>
        <radialGradient id="sf2" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.1)"/><stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <filter id="sg2"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="url(#sf2)" stroke="rgba(139,92,246,0.7)" strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={r-9} fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth={0.5}/>
      {Array.from({length:48}).map((_,i) => {
        const a=toRad(i*7.5+90);
        return <line key={i} suppressHydrationWarning x1={cx+(r-1)*Math.cos(a)} y1={cy+(r-1)*Math.sin(a)} x2={cx+(r-5)*Math.cos(a)} y2={cy+(r-5)*Math.sin(a)} stroke="rgba(139,92,246,0.35)" strokeWidth={1}/>;
      })}
      {Array.from({length:12}).map((_,i) => {
        const a=toRad(i*30+90);
        return <line key={i} suppressHydrationWarning x1={cx+(r-10)*Math.cos(a)} y1={cy+(r-10)*Math.sin(a)} x2={cx+(r-20)*Math.cos(a)} y2={cy+(r-20)*Math.sin(a)} stroke="#8b5cf6" strokeWidth={i%3===0?2.5:1.2} filter="url(#sg2)"/>;
      })}
      <line suppressHydrationWarning x1={cx-8*Math.cos(toRad(hrDeg+90))} y1={cy-8*Math.sin(toRad(hrDeg+90))} x2={cx+(r-34)*Math.cos(toRad(hrDeg+90))} y2={cy+(r-34)*Math.sin(toRad(hrDeg+90))} stroke="#a78bfa" strokeWidth={3} strokeLinecap="round" filter="url(#sg2)"/>
      <line suppressHydrationWarning x1={cx-10*Math.cos(toRad(minDeg+90))} y1={cy-10*Math.sin(toRad(minDeg+90))} x2={cx+(r-20)*Math.cos(toRad(minDeg+90))} y2={cy+(r-20)*Math.sin(toRad(minDeg+90))} stroke="#60a5fa" strokeWidth={1.8} strokeLinecap="round" filter="url(#sg2)"/>
      <line suppressHydrationWarning x1={cx+14*Math.cos(toRad(secDeg+270))} y1={cy+14*Math.sin(toRad(secDeg+270))} x2={cx+(r-12)*Math.cos(toRad(secDeg+90))} y2={cy+(r-12)*Math.sin(toRad(secDeg+90))} stroke="#f472b6" strokeWidth={1} strokeLinecap="round" filter="url(#sg2)"/>
      <circle cx={cx} cy={cy} r={4} fill="#8b5cf6" filter="url(#sg2)"/>
      <circle cx={cx} cy={cy} r={2} fill="#fff"/>
    </svg>
  );
}

// ── CLASSIC ANALOG ────────────────────────────────────────────────────────────
function ClassicClock({ h, m, s, size = 140 }: { h: number; m: number; s: number; size?: number }) {
  const cx = size/2, cy = size/2, r = size/2 - 4;
  const secDeg = s*6, minDeg = m*6+s*0.1, hrDeg = (h%12)*30+m*0.5;
  const toRad = (d: number) => (d-90)*Math.PI/180;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto" suppressHydrationWarning>
      <circle cx={cx} cy={cy} r={r} fill="var(--bg-card-hover)" stroke="var(--border)" strokeWidth={2}/>
      {Array.from({length:60}).map((_,i) => {
        const a=toRad(i*6+90), isMaj=i%5===0;
        return <line key={i} suppressHydrationWarning x1={cx+(r-(isMaj?12:6))*Math.cos(a)} y1={cy+(r-(isMaj?12:6))*Math.sin(a)} x2={cx+(r-3)*Math.cos(a)} y2={cy+(r-3)*Math.sin(a)} stroke={isMaj?"var(--fg)":"var(--border)"} strokeWidth={isMaj?2.5:1}/>;
      })}
      <line suppressHydrationWarning x1={cx} y1={cy} x2={cx+(r-36)*Math.cos(toRad(hrDeg+90))} y2={cy+(r-36)*Math.sin(toRad(hrDeg+90))} stroke="var(--fg)" strokeWidth={5} strokeLinecap="round"/>
      <line suppressHydrationWarning x1={cx} y1={cy} x2={cx+(r-20)*Math.cos(toRad(minDeg+90))} y2={cy+(r-20)*Math.sin(toRad(minDeg+90))} stroke="var(--fg)" strokeWidth={3} strokeLinecap="round"/>
      <line suppressHydrationWarning x1={cx+14*Math.cos(toRad(secDeg+270))} y1={cy+14*Math.sin(toRad(secDeg+270))} x2={cx+(r-12)*Math.cos(toRad(secDeg+90))} y2={cy+(r-12)*Math.sin(toRad(secDeg+90))} stroke="var(--accent)" strokeWidth={1.2} strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={5} fill="var(--accent)"/>
      <circle cx={cx} cy={cy} r={2.5} fill="var(--bg-card)"/>
    </svg>
  );
}

function ClockCard({ entry, style, onRemove }: {
  entry: { city: string; tz: string; flag: string }; style: ClockStyle; onRemove: () => void;
}) {
  const { h, m, s, timeStr, dateStr, isDay, dayNum } = getTime(entry.tz);
  const isAnalog = ["rolex","analog","skeleton"].includes(style);

  return (
    <div className="card group relative p-5 flex flex-col gap-3 overflow-hidden">
      <button onClick={onRemove}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-6 h-6 flex items-center justify-center z-10"
        style={{ background: "var(--bg-card-hover)", color: "var(--fg-muted)" }}>
        <X size={12}/>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xl">{entry.flag}</span>
        <div>
          <p className="text-sm font-bold leading-none" style={{ color: "var(--fg)" }}>{entry.city}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>{dateStr}</p>
        </div>
        <span className="ml-auto text-lg">{isDay ? "☀️" : "🌙"}</span>
      </div>

      {style === "rolex"    && <RolexClock h={h} m={m} s={s} dayNum={dayNum} size={180}/>}
      {style === "analog"   && <ClassicClock h={h} m={m} s={s}/>}
      {style === "skeleton" && <SkeletonClock h={h} m={m} s={s}/>}
      {style === "digital"  && (
        <div className="text-center py-3">
          <span className="text-4xl font-black tracking-widest font-mono grad-text">{timeStr}</span>
        </div>
      )}
      {style === "minimal" && (
        <div className="text-center py-3">
          <span className="text-5xl font-black tracking-tight" style={{ color: "var(--fg)" }}>{timeStr.slice(0,5)}</span>
          <span className="text-xl font-bold ml-1" style={{ color: "var(--fg-muted)" }}>{timeStr.slice(6)}</span>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: "var(--fg-muted)" }}>
        {new Intl.DateTimeFormat("en",{timeZone:entry.tz,timeZoneName:"short"}).formatToParts(new Date()).find(p=>p.type==="timeZoneName")?.value}
      </p>
    </div>
  );
}

export default function WorldClock() {
  const [, setTick] = useState(0);
  const [style, setStyle] = useState<ClockStyle>("rolex");
  const [clocks, setClocks] = useState(["America/New_York","Europe/London","Asia/Tokyo"]);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTick(t => t+1), 1000);
    return () => clearInterval(id);
  }, []);

  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const filtered = TIMEZONES.filter(t => {
    const q = normalize(search);
    return (normalize(t.city).includes(q) || t.tz.toLowerCase().includes(q)) && !clocks.includes(t.tz);
  });

  const styles: { value: ClockStyle; label: string }[] = [
    { value: "rolex",    label: "👑 Rolex" },
    { value: "analog",   label: "⏱ Classic" },
    { value: "skeleton", label: "🔩 Skeleton" },
    { value: "digital",  label: "🔢 Digital" },
    { value: "minimal",  label: "◻ Minimal" },
  ];

  // Hero rolex — local time
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = getTime(localTz);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Tool</p>
        <h1 className="text-4xl font-black tracking-tight grad-text">World Clock</h1>
      </div>

      {/* ── HERO ROLEX ── */}
      <div className="card p-8 flex flex-col items-center gap-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grad-bg opacity-5"/>
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 grad-bg"/>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>Your Local Time</p>
        <RolexClock h={localTime.h} m={localTime.m} s={localTime.s} dayNum={localTime.dayNum} size={280}/>
        <div className="text-center">
          <p suppressHydrationWarning className="text-2xl font-black" style={{ color: "var(--fg)" }}>{localTime.timeStr}</p>
          <p suppressHydrationWarning className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>{localTime.dateStr} · {localTz}</p>
        </div>
      </div>

      {/* style picker */}
      <div className="flex flex-wrap gap-2 justify-center">
        {styles.map(s => (
          <button key={s.value} onClick={() => setStyle(s.value)}
            className="rounded-full px-4 py-1.5 text-xs font-bold transition-all"
            style={style === s.value
              ? { background: "linear-gradient(135deg,var(--grad-start),var(--grad-end))", color: "#fff" }
              : { background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* clocks grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clocks.map(tz => {
          const entry = TIMEZONES.find(t => t.tz === tz) ?? { city: tz, tz, flag: "🌐" };
          return <ClockCard key={tz} entry={entry} style={style} onRemove={() => setClocks(c => c.filter(x => x !== tz))}/>;
        })}
        <button onClick={() => setAdding(true)}
          className="card flex flex-col items-center justify-center gap-2 min-h-[200px] transition-all hover:border-violet-500"
          style={{ borderStyle: "dashed" }}>
          <Plus size={24} style={{ color: "var(--fg-muted)" }}/>
          <span className="text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>Add City</span>
        </button>
      </div>

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => setAdding(false)}>
          <div className="w-full max-w-sm rounded-2xl p-5 space-y-4"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-lg" style={{ color: "var(--fg)" }}>Add City</h3>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search city or timezone…"
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border)", color: "var(--fg)" }}/>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filtered.map((t, i) => (
                <button key={`${t.tz}-${i}`}
                  onClick={() => { setClocks(c => [...c, t.tz]); setAdding(false); setSearch(""); }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-card-hover)]">
                  <span className="text-xl">{t.flag}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{t.city}</p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{t.tz}</p>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && search.includes("/") && (() => {
                try { new Intl.DateTimeFormat("en", { timeZone: search }); }
                catch { return <p className="text-sm text-center py-4" style={{ color: "var(--fg-muted)" }}>Invalid timezone</p>; }
                return (
                  <button onClick={() => { setClocks(c => [...c, search]); setAdding(false); setSearch(""); }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-card-hover)]">
                    <span className="text-xl">🌐</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{search}</p>
                      <p className="text-xs" style={{ color: "var(--fg-muted)" }}>Custom IANA timezone</p>
                    </div>
                  </button>
                );
              })()}
              {filtered.length === 0 && !search.includes("/") && (
                <p className="text-sm text-center py-4" style={{ color: "var(--fg-muted)" }}>
                  No results — try e.g. Africa/Yaounde
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
