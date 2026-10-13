import type { Metadata } from "next";
import CompassClient from "./CompassClient";

export const metadata: Metadata = {
  title: "Online Compass",
  description: "A free online compass powered by your device's orientation sensors — find true north instantly from your phone or tablet browser.",
  alternates: { canonical: "/tools/compass" },
  openGraph: { type: "website", url: "/tools/compass", title: "Online Compass — Ado Daniel Nji", description: "A free online compass powered by your device's orientation sensors." },
};

export default function CompassPage() {
  return <CompassClient />;
}
