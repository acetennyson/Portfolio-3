// One shared requestAnimationFrame loop. Lenis, the cursor, magnetic buttons
// (and the WebGL scene in Stage 2) all subscribe here instead of running their own.
type Tick = (time: number, delta: number) => void;

const subs = new Set<Tick>();
let raf = 0;
let last = 0;

function loop(time: number) {
  const delta = last ? time - last : 16.7;
  last = time;
  subs.forEach((fn) => fn(time, delta));
  raf = requestAnimationFrame(loop);
}

export function subscribe(fn: Tick): () => void {
  subs.add(fn);
  if (subs.size === 1 && typeof window !== "undefined") {
    last = 0;
    raf = requestAnimationFrame(loop);
  }
  return () => {
    subs.delete(fn);
    if (subs.size === 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
