import Link from "next/link";
import { getBlogs, getProjects } from "../../firebase/firestore";
import { siteConfig, staticProjects, staticBlogs, process, testimonials, timeline, currentlyBuilding } from "../../lib/data";
import { ArrowRight, ExternalLink } from "lucide-react";
import Hero from "../../components/shell/Hero";
import Reveal from "../../components/motion/Reveal";
import SplitReveal from "../../components/motion/SplitReveal";
import Magnetic from "../../components/motion/Magnetic";
import CinematicAstronaut from "../../components/shell/CinematicAstronaut";

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
  const blogs = liveBlogs.length ? liveBlogs.slice(0, 3) : staticBlogs;

  return (
    <>
    <Hero />
    <div className="home-content">
      
      {/* ── STATEMENT ── */}
      <section className="statement-section">
        <Reveal y={60}>
          <SplitReveal 
            as="h2" 
            className="statement-title" 
            stagger={120} 
            delay={0}
            text="Building *digital experiences* that feel visually striking and *technically seamless.*"
          />
        </Reveal>
      </section>

      {/* ── FEATURED WORK ── */}
      <section className="featured-work-section">
        <Reveal y={40}>
          <div className="section-header">
            <p className="label" style={{ color: "var(--accent-ink)" }}>Featured Work</p>
            <h2 className="section-title">Selected Projects</h2>
          </div>
        </Reveal>

        <div className="work-list">
          {projects.map((project: any, i: number) => (
            <Reveal key={project.id} y={80} delay={i * 100}>
              <article className="work-item">
                <div className="work-item-visual">
                  <div className="work-item-img-wrap">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt={project.title} className="work-item-img" />
                    ) : (
                      <div className="work-item-placeholder">
                        <span className="work-item-number">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="work-item-content">
                  <div className="work-item-meta">
                    <span className="label">0{i + 1}</span>
                    {project.technologies && (
                      <div className="work-item-tags">
                        {project.technologies.slice(0, 3).map((t: string) => (
                          <span key={t} className="label">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="work-item-title">{project.title}</h3>
                  {project.description && (
                    <p className="work-item-desc">{project.description}</p>
                  )}
                  {project.liveUrl && (
                    <Magnetic>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="work-item-link">
                        View project <ArrowRight size={16} />
                      </a>
                    </Magnetic>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal y={40} delay={200}>
          <div className="section-footer">
            <Magnetic>
              <Link href="/projects" className="btn-line-lg">
                See all projects <ArrowRight size={18} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ── APPROACH ── */}
      <section className="approach-section">
        <Reveal y={40}>
          <div className="section-header">
            <p className="label" style={{ color: "var(--accent-ink)" }}>Approach</p>
            <h2 className="section-title">How I Work</h2>
          </div>
        </Reveal>

        <div className="approach-grid">
          {process.map(({ step, title, desc }, i) => (
            <Reveal key={step} y={60} delay={i * 80}>
              <div className="approach-card">
                <span className="approach-number">{step}</span>
                <h3 className="approach-title">{title}</h3>
                <p className="approach-desc">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── MARQUEE (Skills) ── */}
      <section className="marquee-section">
        <div className="marquee">
          <div className="marquee-inner">
            <span>React</span>
            <span>Next.js</span>
            <span>TypeScript</span>
            <span>Three.js</span>
            <span>WebGL</span>
            <span>Firebase</span>
            <span>Node.js</span>
            <span>Tailwind</span>
            <span>React</span>
            <span>Next.js</span>
            <span>TypeScript</span>
            <span>Three.js</span>
          </div>
        </div>
      </section>

      {/* ── LAB TEASER ── */}
      <section className="lab-section">
        <Reveal y={40}>
          <div className="section-header-center">
            <p className="label" style={{ color: "var(--accent-ink)" }}>Lab</p>
            <h2 className="section-title">Experiments & Tools</h2>
            <p className="section-subtitle">Interactive tools and experiments I've built for fun and learning.</p>
          </div>
        </Reveal>

        <div className="lab-grid">
          {[
            { name: "3D Dice", url: "/tools/dice", desc: "Physics-based dice roller" },
            { name: "Weather", url: "/tools/weather", desc: "Real-time weather data" },
            { name: "Calculator", url: "/tools/calculator", desc: "Modern calculator" },
            { name: "World Clock", url: "/tools/world-clock", desc: "Global time zones" },
          ].map((tool, i) => (
            <Reveal key={tool.name} y={60} delay={i * 60}>
              <Link href={tool.url} className="lab-card">
                <div className="lab-card-content">
                  <h3 className="lab-card-title">{tool.name}</h3>
                  <p className="lab-card-desc">{tool.desc}</p>
                </div>
                <div className="lab-card-arrow">
                  <ArrowRight size={20} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal y={40} delay={200}>
          <div className="section-footer">
            <Magnetic>
              <Link href="/tools" className="btn-line-lg">
                Explore all tools <ArrowRight size={18} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ── BLOG PREVIEW ── */}
      <section className="blog-section">
        <Reveal y={40}>
          <div className="section-header">
            <p className="label" style={{ color: "var(--accent-ink)" }}>Writing</p>
            <h2 className="section-title">Latest Thoughts</h2>
          </div>
        </Reveal>

        <div className="blog-grid">
          {blogs.map((blog: any, i: number) => {
            const href = `/blog/${blog.slug}`;
            const date = blog.createdAt ? formatDate(blog.createdAt) : "Just now";
            return (
              <Reveal key={blog.id} y={60} delay={i * 80}>
                <Link href={href} className="blog-card">
                  <time className="blog-card-date label">{date}</time>
                  <h3 className="blog-card-title">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="blog-card-excerpt">{blog.excerpt}</p>
                  )}
                  <span className="blog-card-link">
                    Read more <ArrowRight size={14} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal y={40} delay={200}>
          <div className="section-footer">
            <Magnetic>
              <Link href="/blog" className="btn-line-lg">
                All posts <ArrowRight size={18} />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>

        </div>

    {/* ── CINEMATIC ASTRONAUT / CONTACT (replaces "Say Hello") ── */}
    <CinematicAstronaut />
    </>
  );
}
