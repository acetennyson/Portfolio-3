"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePostOptional } from "./PostContext";
import { COURSE_THEMES, type CourseTheme } from "./courseThemes";

// CourseTeaser + two live demos. All MDX props are plain strings, because
// next-mdx-remote strips JS-expression props.
//
//   <CourseTeaser theme="ml" title="..." hook="..."
//     pains="one|two|three"
//     steps="Name:hours:one line|Name:hours:one line">
//     <LiveSignalDemo />
//   </CourseTeaser>

function useT(p?: CourseTheme) {
  const post = usePostOptional();
  const theme = p ?? post?.theme ?? "default";
  return { theme, t: COURSE_THEMES[theme] };
}

const CSS = `
.ct{margin:1rem 0 4rem;--ink:var(--fg,currentColor);--quiet:var(--fg-muted,#8a8f98)}
.ct-hero{display:grid;gap:2rem;align-items:center;padding:2rem 0}
@media(min-width:860px){.ct-hero{grid-template-columns:1fr 1.1fr}}
.ct-title{font-size:clamp(2rem,5vw,3.4rem);line-height:1.05;font-weight:700;letter-spacing:-.02em;margin:0 0 1rem}
.ct-hook{font-size:1.15rem;line-height:1.55;color:var(--quiet);max-width:34ch;margin:0}
.ct-demo{border:1px solid var(--acl);border-radius:var(--rad);padding:1rem;background:var(--asoft)}
.ct-pains{margin:2.5rem 0;display:grid;gap:.6rem}
.ct-pain{margin:0;padding:.7rem 1rem;border-left:3px solid var(--acc);background:var(--asoft);opacity:0;transform:translateY(8px);animation:ctin .5s forwards}
.ct-pain b{color:var(--acc);margin-right:.5rem}
@keyframes ctin{to{opacity:1;transform:none}}
.ct-road{list-style:none;margin:2rem 0 0;padding:0;display:grid;gap:.75rem}
@media(min-width:860px){.ct-road{grid-template-columns:repeat(auto-fit,minmax(170px,1fr))}}
.ct-step{padding:1rem;border:1px solid var(--acl);border-radius:var(--rad);transition:transform .2s,background .2s}
.ct-step:hover{transform:translateY(-4px);background:var(--asoft)}
.ct-step b{display:block;font-size:1.05rem}
.ct-step i{font-style:normal;color:var(--acc);font-size:.85rem}
.ct-step span{display:block;margin-top:.4rem;color:var(--quiet);font-size:.9rem;line-height:1.4}
.ld{display:grid;gap:.8rem;font-size:.9rem}
.ld-row{display:flex;gap:.4rem;flex-wrap:wrap;align-items:center}
.ld-btn{padding:.35rem .8rem;border:1px solid var(--acl);border-radius:999px;background:none;color:var(--ink);cursor:pointer}
.ld-btn[aria-pressed=true]{background:var(--acc);color:var(--onacc);border-color:var(--acc)}
.ld-bars{display:flex;gap:6px;align-items:flex-end;height:70px}
.ld-bar{flex:1;background:var(--acc);border-radius:3px 3px 0 0;transition:height .25s}
.ld-dist{display:grid;grid-template-columns:5rem 1fr 4rem;gap:.5rem;align-items:center}
.ld-track{height:10px;background:var(--asoft);border-radius:5px;overflow:hidden}
.ld-fill{height:100%;background:var(--quiet);transition:width .25s}
.ld-win .ld-fill{background:var(--acc)}
.ld-verdict{font-weight:700;font-size:1.05rem}
.ld canvas{width:100%;border-radius:calc(var(--rad) - .2rem);touch-action:none;cursor:crosshair;background:#0b0b10}
@media(prefers-reduced-motion:reduce){.ct-pain{animation:none;opacity:1;transform:none}.ld-bar,.ld-fill,.ct-step{transition:none}}
`;

