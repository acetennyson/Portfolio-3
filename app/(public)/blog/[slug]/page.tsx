import Link from "next/link";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getPost, getAllPosts } from "../../../../lib/blog-server";
import { blogView, describe, plainText, readingTime } from "../../../../lib/blog";
import { AUTHOR_NAME, SITE_NAME, SITE_URL, TWITTER_HANDLE, absoluteUrl, jsonLdString, toAbsolute } from "../../../../lib/site";
import SplitReveal from "../../../../components/motion/SplitReveal";
import Reveal from "../../../../components/motion/Reveal";
import CoverParallax from "../../../../components/work/CoverParallax";
import BlockRenderer from "../../../../components/renderers/BlockRenderer";
import { MDXComponents } from "../../../../components/mdx/MDXComponents";
import { PostProvider } from "../../../../components/mdx/PostContext";
import { resolveTheme } from "../../../../components/mdx/courseThemes";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog: any = await getPost(slug);
  if (!blog) return { title: "Post not found", robots: { index: false, follow: false } };

  const view = blogView(blog);
  const path = `/blog/${slug}`;
  const description = describe(view.excerpt, blog.content, `${view.title} — an article by ${AUTHOR_NAME}.`);

  // No `images` here on purpose: the sibling opengraph-image.tsx / twitter-image.tsx files generate a
  // correctly-sized card per post, and Next wires them into og:image / twitter:image automatically.
  return {
    title: view.title,
    description,
    keywords: view.tags.length ? view.tags : undefined,
    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      title: view.title,
      description,
      publishedTime: view.iso,
      modifiedTime: view.updatedIso ?? view.iso,
      authors: [AUTHOR_NAME],
      section: view.tags[0],
      tags: view.tags.length ? view.tags : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: view.title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog: any = await getPost(slug);
  if (!blog) return notFound();

  const allBlogs: any[] = await getAllPosts();
  const idx = allBlogs.findIndex((b: any) => b.slug === slug);
  const next = allBlogs.length > 1 ? allBlogs[(idx + 1) % allBlogs.length] : null;
  const num = String((idx < 0 ? 0 : idx) + 1).padStart(2, "0");

  const view = blogView(blog);
  const contentString = typeof blog.content === "string" ? blog.content : null;
  const courseTheme = resolveTheme(
    [slug, view.title, ...(Array.isArray(view.tags) ? view.tags : [])].join(" ")
  );
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

  const postUrl = absoluteUrl(`/blog/${view.slug}`);
  const description = describe(view.excerpt, contentString, `${view.title} — an article by ${AUTHOR_NAME}.`);
  const words = plainText(contentString ?? "").split(/\s+/).filter(Boolean).length;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    headline: view.title.slice(0, 110),
    description,
    image: view.cover ? [toAbsolute(view.cover)] : undefined,
    url: postUrl,
    datePublished: view.iso,
    dateModified: view.updatedIso ?? view.iso,
    inLanguage: "en",
    wordCount: words || undefined,
    author: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
    publisher: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
    keywords: view.tags.length ? view.tags.join(", ") : undefined,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Writing", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: view.title, item: postUrl },
    ],
  };

  return (
    <article className="cs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }} />
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
                <PostProvider slug={slug} theme={courseTheme}>
                  <MDXRemote
                    source={contentString}
                    components={MDXComponents}
                    options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                  />
                </PostProvider>
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
