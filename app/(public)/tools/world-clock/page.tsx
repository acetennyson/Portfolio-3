import type { Metadata } from "next";
import WorldClockClient from "./WorldClockClient";

export const metadata: Metadata = {
  title: "World Clock",
  description: "Free world clock — track time zones across the globe with analog, digital, minimal and neon clock styles.",
  alternates: { canonical: "/tools/world-clock" },
  openGraph: { type: "website", url: "/tools/world-clock", title: "World Clock — Ado Daniel Nji", description: "Free world clock — track time zones across the globe in multiple clock styles." },
};

export default function WorldClockPage() {
  return <WorldClockClient />;
}
