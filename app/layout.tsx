import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Creative portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');else if(t==='dark')document.documentElement.removeAttribute('data-theme');else if(window.matchMedia('(prefers-color-scheme: light)').matches)document.documentElement.setAttribute('data-theme','light');})()`}</Script>
        {children}
      </body>
    </html>
  );
}
