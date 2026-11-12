"use client";

import React from "react";
import {
  ChevronDown,
  Terminal,
  Cpu,
  Binary,
  Gamepad2,
  Swords,
  Trophy,
  Zap,
  CircleCheck,
} from "lucide-react";
import { usePostOptional } from "./PostContext";
import { COURSE_THEMES, type CourseTheme, type ThemeTokens } from "./courseThemes";

// ───────────────────────── theme plumbing ─────────────────────────
//
// Every component below accepts an optional `theme` prop ("ml" | "gaming" |
// "default"). When it's left out, the component falls back to whatever
// theme the post set on <PostProvider theme="..." /> (see PostContext.tsx
// and courseThemes.ts), and finally to "default" if neither is set — so
// older content with no theme prop renders exactly as before.

function useTheme(explicit?: CourseTheme): { theme: CourseTheme; t: ThemeTokens } {
  const post = usePostOptional();
  const theme = explicit ?? post?.theme ?? "default";
  return { theme, t: COURSE_THEMES[theme] };
}

// next-mdx-remote strips `prop={26}` (a JS expression) by default for
// security, which used to silently zero out every hours/number prop in the
// course posts. The content now passes these as quoted strings
// (hours="26"), which survive; this coerces them back to numbers so the
// math (totals, hour badges) still works regardless of which form a post
// uses.
function toNum(value: number | string | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function ThemeIcon({ theme, className }: { theme: CourseTheme; className?: string }) {
  if (theme === "ml") return <Terminal className={className} aria-hidden />;
  if (theme === "gaming") return <Gamepad2 className={className} aria-hidden />;
  return <Zap className={className} aria-hidden />;
}

// ───────────────────────── CourseProgress ─────────────────────────
// A phase map for the whole course. ML reads like a pipeline readout;
// gaming reads like a level-select screen; default stays the original
// clean grid.

export const CourseProgress = ({
  phase1, phase2, phase3, phase4,
  hours1, hours2, hours3, hours4,
  modules1, modules2, modules3, modules4,
  theme: themeProp,
}: {
  phase1: string;
  phase2?: string;
  phase3?: string;
  phase4?: string;
  hours1: number | string;
  hours2?: number | string;
  hours3?: number | string;
  hours4?: number | string;
  modules1: string;
  modules2?: string;
  modules3?: string;
  modules4?: string;
  theme?: CourseTheme;
}) => {
  const { theme, t } = useTheme(themeProp);
  const phases = [
    { name: phase1, modules: modules1, hours: toNum(hours1) },
    phase2 && { name: phase2, modules: modules2!, hours: toNum(hours2) },
    phase3 && { name: phase3, modules: modules3!, hours: toNum(hours3) },
    phase4 && { name: phase4, modules: modules4!, hours: toNum(hours4) },
  ].filter(Boolean) as { name: string; modules: string; hours: number }[];

  const totalHours = phases.reduce((sum, p) => sum + p.hours, 0);

  return (
    <div className="my-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase, i) => (
          <div
            key={i}
            className="group relative p-6 overflow-hidden border transition-transform duration-300 hover:-translate-y-1"
            style={{
              borderColor: t.accentLine,
              borderRadius: t.radius,
              background: `${t.texture !== "none" ? t.texture + "," : ""} var(--bg-card)`,
              backgroundSize: theme === "ml" ? "14px 14px" : undefined,
            }}
          >
            <div
              className="absolute left-0 top-0 h-full w-[3px] transition-all duration-300 group-hover:w-1.5"
              style={{ background: t.accent }}
            />
            <div
              className={`label mb-2 flex items-center gap-1.5 ${t.voice === "mono" ? "font-mono" : ""}`}
              style={{ color: t.accent }}
            >
              <span aria-hidden>{t.glyph}</span> Phase {i + 1}
            </div>
            <h3
              className={`mb-3 ${t.voice === "mono" ? "font-mono text-lg" : "text-xl font-semibold"}`}
            >
              {phase.name}
            </h3>
            <div className="flex items-baseline gap-2 text-[var(--fg-muted)]">
              <span className="label">Modules {phase.modules}</span>
              <span>·</span>
              <span className="label">{phase.hours}h</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-center">
        <ThemeIcon theme={theme} className="h-3.5 w-3.5" />
        <span className="label" style={{ color: t.accent }}>
          {totalHours} hours total · ~{Math.ceil(totalHours / 6)} weeks at 6h/week
        </span>
      </div>
    </div>
  );
};

// ───────────────────────── ModuleCard ─────────────────────────
// ML: a terminal-style header (traffic-dot rail, monospace number).
// Gaming: a quest card (hex badge, glow on hover).
// default: unchanged collapsible card.

export const ModuleCard = ({
  number,
  title,
  hours,
  objective,
  children,
  theme: themeProp,
}: {
  number: string;
  title: string;
  hours: number | string;
  objective: string;
  children?: React.ReactNode;
  theme?: CourseTheme;
}) => {
  const { theme, t } = useTheme(themeProp);
  const [isOpen, setIsOpen] = React.useState(false);
  const hoursNum = toNum(hours);

  return (
    <div
      className="my-6 overflow-hidden border transition-colors"
      style={{
        borderRadius: t.radius,
        borderColor: isOpen ? t.accentLine : "var(--border)",
        background: "var(--bg-card)",
        boxShadow: isOpen && theme !== "default" ? `0 0 0 1px ${t.accentLine}, 0 12px 28px -14px ${t.accentLine}` : undefined,
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-start gap-6 text-left group"
      >
        <div
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center border label transition-colors"
          style={{
            borderColor: t.accentLine,
            borderRadius: theme === "gaming" ? "9999px" : t.radius,
            color: t.accent,
            fontFamily: t.voice === "mono" ? "var(--font-mono)" : undefined,
          }}
        >
          {theme === "gaming" ? <Swords className="h-4 w-4" aria-hidden /> : number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className={`text-lg ${t.voice === "mono" ? "font-mono" : "font-medium"}`}>
              {theme === "ml" && <span style={{ color: t.accent }}>{number}&nbsp;</span>}
              {title}
            </h3>
            <span className="label whitespace-nowrap" style={{ color: t.accent }}>{hoursNum}h</span>
          </div>
          <p className="text-sm text-[var(--fg-muted)]">{objective}</p>
        </div>

        <ChevronDown
          className="flex-shrink-0 w-4 h-4 text-[var(--fg-muted)] transition-transform mt-1"
          style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
          aria-hidden
        />
      </button>

      {isOpen && children && (
        <div
          className="px-6 pb-6 pt-6 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// ───────────────────────── VocabTable / VocabRow ─────────────────────────
// ML: looks like inspected CLI output. Gaming: looks like an item/loot
// tooltip list. default: unchanged plain table.

export const VocabTable = ({ children, theme: themeProp }: { children: React.ReactNode; theme?: CourseTheme }) => {
  const { theme, t } = useTheme(themeProp);
  return (
    <div className="my-12 overflow-x-auto border" style={{ borderColor: theme === "default" ? "transparent" : t.accentLine, borderRadius: t.radius }}>
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border)", background: theme !== "default" ? t.accentSoft : undefined }}>
            <th className={`text-left py-3 pr-8 pl-4 label font-medium ${t.voice === "mono" ? "" : ""}`} style={{ color: theme !== "default" ? t.accent : undefined }}>
              {theme === "ml" ? "const" : theme === "gaming" ? "Item" : "Term"}
            </th>
            <th className="text-left py-3 pr-8 label font-medium">
              {theme === "ml" ? "// resolves to" : theme === "gaming" ? "Effect" : "Meaning"}
            </th>
            <th className="text-left py-3 pr-4 label font-medium hidden md:table-cell">Context</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export const VocabRow = ({ term, meaning, context, theme: themeProp }: { term: string; meaning: string; context?: string; theme?: CourseTheme }) => {
  const { theme, t } = useTheme(themeProp);
  return (
    <tr className="border-b transition-colors hover:bg-[var(--bg-card-hover)]" style={{ borderColor: "var(--border)" }}>
      <td className="py-4 pr-8 pl-4">
        <code
          className="text-sm px-1.5 py-0.5 rounded"
          style={{ color: theme !== "default" ? t.accent : undefined, background: theme !== "default" ? t.accentSoft : undefined }}
        >
          {term}
        </code>
      </td>
      <td className="py-4 pr-8 text-sm text-[var(--fg-muted)]">{meaning}</td>
      {context && <td className="py-4 pr-4 text-sm text-[var(--fg-muted)] hidden md:table-cell">{context}</td>}
    </tr>
  );
};

// ───────────────────────── Principle ─────────────────────────
// ML: looks like a numbered assertion/step. Gaming: looks like an
// achievement badge. default: unchanged.

export const Principle = ({
  number,
  children,
  theme: themeProp,
}: {
  number?: string;
  children: React.ReactNode;
  theme?: CourseTheme;
}) => {
  const { theme, t } = useTheme(themeProp);
  return (
    <div
      className="my-8 flex gap-4 p-6 border"
      style={{
        borderRadius: t.radius,
        borderColor: theme === "default" ? "var(--border)" : t.accentLine,
        background: theme === "default" ? "var(--bg-card)" : `${t.accentSoft}, var(--bg-card)`,
      }}
    >
      {number && (
        <div
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center border label"
          style={{
            borderRadius: theme === "gaming" ? "9999px" : t.radius,
            borderColor: theme === "default" ? "var(--border)" : t.accentLine,
            color: theme === "default" ? undefined : t.accent,
            fontFamily: t.voice === "mono" ? "var(--font-mono)" : undefined,
          }}
        >
          {theme === "ml" ? `[${number}]` : number}
        </div>
      )}
      <div className="flex-1 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

// ───────────────────────── PhaseCard ─────────────────────────

export const PhaseCard = ({
  phase,
  modules,
  description,
  hours,
  theme: themeProp,
}: {
  phase: string;
  modules: string;
  description: string;
  hours: number | string;
  theme?: CourseTheme;
}) => {
  const { theme, t } = useTheme(themeProp);
  const hoursNum = toNum(hours);
  return (
    <div
      className="my-12 p-8 border relative overflow-hidden"
      style={{
        borderRadius: t.radius,
        borderColor: theme === "default" ? "var(--border)" : t.accentLine,
        background: "var(--bg-card)",
      }}
    >
      {theme !== "default" && (
        <div
          className="absolute right-0 top-0 h-full w-1.5"
          style={{ background: t.accent }}
          aria-hidden
        />
      )}
      <div className="flex items-start justify-between gap-6 mb-4">
        <div>
          <div className="label mb-2" style={{ color: theme === "default" ? undefined : t.accent }}>
            Modules {modules}
          </div>
          <h3 className={`text-2xl ${t.voice === "mono" ? "font-mono" : "font-medium"}`}>{phase}</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-medium" style={{ color: theme === "default" ? undefined : t.accent }}>
            {hoursNum}
          </div>
          <div className="label">hours</div>
        </div>
      </div>
      <p className="text-[var(--fg-muted)] leading-relaxed">{description}</p>
    </div>
  );
};

// ───────────────────────── CheckYourself ─────────────────────────
// ML: reads like an assert() block. Gaming: reads like a boss-check gate.

export const CheckYourself = ({ children, theme: themeProp }: { children: React.ReactNode; theme?: CourseTheme }) => {
  const { theme, t } = useTheme(themeProp);
  return (
    <div
      className="my-8 p-6 border"
      style={{
        borderRadius: t.radius,
        borderColor: theme === "default" ? "var(--border)" : t.accentLine,
        background: theme === "default" ? "var(--bg-card)" : `${t.accentSoft}, var(--bg-card)`,
      }}
    >
      <div className="label mb-2 flex items-center gap-1.5" style={{ color: theme === "default" ? undefined : t.accent }}>
        <CircleCheck className="h-3.5 w-3.5" aria-hidden />
        {theme === "ml" ? "assert(self_check)" : theme === "gaming" ? "Boss Check" : "Check Yourself"}
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
};

// ───────────────────────── Outcome ─────────────────────────

export const Outcome = ({ children, theme: themeProp }: { children: React.ReactNode; theme?: CourseTheme }) => {
  const { theme, t } = useTheme(themeProp);
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
      style={{ borderColor: theme === "default" ? "var(--border)" : t.accentLine, background: "var(--bg-card)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.accent }} aria-hidden />
      {children}
    </div>
  );
};

// ───────────────────────── TechStack / TechItem ─────────────────────────
// ML: terminal chips ("$ numpy"). Gaming: chunky bordered badges that lift
// on hover.

export const TechStack = ({ children, theme: themeProp }: { children: React.ReactNode; theme?: CourseTheme }) => {
  const { t } = useTheme(themeProp);
  return (
    <div className="my-12 grid grid-cols-2 md:grid-cols-4 gap-3" style={{ fontFamily: t.voice === "mono" ? "var(--font-mono)" : undefined }}>
      {children}
    </div>
  );
};

export const TechItem = ({ name, theme: themeProp }: { name: string; theme?: CourseTheme }) => {
  const { theme, t } = useTheme(themeProp);
  return (
    <div
      className="p-4 border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderRadius: t.radius,
        borderColor: theme === "default" ? "var(--border)" : t.accentLine,
        background: "var(--bg-card)",
      }}
      onMouseEnter={(e) => {
        if (theme !== "default") (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 20px -10px ${t.accentLine}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      <div className="label" style={{ color: theme === "default" ? undefined : t.accent }}>
        {theme === "ml" ? `$ ${name.toLowerCase()}` : theme === "gaming" ? `▸ ${name}` : name}
      </div>
    </div>
  );
};

// ───────────────────────── CodeCompare ─────────────────────────

export const CodeCompare = ({
  title,
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  theme: themeProp,
}: {
  title: string;
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  theme?: CourseTheme;
}) => {
  const { theme, t } = useTheme(themeProp);
  return (
    <div className="my-12">
      <div className="label mb-4" style={{ color: theme === "default" ? undefined : t.accent }}>{title}</div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="label mb-2 px-4 opacity-70">{beforeLabel}</div>
          <pre className="p-4 rounded border border-[var(--border)] overflow-x-auto text-xs leading-relaxed bg-[var(--bg-card)]">
            <code>{before}</code>
          </pre>
        </div>
        <div>
          <div className="label mb-2 px-4 flex items-center gap-1.5" style={{ color: t.accent }}>
            {theme === "ml" && <Cpu className="h-3 w-3" aria-hidden />}
            {theme === "gaming" && <Trophy className="h-3 w-3" aria-hidden />}
            {afterLabel}
          </div>
          <pre
            className="p-4 rounded overflow-x-auto text-xs leading-relaxed bg-[var(--bg-card)] border"
            style={{ borderColor: t.accentLine, boxShadow: theme !== "default" ? `0 0 0 1px ${t.accentLine} inset` : undefined }}
          >
            <code>{after}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── CourseBadge ─────────────────────────
// New: a small theme-flavored kicker you can drop at the top of a course
// post, e.g. <CourseBadge theme="ml" label="Machine Learning Course" />

export const CourseBadge = ({ label, theme: themeProp }: { label: string; theme?: CourseTheme }) => {
  const { theme, t } = useTheme(themeProp);
  const Icon = theme === "ml" ? Binary : theme === "gaming" ? Gamepad2 : Zap;
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border text-xs font-medium uppercase tracking-wide"
      style={{
        borderRadius: theme === "gaming" ? "9999px" : t.radius,
        borderColor: t.accentLine,
        color: t.accent,
        background: t.accentSoft,
        fontFamily: t.voice === "mono" ? "var(--font-mono)" : undefined,
      }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </div>
  );
};
