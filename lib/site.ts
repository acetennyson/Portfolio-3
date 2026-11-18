/**
 * Single source of truth for the site's public URL + identity.
 *
 * NEXT_PUBLIC_SITE_URL wins. If it isn't set (it's easy to forget on a host), fall back to the
 * platform's own URL before ever falling back to localhost, so canonical / og:url / sitemap entries
 * never point at http://localhost:3000 in production.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelPreview = process.env.VERCEL_URL;
  let raw = explicit || (vercelProd ? vercelProd : vercelPreview ? vercelPreview : "http://localhost:3000");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  return raw.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Ado Daniel Nji";
export const AUTHOR_NAME = "Ado Daniel Nji";
export const TWITTER_HANDLE = "@AdoNj84371";

/** "/blog/x" -> "https://site.com/blog/x" */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Make a stored image URL absolute (covers may be "/blogAssets/x.png" or a full https URL). */
export function toAbsolute(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return absoluteUrl(url);
}

/** JSON.stringify for <script type="application/ld+json">, safe against "</script>" in titles/excerpts. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
