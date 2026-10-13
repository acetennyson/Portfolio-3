import { escapeHtml } from "./escape";

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function contactEmail(m: ContactMessage, meta: { ip: string; at: Date }) {
  const name = escapeHtml(m.name);
  const email = escapeHtml(m.email);
  const subject = escapeHtml(m.subject);
  const body = escapeHtml(m.message).replace(/\n/g, "<br>");
  const when = meta.at.toUTCString();

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f1eee8;font-family:Arial,Helvetica,sans-serif;color:#121212">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2ded5;border-radius:10px">
    <tr><td style="padding:24px 28px;border-bottom:1px solid #e2ded5">
      <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5f5c56">New message from your portfolio</div>
      <div style="font-size:20px;font-weight:700;margin-top:6px">${subject}</div>
    </td></tr>
    <tr><td style="padding:20px 28px;font-size:14px;line-height:1.6">
      <p style="margin:0 0 4px"><strong>Name:</strong> ${name}</p>
      <p style="margin:0 0 16px"><strong>Email:</strong> <a href="mailto:${email}" style="color:#3d5600">${email}</a></p>
      <div style="padding:16px;background:#f7f5f0;border-radius:8px;font-size:15px;line-height:1.7">${body}</div>
    </td></tr>
    <tr><td style="padding:14px 28px;border-top:1px solid #e2ded5;font-size:12px;color:#8d8a84">
      Received ${escapeHtml(when)} from ${escapeHtml(meta.ip)}. Hit reply to answer ${name} directly.
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `New message from your portfolio`,
    ``,
    `Name: ${m.name}`,
    `Email: ${m.email}`,
    `Subject: ${m.subject}`,
    ``,
    m.message,
    ``,
    `Received ${when} from ${meta.ip}. Reply to this mail to answer ${m.name} directly.`,
  ].join("\n");

  return { subject: `[Portfolio] ${m.subject}`, html, text };
}
