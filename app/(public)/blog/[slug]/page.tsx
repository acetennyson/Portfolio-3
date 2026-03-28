import { getBlogBySlug } from "../../../../firebase/firestore";
import BlockRenderer from "../../../../components/renderers/BlockRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug) as any;

  if (!blog) return notFound();

  return (
    <article className="max-w-2xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
        <ArrowLeft size={14} /> Back home
      </Link>

      <header className="mb-12">
        <time className="text-xs" style={{ color: "var(--fg-muted)" }}>
          {blog.createdAt?.toDate?.() ? new Date(blog.createdAt.toDate()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Just now"}
        </time>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight grad-text">
          {blog.title}
        </h1>
        <div className="mt-6 h-px w-full" style={{ background: "var(--border)" }} />
      </header>

      <div className="prose prose-lg max-w-none" style={{ color: "var(--fg)" }}>
        <BlockRenderer blocks={blog.content?.blocks || []} />
      </div>
    </article>
  );
}
