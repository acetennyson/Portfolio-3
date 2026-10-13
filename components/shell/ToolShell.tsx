import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SplitReveal from "../motion/SplitReveal";
import Reveal from "../motion/Reveal";
import { tools, type Tool } from "../../lib/tools";

/**
 * Shared header + stage for every page under /tools. Wraps a tool's existing,
 * untouched logic in the same editorial shell used across the rest of the site.
 */
export default function ToolShell({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const idx = tools.findIndex((t) => t.slug === tool.slug);
  const num = String((idx < 0 ? 0 : idx) + 1).padStart(2, "0");
  const Icon = tool.icon;

  return (
    <article className="tool-page">
      <header className="tool-head">
        <Reveal immediate delay={100} className="n-page-top label">
          <Link href="/tools" className="cs-back"><ArrowLeft size={14} /> The Lab</Link>
          <span>{num} / {String(tools.length).padStart(2, "0")}</span>
        </Reveal>
        <div className="tool-head-main">
          <Icon className="tool-icon" size={32} strokeWidth={1.4} aria-hidden />
          <SplitReveal as="h1" className="tool-title" immediate delay={200} stagger={90} text={tool.name} />
        </div>
        <Reveal immediate delay={450}>
          <p className="tool-desc">{tool.desc}</p>
        </Reveal>
      </header>
      <div className="tool-stage">{children}</div>
    </article>
  );
}
