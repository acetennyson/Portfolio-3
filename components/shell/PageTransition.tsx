"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { animate, stagger } from "animejs";
import { getLenis, lockScroll, prefersReducedMotion } from "../../lib/motion";

/**
 * Route transitions: an accent curtain followed by a page-coloured curtain carrying the destination title.
 *  - Link clicks are intercepted (capture phase), the curtain covers, THEN router.push runs.
 *  - Back/forward (popstate) and programmatic navigations can't be intercepted, so the curtain snaps shut
 *    before paint (layout effect) and wipes away -> same look, no flash of the new page.
 *  - New pages hold their entrance animations until the curtain is leaving (see whenReady in lib/motion).
 */

const MAP: Record<string, string> = { "/": "Home", "/projects": "Work", "/blog": "Writing", "/tools": "The Lab", "/privacy": "Privacy" };
const pretty = (s: string) => decodeURIComponent(s).replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
function titleFor(path: string, el?: Element | null): string {
  const custom = el?.closest("[data-transition-title]")?.getAttribute("data-transition-title");
  if (custom) return custom;
  const clean = path.replace(/\/+$/, "") || "/";
  if (MAP[clean]) return MAP[clean];
  const seg = clean.split("/").filter(Boolean);
  if (seg[0] === "projects") return "Case study";
  if (seg[0] === "blog") return "Article";
  if (seg[0] === "tools" && seg[1]) return pretty(seg[1]);
  return pretty(seg[seg.length - 1] || "Home");
}

function run(targets: any, params: Record<string, any>): Promise<void> {
  return new Promise((resolve) => {
    animate(targets, { ...params, onComplete: () => resolve() });
  });
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const layerA = useRef<HTMLDivElement>(null);
  const layerB = useRef<HTMLDivElement>(null);
  const titleEl = useRef<HTMLDivElement>(null);
  const prev = useRef(pathname);
  const busy = useRef(false);
  const pending = useRef(false);
  const safety = useRef<number>(0);

  const setTitle = (text: string) => {
    const el = titleEl.current;
    if (!el) return;
    el.textContent = "";
    text.split(/\s+/).filter(Boolean).forEach((w) => {
      const outer = document.createElement("span");
      outer.className = "pt-w";
      const inner = document.createElement("span");
      inner.className = "pt-i";
      inner.textContent = w;
      outer.appendChild(inner);
      el.appendChild(outer);
      el.appendChild(document.createTextNode(" "));
    });
  };
  const words = () => Array.from(titleEl.current?.querySelectorAll<HTMLElement>(".pt-i") || []);

  const cover = async (title: string) => {
    setTitle(title);
    const o = overlay.current!;
    o.style.pointerEvents = "auto";
    await Promise.all([
      run(layerA.current, { translateY: ["100%", "0%"], duration: 800, ease: "inOutQuart" }),
      run(layerB.current, { translateY: ["100%", "0%"], duration: 800, delay: 110, ease: "inOutQuart" }),
      run(words(), { translateY: ["110%", "0%"], duration: 750, delay: stagger(55, { start: 520 }), ease: "outExpo" }),
    ]);
  };

  const reveal = async () => {
    const d = document.documentElement;
    window.setTimeout(() => {
      d.dataset.transition = "revealing"; // lets the new page's Reveal / SplitReveal start now
      window.dispatchEvent(new Event("page:reveal"));
    }, 380);
    await Promise.all([
      run(words(), { translateY: ["0%", "-110%"], duration: 520, ease: "inQuart" }),
      run(layerB.current, { translateY: ["0%", "-100%"], duration: 900, delay: 160, ease: "inOutQuart" }),
      run(layerA.current, { translateY: ["0%", "-100%"], duration: 900, delay: 280, ease: "inOutQuart" }),
    ]);
    [layerA.current, layerB.current].forEach((l) => l && (l.style.transform = "translateY(100%)"));
    if (overlay.current) overlay.current.style.pointerEvents = "none";
    delete d.dataset.transition;
    lockScroll(false);
    busy.current = false;
    pending.current = false;
  };

  // New route committed: reset scroll, make sure the curtain is closed (instantly, before paint, if it wasn't ours), then reveal.
  useLayoutEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    window.clearTimeout(safety.current);
    const ours = pending.current;
    const lenis = getLenis();

    if (prefersReducedMotion()) {
      window.scrollTo(0, 0);
      return;
    }
    const d = document.documentElement;
    if (!ours) {
      // back / forward / programmatic navigation: close the curtain before the browser paints the new page
      busy.current = true;
      d.dataset.transition = "covering";
      lockScroll(true);
      setTitle(titleFor(pathname));
      [layerA.current, layerB.current].forEach((l) => l && (l.style.transform = "translateY(0%)"));
      words().forEach((w) => (w.style.transform = "translateY(0%)"));
      if (overlay.current) overlay.current.style.pointerEvents = "auto";
    }
    if (ours) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    window.setTimeout(() => {
      if (!ours) lenis?.scrollTo(window.scrollY, { immediate: true, force: true }); // sync Lenis with the browser-restored position
      lenis?.resize();
      reveal();
    }, ours ? 260 : 380);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Intercept internal link clicks
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let u: URL;
      try { u = new URL(a.href, location.href); } catch { return; }
      if (u.origin !== location.origin) return;
      if (u.pathname.startsWith("/api") || u.pathname.startsWith("/admin")) return;
      if (u.pathname === location.pathname) return; // same page / hash jump: native behaviour
      e.preventDefault();
      e.stopImmediatePropagation();
      if (busy.current) return;

      busy.current = true;
      pending.current = true;
      document.documentElement.dataset.transition = "covering";
      lockScroll(true);
      cover(titleFor(u.pathname, a)).then(() => {
        router.push(u.pathname + u.search + u.hash, { scroll: false });
        // if the route never commits (error / same URL), don't leave the user behind a curtain
        safety.current = window.setTimeout(() => { if (pending.current) { pending.current = true; reveal(); } }, 6000);
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div ref={overlay} className="pt" aria-hidden>
      <div ref={layerA} className="pt-layer pt-a" />
      <div ref={layerB} className="pt-layer pt-b">
        <div className="pt-content">
          <span className="label">( Now entering )</span>
          <div ref={titleEl} className="pt-title" />
        </div>
      </div>
    </div>
  );
}
