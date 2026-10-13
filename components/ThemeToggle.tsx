"use client";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "system" | "light" | "dark";

function applyTheme(t: Theme) {
  if (t === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.classList.remove("dark");
  } else if (t === "dark") {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.add("dark");
  } else {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.add("dark");
    }
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    let stored: Theme = "system";
    try { stored = (localStorage.getItem("theme") as Theme) ?? "system"; } catch { /* storage blocked */ }
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function set(t: Theme) {
    setTheme(t);
    try { localStorage.setItem("theme", t); } catch { /* storage blocked */ }
    applyTheme(t);
  }

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "system", label: "Match system theme", icon: <Monitor size={13} aria-hidden /> },
    { value: "light", label: "Light theme", icon: <Sun size={13} aria-hidden /> },
    { value: "dark", label: "Dark theme", icon: <Moon size={13} aria-hidden /> },
  ];

  return (
    <div role="group" aria-label="Colour theme" className="flex items-center gap-0.5 rounded-full p-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {options.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => set(value)}
          title={label}
          aria-label={label}
          aria-pressed={theme === value}
          className="rounded-full p-1.5 transition-all duration-200"
          style={theme === value
            ? { background: "var(--accent)", color: "#0c0c0d" }
            : { background: "transparent", color: "var(--fg-muted)" }
          }
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
