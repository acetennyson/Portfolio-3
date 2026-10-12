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

/** Resolves once the loader has finished (or immediately if it was already seen). */
export function whenReady(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (document.documentElement.dataset.loader === "done") return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener("app:ready", () => resolve(), { once: true });
  });
}
