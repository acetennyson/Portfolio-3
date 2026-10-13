import type { Metadata } from "next";
import DiceClient from "./DiceClient";

export const metadata: Metadata = {
  title: "3D Dice Roller",
  description: "Roll realistic 3D physics-based dice online — a free dice roller with true gravity and randomness, no sign-up required.",
  alternates: { canonical: "/tools/dice" },
  openGraph: { type: "website", url: "/tools/dice", title: "3D Dice Roller — Ado Daniel Nji", description: "Roll realistic 3D physics-based dice online, free, with true gravity and randomness." },
};

export default function DicePage() {
  return <DiceClient />;
}
