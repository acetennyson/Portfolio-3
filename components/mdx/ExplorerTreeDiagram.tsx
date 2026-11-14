"use client";

import React, { useState } from "react";
import { usePostOptional } from "./PostContext";
import { COURSE_THEMES, type CourseTheme } from "./courseThemes";

// ExplorerTreeDiagram
// The top of a new Baseplate place as a tree. Hover, focus or tap a row for
// more detail on what that container is for.
//
// Same theme plumbing as CourseComponents: explicit `theme` prop, then the
// post's <PostProvider theme="...">, then "default".
//
// Usage in MDX (after registering it in MDXComponents.tsx):
//   <ExplorerTreeDiagram />

type Item = {
  id: string;
  name: string;
  job: string;
  tip: string;
  level?: 1 | 2;
  main?: boolean;
  root?: boolean;
};

const ROOT: Item = {
  id: "game",
  name: "game",
  root: true,
  job: "The root: every object lives below it",
  tip: "The root of the whole tree, written game in scripts. Studio hides it, so the Explorer starts at Workspace.",
};

// level 1 = directly under the root, level 2 = inside Workspace.
// Row positions come from the order of this list.
const ROWS: Item[] = [
  {
    id: "workspace", name: "Workspace", level: 1, main: true,
    job: "Everything players can see and touch",
    tip: "Only things inside Workspace exist in the 3D world. If a block will not show up, check that it is in here.",
  },
  {
    id: "baseplate", name: "Baseplate", level: 2,
    job: "The flat ground, itself a Part",
    tip: "A single flat block. Select it and change its Color to practise using Properties.",
  },
  {
    id: "camera", name: "Camera", level: 2,
    job: "The viewpoint each player looks through",
    tip: "Each player's view of the world. Scripts can move it, which Module 12 uses for camera shake.",
  },
  {
    id: "terrain", name: "Terrain", level: 2,
    job: "Holds landscape made with the terrain tools",
    tip: "Empty at first. Landscape you paint with the terrain tools lives here (Unit 1.6).",
  },
  {
    id: "lighting", name: "Lighting", level: 1,
    job: "Time of day, brightness, sky and mood",
    tip: "Properties such as ClockTime and Brightness change the look of the whole world (Unit 1.6).",
  },
  {
    id: "replicatedstorage", name: "ReplicatedStorage", level: 1,
    job: "Things both the server and players can see",
    tip: "A shelf the server and every player can read. Shared modules and remotes go here (Module 4).",
  },
  {
    id: "serverscriptservice", name: "ServerScriptService", level: 1,
    job: "Server scripts live here; players never see them",
    tip: "Scripts here run only on the server and are never sent to players, so they are safe from tampering (Modules 2 to 4).",
  },
  {
    id: "startergui", name: "StarterGui", level: 1,
    job: "Interface copied to each player on joining",
    tip: "Anything here is copied into each player's own screen when they join. Your HUD starts here (Module 8).",
  },
];

type Placed = Item & { yc: number };

const rows: Placed[] = ROWS.map((r, i) => ({ ...r, yc: 124 + 40 * i }));
const level1 = rows.filter((r) => r.level === 1);
const level2 = rows.filter((r) => r.level === 2);
const ALL: Placed[] = [{ ...ROOT, yc: 70 }, ...rows];

const geo = (r: Placed) =>
  r.root
    ? { x: 24, w: 232, h: 36 }
    : r.level === 1
    ? { x: 56, w: 200, h: 32 }
    : { x: 96, w: 160, h: 32 };

