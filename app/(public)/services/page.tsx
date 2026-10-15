import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SplitReveal from "../../../components/motion/SplitReveal";
import Reveal from "../../../components/motion/Reveal";
import Magnetic from "../../../components/motion/Magnetic";
import { siteConfig } from "../../../lib/data";

export const metadata = {
  title: "Services",
  description: "What Ado Daniel Nji builds, the stack behind it, how engagements run — solo or embedded in a team — and what projects typically cost.",
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    title: "Services | Ado Daniel Nji",
    description: "What I build, the stack behind it, how I work, and what it typically costs.",
  },
};

const CAPABILITIES = [
  {
    n: "01",
    title: "Web applications",
    desc: "Frontends built in React and Next.js, wired to real backend logic — authentication, business rules, and data that has to stay correct, not just display.",
    items: ["Next.js & React", "APIs & auth", "PostgreSQL / Supabase / Firebase", "Performance & SEO"],
  },
  {
    n: "02",
    title: "AI agents & automation",
    desc: "Assistants and workflows that do something, not just answer questions — connected to messaging channels and the tools they need to act.",
    items: ["Tool-enabled AI agents", "WhatsApp / messaging integration", "Workflow automation", "MCP servers"],
  },
  {
    n: "03",
    title: "Games & real-time systems",
    desc: "Socket-based multiplayer infrastructure and matchmaking across game modes — the same systems-thinking applied to latency and concurrent state instead of request/response.",
    items: ["Unity & Unreal Engine", "Three.js / WebGL", "Cannon.js & Ammo.js physics", "Socket-based multiplayer"],
  },
  {
    n: "04",
    title: "Systems & integrations",
    desc: "The connective tissue between services: payments, external APIs and deployment that have to behave under real conditions, not just the happy path.",
    items: ["Mobile money & payment APIs", "Third-party API integration", "Docker & deployment", "Data pipelines"],
  },
  {
    n: "05",
    title: "Mobile & product builds",
    desc: "Taking a working idea to a usable product end to end — from the data model up through the interface someone actually uses.",
    items: ["React Native / Capacitor", "Swift (Xcode) & Android Studio", "Ionic & Cordova", "MVP scoping & iteration"],
  },
];

// Stacks used when a project or an existing codebase specifically calls for them — not the
// default, so they sit below the core categories rather than padding them out.
const TECH_RANGE = ["PHP", "Laravel", "Angular", "Java", "Spring Boot", "C#", "Python", "MySQL"];

const ENGAGEMENT = [
  { title: "Solo or embedded", desc: "Runs a build end to end as the sole engineer, or joins an existing team for a sprint, a feature, or ongoing capacity." },
  { title: "Async-friendly", desc: "Comfortable working remote and async across time zones; calls when they're useful, not by default." },
  { title: "Focused capacity", desc: "Keeps active engagements limited so attention doesn't thin out across clients, solo or embedded." },
  { title: "Direct line", desc: "You talk to the person doing the work, start to finish — not a layer of account management." },
];

const TIERS = [
  {
    name: "Single build",
    featured: false,
    for: "A focused feature, landing page, internal tool, bug-fix sprint or one integration.",
    price: "$350 – $1,200",
    note: "fixed price",
    items: ["Scoped in a short call first", "One deliverable, clear definition of done", "1–2 weeks typical turnaround", "50% upfront, 50% on delivery"],
    cta: "Start small",
  },
  {
    name: "Full product",
    featured: true,
    for: "A complete web, mobile or game-backed product from scratch — auth, data, admin, and the integrations it needs.",
    price: "$1,500 – $8,000+",
    note: "scope-dependent",
    items: ["Milestone-based delivery", "Discovery before pricing is finalized", "Weekly progress check-ins", "40% / 30% / 30% payment split"],
    cta: "Scope a project",
  },
  {
    name: "Ongoing partner",
    featured: false,
    for: "Continuous development, maintenance, or iteration after launch — an engineer on call without hiring one.",
    price: "$800 – $3,000",
    note: "per month",
    items: ["Part-time to dedicated availability", "Monthly billing, cancel with 30 days' notice", "Covers bug fixes, features & upkeep", "Priority response over one-off work"],
    cta: "Discuss a retainer",
  },
];

