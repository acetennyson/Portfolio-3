import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogBySlug, getBlogs } from "../../../../firebase/firestore";
import { blogView, formatDate, readingTime } from "../../../../lib/blog";
import SplitReveal from "../../../../components/motion/SplitReveal";
import Reveal from "../../../../components/motion/Reveal";
import CoverParallax from "../../../../components/work/CoverParallax";
import BlockRenderer from "../../../../components/renderers/BlockRenderer";
import { MDXComponents } from "../../../../components/mdx/MDXComponents";

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

function extractHeadingsFromMdx(mdx: string): { level: number; text: string }[] {
  const headings: { level: number; text: string }[] = [];
  const lines = mdx.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      if (level <= 3) headings.push({ level, text });
    }
  }
  
  return headings;
}

function isHtml(content: string): boolean {
  return content.trim().startsWith('<');
}

function isMdx(content: string): boolean {
  // MDX if it contains JSX components (starts with < but not HTML tags)
  // or contains markdown heading syntax
  return content.includes('<') || /^#{1,6}\s/.test(content);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog: any = await getBlogBySlug(slug).catch(() => null);
  if (!blog) return { title: "Post" };

  const url = `/blog/${slug}`;
  const description = blog.excerpt || `${blog.title} — an article by Ado Daniel Nji.`;

  return {
    title: blog.title,
    description,
    keywords: Array.isArray(blog.tags) ? blog.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: blog.title,
      description,
      images: blog.coverImage ? [{ url: blog.coverImage, width: 1200, height: 630, alt: blog.title }] : undefined,
      publishedTime: blog.createdAt?.toDate?.()?.toISOString?.() || undefined,
      tags: Array.isArray(blog.tags) ? blog.tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
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
  const contentString = typeof blog.content === "string" ? blog.content : null;
  const isHtmlContent = contentString ? isHtml(contentString) : false;
  const processedContent = isHtmlContent ? prepareHtml(contentString!) : null;
  
  // Extract headings based on content type
  let headings: { level: number; text: string }[] = [];
  if (isHtmlContent && contentString) {
    headings = extractHeadings(contentString);
  } else if (contentString && !isHtmlContent) {
    headings = extractHeadingsFromMdx(contentString);
  }
  
  const time = readingTime(contentString ?? JSON.stringify(blog.content?.blocks || ""));

  const meta: [string, string | undefined][] = [
    ["Published", view.date],
    ["Reading time", time],
  ];

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: view.title,
    description: view.excerpt || undefined,
    image: view.cover,
    url: `${SITE_URL}/blog/${view.slug}`,
    datePublished: view.date !== "Just now" ? view.date : undefined,
    author: { "@type": "Person", name: "Ado Daniel Nji", url: SITE_URL },
    publisher: { "@type": "Person", name: "Ado Daniel Nji" },
    keywords: view.tags.join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Writing", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: view.title, item: `${SITE_URL}/blog/${view.slug}` },
    ],
  };

  return (
    <article className="cs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
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
                // Legacy HTML content
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              ) : contentString && !isHtmlContent ? (
                // MDX content with custom components
                <MDXRemote source={contentString} components={MDXComponents} />
              ) : (
                // Editor.js blocks (legacy)
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
