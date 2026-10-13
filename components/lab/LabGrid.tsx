"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../motion/Reveal";
import { tools } from "../../lib/tools";

/**
 * Grid of large, accent-sweep tiles — one per tool in the Lab.
 * Reads the tool list itself (icon components aren't serialisable across
 * the server → client boundary, so this can't be a prop from a server page).
 */
export default function LabGrid() {
  return (
    <div className="lab-grid">
      {tools.map((t, i) => {
        const Icon = t.icon;
        return (
          <Reveal key={t.href} y={40} delay={i * 60}>
            <Link href={t.href} className="lab-tile" data-transition-title={t.name}>
              <span className="lab-tile-top">
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <Icon className="lab-tile-icon" size={22} strokeWidth={1.5} aria-hidden />
              </span>
              <span className="lab-tile-main">
                <h2 className="lab-tile-title">{t.name}</h2>
                <p className="lab-tile-desc">{t.desc}</p>
              </span>
              <ArrowUpRight className="lab-tile-arrow" size={28} strokeWidth={1.3} aria-hidden />
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
