import { getProjects } from "../../../../firebase/firestore";
import { allowedOrigins, fetchScreenshot, safeUrl } from "../../../../lib/preview";

/**
 * GET /api/preview/image?url=<project live url>
 * Screenshots a project's live site through a provider (keys stay server-side) and caches it hard.
 * Only your own projects' origins are allowed, so this can't be used as an open screenshot proxy.
 * On any failure it returns 404 and the UI falls back to the project's cover image.
 */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url") || "";
  const target = safeUrl(raw);
  if (!target) return new Response("Bad url", { status: 400 });

  const live = await getProjects().catch(() => []);
  if (!allowedOrigins(live).has(target.origin)) return new Response("Not allowed", { status: 403 });

  const shot = await fetchScreenshot(target.toString());
  if (!shot) return new Response("No preview", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });

  return new Response(shot.body, {
    headers: {
      "Content-Type": shot.type,
      // 1 day in browsers, 7 days on the CDN, serve stale for a month while refreshing
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
    },
  });
}