const GOOD_FIT = [
  "You need one person who can own a build end to end, not just a slice of it.",
  "You need a senior engineer to embed with your existing team for a sprint or a stretch of ongoing capacity.",
  "You're building something WhatsApp-first, mobile-first, real-time, or aimed at African markets.",
  "You have a clear problem but flexible opinions on exact implementation.",
];

const NOT_YET = [
  "You need to hire and manage an entire team at once — I join or lead a build, not staff one.",
  "You need 24/7 on-call coverage — that's a different kind of arrangement.",
  "The ask is pure visual/graphic design with no software behind it.",
  "The opening offer is \"that's a lot for your region\" — the rate doesn't move based on where I'm sitting.",
];

const FAQ = [
  {
    q: "What's the smallest project you'll take on?",
    a: "Roughly $350 worth of work. Anything smaller is usually better handled as a quick fixed-price fix rather than a full engagement — happy to say so upfront if that's the case.",
  },
  {
    q: "How is a project actually priced?",
    a: "Fixed price for clearly scoped work, milestones for larger builds, a monthly retainer for ongoing work. Every quote follows a short call — the ranges above are a starting point, not a menu.",
  },
  {
    q: "Do you only build with Next.js and React, or can you join an existing team?",
    a: "Next.js, React and Node are the default for new web work, but the broader stack above gets used when a project or an existing codebase calls for it — PHP/Laravel, Java/Spring Boot, C#, Unity/Unreal included. Joining an existing team for a sprint, a feature, or ongoing capacity is also on the table, not just solo end-to-end builds — day-rate or sprint terms available on request.",
  },
  {
    q: "Do you work with clients outside Cameroon?",
    a: "Yes — most engagements are remote and async, in English, across time zones. Payment can be arranged in USD or locally depending on where you're based.",
  },
  {
    q: "Why not price lower, given where you're based?",
    a: "Cost of living where the work happens doesn't change what a feature costs to build well, or what it's worth to the business using it. Rates here track the same market as freelance engineers anywhere else doing comparable work — they're not a regional discount.",
  },
  {
    q: "Is there support after launch?",
    a: "Yes, either folded into the ongoing-partner tier or as a smaller paid maintenance arrangement — whichever fits how much the product keeps changing.",
  },
  {
    q: "How soon can you start?",
    a: "Usually within one to two weeks, depending on what's already in progress. Ask and I'll give you a real answer, not a placeholder one.",
  },
];

