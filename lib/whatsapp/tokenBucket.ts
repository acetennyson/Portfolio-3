export interface BucketState {
  tokens: number
  lastRefill: number // epoch ms
}

export interface BucketConfig {
  capacity: number // max tokens
  refillRatePerMs: number // tokens regenerated per millisecond
  cost: number // tokens consumed per message
}

/**
 * Refills a bucket purely as a function of elapsed time — no conditionals,
 * just clamped linear growth. clamp(x, 0, capacity) shape.
 */
export function refill(state: BucketState, now: number, config: BucketConfig): BucketState {
  const elapsed = Math.max(0, now - state.lastRefill)
  const tokens = Math.min(config.capacity, state.tokens + elapsed * config.refillRatePerMs)
  return { tokens, lastRefill: now }
}

/**
 * Attempts to spend `cost` tokens. Pure: given the same state, always
 * returns the same result.
 */
export function consume(state: BucketState, cost: number): { state: BucketState; allowed: boolean } {
  const allowed = state.tokens >= cost
  const tokens = state.tokens - (allowed ? cost : 0)
  return { state: { tokens, lastRefill: state.lastRefill }, allowed }
}

/**
 * Composition of refill + consume — the single entry point callers need.
 */
export function evaluateRequest(
  state: BucketState,
  now: number,
  config: BucketConfig
): { state: BucketState; allowed: boolean } {
  return consume(refill(state, now, config), config.cost)
}

export const DEFAULT_BUCKET_CONFIG: BucketConfig = {
  capacity: 5, // burst of 5 messages
  refillRatePerMs: 1 / 12000, // 1 token every 12s -> 5/min sustained
  cost: 1,
}
