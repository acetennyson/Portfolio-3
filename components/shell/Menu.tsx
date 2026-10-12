"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, stagger } from "animejs";
import { lockScroll, prefersReducedMotion } from "../../lib/motion";
import { siteConfig } from "../../lib/data";
import { NAV } from "../../lib/nav";
import { GithubIcon, TwitterIcon, LinkedinIcon, DevtoIcon } from "../SocialIcons";

export default function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const wasOpen = useRef(false);

  // close on route change
  useEffect(() => { if (open) onClose(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathname]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();

    if (open) {
      wasOpen.current = true;
      setVisible(true);
      lockScroll(true);
      const links = el.querySelectorAll<HTMLElement>(".menu-link-i");
      const meta = el.querySelectorAll<HTMLElement>(".menu-meta");
      if (reduced) {
        el.style.clipPath = "none";
        links.forEach((l) => (l.style.transform = "none"));
        meta.forEach((m) => (m.style.opacity = "1"));
      } else {
        animate(el, { clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"], duration: 900, ease: "inOutExpo" });
        animate(links, { translateY: ["110%", "0%"], duration: 1000, delay: stagger(80, { start: 350 }), ease: "outExpo" });
        animate(meta, { opacity: [0, 1], duration: 800, delay: stagger(60, { start: 700 }), ease: "outQuad" });
      }
      const first = el.querySelector<HTMLElement>("a");
      window.setTimeout(() => first?.focus({ preventScroll: true }), reduced ? 0 : 400);
    } else if (wasOpen.current) {
      wasOpen.current = false;
      lockScroll(false);
      if (reduced) { setVisible(false); return; }
      animate(el, {
        clipPath: ["inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"],
        duration: 750,
        ease: "inOutExpo",
        onComplete: () => setVisible(false),
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>("a[href], button");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const socials = [
    { href: siteConfig.social.github, label: "GitHub", icon: <GithubIcon size={15} /> },
    { href: siteConfig.social.twitter, label: "X / Twitter", icon: <TwitterIcon size={15} /> },
    { href: siteConfig.social.linkedin, label: "LinkedIn", icon: <LinkedinIcon size={15} /> },
    { href: siteConfig.social.dev, label: "DEV", icon: <DevtoIcon size={15} /> },
  ];

  return (
    <div
      ref={root}
      id="site-menu"
      className="menu"
      data-open={visible ? "true" : "false"}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <nav className="menu-nav" aria-label="Primary">
        <ul>
          {NAV.map((n, i) => (
            <li key={n.href} className="menu-link-w">
              <Link href={n.href} className="menu-link" data-active={pathname === n.href} onClick={onClose}>
                <span className="menu-link-i">
                  <span className="menu-idx">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="menu-side">
        <div className="menu-meta">
          <p className="label">Say hello</p>
          <a href={`mailto:${siteConfig.email}`} className="menu-mail">{siteConfig.email}</a>
        </div>
        <div className="menu-meta">
          <p className="label">Elsewhere</p>
          <ul className="menu-social">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.icon}<span>{s.label}</span></a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
