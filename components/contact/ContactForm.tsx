"use client";

import React from "react";

type Status = "idle" | "loading" | "success" | "error";
type Fields = { name: string; email: string; subject: string; message: string };

const EMPTY: Fields = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = React.useState<Fields>(EMPTY);
  const [website, setWebsite] = React.useState(""); // honeypot
  const [status, setStatus] = React.useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Fields>>({});
  const [formError, setFormError] = React.useState("");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFieldErrors({});
    setFormError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setValues(EMPTY);
        setStatus("success");
        return;
      }
      setFieldErrors(data.errors ?? {});
      setFormError(data.error ?? (data.errors ? "Please fix the highlighted fields." : "Something went wrong."));
      setStatus("error");
    } catch {
      setFormError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  };

  const busy = status === "loading";

  if (status === "success") {
    return (
      <div className="c-done" role="status">
        <p className="c-done-title">Message sent.</p>
        <p className="c-done-text">Thanks for reaching out. I will reply to your email soon.</p>
        <button type="button" className="btn-line" onClick={() => setStatus("idle")}>Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="c-form" noValidate>
      <div className="c-row">
        <Field label="Name" error={fieldErrors.name}>
          <input type="text" name="name" autoComplete="name" required maxLength={80}
            value={values.name} onChange={set("name")} disabled={busy} />
        </Field>
        <Field label="Email" error={fieldErrors.email}>
          <input type="email" name="email" autoComplete="email" required maxLength={160}
            value={values.email} onChange={set("email")} disabled={busy} />
        </Field>
      </div>

      <Field label="Subject" error={fieldErrors.subject}>
        <input type="text" name="subject" required maxLength={120}
          value={values.subject} onChange={set("subject")} disabled={busy} />
      </Field>

      <Field label="Message" error={fieldErrors.message}>
        <textarea name="message" rows={7} required maxLength={5000}
          value={values.message} onChange={set("message")} disabled={busy} />
      </Field>

      {/* Honeypot, hidden from people and assistive tech */}
      <div className="c-hp" aria-hidden="true">
        <label>Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off"
            value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {formError && <p className="c-error" role="alert">{formError}</p>}

      <button type="submit" className="btn-solid c-submit" disabled={busy}>
        {busy ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="c-field">
      <span className="label">{label}</span>
      {children}
      {error && <span className="c-field-error">{error}</span>}
    </label>
  );
}
