import { type NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/data";
import { sendMail } from "@/lib/mail/sendMail";
import { contactEmail } from "@/lib/mail/templates";
import { validateContact } from "@/lib/contact/validate";
import { allowContact } from "@/lib/contact/rateLimit";

export const runtime = "nodejs"; // nodemailer needs Node APIs, not the edge runtime

const RECIPIENT = process.env.CONTACT_TO || siteConfig.email;

const json = (body: object, status = 200) => NextResponse.json(body, { status });

const clientIp = (req: NextRequest) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return json({ ok: false, error: "Invalid request." }, 400);

  // Honeypot: real users never fill this hidden field. Pretend success so bots learn nothing.
  if (typeof body.website === "string" && body.website.length > 0) return json({ ok: true });

  const ip = clientIp(req);
  if (!allowContact(ip)) {
    return json({ ok: false, error: "Too many messages. Please try again in a few minutes." }, 429);
  }

  const { data, errors } = validateContact(body);
  if (Object.keys(errors).length > 0) return json({ ok: false, errors }, 400);

  try {
    const mail = contactEmail(data, { ip, at: new Date() });
    await sendMail({ to: RECIPIENT, replyTo: data.email, ...mail });
    return json({ ok: true });
  } catch (err) {
    console.error("Contact mail failed:", err);
    return json({ ok: false, error: "Could not send your message right now. Please try again later." }, 502);
  }
}
