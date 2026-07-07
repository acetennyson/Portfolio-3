import { computeHmacSignature, constantTimeEquals } from './signature'

/**
 * Verifies a POST body actually came from Meta, using the app secret.
 * Returns false (never throws) so callers can treat any failure the same way.
 */
export function isAuthenticWebhookPayload(
  rawBody: string,
  headerSignature: string | null,
  appSecret: string | undefined
): boolean {
  if (!appSecret || !headerSignature) return false
  const expected = computeHmacSignature(rawBody, appSecret)
  return constantTimeEquals(expected, headerSignature)
}
