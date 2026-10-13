import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProjectById, getProjects } from "../../../../firebase/firestore";
import { staticProjects } from "../../../../lib/data";
import { projectView, resolveProjects } from "../../../../lib/projects";
import { isEmbeddable } from "../../../../lib/preview";
import SplitReveal from "../../../../components/motion/SplitReveal";
import Reveal from "../../../../components/motion/Reveal";
import Magnetic from "../../../../components/motion/Magnetic";
import CoverParallax from "../../../../components/work/CoverParallax";
import BlockRenderer from "../../../../components/renderers/BlockRenderer";

export const revalidate = 60;

async function load(id: string) {
  const live: any = await getProjectById(id).catch(() => null);
  if (live) return projectView(live);
  const fallback = staticProjects.find((p) => p.id === id);
  return fallback ? projectView(fallback) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await load(id);
  return p ? { title: p.title, description: p.description } : { title: "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await load(id);
  if (!project) return notFound();

  const all = resolveProjects(await getProjects().catch(() => []));
  const idx = all.findIndex((p) => p.id === project.id);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  const embed = project.liveUrl ? await isEmbeddable(project.liveUrl) : false;
  const num = String((idx < 0 ? 0 : idx) + 1).padStart(2, "0");

  const meta: [string, string | undefined][] = [
    ["Year", project.year || undefined],
    ["Role", project.role],
    ["Client", project.client],
    ["Status", project.status],
  ];

  return (
    <article className="cs">
      <header className="cs-head">
        <Reveal immediate delay={100} className="n-page-top label">
          <Link href="/projects" className="cs-back"><ArrowLeft size={14} /> All work</Link>
          <span>{num} / {String(all.length).padStart(2, "0")}</span>
        </Reveal>
        <SplitReveal as="h1" className="cs-title" immediate delay={200} stagger={80} text={project.title} />
        {project.tags.length > 0 && (
          <Reveal immediate delay={600}>
            <p className="cs-tags label">{project.tags.map((t) => <span key={t}>{t}</span>)}</p>
          </Reveal>
        )}
      </header>

      <CoverParallax src={project.cover} title={project.title} label={num} liveUrl={project.liveUrl} embed={embed} />

      <div className="cs-grid">
        <aside className="cs-meta">
          {meta.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><span className="label">{k}</span><p>{v}</p></div>
          ))}
          {project.tags.length > 0 && (
            <div><span className="label">Stack</span><p>{project.tags.join(", ")}</p></div>
          )}
          {(project.liveUrl || project.githubUrl) && (
            <div className="cs-links">
              {project.liveUrl && <Magnetic><a className="btn-solid" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit project <ArrowUpRight size={16} /></a></Magnetic>}
              {project.githubUrl && <Magnetic><a className="btn-line" href={project.githubUrl} target="_blank" rel="noopener noreferrer">Source <ArrowUpRight size={16} /></a></Magnetic>}
            </div>
          )}
        </aside>

        <div className="cs-body">
          {project.description && (
            <Reveal y={50}><p className="cs-lead">{project.description}</p></Reveal>
          )}

          {/* Rich content blocks (if the project has them), each revealed on scroll */}
          {project.blocks.map((b, i) => (
            <Reveal key={i} y={40}><div className="cs-block"><BlockRenderer blocks={[b]} /></div></Reveal>
          ))}

          {/* Gallery */}
          {project.gallery.map((src, i) => (
            <Reveal key={src + i} y={60}><figure className="cs-shot"><img src={src} alt={`${project.title} — image ${i + 1}`} loading="lazy" /></figure></Reveal>
          ))}

          {/* Always-available section so a sparse project still reads as a case study */}
          {project.tags.length > 0 && (
            <Reveal y={50}>
              <section className="cs-stack">
                <p className="label">( Built with )</p>
                <ul>{project.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </section>
            </Reveal>
          )}
        </div>
      </div>

      {next && (
        <Link href={`/projects/${next.id}`} className="cs-next" data-transition-title={next.title}>
          <span className="label">( Next project )</span>
          <span className="cs-next-title">{next.title}<ArrowRight size={56} strokeWidth={1.2} aria-hidden /></span>
        </Link>
      )}
    </article>
  );
}
