// Visual identity for course posts. Each course gets an accent, a type
// voice and an icon set so a machine-learning course reads "techy" and a
// Roblox course reads "gaming", instead of every course rendering the same
// grey card.
//
// Resolution order (see resolveTheme / usePost):
//   1. An explicit `theme` prop on a component, e.g. <ModuleCard theme="gaming" ...>
//   2. The `theme` passed to <PostProvider theme="..." />, usually derived
//      from the post's slug/tags in app/(public)/blog/[slug]/page.tsx
//   3. "default" — the original neutral treatment, unchanged.

export type CourseTheme = "ml" | "gaming" | "default";

export interface ThemeTokens {
  /** Headline accent color (hex), used for borders, glows, numerals. */
  accent: string;
  /** Low-opacity fill of the accent, for chips/backgrounds. */
  accentSoft: string;
  /** Mid-opacity accent, for borders/rings. */
  accentLine: string;
  /** Text color that reads on top of a solid accent fill. */
  onAccent: string;
  /** Monospace voice (terminal/code) vs a bolder display voice. */
  voice: "mono" | "display";
  /** Corner rounding for cards in this theme. */
  radius: string;
  /** Small decorative glyph prefixed to labels, e.g. ">" or "/". */
  glyph: string;
  /** CSS background-image for the subtle card texture (or "none"). */
  texture: string;
}

export const COURSE_THEMES: Record<CourseTheme, ThemeTokens> = {
  ml: {
    accent: "#39e8ff",
    accentSoft: "rgba(57, 232, 255, 0.10)",
    accentLine: "rgba(57, 232, 255, 0.38)",
    onAccent: "#031418",
    voice: "mono",
    radius: "0.5rem",
    glyph: "//",
    texture:
      "linear-gradient(rgba(57,232,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(57,232,255,0.055) 1px, transparent 1px)",
  },
  gaming: {
    accent: "#ff4fd8",
    accentSoft: "rgba(255, 79, 216, 0.10)",
    accentLine: "rgba(255, 79, 216, 0.4)",
    onAccent: "#1a0313",
    voice: "display",
    radius: "0.9rem",
    glyph: "▸",
    texture:
      "repeating-linear-gradient(135deg, rgba(255,79,216,0.05) 0px, rgba(255,79,216,0.05) 2px, transparent 2px, transparent 10px)",
  },
  default: {
    accent: "var(--accent)",
    accentSoft: "rgba(198, 255, 61, 0.10)",
    accentLine: "rgba(198, 255, 61, 0.35)",
    onAccent: "var(--on-accent)",
    voice: "display",
    radius: "0.5rem",
    glyph: "·",
    texture: "none",
  },
};

/** Guess a course theme from a slug, title or tag string. */
export function resolveTheme(input?: string | null): CourseTheme {
  if (!input) return "default";
  const s = input.toLowerCase();
  if (/\b(ml|machine[-\s]?learning|ai|neural|pytorch|sklearn|scikit)\b/.test(s)) return "ml";
  if (/\b(roblox|luau|game[-\s]?dev|gaming|unity|unreal)\b/.test(s)) return "gaming";
  return "default";
}

/** Resolve the first non-empty theme hint into a theme + its tokens. */
export function useThemeTokens(...hints: Array<string | null | undefined>): ThemeTokens {
  for (const hint of hints) {
    if (hint === "ml" || hint === "gaming" || hint === "default") return COURSE_THEMES[hint];
  }
  for (const hint of hints) {
    const resolved = resolveTheme(hint);
    if (resolved !== "default") return COURSE_THEMES[resolved];
  }
  return COURSE_THEMES.default;
}
