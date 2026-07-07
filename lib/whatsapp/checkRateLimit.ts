import { evaluateRequest, DEFAULT_BUCKET_CONFIG, type BucketConfig } from './tokenBucket'
import { getBucketState, saveBucketState } from '@/firebase/rateLimitStore'

/**
 * Checks whether `phone` is allowed to send another message right now,
 * persisting the updated bucket state either way.
 */
export async function checkRateLimit(
  phone: string,
  config: BucketConfig = DEFAULT_BUCKET_CONFIG
): Promise<boolean> {
  const current = await getBucketState(phone, config.capacity)
  const { state, allowed } = evaluateRequest(current, Date.now(), config)
  await saveBucketState(phone, state)
  return allowed
}
