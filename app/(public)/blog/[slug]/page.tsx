import { getBlogBySlug, getBlogs } from "../../../../firebase/firestore";
import BlockRenderer from "../../../../components/renderers/BlockRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

function formatDate(date: any): string {
  if (!date) return "Just now";
  if (date?.toDate) return new Date(date.toDate()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  if (date instanceof Date) return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return "Just now";
}

function prepareHtml(html: string): string {
  return html.replace(/\b(?:not-)?dark:[^\s"'>]+/g, "").replace(/\s{2,}/g, " ").trim();
}

function extractHeadings(html: string): { level: number; text: string }[] {
  const headings: { level: number; text: string }[] = [];
  const regex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    if (text) headings.push({ level: Number(match[1]), text });
  }
  return headings;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug) as any;

  if (!blog) return notFound();

  const processedContent = typeof blog.content === "string" ? prepareHtml(blog.content) : null;
  const allBlogs = await getBlogs();
  const recentBlogs = allBlogs.filter((b: any) => b.slug !== slug).slice(0, 4);
  const headings = processedContent ? extractHeadings(blog.content as string) : [];

  const allTags = [...new Set(allBlogs.flatMap((b: any) => b.tags || []))] as string[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-60" style={{ color: "var(--fg-muted)" }}>
        <ArrowLeft size={13} /> Back to posts
      </Link>

      {blog.coverImage && (
        <div className="mt-6 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <img src={blog.coverImage} alt={blog.title} className="w-full object-cover aspect-video" />
        </div>
      )}

      <header className="mt-8 mb-2">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--bg-card-hover)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-balance text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight grad-text">
          {blog.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm" style={{ color: "var(--fg-muted)" }}>
          <time>{formatDate(blog.createdAt)}</time>
          {blog.excerpt && (
            <>
              <span>·</span>
              <span className="line-clamp-1">{blog.excerpt}</span>
            </>
          )}
        </div>
      </header>

      <div className="mt-10 flex flex-col lg:flex-row gap-10">
        <article className="flex-1 min-w-0" style={{ color: "var(--fg)" }}>
          <style>{`
            .blog-content { line-height: 1.75; }
            .blog-content a { color: var(--accent) !important; }
            .blog-content a:hover { opacity: 0.8 !important; }
            .blog-content p { margin-bottom: 1em; }
            .blog-content h1, .blog-content h2, .blog-content h3 { color: var(--fg) !important; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 700; }
            .blog-content h1 { font-size: 1.875rem; }
            .blog-content h2 { font-size: 1.5rem; }
            .blog-content h3 { font-size: 1.25rem; }
            .blog-content ul, .blog-content ol { padding-left: 1.5em; margin-bottom: 1em; }
            .blog-content li { margin-bottom: 0.25em; }
            .blog-content img { border-radius: 0.75rem; max-width: 100%; height: auto; border: 1px solid var(--border); }
            .blog-content pre { border-radius: 0.75rem; padding: 1rem; overflow-x: auto; background: var(--bg-card) !important; border: 1px solid var(--border); }
            .blog-content blockquote { border-left: 3px solid var(--accent); padding-left: 1em; margin: 1em 0; color: var(--fg-muted); }
            .blog-content strong { color: var(--fg); }
            .blog-content .text-gray-900, .blog-content .text-gray-800, .blog-content .text-gray-700,
            .blog-content .text-gray-600, .blog-content .text-gray-500, .blog-content .text-gray-400,
            .blog-content .text-white, .blog-content .text-black,
            .blog-content .text-red-600, .blog-content .text-red-400,
            .blog-content .text-blue-600, .blog-content .text-blue-400 { color: inherit !important; }
            .blog-content .bg-white, .blog-content .bg-gray-50, .blog-content .bg-gray-100,
            .blog-content .bg-gray-900, .blog-content .bg-gray-800 { background: transparent !important; }
            .blog-content .shadow-md, .blog-content .shadow-lg { box-shadow: none !important; }
            .blog-content .border-gray-200, .blog-content .border-gray-300,
            .blog-content .border-gray-700, .blog-content .border-gray-600 { border-color: var(--border) !important; }
          `}</style>
          <div className="blog-content">
            {processedContent !== null ? (
              <div dangerouslySetInnerHTML={{ __html: processedContent }} />
            ) : (
              <BlockRenderer blocks={blog.content?.blocks || []} />
            )}
          </div>
        </article>

        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-6">
            {headings.length > 0 && (
              <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>On this page</h3>
                <nav className="space-y-1.5">
                  {headings.map((h, i) => (
                    <div key={i} className="text-sm transition-opacity hover:opacity-70"
                      style={{ paddingLeft: `${(h.level - 1) * 12}px`, color: "var(--fg-muted)" }}>
                      {h.text}
                    </div>
                  ))}
                </nav>
              </div>
            )}

            {recentBlogs.length > 0 && (
              <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Recent posts</h3>
                <div className="space-y-3">
                  {recentBlogs.map((b: any) => (
                    <Link key={b.id} href={`/blog/${b.slug}`} className="group flex items-start gap-3 transition-opacity hover:opacity-70">
                      {b.coverImage && (
                        <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden" style={{ background: "var(--bg-card-hover)" }}>
                          <img src={b.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "var(--fg)" }}>{b.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>{formatDate(b.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-bold mt-3 grad-text">
                  View all <ArrowRight size={11} />
                </Link>
              </div>
            )}

            {allTags.length > 0 && (
              <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.slice(0, 12).map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--bg-card-hover)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
