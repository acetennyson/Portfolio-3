"use client";

import { useState } from "react";
import { siteConfig } from "../../lib/data";
import Reveal from "../motion/Reveal";
import SplitReveal from "../motion/SplitReveal";
import Magnetic from "../motion/Magnetic";

const JOURNEY = [
  { tag: "01", text: "Started out building solo, full-stack and mobile, from Douala, Cameroon." },
  { tag: "02", text: "Founded IAmSupreme Developers, a mentorship community for devs leveling up." },
  { tag: "03", text: "Shipped Beta Gamer, a multi-tenant Games-as-a-Service platform." },
  { tag: "04", text: "Built JobHub Cameroon and Axir, a WhatsApp-native AI agent — production software, end to end." },
];

export default function GreetingSection() {
  const [greeted, setGreeted] = useState(false);

  return (
    <section className="greeting-section">
      <Reveal y={40}>
        <div className="section-header-center">
          <p className="label" style={{ color: "var(--accent-ink)" }}>Say Hello</p>
          <SplitReveal
            as="h2"
            className="section-title"
            stagger={90}
            text="From *solo builder* to shipping *products people use.*"
          />
        </div>
      </Reveal>

      <div className="greeting-layout" style={{ gridTemplateColumns: "1fr", maxWidth: "42rem", margin: "0 auto" }}>
        <Reveal y={40} delay={120} className="greeting-journey">
          <ol>
            {JOURNEY.map((j) => (
              <li key={j.tag}>
                <span className="greeting-journey-tag label">{j.tag}</span>
                <p>{j.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>

      </div>

      <Reveal y={40} delay={200}>
        <div className="greeting-cta">
          <p className="greeting-cta-copy">
            {greeted
              ? "I'm available for freelance projects, collaborations, and full-time opportunities."
              : "Still floating out there — give him a hand, or just reach out directly."}
          </p>
          <Magnetic>
            <a href={`mailto:${siteConfig.email}`} className="btn-cta">
              {siteConfig.email}
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
