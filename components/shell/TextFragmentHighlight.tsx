"use client";
import { useEffect } from "react";
import { getLenis, whenReadySafe } from "../../lib/motion";

/**
 * Makes "Copy link to highlight" links (…#:~:text=…) reliable.
 *
 * The browser handles these natively on the first load, but it silently gives up when:
 *   - the page is refreshed (the browser drops the `:~:text=` part of the URL, so the highlight is gone),
 *   - the match is split across elements (animated titles are one inline-block per word),
 *   - the browser / in-app webview doesn't support text fragments, or ignores them for that navigation.
 *
 * The browser hides the directive from `location`, but the original URL is still on the navigation
 * timing entry. We read it from there, find the text ourselves, highlight it (CSS Custom Highlight API,
 * falling back to a normal selection), and remember it in sessionStorage so a refresh keeps it.
 */

type Directive = { prefix?: string; start: string; end?: string; suffix?: string };
type Flat = { text: string; at: { node: Text; offset: number }[] };

const KEY = "tf-directive";
const HIT = "tf-hit";
const BLOCKS = "p,li,h1,h2,h3,h4,h5,h6,div,section,article,aside,td,th,tr,pre,blockquote,figcaption,ul,ol,table,header,footer,nav,main";

function parse(frag: string): Directive[] {
  const i = frag.indexOf(":~:");
  if (i < 0) return [];
  const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
  const out: Directive[] = [];
  for (const part of frag.slice(i + 3).split("&")) {
    if (!part.startsWith("text=")) continue;
    const raw = part.slice(5).split(",");
    let prefix: string | undefined;
    let suffix: string | undefined;
    if (raw.length > 1 && raw[0].endsWith("-")) prefix = dec(raw.shift()!.slice(0, -1));
    if (raw.length > 1 && raw[raw.length - 1].startsWith("-")) suffix = dec(raw.pop()!.slice(1));
    if (!raw.length || !raw[0]) continue;
    out.push({ prefix, suffix, start: dec(raw[0]), end: raw[1] ? dec(raw[1]) : undefined });
  }
  return out;
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/** All visible text under `root` as one lowercase, whitespace-collapsed string, with a map back to DOM positions. */
function flatten(root: Element): Flat {
  const text: string[] = [];
  const at: Flat["at"] = [];
  let lastBlock: Element | null = null;
  let lastNode: Text | null = null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const el = n.parentElement;
      if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(el.tagName)) return NodeFilter.FILTER_REJECT;
      if (el.closest(".loader, .pt")) return NodeFilter.FILTER_REJECT;
      if (typeof el.checkVisibility === "function" && !el.checkVisibility()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const block = n.parentElement!.closest(BLOCKS);
    if (lastNode && block !== lastBlock && text.length && text[text.length - 1] !== " ") {
      text.push(" ");
      at.push({ node: lastNode, offset: Math.max(lastNode.length - 1, 0) });
    }
    lastBlock = block;
    lastNode = n;
    const data = n.data;
    for (let i = 0; i < data.length; i++) {
      const c = data[i];
      if (/\s/.test(c)) {
        if (!text.length || text[text.length - 1] === " ") continue;
        text.push(" ");
      } else {
        const l = c.toLowerCase();
        text.push(l.length === 1 ? l : c);
      }
      at.push({ node: n, offset: i });
    }
  }
  return { text: text.join(""), at };
}

function find(flat: Flat, d: Directive): Range | null {
  const start = norm(d.start);
  const end = d.end ? norm(d.end) : null;
  const prefix = d.prefix ? norm(d.prefix) : null;
  const suffix = d.suffix ? norm(d.suffix) : null;
  if (!start) return null;
  let from = 0;
  for (;;) {
    const i = flat.text.indexOf(start, from);
    if (i < 0) return null;
    from = i + 1;
    if (prefix && !flat.text.slice(0, i).trimEnd().endsWith(prefix)) continue;
    let j = i + start.length;
    if (end) {
      const k = flat.text.indexOf(end, j);
      if (k < 0) continue;
      j = k + end.length;
    }
    if (suffix && !flat.text.slice(j).trimStart().startsWith(suffix)) continue;
    const a = flat.at[i];
    const b = flat.at[j - 1];
    if (!a || !b) return null;
    const r = document.createRange();
    r.setStart(a.node, a.offset);
    r.setEnd(b.node, b.offset + 1);
    return r;
  }
}

function paint(ranges: Range[]): () => void {
  const Hl = (window as any).Highlight;
  const reg = (CSS as any).highlights;
  if (Hl && reg) {
    reg.set(HIT, new Hl(...ranges));
    return () => reg.delete(HIT);
  }
  const sel = window.getSelection();
  sel?.removeAllRanges();
  ranges.forEach((r) => sel?.addRange(r));
  return () => sel?.removeAllRanges();
}

/** Scroll only if the match isn't comfortably on screen (so we never fight the browser's own scroll). */
function bringIntoView(range: Range) {
  const r = range.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.top >= 90 && r.bottom <= vh - 40) return;
  const y = Math.max(0, r.top + window.scrollY - vh * 0.3);
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
}

export default function TextFragmentHighlight() {
  // `::highlight()` is valid CSS, but Turbopack's CSS parser rejects it, so it's injected at runtime instead of living in globals.css.
  useEffect(() => {
    if (document.getElementById("tf-hit-style")) return;
    const el = document.createElement("style");
    el.id = "tf-hit-style";
    el.textContent = "::highlight(tf-hit) { background-color: var(--accent); color: var(--on-accent); }";
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    // The original URL, directive included, survives on the navigation entry even though location hides it.
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    let frag = nav?.name && nav.name.includes(":~:") ? nav.name.slice(nav.name.indexOf(":~:")) : "";
    try {
      if (frag) sessionStorage.setItem(KEY, JSON.stringify({ path: location.pathname, frag }));
      else if (nav?.type === "reload") {
        const saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
        if (saved?.path === location.pathname) frag = saved.frag;
      } else sessionStorage.removeItem(KEY);
    } catch {}
    const directives = frag ? parse(frag) : [];
    if (!directives.length) return;

    let cancelled = false;
    let clear: (() => void) | null = null;
    const timers: number[] = [];

    const dismiss = () => {
      clear?.();
      clear = null;
      window.removeEventListener("pointerdown", dismiss, true);
      window.removeEventListener("keydown", dismiss, true);
    };

    const attempt = (tries: number) => {
      if (cancelled) return;
      const flat = flatten(document.querySelector("main") || document.body);
      const ranges = directives.map((d) => find(flat, d)).filter((r): r is Range => !!r);
      if (!ranges.length) {
        if (tries > 0) timers.push(window.setTimeout(() => attempt(tries - 1), 600));
        return;
      }
      clear?.();
      clear = paint(ranges);
      bringIntoView(ranges[0]);
      // Like the native highlight: it goes away on the next click / tap / key press.
      window.addEventListener("pointerdown", dismiss, true);
      window.addEventListener("keydown", dismiss, true);
    };

    // Wait for the loader / route curtain, then give layout a beat to settle.
    whenReadySafe().then(() => {
      if (!cancelled) timers.push(window.setTimeout(() => attempt(3), 400));
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      dismiss();
    };
  }, []);

  return null;
}