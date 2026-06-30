import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Ado Daniel",
  description:
    "Privacy Policy for the WhatsApp chatbot application built and operated by Ado Daniel.",
};

const APP_NAME = "Ado Daniel WhatsApp Bot"; // TODO: replace with your actual app name
const CONTACT_EMAIL = "your-email@example.com"; // TODO: replace with your real contact email
const LAST_UPDATED = "June 30, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-zinc-800 dark:text-zinc-200">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-zinc-500 mb-10">Last updated: {LAST_UPDATED}</p>

      <p className="mb-6 leading-relaxed">
        This Privacy Policy explains how {APP_NAME} (&quot;the App&quot;, &quot;we&quot;,
        &quot;us&quot;) collects, uses, and protects information when you interact with our
        chatbot via WhatsApp, which is built using the Meta (Facebook) WhatsApp Business
        Platform. By messaging or otherwise interacting with the App, you agree to the
        practices described in this policy.
      </p>

      <Section title="1. Information We Collect">
        <p className="mb-3">When you interact with the App through WhatsApp, we may collect:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your WhatsApp phone number (used as your unique identifier).</li>
          <li>Your WhatsApp profile name, as provided by WhatsApp.</li>
          <li>
            The content of messages you send to the bot (text, button replies, and any
            media such as images, audio, or documents you choose to send).
          </li>
          <li>
            Metadata about your messages (timestamps, message status, and delivery
            information) provided by the WhatsApp Business Platform.
          </li>
          <li>
            Any information you voluntarily provide during a conversation (e.g. name,
            email, preferences) in order to use specific features of the App.
          </li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul className="list-disc pl-6 space-y-1">
          <li>To operate, maintain, and provide the chatbot functionality you requested.</li>
          <li>To respond to your messages and provide customer support.</li>
          <li>To improve, debug, and monitor the performance and reliability of the App.</li>
          <li>To personalize responses based on your prior interactions, where applicable.</li>
          <li>To comply with legal obligations and enforce our terms of use.</li>
        </ul>
        <p className="mt-3">
          We do not use your data to serve third-party advertising, and we do not sell your
          personal information to anyone.
        </p>
      </Section>

      <Section title="3. How We Share Information">
        <p className="mb-3">We may share information only in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            With service providers that help us operate the App (e.g. cloud hosting,
            database, or AI/automation providers), bound by confidentiality obligations.
          </li>
          <li>
            With Meta/WhatsApp, as required for the App to function on the WhatsApp
            Business Platform, subject to Meta&apos;s own data policies.
          </li>
          <li>If required to do so by law, regulation, or valid legal process.</li>
          <li>
            To protect the rights, property, or safety of the App, our users, or the
            public.
          </li>
        </ul>
        <p className="mt-3">We do not sell or rent your personal data to third parties.</p>
      </Section>

      <Section title="4. Data Storage and Security">
        <p>
          We take reasonable technical and organizational measures to protect the
          information we process, including encryption in transit and restricted access to
          stored data. However, no method of transmission or storage is 100% secure, and we
          cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain conversation data only for as long as necessary to provide the App&apos;s
          functionality, improve our service, or comply with legal obligations. You may
          request deletion of your data at any time as described in Section 7.
        </p>
      </Section>

      <Section title="6. Children's Privacy">
        <p>
          The App is not directed to children under 13 (or the minimum age required in your
          jurisdiction), and we do not knowingly collect personal information from children.
          If you believe a child has provided us with personal information, please contact
          us so we can delete it.
        </p>
      </Section>

      <Section title="7. Your Rights and Choices">
        <ul className="list-disc pl-6 space-y-1">
          <li>You may stop using the App at any time by simply no longer messaging it.</li>
          <li>
            You may request access to, correction of, or deletion of your personal data by
            contacting us at {CONTACT_EMAIL}.
          </li>
          <li>
            Depending on your location, you may have additional rights under applicable
            data protection laws (e.g. GDPR, CCPA).
          </li>
        </ul>
      </Section>

      <Section title="8. Third-Party Platform">
        <p>
          The App operates on top of the WhatsApp Business Platform, which is owned and
          operated by Meta Platforms, Inc. Your use of WhatsApp itself is also governed by{" "}
          <a
            href="https://www.whatsapp.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            WhatsApp&apos;s Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://www.whatsapp.com/legal/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Terms of Service
          </a>
          .
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted
          on this page with an updated &quot;Last updated&quot; date. Continued use of the
          App after changes are posted constitutes acceptance of the revised policy.
        </p>
      </Section>

      <Section title="10. Contact Us">
        <p>
          If you have any questions about this Privacy Policy or how your data is handled,
          please contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="leading-relaxed">{children}</div>
    </section>
  );
}