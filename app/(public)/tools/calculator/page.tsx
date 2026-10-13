import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Online Calculator",
  description: "A free, fast online calculator for everyday maths — addition, subtraction, multiplication, division and more, right in your browser.",
  alternates: { canonical: "/tools/calculator" },
  openGraph: { type: "website", url: "/tools/calculator", title: "Online Calculator — Ado Daniel Nji", description: "A free, fast online calculator for everyday maths, right in your browser." },
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