export default function ServicesPage() {
  return (
    <section className="n-page">
      <Reveal immediate delay={100} className="n-page-top label">
        <span>( Services )</span>
        <span>Available for work</span>
      </Reveal>
      <SplitReveal as="h1" className="n-page-title" immediate delay={200} stagger={90} text="Work with *me*" />
      <Reveal immediate delay={500}>
        <p className="n-page-lead">
          What I build, the stack behind it, how engagements run — solo or embedded in your team —
          and roughly what they cost, so you can tell in a minute whether this is a fit.
        </p>
      </Reveal>

      {/* ── WHAT I BUILD ── */}
      <div className="n-sec" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="n-head">
          <h2>What I <em className="font-serif italic font-normal">build</em></h2>
          <p className="label">( Capabilities )</p>
        </div>
        <div className="sv-caps">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.title} y={40} delay={i * 80}>
              <article className="sv-cap">
                <span className="sv-cap-n">{c.n}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal y={20} delay={120}>
          <div className="sv-range">
            <p className="label">( Also building with )</p>
            <p className="sv-range-note">
              Used when a project or an existing codebase specifically calls for it — not the default,
              so it sits here rather than padding out the categories above.
            </p>
            <ul className="sv-range-tags">
              {TECH_RANGE.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* ── HOW I WORK ── */}
      <div className="n-sec n-tight" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="n-head">
          <h2>How I <em className="font-serif italic font-normal">work</em></h2>
          <p className="label">( Engagement )</p>
        </div>
        <Reveal y={30}>
          <div className="sv-engage">
            {ENGAGEMENT.map((e) => (
              <div key={e.title} className="sv-engage-item">
                <strong>{e.title}</strong>
                <span>{e.desc}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── PRICING ── */}
      <div className="n-sec" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="n-head">
          <h2>What it <em className="font-serif italic font-normal">costs</em></h2>
          <p className="label">( Pricing )</p>
        </div>
        <div className="sv-tiers">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} y={40} delay={i * 90}>
              <div className={`card sv-tier${t.featured ? " is-featured" : ""}`}>
                {t.featured && <span className="sv-tier-badge">Most common</span>}
                <h3 className="sv-tier-name">{t.name}</h3>
                <p className="sv-tier-for">{t.for}</p>
                <div className="sv-tier-price">
                  <span className="sv-tier-price-num">{t.price}</span>
                  <span className="sv-tier-price-note">{t.note}</span>
                </div>
                <ul className="sv-tier-list">
                  {t.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <Magnetic>
                  <Link href="/contact" className={t.featured ? "btn-solid" : "btn-line"}>
                    {t.cta} <ArrowRight size={16} />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          ))}
        </div>
        <p style={{ color: "var(--fg-muted)", fontSize: "0.9rem", marginTop: "1.6rem", maxWidth: "40rem" }}>
          Ranges are a starting point — actual cost depends on scope, and every quote follows a short
          discovery call rather than a form. Rates can flex for students, early-stage founders and
          registered nonprofits — just say so.
        </p>
        <p style={{ color: "var(--fg-muted)", fontSize: "0.9rem", marginTop: "0.6rem", maxWidth: "40rem" }}>
          These are set by scope and market value, not by location — the same build costs the same
          whether the brief comes from Douala, Lagos or San Francisco.
        </p>
        <p style={{ color: "var(--fg-muted)", fontSize: "0.9rem", marginTop: "0.6rem", maxWidth: "40rem" }}>
          Joining an existing team instead of running a standalone build? Day-rate and sprint-based
          contracting is available too — mention it on the call.
        </p>
      </div>

      {/* ── GOOD FIT ── */}
      <div className="n-sec n-tight" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="n-head">
          <h2>Is this a <em className="font-serif italic font-normal">fit</em>?</h2>
          <p className="label">( Self-check )</p>
        </div>
        <div className="sv-fit">
          <Reveal y={30} className="sv-fit-col">
            <h3>Good fit</h3>
            <ul>{GOOD_FIT.map((g) => <li key={g}>{g}</li>)}</ul>
          </Reveal>
          <Reveal y={30} delay={100} className="sv-fit-col">
            <h3>Probably not yet</h3>
            <ul>{NOT_YET.map((g) => <li key={g}>{g}</li>)}</ul>
          </Reveal>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="n-sec n-tight" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="n-head">
          <h2>Common <em className="font-serif italic font-normal">questions</em></h2>
          <p className="label">( FAQ )</p>
        </div>
        <div className="sv-faq">
          {FAQ.map((f) => (
            <details key={f.q} className="sv-faq-item">
              <summary className="sv-faq-q">{f.q}</summary>
              <p className="sv-faq-a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ── CLOSING CTA ── */}
      <div className="n-sec" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <div className="sv-cta">
          <h2>Have something worth building?</h2>
          <Magnetic>
            <Link href="/contact" className="btn-solid">
              Tell me about it <ArrowUpRight size={16} />
            </Link>
          </Magnetic>
        </div>
        <p style={{ color: "var(--fg-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>
          Prefer email? <a href={`mailto:${siteConfig.email}`} style={{ color: "var(--accent-ink)" }}>{siteConfig.email}</a>
        </p>
      </div>
    </section>
  );
}
