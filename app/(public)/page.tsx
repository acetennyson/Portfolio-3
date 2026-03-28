import Link from "next/link";
import { getBlogs, getProjects } from "../../firebase/firestore";
import { siteConfig, staticProjects, staticBlogs, skills, process, testimonials, timeline, currentlyBuilding, roles } from "../../lib/data";
import { ArrowRight, ExternalLink, Clock, Star } from "lucide-react";
import TypingRole from "../../components/TypingRole";
import { GithubIcon, TwitterIcon, LinkedinIcon } from "../../components/SocialIcons";

export const revalidate = 60;

export default async function HomePage() {
  const [liveBlogs, liveProjects] = await Promise.all([
    getBlogs().catch(() => []),
    getProjects("live").catch(() => []),
  ]);

  const projects = liveProjects.length ? liveProjects.slice(0, 3) : staticProjects;
  const blogs = liveBlogs.length ? liveBlogs.slice(0, 4) : staticBlogs;
  const isStaticBlog = !liveBlogs.length;
  const featuredBlog = isStaticBlog ? (blogs as typeof staticBlogs).find(b => b.featured) : null;
  const restBlogs = isStaticBlog ? (blogs as typeof staticBlogs).filter(b => !b.featured) : blogs;

  return (
    <div className="space-y-32 pb-20">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden pt-10 pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[140px] opacity-20 grad-bg" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 grad-alt-bg" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ background: "var(--grad-end)" }} />
        </div>

        {/* avatar */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 rounded-full p-0.5 grad-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteConfig.avatar} alt={siteConfig.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2" style={{ borderColor: "var(--bg)" }} />
        </div>

        <p className="mb-3 text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>{siteConfig.name}</p>

        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] mb-5">
          I Build Things<br />
          <span className="grad-text">People Love</span>
        </h1>

        {/* typing role */}
        <p className="text-xl font-semibold mb-6 h-8">
          <TypingRole roles={roles} />
        </p>

        <p className="max-w-md text-base leading-relaxed mb-10" style={{ color: "var(--fg-muted)" }}>
          {siteConfig.bio}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link href="/projects"
            className="btn-grad inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-opacity hover:opacity-90"
            style={{ boxShadow: "0 8px 32px rgba(139,92,246,0.35)" }}>
            See My Work <ArrowRight size={15} />
          </Link>
          <a href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-all hover:border-violet-500"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg)" }}>
            Get in Touch
          </a>
        </div>

        {/* social */}
        <div className="flex items-center gap-3 mb-14">
          {[
          { href: siteConfig.social.github, icon: <GithubIcon size={17} /> },
            { href: siteConfig.social.twitter, icon: <TwitterIcon size={17} /> },
            { href: siteConfig.social.linkedin, icon: <LinkedinIcon size={17} /> },
          ].map(({ href, icon }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:border-violet-500 hover:scale-110"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
              {icon}
            </a>
          ))}
        </div>

        {/* stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {siteConfig.stats.map(({ value, label }) => (
            <div key={label} className="rounded-2xl px-6 py-4 text-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="text-3xl font-black grad-text">{value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* skills */}
        <div className="flex flex-wrap justify-center gap-2">
          {skills.map(s => (
            <span key={s} className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
              {s}
            </span>
          ))}
        </div>
      </section>

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
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.image} alt={project.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-5xl font-black select-none grad-text opacity-20">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(6,6,10,0.75) 0%, transparent 60%)" }} />
                {project.tag && (
                  <span className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold text-white btn-grad">
                    {project.tag}
                  </span>
                )}
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff" }}>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-base" style={{ color: "var(--fg)" }}>{project.name}</h3>
                {project.description && (
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--fg-muted)" }}>{project.description}</p>
                )}
                {project.techs && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {project.techs.map((t: string) => (
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentlyBuilding.image} alt={currentlyBuilding.name} className="object-cover w-full h-full" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))" }} />
          </div>
          <div className="p-8 flex flex-col justify-center gap-4 flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest w-fit rounded-full px-3 py-1"
              style={{ background: "rgba(139,92,246,0.15)", color: "var(--accent)", border: "1px solid rgba(139,92,246,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" /> Live Build
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

      {/* ── TESTIMONIALS ── */}
      <section>
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Social Proof</p>
          <h2 className="text-4xl font-black tracking-tight" style={{ color: "var(--fg)" }}>What People Say</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map(({ id, quote, name, role, avatar }) => (
            <div key={id} className="card p-6 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" style={{ color: "var(--accent)" }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--fg-muted)" }}>"{quote}"</p>
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--fg)" }}>{name}</p>
                  <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{role}</p>
                </div>
              </div>
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
        </div>

        {/* featured post */}
        {featuredBlog && (
          <Link href={`/blog/${featuredBlog.slug}`} className="card group relative overflow-hidden flex flex-col sm:flex-row mb-5 block">
            <div className="sm:w-2/5 aspect-video sm:aspect-auto relative overflow-hidden" style={{ background: "var(--bg-card-hover)", minHeight: 200 }}>
              <div className="absolute inset-0 grad-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-black text-white opacity-10">★</span>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center gap-3 flex-1">
              <span className="text-xs font-bold uppercase tracking-widest grad-text">Featured Post</span>
              <h3 className="text-2xl font-black leading-snug group-hover:opacity-80 transition-opacity" style={{ color: "var(--fg)" }}>
                {featuredBlog.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{featuredBlog.excerpt}</p>
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--fg-muted)" }}>
                <span>{featuredBlog.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {featuredBlog.readTime}</span>
              </div>
            </div>
          </Link>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          {(restBlogs as any[]).slice(0, 3).map((blog, i) => {
            const href = `/blog/${blog.slug}`;
            const date = isStaticBlog ? blog.date : blog.createdAt?.toDate?.() ? new Date(blog.createdAt.toDate()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Just now";
            return (
              <article key={blog.id} className="card group relative p-6 flex flex-col gap-3 overflow-hidden">
                <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity grad-bg" />
                <div className="flex items-center justify-between">
                  <time className="text-xs" style={{ color: "var(--fg-muted)" }}>{date}</time>
                  {isStaticBlog && blog.readTime && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--fg-muted)" }}>
                      <Clock size={10} /> {blog.readTime}
                    </span>
                  )}
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
          {/* vertical line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-px" style={{ background: "var(--border)" }} />
          <div className="space-y-10">
            {timeline.map(({ year, title, desc }, i) => (
              <div key={i} className="relative">
                {/* dot */}
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
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">Let's collaborate</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">Got a project in mind?</h2>
          <p className="text-white/70 text-base mb-10 max-w-md mx-auto">
            I'm always open to new opportunities, creative ideas, or just a good chat.
          </p>
          <a href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all hover:scale-105"
            style={{ background: "#ffffff", color: "#0a0a12" }}>
            {siteConfig.email} <ArrowRight size={15} />
          </a>
        </div>
      </section>

    </div>
  );
}
