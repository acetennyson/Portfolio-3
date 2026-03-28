import React from "react";
import Link from "next/link";
import ThemeToggle from "../../components/ThemeToggle";
import { GithubIcon, TwitterIcon, LinkedinIcon } from "../../components/SocialIcons";
import { siteConfig } from "../../lib/data";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl"
        style={{ borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg) 75%, transparent)" }}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-lg font-black tracking-tight grad-text">
            {siteConfig.name}
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="transition-opacity hover:opacity-60" style={{ color: "var(--fg)" }}>Home</Link>
            <Link href="/projects" className="transition-opacity hover:opacity-60" style={{ color: "var(--fg)" }}>Projects</Link>
            <Link href="/tools" className="transition-opacity hover:opacity-60" style={{ color: "var(--fg)" }}>Tools</Link>
            <Link href="#blog" className="transition-opacity hover:opacity-60" style={{ color: "var(--fg)" }}>Blog</Link>
            <Link href="/admin" className="transition-opacity hover:opacity-60 sr-only" style={{ color: "var(--fg-muted)" }}>Admin</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        {children}
      </main>

      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-base font-black grad-text">{siteConfig.name}</p>
              <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>{siteConfig.title}</p>
            </div>
            <div className="flex items-center gap-6 text-sm" style={{ color: "var(--fg-muted)" }}>
              <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
              <Link href="/projects" className="hover:opacity-70 transition-opacity">Projects</Link>
              <a href={`mailto:${siteConfig.email}`} className="hover:opacity-70 transition-opacity">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              {[
                { href: siteConfig.social.github, icon: <GithubIcon size={16} /> },
                { href: siteConfig.social.twitter, icon: <TwitterIcon size={16} /> },
                { href: siteConfig.social.linkedin, icon: <LinkedinIcon size={16} /> },
              ].map(({ href, icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:border-violet-500"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 text-center text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--fg-muted)" }}>
            © {new Date().getFullYear()} {siteConfig.name} — Built with Next.js & Firebase
          </div>
        </div>
      </footer>
    </div>
  );
}
