"use client";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "system" | "light" | "dark";

function applyTheme(t: Theme) {
  if (t === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else if (t === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) ?? "system";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function set(t: Theme) {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  }

  const options: { value: Theme; icon: React.ReactNode }[] = [
    { value: "system", icon: <Monitor size={13} /> },
    { value: "light", icon: <Sun size={13} /> },
    { value: "dark", icon: <Moon size={13} /> },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-full p-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {options.map(({ value, icon }) => (
        <button
          key={value}
          onClick={() => set(value)}
          title={value}
          className="rounded-full p-1.5 transition-all duration-200"
          style={theme === value
            ? { background: "linear-gradient(135deg, var(--grad-start), var(--grad-end))", color: "#fff" }
            : { background: "transparent", color: "var(--fg-muted)" }
          }
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
