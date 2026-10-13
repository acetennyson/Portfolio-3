import type Lenis from "lenis";

let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let locks = 0;
/** Stack-safe scroll lock used by the loader and the fullscreen menu. */
export function lockScroll(lock: boolean) {
  locks = Math.max(0, locks + (lock ? 1 : -1));
  const on = locks > 0;
  if (instance) {
    if (on) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = on ? "hidden" : "";
}

const waitFor = (ev: string) => new Promise<void>((resolve) => window.addEventListener(ev, () => resolve(), { once: true }));

/**
 * Resolves once the loader has finished AND no route transition is covering the screen,
 * so entrance animations play when the user can actually see them.
 */
export async function whenReady(): Promise<void> {
  if (typeof document === "undefined") return;
  const d = document.documentElement;
  if (d.dataset.loader !== "done") await waitFor("app:ready");
  if (d.dataset.transition === "covering") await waitFor("page:reveal");
}

/**
 * whenReady() with a ceiling. If a loader/transition event never fires (bug, error, tab
 * restored from bfcache...) content must not stay at opacity:0 forever.
 */
export function whenReadySafe(maxMs = 7000): Promise<void> {
  return Promise.race([
    whenReady().catch(() => {}),
    new Promise<void>((resolve) => window.setTimeout(resolve, maxMs)),
  ]);
}

/**
 * Fire `onEnter` once when `el` first reaches the viewport. Safe for ANY element size.
 *
 *  - threshold 0 (+ rootMargin): "any pixel visible", never a % of the element's area.
 *    A % threshold is impossible to reach once the element is taller than viewport / %.
 *  - `onEnter(true)`  -> element is already ABOVE the viewport (hash link, scroll restore,
 *    reload mid-page): show it instantly, don't animate something nobody can see.
 *  - No IntersectionObserver -> show immediately.
 *
 * Returns a cleanup function.
 */
export function onEnterView(el: Element, onEnter: (alreadyPassed: boolean) => void): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onEnter(false);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          io.disconnect();
          onEnter(false);
          return;
        }
        if (e.boundingClientRect.bottom < 0) {
          // fully scrolled past before we ever saw it
          io.disconnect();
          onEnter(true);
          return;
        }
      }
    },
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  io.observe(el);
  return () => io.disconnect();
}
