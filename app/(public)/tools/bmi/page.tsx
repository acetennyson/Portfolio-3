import type { Metadata } from "next";
import BmiClient from "./BmiClient";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description: "Free BMI calculator with a visual gauge, healthy weight range and personalized health tips — works in metric or imperial units.",
  alternates: { canonical: "/tools/bmi" },
  openGraph: { type: "website", url: "/tools/bmi", title: "BMI Calculator — Ado Daniel Nji", description: "Free BMI calculator with a visual gauge, healthy weight range and personalized health tips." },
};

export default function BmiPage() {
  return <BmiClient />;
}
