"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import Magnetic from "../motion/Magnetic";
import Menu from "./Menu";
import { siteConfig } from "../../lib/data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 120 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y <= 120) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="site-header" data-hidden={hidden && !open}>
        <Link href="/" className="brand" aria-label={`${siteConfig.name} — home`}>
          <span className="brand-mark" />
          {siteConfig.name}
        </Link>
        <div className="header-right">
          <ThemeToggle />
          <Magnetic strength={0.25}>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="menu-btn-icon" data-open={open} aria-hidden />
            </button>
          </Magnetic>
        </div>
      </header>
      <Menu open={open} onClose={close} />
    </>
  );
}
