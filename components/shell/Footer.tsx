import Link from "next/link";
import { siteConfig } from "../../lib/data";
import { GithubIcon, TwitterIcon, LinkedinIcon, DevtoIcon } from "../SocialIcons";
import { NAV } from "../../lib/nav";

export default function Footer() {
  const socials = [
    { href: siteConfig.social.github, label: "GitHub", icon: <GithubIcon size={16} /> },
    { href: siteConfig.social.twitter, label: "X / Twitter", icon: <TwitterIcon size={16} /> },
    { href: siteConfig.social.linkedin, label: "LinkedIn", icon: <LinkedinIcon size={16} /> },
    { href: siteConfig.social.dev, label: "DEV", icon: <DevtoIcon size={16} /> },
  ];
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-name">{siteConfig.name}</p>
          <p className="label">{siteConfig.title}</p>
        </div>
        <ul className="footer-nav">
          {NAV.map((n) => (
            <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
          ))}
          <li><Link href="/contact">Contact</Link></li>
        </ul>
        <ul className="footer-social">
          {socials.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.icon}</a>
            </li>
          ))}
        </ul>
      </div>
      <p className="footer-fine label">
        &copy; {new Date().getFullYear()} {siteConfig.name} &mdash; Built with Next.js &amp; Firebase
      </p>
      <p className="footer-fine label footer-credit">
        Astronaut 3D model &copy; Google, licensed Apache-2.0 (model-viewer shared-assets). Greeting
        interaction concept inspired by{" "}
        <a href="https://lusion.co" target="_blank" rel="noopener noreferrer">
          Lusion
        </a>
        .
      </p>
    </footer>
  );
}
