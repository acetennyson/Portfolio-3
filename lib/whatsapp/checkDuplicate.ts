import { isWithinWindow, DEFAULT_DEDUPE_WINDOW_MS } from './dedupe'
import { getSeenTimestamp, markSeen } from '@/firebase/dedupeStore'

/**
 * Returns true if this WhatsApp message ID was already processed recently.
 * Always marks the message as seen, so the window slides forward.
 */
export async function isDuplicateMessage(
  messageId: string,
  windowMs: number = DEFAULT_DEDUPE_WINDOW_MS
): Promise<boolean> {
  const now = Date.now()
  const lastSeen = await getSeenTimestamp(messageId)
  const duplicate = isWithinWindow(lastSeen, now, windowMs)
  await markSeen(messageId, now)
  return duplicate
}
