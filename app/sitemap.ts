import type { MetadataRoute } from "next";
import { tools } from "../lib/tools";
import { getBlogs, getProjects } from "../firebase/firestore";
import { resolveProjects } from "../lib/projects";
import { blogView } from "../lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [liveProjects, liveBlogs] = await Promise.all([
    getProjects().catch(() => []),
    getBlogs().catch(() => []),
  ]);

  const projects = resolveProjects(liveProjects);
  const blogs = liveBlogs.map(blogView);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tools`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ...tools.map((t) => ({ url: `${SITE_URL}${t.href}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((b) => {
    const parsed = b.date && b.date !== "Just now" ? new Date(b.date) : null;
    return {
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: parsed && !isNaN(parsed.getTime()) ? parsed : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [...staticPages, ...projectPages, ...blogPages];
}
