import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SplitReveal from "../motion/SplitReveal";
import { tools, type Tool } from "../../lib/tools";

/**
 * Shared frame for every page under /tools. The page is exactly one viewport tall
 * and never scrolls; each tool decides how its stage uses the space.
 *
 *  layout="split"  desktop: stage on the left, notes rail on the right (title, description, `aside`).
 *  layout="bare"   desktop: stage under a slim title bar that carries the description.
 *
 *  Below 1024px both layouts show the tool only: a one-line bar (back, title, index) and the stage.
 */
export default function ToolShell({
  tool,
  layout = "split",
  aside,
  children,
}: {
  tool: Tool;
  layout?: "split" | "bare";
  /** Tool-specific notes shown in the rail on desktop (shortcuts, history, support info). */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const idx = tools.findIndex((t) => t.slug === tool.slug);
  const num = String((idx < 0 ? 0 : idx) + 1).padStart(2, "0");
  const Icon = tool.icon;
  const count = (
    <span className="tool-bar-count label">
      {num} / {String(tools.length).padStart(2, "0")}
    </span>
  );

  return (
    <article className="tool-page" data-layout={layout}>
      <div className="tool-body">
        <div className="tool-main">
          <div className="tool-bar">
            <Link href="/tools" className="cs-back label">
              <ArrowLeft size={14} /> The Lab
            </Link>
            <h1 className="tool-bar-title">
              <Icon size={16} strokeWidth={1.6} aria-hidden />
              <span>{tool.name}</span>
            </h1>
            <p className="tool-bar-desc">{tool.desc}</p>
            {count}
          </div>
          <section className="tool-stage" aria-label={tool.name}>
            {children}
          </section>
        </div>

        {layout === "split" && (
          <aside className="tool-rail">
            <div className="tool-rail-top">
              <span className="label">{num} / {String(tools.length).padStart(2, "0")}</span>
              <Icon className="tool-rail-icon" size={26} strokeWidth={1.4} aria-hidden />
            </div>
            <SplitReveal as="p" className="tool-rail-title" immediate delay={200} stagger={90} text={tool.name} />
            <p className="tool-desc">{tool.desc}</p>
            {aside}
          </aside>
        )}
      </div>
    </article>
  );
}
