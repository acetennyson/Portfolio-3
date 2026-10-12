"use client";
import { usePathname } from "next/navigation";

/** Home is full-bleed; every not-yet-rebuilt page keeps its old container. */
export default function PageFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <main id="main" className={isHome ? "flex-1" : "flex-1 container mx-auto px-4 pt-32 pb-16"}>
      {children}
    </main>
  );
}
