import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogBySlug, getBlogs } from "../../../../firebase/firestore";
import { blogView, formatDate, readingTime } from "../../../../lib/blog";
import SplitReveal from "../../../../components/motion/SplitReveal";
import Reveal from "../../../../components/motion/Reveal";
import CoverParallax from "../../../../components/work/CoverParallax";
import BlockRenderer from "../../../../components/renderers/BlockRenderer";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog: any = await getBlogBySlug(slug).catch(() => null);
  return blog ? { title: blog.title, description: blog.excerpt } : { title: "Post" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog: any = await getBlogBySlug(slug).catch(() => null);
  if (!blog) return notFound();

  const allBlogs: any[] = await getBlogs().catch(() => []);
  const idx = allBlogs.findIndex((b: any) => b.slug === slug);
  const next = allBlogs.length > 1 ? allBlogs[(idx + 1) % allBlogs.length] : null;
  const num = String((idx < 0 ? 0 : idx) + 1).padStart(2, "0");

  const view = blogView(blog);
  const processedContent = typeof blog.content === "string" ? prepareHtml(blog.content) : null;
  const headings = processedContent ? extractHeadings(blog.content as string) : [];
  const time = readingTime(processedContent ?? JSON.stringify(blog.content?.blocks || ""));

  const meta: [string, string | undefined][] = [
    ["Published", view.date],
    ["Reading time", time],
  ];

  return (
    <article className="cs">
      <header className="cs-head">
        <Reveal immediate delay={100} className="n-page-top label">
          <Link href="/blog" className="cs-back"><ArrowLeft size={14} /> All writing</Link>
          <span>{num} / {String(allBlogs.length).padStart(2, "0")}</span>
        </Reveal>
        <SplitReveal as="h1" className="cs-title" immediate delay={200} stagger={80} text={view.title} />
        {view.tags.length > 0 && (
          <Reveal immediate delay={600}>
            <p className="cs-tags label">{view.tags.map((t) => <span key={t}>{t}</span>)}</p>
          </Reveal>
        )}
      </header>

      <CoverParallax src={view.cover} title={view.title} label={num} />

      <div className="cs-grid">
        <aside className="cs-meta">
          {meta.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><span className="label">{k}</span><p>{v}</p></div>
          ))}
          {headings.length > 0 && (
            <div>
              <span className="label">On this page</span>
              <nav className="cs-toc">
                {headings.map((h, i) => (
                  <span key={i} style={{ paddingLeft: `${(h.level - 1) * 10}px` }}>{h.text}</span>
                ))}
              </nav>
            </div>
          )}
        </aside>

        <div className="cs-body">
          {view.excerpt && <Reveal y={50}><p className="cs-lead">{view.excerpt}</p></Reveal>}

          <Reveal y={40}>
            <div className="cs-block blog-content">
              {processedContent !== null ? (
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              ) : (
                <BlockRenderer blocks={blog.content?.blocks || []} />
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {next && (
        <Link href={`/blog/${next.slug}`} className="cs-next" data-transition-title={next.title}>
          <span className="label">( Next post )</span>
          <span className="cs-next-title">{next.title}<ArrowRight size={56} strokeWidth={1.2} aria-hidden /></span>
        </Link>
      )}
    </article>
  );
}
