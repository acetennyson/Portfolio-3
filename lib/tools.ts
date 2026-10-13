import type { LucideIcon } from "lucide-react";
import { Calculator, Dices, CloudSun, Compass, ArrowLeftRight, Clock, Scale } from "lucide-react";

export type Tool = {
  slug: string;
  name: string;
  desc: string;
  href: string;
  icon: LucideIcon;
};

/** The Lab: small, self-contained tools. Order here is the order they appear on /tools. */
export const tools: Tool[] = [
  {
    slug: "calculator",
    name: "Calculator",
    desc: "A sleek calculator for quick maths, with a bit of flair.",
    href: "/tools/calculator",
    icon: Calculator,
  },
  {
    slug: "dice",
    name: "Dice Roller",
    desc: "3D physics-based dice, dropped and settled with real gravity.",
    href: "/tools/dice",
    icon: Dices,
  },
  {
    slug: "weather",
    name: "Weather Forecast",
    desc: "Search by city, ZIP, IP or coordinates for a 7-day forecast.",
    href: "/tools/weather",
    icon: CloudSun,
  },
  {
    slug: "compass",
    name: "Compass",
    desc: "A real-time compass driven by your device's orientation sensors.",
    href: "/tools/compass",
    icon: Compass,
  },
  {
    slug: "converter",
    name: "Universal Converter",
    desc: "Currency, length, weight, temperature, time & more.",
    href: "/tools/converter",
    icon: ArrowLeftRight,
  },
  {
    slug: "world-clock",
    name: "World Clock",
    desc: "Track timezones across the globe — analog, digital, minimal or neon.",
    href: "/tools/world-clock",
    icon: Clock,
  },
  {
    slug: "bmi",
    name: "BMI Tracker",
    desc: "Calculate BMI with a gauge, healthy range and tips.",
    href: "/tools/bmi",
    icon: Scale,
  },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}
