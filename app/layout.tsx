import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ado Daniel NJ — Full-Stack Developer & Designer",
  description: "Designer & developer crafting high-performance digital products.",
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
