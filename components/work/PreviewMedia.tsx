"use client";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, MousePointer2 } from "lucide-react";

const shotSrc = (u: string) => `/api/preview/image?url=${encodeURIComponent(u)}`;

/**
 * Image with the preview fallback chain:  live-site screenshot  →  cover image  →  numbered placeholder.
 * Cheap enough for hover previews and thumbnails (no iframes).
 */
export function PreviewImage({ liveUrl, cover, alt = "", className = "", label = "" }: { liveUrl?: string; cover?: string; alt?: string; className?: string; label?: string }) {
  const [stage, setStage] = useState<"shot" | "cover" | "none">(liveUrl ? "shot" : cover ? "cover" : "none");
  const [loaded, setLoaded] = useState(false);
  const src = stage === "shot" ? shotSrc(liveUrl!) : stage === "cover" ? cover : undefined;

  if (!src) return <span className={`n-preview-ph ${className}`} aria-hidden>{label}</span>;
  return (
    <img
      className={`pm-img ${loaded ? "is-loaded" : ""} ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => { setLoaded(false); setStage((s) => (s === "shot" && cover ? "cover" : "none")); }}
    />
  );
}

/**
 * Large case-study media:  interactive live iframe (if the site allows embedding)
 *   →  screenshot  →  cover image  →  placeholder.
 */
export default function PreviewMedia({ liveUrl, cover, title, label, embed }: { liveUrl?: string; cover?: string; title: string; label: string; embed?: boolean }) {
  const [mode, setMode] = useState<"embed" | "static">(liveUrl && embed ? "embed" : "static");
  const [active, setActive] = useState(false);
  const [dims, setDims] = useState({ s: 0.5, h: 900 });
  const box = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const W = 1440; // render the site at desktop width, then scale it to fit

  useEffect(() => {
    if (mode !== "embed") return;
    const el = box.current;
    if (!el) return;
    const fit = () => { const s = el.clientWidth / W; setDims({ s, h: el.clientHeight / s }); };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    // if the page never finishes loading, fall back to the screenshot
    const t = window.setTimeout(() => { if (!loaded.current) setMode("static"); }, 12000);
    return () => { ro.disconnect(); window.clearTimeout(t); };
  }, [mode]);

  if (mode === "embed" && liveUrl) {
    return (
      <div ref={box} className="pm-embed" onMouseLeave={() => setActive(false)}>
        <iframe
          src={liveUrl}
          title={`${title} — live preview`}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => { loaded.current = true; }}
          style={{ width: W, height: dims.h, transform: `scale(${dims.s})`, pointerEvents: active ? "auto" : "none" }}
        />
        <span className="pm-badge label"><i aria-hidden /> Live preview</span>
        <div className="pm-actions">
          <button type="button" onClick={() => setActive((a) => !a)} aria-pressed={active}><MousePointer2 size={14} /> {active ? "Scroll page" : "Interact"}</button>
          <a href={liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Open</a>
        </div>
      </div>
    );
  }
  return <PreviewImage liveUrl={liveUrl} cover={cover} alt={title} label={label} className="pm-fill" />;
}
