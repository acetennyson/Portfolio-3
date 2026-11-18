import { getAllPosts } from "../../../../lib/blog-server";
import { blogView, describe } from "../../../../lib/blog";
import { AUTHOR_NAME, SITE_URL, absoluteUrl } from "../../../../lib/site";

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** GET /blog/feed.xml — RSS 2.0 so readers, aggregators and crawlers can discover new posts. */
export async function GET() {
  const raw = await getAllPosts();
  const items = raw.map((b) => ({ view: blogView(b), content: b.content }));

  const body = items
    .map(({ view, content }) => {
      const link = absoluteUrl(`/blog/${view.slug}`);
      return `    <item>
      <title>${esc(view.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>${view.iso ? `\n      <pubDate>${new Date(view.iso).toUTCString()}</pubDate>` : ""}
      <description>${esc(describe(view.excerpt, content, view.title, 300))}</description>${view.tags.map((t) => `\n      <category>${esc(t)}</category>`).join("")}
    </item>`;
    })
    .join("\n");

  const newest = items.find((i) => i.view.iso)?.view.iso;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Writing — ${esc(AUTHOR_NAME)}</title>
    <link>${esc(absoluteUrl("/blog"))}</link>
    <description>Articles, tutorials and notes on design, development and everything in between.</description>
    <language>en</language>${newest ? `\n    <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : ""}
    <atom:link href="${esc(`${SITE_URL}/blog/feed.xml`)}" rel="self" type="application/rss+xml" />
${body}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
