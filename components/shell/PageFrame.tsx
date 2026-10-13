"use client";
import { usePathname } from "next/navigation";

/** Rebuilt sections render full-bleed and manage their own padding; the rest keep the old container. */
export default function PageFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullBleed =
    pathname === "/" ||
    pathname === "/projects" ||
    pathname.startsWith("/projects/") ||
    pathname === "/tools" ||
    pathname.startsWith("/tools/") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/");
  return (
    <main id="main" className={fullBleed ? "flex-1" : "flex-1 container mx-auto px-4 pt-32 pb-16"}>
      {children}
    </main>
  );
}