const CSS = `
.et-fig{margin:2rem 0;--dg-ink:var(--fg,currentColor);--dg-quiet:var(--fg-muted,#8a8f98);--dg-line:var(--fg-muted,#8a8f98)}
.et-svg{display:block;width:100%;height:auto;font-family:inherit}
.et-title{fill:var(--dg-ink);font-size:15px;font-weight:600}
.et-links{fill:none;stroke:var(--dg-line);stroke-opacity:.6;stroke-width:1.25}
.et-row{cursor:pointer;outline:none}
.et-box{fill:none;stroke:var(--dg-line);stroke-opacity:.6;stroke-width:1.25;transition:fill .15s,stroke .15s,stroke-opacity .15s}
.et-row.et-main .et-box{fill:var(--dg-wash);stroke:var(--dg-accent);stroke-opacity:1;stroke-width:2}
.et-row:hover .et-box,.et-row.et-on .et-box{fill:var(--dg-wash);stroke:var(--dg-accent);stroke-opacity:1;stroke-width:2}
.et-row:focus-visible .et-box{stroke:var(--dg-accent);stroke-opacity:1;stroke-width:3}
.et-name{fill:var(--dg-ink);font-size:13px}
.et-name.et-strong{font-weight:600}
.et-job{fill:var(--dg-quiet);font-size:13px;transition:fill .15s}
.et-row:hover .et-job,.et-row.et-on .et-job{fill:var(--dg-ink)}
.et-cap{margin:.6rem 0 0;min-height:3.4em;font-size:.95rem;line-height:1.5;color:var(--dg-quiet)}
.et-cap strong{color:var(--dg-ink)}
@media (prefers-reduced-motion:reduce){.et-box,.et-job{transition:none}}
`;

export default function ExplorerTreeDiagram({
  theme: themeProp,
  className = "",
}: {
  theme?: CourseTheme;
  className?: string;
}) {
  const post = usePostOptional();
  const t = COURSE_THEMES[themeProp ?? post?.theme ?? "default"];
  const [active, setActive] = useState<string | null>(null);
  const current = ALL.find((r) => r.id === active);

  const mouseOnly = (fn: () => void) => (e: React.PointerEvent<SVGGElement>) => {
    if (e.pointerType === "mouse") fn();
  };

  const vars = {
    "--dg-accent": t.accent,
    "--dg-wash": t.accentSoft,
  } as React.CSSProperties;

  const lastLevel1 = level1[level1.length - 1];
  const lastLevel2 = level2[level2.length - 1];
  const firstRow = rows[0];

  return (
    <figure className={`et-fig ${className}`.trim()} style={vars}>
      <style>{CSS}</style>
      <svg
        className="et-svg"
        viewBox="0 0 760 444"
        role="group"
        aria-label="The top of a new Baseplate place as a tree of objects"
      >
        <text className="et-title" x="24" y="34">
          Everything in a game hangs off one tree of objects
        </text>

        <g className="et-links" aria-hidden="true">
          <path d={`M40 88V${lastLevel1.yc}`} />
          {level1.map((r) => (
            <path key={r.id} d={`M40 ${r.yc}H56`} />
          ))}
          <path d={`M80 ${firstRow.yc + 16}V${lastLevel2.yc}`} />
          {level2.map((r) => (
            <path key={r.id} d={`M80 ${r.yc}H96`} />
          ))}
        </g>

        {ALL.map((r) => {
          const g = geo(r);
          return (
            <g
              key={r.id}
              className={`et-row${r.main ? " et-main" : ""}${active === r.id ? " et-on" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={`${r.name}. ${r.job}. ${r.tip}`}
              onPointerEnter={mouseOnly(() => setActive(r.id))}
              onPointerLeave={mouseOnly(() => setActive(null))}
              onClick={() => setActive(r.id)}
              onFocus={() => setActive(r.id)}
              onBlur={() => setActive(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(r.id);
                }
              }}
            >
              <rect className="et-box" x={g.x} y={r.yc - g.h / 2} width={g.w} height={g.h} rx="8" />
              <text
                className={`et-name${r.level === 2 ? "" : " et-strong"}`}
                x={g.x + 12}
                y={r.yc + 5}
              >
                {r.name}
              </text>
              <text className="et-job" x="272" y={r.yc + 4}>
                {r.job}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="et-cap" aria-live="polite">
        {current ? (
          <>
            <strong>{current.name}.</strong> {current.tip}
          </>
        ) : (
          "Hover, focus or tap a row for more detail."
        )}
      </figcaption>
    </figure>
  );
}
