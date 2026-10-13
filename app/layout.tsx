import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const DESCRIPTION = "Designer & developer crafting high-performance digital products.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Ado Daniel NJ — Full-Stack Developer & Designer", template: "%s — Ado Daniel NJ" },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Ado Daniel NJ",
    title: "Ado Daniel NJ — Full-Stack Developer & Designer",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "Ado Daniel NJ — Full-Stack Developer & Designer", description: DESCRIPTION },
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
        {children}
      </body>
    </html>
  );
}
