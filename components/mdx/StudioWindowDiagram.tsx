"use client";

import React, { useState } from "react";
import { usePostOptional } from "./PostContext";
import { COURSE_THEMES, type CourseTheme } from "./courseThemes";

// StudioWindowDiagram
// Hover, focus or tap a panel to see what it does.
//
// Uses the same theme plumbing as CourseComponents: an explicit `theme` prop
// wins, then the post's <PostProvider theme="...">, then "default". Ink,
// muted text and lines come from your site's CSS variables (--fg, --fg-muted),
// so light/dark follows your ThemeToggle with no extra work.
//
// Usage in MDX (after registering it in MDXComponents.tsx):
//   <StudioWindowDiagram />

type Part = {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tip: string;
  single?: string;
  lines?: string[];
  main?: boolean;
};

const PARTS: Part[] = [
  {
    id: "ribbon",
    name: "Ribbon",
    x: 24, y: 52, w: 712, h: 40,
    single: "Ribbon: tabs of tools such as Home and Test",
    tip: "The tabs along the top. Home holds Play, Test runs several players at once, and View brings back any panel you closed.",
  },
  {
    id: "toolbox",
    name: "Toolbox",
    x: 24, y: 100, w: 150, h: 300,
    lines: ["Models and assets", "to add to the world"],
    tip: "Ready-made models and other assets. Handy, but anything made by a stranger can carry scripts, so inspect it first (Unit 1.10).",
  },
  {
    id: "viewport",
    name: "Viewport",
    x: 182, y: 100, w: 350, h: 236,
    lines: ["The 3D world you build in and look at"],
    main: true,
    tip: "The world itself. Right-drag to look around, scroll to zoom, click an object to select it.",
  },
  {
    id: "explorer",
    name: "Explorer",
    x: 540, y: 100, w: 196, h: 116,
    lines: ["Every object in the game", "shown as a tree"],
    tip: "A tree of every object in the game. Indentation shows what sits inside what.",
  },
  {
    id: "properties",
    name: "Properties",
    x: 540, y: 224, w: 196, h: 112,
    lines: ["Settings of whatever", "is selected"],
    tip: "The settings of the selected object, such as its color and size. The search box at the top finds one fast.",
  },
  {
    id: "output",
    name: "Output",
    x: 182, y: 344, w: 554, h: 56,
    lines: ["Messages, errors and print results"],
    tip: "A log of messages from Studio and your scripts, including errors. You will read it constantly from Module 2 onward.",
  },
];

const CSS = `
.sw-fig{margin:2rem 0;--dg-ink:var(--fg,currentColor);--dg-quiet:var(--fg-muted,#8a8f98);--dg-line:var(--fg-muted,#8a8f98)}
.sw-svg{display:block;width:100%;height:auto;font-family:inherit}
.sw-title{fill:var(--dg-ink);font-size:15px;font-weight:600}
.sw-part{cursor:pointer;outline:none}
.sw-box{fill:none;stroke:var(--dg-line);stroke-opacity:.6;stroke-width:1.25;transition:fill .15s,stroke .15s,stroke-opacity .15s}
.sw-part.sw-main .sw-box{fill:var(--dg-wash);stroke:var(--dg-accent);stroke-opacity:1;stroke-width:2}
.sw-part:hover .sw-box,.sw-part.sw-on .sw-box{fill:var(--dg-wash);stroke:var(--dg-accent);stroke-opacity:1;stroke-width:2}
.sw-part:focus-visible .sw-box{stroke:var(--dg-accent);stroke-opacity:1;stroke-width:3}
.sw-name{fill:var(--dg-ink);font-size:13px;font-weight:600}
.sw-line{fill:var(--dg-quiet);font-size:11.5px}
.sw-floor{fill:none;stroke:var(--dg-line);stroke-opacity:.6;stroke-width:1.25}
.sw-cap{margin:.6rem 0 0;min-height:3.4em;font-size:.95rem;line-height:1.5;color:var(--dg-quiet)}
.sw-cap strong{color:var(--dg-ink)}
@media (prefers-reduced-motion:reduce){.sw-box{transition:none}}
`;

export default function StudioWindowDiagram({
  theme: themeProp,
  className = "",
}: {
  theme?: CourseTheme;
  className?: string;
}) {
  const post = usePostOptional();
  const t = COURSE_THEMES[themeProp ?? post?.theme ?? "default"];
  const [active, setActive] = useState<string | null>(null);
  const current = PARTS.find((p) => p.id === active);

  const mouseOnly = (fn: () => void) => (e: React.PointerEvent<SVGGElement>) => {
    if (e.pointerType === "mouse") fn();
  };

  const vars = {
    "--dg-accent": t.accent,
    "--dg-wash": t.accentSoft,
  } as React.CSSProperties;

  return (
    <figure className={`sw-fig ${className}`.trim()} style={vars}>
      <style>{CSS}</style>
      <svg
        className="sw-svg"
        viewBox="0 0 760 424"
        role="group"
        aria-label="Studio window layout: six panels around one 3D world"
      >
        <text className="sw-title" x="24" y="34">
          Studio is six panels around one 3D world
        </text>

        {PARTS.map((p) => {
          const cx = p.x + p.w / 2;
          return (
            <g
              key={p.id}
              className={`sw-part${p.main ? " sw-main" : ""}${active === p.id ? " sw-on" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={`${p.name}. ${p.tip}`}
              onPointerEnter={mouseOnly(() => setActive(p.id))}
              onPointerLeave={mouseOnly(() => setActive(null))}
              onClick={() => setActive(p.id)}
              onFocus={() => setActive(p.id)}
              onBlur={() => setActive(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(p.id);
                }
              }}
            >
              <rect className="sw-box" x={p.x} y={p.y} width={p.w} height={p.h} rx="8" />

              {p.single ? (
                <text className="sw-name" x={cx} y={p.y + p.h / 2 + 5} textAnchor="middle">
                  {p.single}
                </text>
              ) : (
                <>
                  <text className="sw-name" x={cx} y={p.y + 24} textAnchor="middle">
                    {p.name}
                  </text>
                  {(p.lines ?? []).map((line, i) => (
                    <text key={line} className="sw-line" x={cx} y={p.y + 40 + i * 16} textAnchor="middle">
                      {line}
                    </text>
                  ))}
                </>
              )}

              {p.id === "viewport" && (
                <>
                  <polygon className="sw-floor" points="215,300 500,300 470,236 245,236" />
                  <text className="sw-line" x={cx} y={p.y + 224} textAnchor="middle">
                    Baseplate
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <figcaption className="sw-cap" aria-live="polite">
        {current ? (
          <>
            <strong>{current.name}.</strong> {current.tip}
          </>
        ) : (
          "Hover, focus or tap a panel to see what it does."
        )}
      </figcaption>
    </figure>
  );
}
