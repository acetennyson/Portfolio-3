import SplitReveal from "../../../components/motion/SplitReveal";
import Reveal from "../../../components/motion/Reveal";
import ContactForm from "../../../components/contact/ContactForm";
import ContactChannels from "../../../components/contact/ContactChannels";

// Edit this line to change what the page promises.
const REPLY_TIME = "Replies within a few days";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Ado Daniel Nji for projects, collaborations or a quick hello.",
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", url: "/contact", title: "Contact | Ado Daniel Nji", description: "Get in touch for projects, collaborations or a quick hello." },
};

export default function ContactPage() {
  return (
    <section className="n-page">
      <Reveal immediate delay={100} className="n-page-top label">
        <span>( Contact )</span>
        <span className="ct-status"><i className="ct-dot" aria-hidden /> Available for work</span>
      </Reveal>
      <SplitReveal as="h1" className="n-page-title" immediate delay={200} stagger={90} text="Let's *talk*" />
      <Reveal immediate delay={500}>
        <p className="n-page-lead">
          Have a project, a question or an idea worth building? Tell me a little about it and it lands straight in my inbox.
        </p>
      </Reveal>

      <div className="ct-grid">
        <Reveal immediate delay={650} className="ct-aside-wrap">
          <ContactChannels replyTime={REPLY_TIME} />
        </Reveal>
        <Reveal immediate delay={750}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
