import { getProjects } from "../../../firebase/firestore";
import SplitReveal from "../../../components/motion/SplitReveal";
import Reveal from "../../../components/motion/Reveal";
import ProjectIndex from "../../../components/work/ProjectIndex";
import { resolveProjects, workItem } from "../../../lib/projects";

export const revalidate = 60;
export const metadata = {
  title: "Work",
  description: "Selected projects, case studies and experiments by Ado Daniel Nji — full-stack web and mobile apps, AI agents and design systems.",
  alternates: { canonical: "/projects" },
  openGraph: { type: "website", url: "/projects", title: "Work — Ado Daniel Nji", description: "Selected projects, case studies and experiments." },
};

export default async function ProjectsPage() {
  const live = await getProjects().catch(() => []);
  const items = resolveProjects(live).map(workItem);

  return (
    <section className="n-page">
      <Reveal immediate delay={100} className="n-page-top label">
        <span>( Index )</span>
        <span>{String(items.length).padStart(2, "0")} projects</span>
      </Reveal>
      <SplitReveal as="h1" className="n-page-title" immediate delay={200} stagger={90} text="Selected *work*" />
      <Reveal immediate delay={500}>
        <p className="n-page-lead">Case studies, products and experiments. Hover a row for a preview, open one for the full story.</p>
      </Reveal>
      <ProjectIndex items={items} />
    </section>
  );
}
