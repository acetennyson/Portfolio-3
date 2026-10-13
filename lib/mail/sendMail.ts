import { getTransport } from "./transport";

export interface MailInput {
  to: string | string[];
  subject: string;
  /** HTML body. When `text` is omitted, a plain-text version is derived from it. */
  html?: string;
  /** Plain-text body. Required when `html` is omitted. */
  text?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/** Crude but dependable HTML to text fallback so every mail ships a text part. */
export function htmlToText(html: string): string {
  return html
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const asList = (v?: string | string[]) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/**
 * Sends an HTML and/or text mail to one or many addresses.
 * Resolves with the SMTP message id; throws if the transport rejects.
 */
export async function sendMail(input: MailInput): Promise<string> {
  const to = asList(input.to);
  if (to.length === 0) throw new Error("sendMail: at least one recipient is required");
  if (!input.html && !input.text) throw new Error("sendMail: provide html or text");

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const info = await getTransport().sendMail({
    from,
    to,
    cc: asList(input.cc),
    bcc: asList(input.bcc),
    replyTo: input.replyTo,
    subject: input.subject,
    html: input.html,
    text: input.text ?? htmlToText(input.html as string),
  });
  return info.messageId;
}
