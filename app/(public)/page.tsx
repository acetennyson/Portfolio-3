import Link from "next/link";
import { getBlogs, getProjects } from "../../firebase/firestore";
import { siteConfig, staticBlogs, process, services, labTools, skills } from "../../lib/data";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Hero from "../../components/shell/Hero";
import Reveal from "../../components/motion/Reveal";
import Magnetic from "../../components/motion/Magnetic";
import CinematicAstronaut from "../../components/shell/CinematicAstronaut";
import ScrollWords from "../../components/home/ScrollWords";
import WorkList, { type WorkItem } from "../../components/home/WorkList";
import Marquee from "../../components/home/Marquee";
import Stats from "../../components/home/Stats";
import Process from "../../components/home/Process";
import { resolveProjects, workItem } from "../../lib/projects";

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

  // Firebase first, static fallback; each row opens its case study.
  const work: WorkItem[] = resolveProjects(liveProjects).slice(0, 5).map(workItem);
  const blogs = liveBlogs.length ? liveBlogs.slice(0, 3) : staticBlogs;

  return (
    <>
      <Hero />
      <div className="home-content">
        {/* ── STATEMENT (scroll-scrubbed, word by word) ── */}
        <section className="n-statement">
          <p className="label n-statement-label">( About )</p>
          <ScrollWords
            className="n-statement-text"
            text="Good software doesn't just work — it moves through *users*, *technology*, *security*, and *interfaces* with intention. I engineer systems that hold together under scrutiny, respect the layers beneath them, and meet people where they are."
          />
        </section>

        {/* ── SELECTED WORK ── */}
        <section className="n-sec" id="work">
          <div className="n-head">
            <h2>Selected <em className="font-serif italic font-normal">work</em></h2>
            <p className="label">({String(work.length).padStart(2, "0")}) Projects</p>
          </div>
          <WorkList items={work} />
          <div className="n-foot">
            <Magnetic><Link href="/projects" className="btn-line">See all projects <ArrowRight size={16} /></Link></Magnetic>
          </div>
        </section>

        {/* ── STATS + MARQUEE ── */}
        <section className="n-sec n-tight">
          <Stats stats={siteConfig.stats} />
        </section>
        <section className="n-marq-wrap" aria-label="Skills">
          <Marquee items={skills} />
          <Marquee items={[...skills].reverse()} reverse outline />
        </section>

        {/* ── SERVICES ── */}
        <section className="n-sec">
          <div className="n-head">
            <h2>What I <em className="font-serif italic font-normal">do</em></h2>
            <p className="label">( Services )</p>
          </div>
          <div className="n-services">
            {services.map((s, i) => (
              <Reveal key={s.n} y={50} delay={i * 90}>
                <article className="n-service">
                  <span className="label">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.blurb}</p>
                  <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="n-sec">
          <div className="n-head">
            <h2>How I <em className="font-serif italic font-normal">work</em></h2>
            <p className="label">( Process )</p>
          </div>
          <Process steps={process} />
        </section>

        {/* ── LAB ── */}
        <section className="n-sec">
          <div className="n-head">
            <h2>The <em className="font-serif italic font-normal">lab</em></h2>
            <p className="label">({String(labTools.length).padStart(2, "0")}) Tools & experiments</p>
          </div>
          <div className="n-lab-grid">
            {labTools.map((t, i) => (
              <Reveal key={t.href} y={40} delay={(i % 4) * 70}>
                <Link href={t.href} className="n-lab-tile">
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  <span className="n-lab-body">
                    <strong>{t.name}</strong>
                    <small>{t.desc}</small>
                  </span>
                  <ArrowUpRight className="n-lab-arrow" size={22} aria-hidden />
                </Link>
              </Reveal>
            ))}
            <Reveal y={40} delay={210}>
              <Link href="/tools" className="n-lab-tile n-lab-all">
                <span className="label">All</span>
                <span className="n-lab-body"><strong>Open the lab</strong><small>Every tool in one place.</small></span>
                <ArrowRight className="n-lab-arrow" size={22} aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── WRITING ── */}
        <section className="n-sec">
          <div className="n-head">
            <h2>Latest <em className="font-serif italic font-normal">writing</em></h2>
            <p className="label">( Blog )</p>
          </div>
          <div className="blog-grid">
            {blogs.map((blog: any, i: number) => (
              <Reveal key={blog.id} y={60} delay={i * 80}>
                <Link href={`/blog/${blog.slug}`} className="blog-card" data-transition-title={blog.title}>
                  <time className="blog-card-date label">{blog.createdAt ? formatDate(blog.createdAt) : "Just now"}</time>
                  <h3 className="blog-card-title">{blog.title}</h3>
                  {blog.excerpt && <p className="blog-card-excerpt">{blog.excerpt}</p>}
                  <span className="blog-card-link">Read more <ArrowRight size={14} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="n-foot">
            <Magnetic><Link href="/blog" className="btn-line">All posts <ArrowRight size={16} /></Link></Magnetic>
          </div>
        </section>
      </div>

      {/* Closing call to action = the astronaut finale */}
      <CinematicAstronaut />
    </>
  );
}
