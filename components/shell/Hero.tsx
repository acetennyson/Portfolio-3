import Link from "next/link";
import SplitReveal from "../motion/SplitReveal";
import Reveal from "../motion/Reveal";
import Magnetic from "../motion/Magnetic";
import RoleSwitcher from "./RoleSwitcher";
import BlockScene from "../hero/BlockScene";
import { siteConfig, roles } from "../../lib/data";

export default function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      {/* Stage 2: Interactive three.js / cannon-es block scene */}
      <BlockScene />

      <div className="hero-inner">
        <Reveal immediate delay={150} className="hero-top label">
          <span>{siteConfig.title}</span>
          <span>Available for work</span>
        </Reveal>

        <SplitReveal as="h1" className="hero-title" immediate delay={250} stagger={90} text={"I build\nthings *people*\n*love.*"} />

        <div className="hero-bottom">
          <Reveal immediate delay={900} className="hero-about">
            <p className="label">{siteConfig.name} &mdash; <RoleSwitcher roles={roles} /></p>
            <p className="hero-bio">{siteConfig.bio}</p>
          </Reveal>

          <Reveal immediate delay={1050} className="hero-cta">
            <Magnetic>
              <Link href="/projects" className="btn-solid">See the work</Link>
            </Magnetic>
            <Magnetic>
              <a href={`mailto:${siteConfig.email}`} className="btn-line">Say hello</a>
            </Magnetic>
          </Reveal>

          <Reveal immediate delay={1200} className="hero-scroll label">
            <span>Scroll</span>
            <span className="scroll-line" aria-hidden />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
