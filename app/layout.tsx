import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const NAME = "Ado Daniel Nji";
const TITLE = "Ado Daniel Nji — Full-Stack Developer & Designer";
const DESCRIPTION =
  "Ado Daniel Nji (IAmSupreme) is a solo full-stack developer and designer in Douala, Cameroon, building high-performance web apps, mobile apps and AI agent systems. Founder of Beta Gamer, JobHub Cameroon and Axir.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s — Ado Daniel Nji" },
  description: DESCRIPTION,
  keywords: [
    "Ado Daniel Nji",
    "IAmSupreme",
    "full-stack developer",
    "full-stack developer Cameroon",
    "software developer Douala",
    "React developer",
    "Next.js developer",
    "mobile app developer",
    "AI agent developer",
    "freelance developer Africa",
    "web designer portfolio",
  ],
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  publisher: NAME,
  category: "technology",
  applicationName: NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@AdoNj84371",
  },
  verification: {
    // Paste the verification codes from Google Search Console / Bing Webmaster Tools here once you register the property.
    // google: "your-google-site-verification-code",
    // other: { "msvalidate.01": "your-bing-verification-code" },
  },
};

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  alternateName: "IAmSupreme",
  url: SITE_URL,
  jobTitle: "Full-Stack Developer & Designer",
  description: DESCRIPTION,
  address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM" },
  sameAs: [
    "https://github.com/acetennyson",
    "https://x.com/AdoNj84371",
    "https://www.linkedin.com/in/iamsupreme/",
    "https://www.facebook.com/iamsupreme0",
    "https://dev.to/adodanieln",
  ],
  knowsAbout: ["Full-Stack Development", "React", "Next.js", "Mobile Development", "AI Agents", "UI/UX Design"],
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  publisher: { "@type": "Person", name: NAME },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0d" },
    { media: "(prefers-color-scheme: light)", color: "#f1eee8" },
  ],
};

const INIT = `(function(){var d=document.documentElement;d.classList.add('js');try{d.dataset.loader=sessionStorage.getItem('loaded')?'done':'pending'}catch(e){d.dataset.loader='pending'}var t=null;try{t=localStorage.getItem('theme')}catch(e){}if(t==='light'){d.setAttribute('data-theme','light');d.classList.remove('dark')}else if(t==='dark'){d.removeAttribute('data-theme');d.classList.add('dark')}else if(window.matchMedia('(prefers-color-scheme: light)').matches){d.setAttribute('data-theme','light');d.classList.remove('dark')}else{d.removeAttribute('data-theme');d.classList.add('dark')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: INIT }} />
        {/* Plain <script> (not next/script) so this JSON-LD is present in the initial server-rendered
            HTML rather than injected after hydration — crawlers that don't execute JS still see it. */}
        <script
          id="ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSONLD) }}
        />
        <script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
        {children}
      </body>
    </html>
  );
}
