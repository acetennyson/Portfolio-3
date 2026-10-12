import Link from "next/link";
import { getBlogs, getProjects } from "../../firebase/firestore";
import { siteConfig, staticProjects, staticBlogs, process, testimonials, timeline, currentlyBuilding } from "../../lib/data";
import { ArrowRight, ExternalLink, Clock } from "lucide-react";
import Hero from "../../components/shell/Hero";

export const revalidate = 60;

function formatDate(date: any): string {
  if (!date) return "Just now";
  if (date?.toDate?.()) return new Date(date.toDate()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (date instanceof Date) return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return String(date);
}

export default async function HomePage() {
  const [liveBlogs, liveProjects] = await Promise.all([
    getBlogs().catch(() => []),
    getProjects().catch(() => []),
  ]);

  const projects = liveProjects.length ? liveProjects.slice(0, 3) : staticProjects;
  const blogs = liveBlogs.length ? liveBlogs.slice(0, 4) : staticBlogs;

  return (
    <>
    <Hero />
    <div className="container mx-auto px-4 space-y-32 py-32">

      {/* ── PROCESS ── */}
      <section>
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Approach</p>
          <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--fg)" }}>How I Work</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.map(({ step, title, desc }) => (
            <div key={step} className="card p-6 flex flex-col gap-3">
              <span className="text-4xl font-black grad-text opacity-60">{step}</span>
              <h3 className="text-lg font-bold" style={{ color: "var(--fg)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Selected Work</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--fg)" }}>Featured Projects</h2>
          </div>
          <Link href="/projects" className="flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-60"
            style={{ color: "var(--fg-muted)" }}>
            All projects <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any, i: number) => (
            <div key={project.id} className="card group overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden" style={{ background: "var(--bg-card-hover)" }}>
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-5xl font-black select-none grad-text opacity-20">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(6,6,10,0.75) 0%, transparent 60%)" }} />
                {project.featured && (
                  <span className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold text-[#0c0c0d] btn-grad">
                    Featured
                  </span>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff" }}>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-base" style={{ color: "var(--fg)" }}>{project.title}</h3>
                {project.description && (
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--fg-muted)" }}>{project.description}</p>
                )}
                {project.technologies && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {project.technologies.map((t: string) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--bg-card-hover)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CURRENTLY BUILDING ── */}
      <section>
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>In Progress</p>
          <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--fg)" }}>Currently Building</h2>
        </div>
        <div className="card overflow-hidden flex flex-col sm:flex-row">
          <div className="sm:w-2/5 aspect-video sm:aspect-auto relative overflow-hidden" style={{ background: "var(--bg-card-hover)" }}>
            <img src={currentlyBuilding.image} alt={currentlyBuilding.name} className="object-cover w-full h-full" />
            <div className="absolute inset-0" style={{ background: "rgba(12,12,13,0.4)" }} />
          </div>
          <div className="p-8 flex flex-col justify-center gap-4 flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest w-fit rounded-full px-3 py-1"
              style={{ background: "rgba(198,255,61,0.15)", color: "var(--accent)", border: "1px solid rgba(198,255,61,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" /> Live Build
            </span>
            <h3 className="text-2xl font-black" style={{ color: "var(--fg)" }}>{currentlyBuilding.name}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{currentlyBuilding.desc}</p>
            <div>
              <div className="flex justify-between text-xs mb-2" style={{ color: "var(--fg-muted)" }}>
                <span>Progress</span>
                <span className="font-bold grad-text">{currentlyBuilding.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-card-hover)" }}>
                <div className="h-full rounded-full grad-bg transition-all" style={{ width: `${currentlyBuilding.progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section>
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Working Together</p>
          <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--fg)" }}>What to Expect</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map(({ id, quote }) => (
            <div key={id} className="card p-6 flex flex-col gap-4">
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--fg-muted)" }}>{quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BLOG ── */}
      <section id="blog">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Writing</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--fg)" }}>Latest Thoughts</h2>
          </div>
          <Link href="/blog" className="flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-60"
            style={{ color: "var(--fg-muted)" }}>
            All posts <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {blogs.slice(0, 3).map((blog: any) => {
            const href = `/blog/${blog.slug}`;
            const date = blog.createdAt ? formatDate(blog.createdAt) : "Just now";
            return (
              <article key={blog.id} className="card group relative p-6 flex flex-col gap-3 overflow-hidden">
                <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity grad-bg" />
                <div className="flex items-center justify-between">
                  <time className="text-xs" style={{ color: "var(--fg-muted)" }}>{date}</time>
                </div>
                <h3 className="text-lg font-bold leading-snug" style={{ color: "var(--fg)" }}>
                  <Link href={href}><span className="absolute inset-0" />{blog.title}</Link>
                </h3>
                {blog.excerpt && (
                  <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--fg-muted)" }}>{blog.excerpt}</p>
                )}
                <div className="flex items-center gap-1 text-xs font-bold mt-auto pt-2 grad-text">
                  Read more <ArrowRight size={11} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section>
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Journey</p>
          <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--fg)" }}>Career Timeline</h2>
        </div>
        <div className="relative pl-8">
          <div className="absolute left-2.5 top-0 bottom-0 w-px" style={{ background: "var(--border)" }} />
          <div className="space-y-10">
            {timeline.map(({ year, title, desc }, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-8 top-1 w-4 h-4 rounded-full grad-bg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-xs font-bold grad-text">{year}</span>
                <h3 className="text-lg font-bold mt-0.5" style={{ color: "var(--fg)" }}>{title}</h3>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--fg-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden rounded-3xl p-14 text-center" style={{ border: "1px solid var(--border)" }}>
        <div className="absolute inset-0 grad-bg opacity-90" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-30 bg-white" />
        <div className="relative z-10">
          <p className="text-[#0c0c0d]/70 text-sm font-semibold uppercase tracking-widest mb-4">Let&apos;s collaborate</p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0c0c0d] tracking-tight mb-4">Got a project in mind?</h2>
          <p className="text-[#0c0c0d]/70 text-base mb-10 max-w-md mx-auto">
            I&apos;m always open to new opportunities, creative ideas, or just a good chat.
          </p>
          <a href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#ffffff", color: "#0a0a12" }}>
            {siteConfig.email} <ArrowRight size={15} />
          </a>
        </div>
      </section>

    </div>
    </>
  );
}
