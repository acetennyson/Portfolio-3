import type { Metadata } from "next";
import { getAllPosts } from "../../../lib/blog-server";
import { SITE_NAME, TWITTER_HANDLE } from "../../../lib/site";
import SplitReveal from "../../../components/motion/SplitReveal";
import Reveal from "../../../components/motion/Reveal";
import BlogIndex from "../../../components/blog/BlogIndex";
import { blogView } from "../../../lib/blog";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Writing",
  description: "Articles, tutorials and notes on full-stack development, design and AI by Ado Daniel Nji.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": [{ url: "/blog/feed.xml", title: "Writing — Ado Daniel Nji" }] } },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Writing — Ado Daniel Nji",
    description: "Articles, tutorials and notes on design, development and everything in between.",
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: "Writing — Ado Daniel Nji",
    description: "Articles, tutorials and notes on design, development and everything in between.",
  },
};

export default async function BlogPage() {
  const raw = await getAllPosts();
  const items = raw.map(blogView);

  return (
    <section className="n-page">
      <Reveal immediate delay={100} className="n-page-top label">
        <span>( Writing )</span>
        <span>{String(items.length).padStart(2, "0")} posts</span>
      </Reveal>
      <SplitReveal as="h1" className="n-page-title" immediate delay={200} stagger={90} text="Latest *thoughts*" />
      <Reveal immediate delay={500}>
        <p className="n-page-lead">Articles, tutorials and notes on design, development, and everything in between.</p>
      </Reveal>
      <BlogIndex items={items} />
    </section>
  );
}