export function CourseTeaser({
  theme: themeProp, title, hook, pains = "", steps = "", children,
}: {
  theme?: CourseTheme; title: string; hook: string; pains?: string; steps?: string; children?: React.ReactNode;
}) {
  const { t } = useT(themeProp);
  const vars = {
    "--acc": t.accent, "--asoft": t.accentSoft, "--acl": t.accentLine,
    "--onacc": t.onAccent, "--rad": t.radius,
  } as React.CSSProperties;
  const painList = pains.split("|").filter(Boolean);
  const stepList = steps.split("|").filter(Boolean).map((s) => s.split(":"));
  return (
    <section className="ct" style={vars}>
      <style>{CSS}</style>
      <div className="ct-hero">
        <div>
          <p className="ct-title">{title}</p>
          <p className="ct-hook">{hook}</p>
        </div>
        <div className="ct-demo">{children}</div>
      </div>
      <div className="ct-pains">
        {painList.map((p, i) => (
          <p key={i} className="ct-pain" style={{ animationDelay: `${0.3 + i * 0.35}s` }}>
            <b>{t.glyph}</b>{p}
          </p>
        ))}
      </div>
      <ol className="ct-road">
        {stepList.map(([name, hours, line], i) => (
          <li key={i} className="ct-step">
            <b>{name}</b><i>{hours}h</i><span>{line}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ───────── ML: which button was pressed? (Module 1's scaling build) ─────────
const SAVED: Record<string, number[]> = {
  "Vol +": [9000, 4500, 560, 560, 560, 1690],
  "Vol -": [9000, 4500, 560, 1690, 560, 560],
  "Mute": [9000, 4500, 1690, 560, 560, 1690],
};

export function LiveSignalDemo() {
  const names = Object.keys(SAVED);
  const [press, setPress] = useState(names[0]);
  const [noise, setNoise] = useState(25);
  const [scaled, setScaled] = useState(false);
  const [rnd, setRnd] = useState<number[]>(Array(6).fill(0));
  const roll = () => setRnd(Array.from({ length: 6 }, () => Math.random() * 2 - 1));
  useEffect(roll, []);

  const sig = SAVED[press].map((v, i) => Math.round(v * (1 + (noise / 100) * rnd[i])));
  const scale = SAVED[names[0]].map((_, i) => Math.max(...names.map((n) => SAVED[n][i])));
  const dist = names.map((n) => {
    const d = Math.sqrt(sig.reduce((s, v, i) => {
      const k = scaled ? scale[i] : 1;
      return s + ((v - SAVED[n][i]) / k) ** 2;
    }, 0));
    return { n, d };
  });
  const best = dist.reduce((a, b) => (b.d < a.d ? b : a));
  const maxD = Math.max(...dist.map((x) => x.d)) || 1;
  const right = best.n === press;

  return (
    <div className="ld">
      <div className="ld-row">
        <span>Press:</span>
        {names.map((n) => (
          <button key={n} className="ld-btn" aria-pressed={press === n} onClick={() => { setPress(n); roll(); }}>{n}</button>
        ))}
        <button className="ld-btn" onClick={roll}>Re-roll noise</button>
      </div>
      <div className="ld-bars" aria-label="The incoming signal">
        {sig.map((v, i) => <div key={i} className="ld-bar" style={{ height: `${Math.max(6, Math.sqrt(v / 9500) * 100)}%` }} />)}
      </div>
      <code>[{sig.join(", ")}]</code>
      <label className="ld-row">Noise {noise}%
        <input type="range" min={0} max={40} value={noise} onChange={(e) => setNoise(+e.target.value)} />
      </label>
      <label className="ld-row">
        <input type="checkbox" checked={scaled} onChange={(e) => setScaled(e.target.checked)} /> Scale the features first
      </label>
      {dist.map(({ n, d }) => (
        <div key={n} className={`ld-dist${n === best.n ? " ld-win" : ""}`}>
          <span>{n}</span>
          <div className="ld-track"><div className="ld-fill" style={{ width: `${(d / maxD) * 100}%` }} /></div>
          <span>{scaled ? d.toFixed(2) : Math.round(d)}</span>
        </div>
      ))}
      <div className="ld-verdict">Nearest: {best.n} {right ? "✓" : `✗ (you pressed ${press})`}</div>
    </div>
  );
}

// ───────── Roblox: a tiny wave-survival arena ─────────
type E = { x: number; y: number };

export function MiniArena() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState({ wave: 1, coins: 0, hp: 5 });

  useEffect(() => {
    const c = ref.current!;
    const g = c.getContext("2d")!;
    const W = 480, H = 300;
    const acc = getComputedStyle(c).getPropertyValue("--acc").trim() || "#ff4fd8";
    const S = { px: 240, py: 150, mx: 240, my: 150, en: [] as E[], co: [] as E[], pulse: 0, wave: 1, coins: 0, hp: 5, hurt: 0 };
    const spawn = () => {
      for (let i = 0; i < 2 + S.wave * 2; i++) {
        const side = Math.floor(Math.random() * 4);
        S.en.push({ x: side % 2 ? (side === 1 ? W : 0) : Math.random() * W, y: side % 2 ? Math.random() * H : side === 0 ? 0 : H });
      }
    };
    spawn();
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); S.mx = ((e.clientX - r.left) / r.width) * W; S.my = ((e.clientY - r.top) / r.height) * H; };
    const hit = () => {
      S.pulse = 1;
      S.en = S.en.filter((e) => {
        const dead = Math.hypot(e.x - S.px, e.y - S.py) < 70;
        if (dead) S.co.push({ x: e.x, y: e.y });
        return !dead;
      });
    };
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerdown", (e) => { move(e); hit(); });
    let raf = 0, last = "";
    const loop = () => {
      S.px += (S.mx - S.px) * 0.08; S.py += (S.my - S.py) * 0.08;
      if (S.hurt > 0) S.hurt--;
      for (const e of S.en) {
        const a = Math.atan2(S.py - e.y, S.px - e.x), sp = 0.5 + S.wave * 0.07;
        e.x += Math.cos(a) * sp; e.y += Math.sin(a) * sp;
        if (!S.hurt && Math.hypot(e.x - S.px, e.y - S.py) < 14) {
          S.hurt = 60; S.hp--;
          if (S.hp <= 0) { S.hp = 5; S.wave = 1; S.en = []; spawn(); }
        }
      }
      S.co = S.co.filter((k) => { const got = Math.hypot(k.x - S.px, k.y - S.py) < 16; if (got) S.coins++; return !got; });
      if (!S.en.length) { S.wave++; spawn(); }
      g.fillStyle = "#0b0b10"; g.fillRect(0, 0, W, H);
      g.strokeStyle = "rgba(255,255,255,.05)";
      for (let i = 0; i < W; i += 40) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, H); g.stroke(); }
      for (let j = 0; j < H; j += 40) { g.beginPath(); g.moveTo(0, j); g.lineTo(W, j); g.stroke(); }
      g.fillStyle = "#ffd166"; S.co.forEach((k) => { g.beginPath(); g.arc(k.x, k.y, 5, 0, 7); g.fill(); });
      g.fillStyle = "#ff5d5d"; S.en.forEach((e) => g.fillRect(e.x - 7, e.y - 7, 14, 14));
      if (S.pulse > 0) { g.strokeStyle = acc; g.globalAlpha = S.pulse; g.beginPath(); g.arc(S.px, S.py, 70 * (1.1 - S.pulse * 0.4), 0, 7); g.stroke(); g.globalAlpha = 1; S.pulse -= 0.06; }
      g.fillStyle = S.hurt % 10 > 5 ? "#fff" : acc; g.beginPath(); g.arc(S.px, S.py, 10, 0, 7); g.fill();
      const key = `${S.wave}-${S.coins}-${S.hp}`;
      if (key !== last) { last = key; setHud({ wave: S.wave, coins: S.coins, hp: S.hp }); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); c.removeEventListener("pointermove", move); };
  }, []);

  return (
    <div className="ld">
      <div className="ld-row"><b>Wave {hud.wave}</b><span>·</span><span>Coins {hud.coins}</span><span>·</span><span>HP {"♥".repeat(hud.hp)}</span></div>
      <canvas ref={ref} width={480} height={300} aria-label="Mini wave-survival arena: move the pointer, click to strike" />
      <span>Move your pointer, click to strike. Waves, coins and the rules behind them are Modules 3 and 6.</span>
    </div>
  );
}
