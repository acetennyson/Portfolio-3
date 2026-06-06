import Link from "next/link";
import { getBlogs } from "../../../firebase/firestore";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const revalidate = 60;

function formatDate(date: any): string {
  if (!date) return "Just now";
  if (date?.toDate) return new Date(date.toDate()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  if (date instanceof Date) return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return "Just now";
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12">
      <header>
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70" style={{ color: "var(--fg-muted)" }}>
          <ArrowLeft size={14} /> Back home
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Writing</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: "var(--fg)" }}>Latest Thoughts</h1>
          <p className="mt-3 text-base max-w-xl" style={{ color: "var(--fg-muted)" }}>Articles, tutorials, and insights on design, development, and everything in between.</p>
        </div>
      </header>

      {blogs.length === 0 ? (
        <div className="py-16 text-center rounded-2xl" style={{ border: "1px dashed var(--border)", background: "var(--bg-card)" }}>
          <p className="text-base font-medium" style={{ color: "var(--fg-muted)" }}>No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((blog: any) => {
            const date = formatDate(blog.createdAt);
            return (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="card group relative p-6 flex flex-col gap-3 overflow-hidden">
                <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity grad-bg" />
                {blog.coverImage && (
                  <div className="aspect-video rounded-lg overflow-hidden -mx-1 -mt-1" style={{ background: "var(--bg-card-hover)" }}>
                    <img src={blog.coverImage} alt={blog.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <time className="text-xs" style={{ color: "var(--fg-muted)" }}>{date}</time>
                <h2 className="text-lg font-bold leading-snug group-hover:opacity-80 transition-opacity" style={{ color: "var(--fg)" }}>
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--fg-muted)" }}>{blog.excerpt}</p>
                )}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {blog.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--bg-card-hover)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs font-bold mt-1 grad-text">
                  Read more <ArrowRight size={11} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
