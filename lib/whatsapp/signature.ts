import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Computes the HMAC-SHA256 digest Meta signs webhook payloads with,
 * formatted the same way Meta sends it in X-Hub-Signature-256.
 */
export function computeHmacSignature(rawBody: string, secret: string): string {
  const digest = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')
  return `sha256=${digest}`
}

/**
 * Constant-time string comparison. Avoids leaking match-length via timing,
 * which a naive `a === b` would do.
 */
export function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}
