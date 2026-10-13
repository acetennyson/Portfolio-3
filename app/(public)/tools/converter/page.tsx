import type { Metadata } from "next";
import ConverterClient from "./ConverterClient";

export const metadata: Metadata = {
  title: "Universal Unit Converter",
  description: "Free online unit converter for currency, length, weight, temperature, time and more — fast, accurate conversions in one tool.",
  alternates: { canonical: "/tools/converter" },
  openGraph: { type: "website", url: "/tools/converter", title: "Universal Unit Converter — Ado Daniel Nji", description: "Free online unit converter for currency, length, weight, temperature, time and more." },
};

export default function ConverterPage() {
  return <ConverterClient />;
}
