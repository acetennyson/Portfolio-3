import SplitReveal from "../../../components/motion/SplitReveal";
import Reveal from "../../../components/motion/Reveal";
import LabGrid from "../../../components/lab/LabGrid";
import { tools } from "../../../lib/tools";

export const metadata = {
  title: "Lab",
  description: "Small tools and experiments, built from scratch and shipped for fun, by Ado Daniel Nji.",
  alternates: { canonical: "/tools" },
  openGraph: { type: "website", url: "/tools", title: "The Lab — Ado Daniel Nji", description: "Small tools and experiments, built from scratch and shipped for fun." },
};

export default function ToolsPage() {
  return (
    <section className="n-page">
      <Reveal immediate delay={100} className="n-page-top label">
        <span>( Lab )</span>
        <span>{String(tools.length).padStart(2, "0")} tools</span>
      </Reveal>
      <SplitReveal as="h1" className="n-page-title" immediate delay={200} stagger={90} text="The *Lab*" />
      <Reveal immediate delay={500}>
        <p className="n-page-lead">
          Small, self-contained tools I built for practice and for fun — every one of them live and working,
          no placeholders.
        </p>
      </Reveal>
      <LabGrid />
    </section>
  );
}
