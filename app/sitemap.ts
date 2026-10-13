import type { MetadataRoute } from "next";
import { tools } from "../lib/tools";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/blog", "/tools", ...tools.map((t) => t.href)];
  return pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 }));
}
