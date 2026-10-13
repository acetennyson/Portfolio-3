import SplitReveal from "../../../components/motion/SplitReveal";
import Reveal from "../../../components/motion/Reveal";
import ContactForm from "../../../components/contact/ContactForm";

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
        <span>Replies within a few days</span>
      </Reveal>
      <SplitReveal as="h1" className="n-page-title" immediate delay={200} stagger={90} text="Say *hello*" />
      <Reveal immediate delay={500}>
        <p className="n-page-lead">
          Have a project, a question or an idea worth building? Send a message and it lands straight in my inbox.
        </p>
      </Reveal>
      <Reveal immediate delay={650}>
        <ContactForm />
      </Reveal>
    </section>
  );
}
