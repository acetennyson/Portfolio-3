import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

/** Lazily builds one pooled SMTP transporter per server instance. */
export function getTransport(): Transporter {
  if (cached) return cached;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("Mail is not configured: set SMTP_HOST, SMTP_USER and SMTP_PASS");
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  // 465 is implicit TLS; every other port upgrades via STARTTLS.
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

  cached = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
  });
  return cached;
}
