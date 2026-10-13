"use client";

import React from "react";
import { ArrowRight, Check } from "lucide-react";
import Magnetic from "../motion/Magnetic";
import { validateContact, type ContactInput } from "../../lib/contact/validate";

type FieldName = Exclude<keyof ContactInput, "subject">;
type Errors = Partial<Record<keyof ContactInput, string>>;
type Status = "idle" | "loading" | "success";

const TOPICS = ["New project", "Collaboration", "Job opportunity", "Just saying hi"] as const;
const MAX_MESSAGE = 5000;
const ORDER: FieldName[] = ["name", "email", "message"];

export default function ContactForm() {
  const [topic, setTopic] = React.useState<string>(TOPICS[0]);
  const [values, setValues] = React.useState({ name: "", email: "", message: "" });
  const [website, setWebsite] = React.useState(""); // honeypot
  const [touched, setTouched] = React.useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [serverErrors, setServerErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [sentTo, setSentTo] = React.useState("");

  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  const doneRef = React.useRef<HTMLHeadingElement>(null);

  // The subject is derived, so the inbox always shows who wrote and why.
  const subject = `${topic} from ${values.name.trim() || "a visitor"}`;
  const live = validateContact({ ...values, subject }).errors;
  const errorFor = (f: FieldName) => (touched[f] || submitted ? serverErrors[f] ?? live[f] : undefined);

  React.useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [values.message, status]);

  React.useEffect(() => {
    if (status === "success") doneRef.current?.focus();
  }, [status]);

  const onChange = (f: FieldName) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((p) => ({ ...p, [f]: e.target.value }));
    setServerErrors((p) => ({ ...p, [f]: undefined }));
  };
  const onBlur = (f: FieldName) => () => setTouched((p) => ({ ...p, [f]: true }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setSubmitted(true);
    setFormError("");

    const firstInvalid = ORDER.find((f) => live[f]);
    if (firstInvalid) {
      document.getElementById(`ct-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subject, website }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setSentTo(values.email.trim());
        setValues({ name: "", email: "", message: "" });
        setTouched({});
        setSubmitted(false);
        setServerErrors({});
        setStatus("success");
        return;
      }
      setServerErrors(data.errors ?? {});
      setFormError(data.error ?? (data.errors ? "Please check the highlighted fields." : "Something went wrong. Please try again."));
    } catch {
      setFormError("Network error. Check your connection and try again.");
    }
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="ct-done" role="status">
        <span className="ct-check" aria-hidden><Check size={26} strokeWidth={2.5} /></span>
        <h2 className="ct-done-title" ref={doneRef} tabIndex={-1}>
          Sent, <em>thanks</em>.
        </h2>
        <p className="ct-done-text">
          Your message is in my inbox. I will reply to <strong>{sentTo}</strong> as soon as I can.
        </p>
        <button type="button" className="btn-line" onClick={() => setStatus("idle")}>Send another</button>
      </div>
    );
  }

  const busy = status === "loading";

  return (
    <form onSubmit={submit} className="ct-form" noValidate aria-busy={busy}>
      <div className="ct-step">
        <span className="ct-num" aria-hidden>01</span>
        <div>
          <span className="label" id="ct-topic-label">What is this about?</span>
          <div className="ct-chips" role="radiogroup" aria-labelledby="ct-topic-label">
            {TOPICS.map((t) => (
              <label key={t} className="ct-chip">
                <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} disabled={busy} />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Step n="02" id="ct-name" label="Your name" error={errorFor("name")}>
        <input id="ct-name" className="ct-input" type="text" autoComplete="name" placeholder="Jane Doe" maxLength={80}
          value={values.name} onChange={onChange("name")} onBlur={onBlur("name")} disabled={busy}
          aria-invalid={!!errorFor("name")} aria-describedby={errorFor("name") ? "ct-name-err" : undefined} />
      </Step>

      <Step n="03" id="ct-email" label="Your email" error={errorFor("email")}>
        <input id="ct-email" className="ct-input" type="email" autoComplete="email" inputMode="email" placeholder="jane@company.com" maxLength={160}
          value={values.email} onChange={onChange("email")} onBlur={onBlur("email")} disabled={busy}
          aria-invalid={!!errorFor("email")} aria-describedby={errorFor("email") ? "ct-email-err" : undefined} />
      </Step>

      <Step n="04" id="ct-message" label="Tell me about it" error={errorFor("message")}
        aside={<span className="label ct-count" aria-hidden>{values.message.length}/{MAX_MESSAGE}</span>}>
        <textarea id="ct-message" ref={areaRef} className="ct-input ct-area" rows={1} placeholder="A few lines on what you have in mind" maxLength={MAX_MESSAGE}
          value={values.message} onChange={onChange("message")} onBlur={onBlur("message")} disabled={busy}
          aria-invalid={!!errorFor("message")} aria-describedby={errorFor("message") ? "ct-message-err" : undefined} />
      </Step>

      {/* Honeypot: hidden from people and assistive tech */}
      <div className="ct-hp" aria-hidden="true">
        <label>Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {formError && <p className="ct-alert" role="alert">{formError}</p>}

      <div className="ct-submit-row">
        <Magnetic>
          <button type="submit" className="btn-cta ct-submit" disabled={busy}>
            {busy ? "Sending..." : "Send message"}
            {!busy && <ArrowRight size={18} aria-hidden />}
          </button>
        </Magnetic>
        <span className="label">Goes straight to my inbox</span>
      </div>
    </form>
  );
}

function Step({
  n, id, label, error, aside, children,
}: { n: string; id: string; label: string; error?: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="ct-step">
      <span className="ct-num" aria-hidden>{n}</span>
      <div>
        <div className="ct-label-row">
          <label className="label" htmlFor={id}>{label}</label>
          {aside}
        </div>
        <div className={`ct-field${error ? " is-invalid" : ""}`}>{children}</div>
        {error && <p id={`${id}-err`} className="ct-err" role="alert">{error}</p>}
      </div>
    </div>
  );
}
