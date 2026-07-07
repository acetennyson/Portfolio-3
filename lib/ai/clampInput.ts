const DEFAULT_MAX_LENGTH = 500

/**
 * Truncates inbound WhatsApp message text before it's sent to the model.
 * Prevents someone pasting a huge wall of text from inflating token usage
 * on a per-request basis.
 */
export function clampInput(text: string, maxLength: number = DEFAULT_MAX_LENGTH): string {
  return text.length > maxLength ? text.slice(0, maxLength) : text
}
