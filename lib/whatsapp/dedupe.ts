/**
 * True when `lastSeenTs` falls inside the dedupe window relative to `now`.
 * Pure: no I/O, just arithmetic on timestamps.
 */
export function isWithinWindow(lastSeenTs: number | null, now: number, windowMs: number): boolean {
  return lastSeenTs !== null && now - lastSeenTs < windowMs
}

export const DEFAULT_DEDUPE_WINDOW_MS = 5 * 60 * 1000 // 5 minutes
