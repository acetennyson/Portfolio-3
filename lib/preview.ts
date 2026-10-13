import { staticProjects } from "./data";

/** Only public http(s) sites. Blocks localhost / private ranges / IP literals (SSRF guard). */
export function safeUrl(raw: string): URL | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return null;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h) || h.includes(":")) return null; // IPv4 / IPv6 literals
    if (!h.includes(".")) return null;
    return u;
  } catch {
    return null;
  }
}

/** Origins the preview proxy is allowed to screenshot = the live URLs of your own projects. */
export function allowedOrigins(liveProjects: any[]): Set<string> {
  const set = new Set<string>();
  [...liveProjects, ...staticProjects].forEach((p: any) => {
    const u = typeof p?.liveUrl === "string" ? safeUrl(p.liveUrl) : null;
    if (u) set.add(u.origin);
  });
  return set;
}

/** Can this page be shown in an <iframe> on our site? Reads X-Frame-Options / CSP frame-ancestors. */
export async function isEmbeddable(raw: string): Promise<boolean> {
  const u = safeUrl(raw);
  if (!u || u.protocol !== "https:") return false; // http would be blocked as mixed content
  try {
    const res = await fetch(u.toString(), {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; PortfolioPreviewBot/1.0)" },
      next: { revalidate: 3600 },
    } as RequestInit);
    res.body?.cancel().catch(() => {});
    if (!res.ok) return false;
    const xfo = (res.headers.get("x-frame-options") || "").toLowerCase();
    if (xfo.includes("deny") || xfo.includes("sameorigin")) return false;
    const csp = (res.headers.get("content-security-policy") || "").toLowerCase();
    const fa = csp.match(/frame-ancestors([^;]*)/);
    if (fa && !fa[1].includes("*")) return false; // restricted to specific origins we can't match
    return true;
  } catch {
    return false;
  }
}

/* ───────── Screenshot providers (tried in order until one returns an image) ─────────
 * SCREENSHOT_PROVIDERS = "microlink,thumio,screenshotone"   (default: microlink,thumio)
 * MICROLINK_API_KEY / THUMIO_KEY / SCREENSHOTONE_KEY        (all optional except screenshotone)
 */
type Provider = (url: string, signal: AbortSignal) => Promise<Response | null>;

const microlink: Provider = async (url, signal) => {
  const q = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&type=jpeg&viewport.width=1280&viewport.height=800&waitUntil=networkidle2`;
  const headers: Record<string, string> = {};
  if (process.env.MICROLINK_API_KEY) headers["x-api-key"] = process.env.MICROLINK_API_KEY;
  const r = await fetch(q, { headers, signal });
  if (!r.ok) return null;
  const j: any = await r.json().catch(() => null);
  const shot = j?.data?.screenshot?.url;
  if (!shot) return null;
  return fetch(shot, { signal });
};

const thumio: Provider = async (url, signal) => {
  const key = process.env.THUMIO_KEY;
  const base = `https://image.thum.io/get/${key ? `auth/${key}/` : ""}width/1280/crop/800/noanimate/`;
  return fetch(base + url, { signal });
};

const screenshotone: Provider = async (url, signal) => {
  const key = process.env.SCREENSHOTONE_KEY;
  if (!key) return null;
  const q = `https://api.screenshotone.com/take?access_key=${key}&url=${encodeURIComponent(url)}&viewport_width=1280&viewport_height=800&format=jpg&image_quality=82&block_ads=true&block_cookie_banners=true&cache=true`;
  return fetch(q, { signal });
};

const PROVIDERS: Record<string, Provider> = { microlink, thumio, screenshotone };

export async function fetchScreenshot(url: string): Promise<{ body: ArrayBuffer; type: string } | null> {
  const order = (process.env.SCREENSHOT_PROVIDERS || "microlink,thumio").split(",").map((s) => s.trim()).filter(Boolean);
  for (const name of order) {
    const p = PROVIDERS[name];
    if (!p) continue;
    try {
      const res = await p(url, AbortSignal.timeout(25000));
      const type = res?.headers.get("content-type") || "";
      if (res && res.ok && type.startsWith("image/")) return { body: await res.arrayBuffer(), type };
    } catch {
      /* try next provider */
    }
  }
  return null;
}
