import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tools = [
  { name: "Calculator", desc: "A sleek calculator for quick maths.", href: "/tools/calculator", emoji: "🧮" },
];

export default function ToolsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Utilities</p>
        <h1 className="text-5xl font-black tracking-tight grad-text">Tools</h1>
        <p className="mt-3 text-base" style={{ color: "var(--fg-muted)" }}>A collection of useful tools I've built.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map(({ name, desc, href, emoji }) => (
          <Link key={href} href={href} className="card group p-6 flex items-center gap-4">
            <span className="text-3xl">{emoji}</span>
            <div className="flex-1">
              <h2 className="font-bold text-base" style={{ color: "var(--fg)" }}>{name}</h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>{desc}</p>
            </div>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: "var(--fg-muted)" }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
