// OpenRouter model ids look like "provider/model-name[:variant]"
const OPENROUTER_MODEL_PATTERN = /^[\w.-]+\/[\w.:-]+$/

export const DEFAULT_OPENROUTER_MODEL = 'meta-llama/llama-3.1-8b-instruct:free'

/**
 * Falls back to a known-valid free model whenever the env var is missing
 * or malformed, instead of silently sending an invalid model id upstream.
 */
export function resolveModel(envModel: string | undefined, fallback: string = DEFAULT_OPENROUTER_MODEL): string {
  return envModel && OPENROUTER_MODEL_PATTERN.test(envModel) ? envModel : fallback
}
