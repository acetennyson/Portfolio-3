import type { Metadata } from "next";
import WeatherClient from "./WeatherClient";

export const metadata: Metadata = {
  title: "Weather Forecast",
  description: "Free 7-day weather forecast tool — search by city, ZIP code, IP address or coordinates for accurate, up-to-date weather.",
  alternates: { canonical: "/tools/weather" },
  openGraph: { type: "website", url: "/tools/weather", title: "Weather Forecast — Ado Daniel Nji", description: "Free 7-day weather forecast tool — search by city, ZIP, IP or coordinates." },
};

export default function WeatherPage() {
  return <WeatherClient />;
}
