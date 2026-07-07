const SAFETY_LINE_PATTERN = /^(User|Response) Safety:.*$/gm

/**
 * Removes moderation/safety-label lines that some free OpenRouter models
 * leak into their output, and trims the result.
 */
export function sanitizeReply(raw: string): string {
  return raw.replace(SAFETY_LINE_PATTERN, '').trim()
}
