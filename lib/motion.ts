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
