import { evaluateRequest, type BucketConfig, type BucketState } from "../whatsapp/tokenBucket";

// Burst of 3 submissions, then one more every 2 minutes.
const CONTACT_BUCKET: BucketConfig = { capacity: 3, refillRatePerMs: 1 / 120000, cost: 1 };

// Per server instance. On serverless this resets on cold starts, which is fine as a
// first line of defence; the honeypot and validation handle the rest.
const buckets = new Map<string, BucketState>();
const MAX_KEYS = 5000;

export function allowContact(key: string, now = Date.now()): boolean {
  const current = buckets.get(key) ?? { tokens: CONTACT_BUCKET.capacity, lastRefill: now };
  const { state, allowed } = evaluateRequest(current, now, CONTACT_BUCKET);
  if (buckets.size >= MAX_KEYS) buckets.delete(buckets.keys().next().value as string);
  buckets.set(key, state);
  return allowed;
}
