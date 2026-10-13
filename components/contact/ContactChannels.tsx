"use client";

import React from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { siteConfig } from "../../lib/data";
import { DevtoIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "../SocialIcons";

const LINKS = [
  { label: "GitHub", href: siteConfig.social.github, icon: <GithubIcon size={16} /> },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: <LinkedinIcon size={16} /> },
  { label: "X / Twitter", href: siteConfig.social.twitter, icon: <TwitterIcon size={16} /> },
  { label: "DEV", href: siteConfig.social.dev, icon: <DevtoIcon size={16} /> },
];

/** Live wall-clock for Douala. Empty on the server so hydration never mismatches. */
function useDoualaTime(): string {
  const [time, setTime] = React.useState("");
  React.useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Douala" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function ContactChannels({ replyTime }: { replyTime: string }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const time = useDoualaTime();

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  };

  return (
    <aside className="ct-aside" aria-label="Contact details">
      <div className="ct-block">
        <span className="label">Write directly</span>
        <button type="button" className="ct-mail" onClick={copy} aria-label={`Copy ${siteConfig.email}`}>
          <span>{siteConfig.email}</span>
          <span className="ct-copy">
            {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
        <span className="sr-only" role="status">{copied ? "Email address copied" : ""}</span>
      </div>

      <div className="ct-block">
        <span className="label">Elsewhere</span>
        <ul className="ct-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                <span className="ct-link-name">{l.icon}{l.label}</span>
                <ArrowUpRight size={18} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="ct-block">
        <span className="label">Based in</span>
        <p className="ct-loc">Douala, <em className="font-serif">Cameroon</em></p>
        <p className="label ct-meta">
          {time ? `${time} local time` : "\u00A0"} · {replyTime}
        </p>
      </div>
    </aside>
  );
}
