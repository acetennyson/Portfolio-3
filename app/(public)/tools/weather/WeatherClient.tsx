"use client";
import { useState } from "react";
import {
  Search, MapPin, Wind, Droplets, Eye, Navigation,
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudDrizzle, CloudSnow, CloudFog, CloudLightning,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ToolShell from "../../../../components/shell/ToolShell";
import { getTool } from "../../../../lib/tools";

type WeatherData = {
  location: string;
  lat: number;
  lon: number;
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    visibility: number;
    weatherCode: number;
    isDay: boolean;
  };
  daily: {
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
    precipitation: number;
  }[];
};

// WMO weather codes → label + icon
function describeWeather(code: number, isDay = true): { label: string; Icon: LucideIcon } {
  if (code === 0) return { label: "Clear sky", Icon: isDay ? Sun : Moon };
  if (code <= 2) return { label: "Partly cloudy", Icon: isDay ? CloudSun : CloudMoon };
  if (code === 3) return { label: "Overcast", Icon: Cloud };
  if (code <= 49) return { label: "Foggy", Icon: CloudFog };
  if (code <= 59) return { label: "Drizzle", Icon: CloudDrizzle };
  if (code <= 69) return { label: "Rain", Icon: CloudRain };
  if (code <= 79) return { label: "Snow", Icon: CloudSnow };
  if (code <= 84) return { label: "Rain showers", Icon: CloudRain };
  return { label: "Thunderstorm", Icon: CloudLightning };
}

function formatDay(dateStr: string, i: number) {
  if (i === 0) return "Today";
  if (i === 1) return "Tomorrow";
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

async function resolveCoords(input: string): Promise<{ lat: number; lon: number; name: string }> {
  const trimmed = input.trim();

  // Coordinates: "51.5, -0.12" or "51.5 -0.12"
  const coordMatch = trimmed.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);
  if (coordMatch) {
    return { lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[2]), name: `${coordMatch[1]}, ${coordMatch[2]}` };
  }

  // IP address
  const ipMatch = trimmed.match(/^\d{1,3}(\.\d{1,3}){3}$/);
  if (ipMatch) {
    const res = await fetch(`https://ip-api.com/json/${trimmed}?fields=lat,lon,city,country`);
    const data = await res.json();
    if (data.lat) return { lat: data.lat, lon: data.lon, name: `${data.city}, ${data.country}` };
    throw new Error("Could not resolve IP location");
  }

  // City name or ZIP — Open-Meteo geocoding
  const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`);
  const geoData = await geo.json();
  if (!geoData.results?.length) throw new Error(`Location "${trimmed}" not found`);
  const r = geoData.results[0];
  return { lat: r.latitude, lon: r.longitude, name: `${r.name}${r.country ? ", " + r.country : ""}` };
}

async function fetchWeather(lat: number, lon: number, name: string): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
    + `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day,visibility`
    + `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum`
    + `&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  const d = await res.json();
  return {
    location: name, lat, lon,
    current: {
      temp: Math.round(d.current.temperature_2m),
      feelsLike: Math.round(d.current.apparent_temperature),
      humidity: d.current.relative_humidity_2m,
      windSpeed: Math.round(d.current.wind_speed_10m),
      visibility: Math.round((d.current.visibility ?? 10000) / 1000),
      weatherCode: d.current.weather_code,
      isDay: d.current.is_day === 1,
    },
    daily: d.daily.time.map((date: string, i: number) => ({
      date,
      maxTemp: Math.round(d.daily.temperature_2m_max[i]),
      minTemp: Math.round(d.daily.temperature_2m_min[i]),
      weatherCode: d.daily.weather_code[i],
      precipitation: d.daily.precipitation_sum[i],
    })),
  };
}

const QUICK = ["London", "Lagos", "New York", "Tokyo", "Sydney"];

function WeatherForecast() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(q?: string) {
    const input = q ?? query;
    if (!input.trim()) return;
    setLoading(true); setError(""); setWeather(null);
    try {
      const { lat, lon, name } = await resolveCoords(input);
      const data = await fetchWeather(lat, lon, name);
      setWeather(data);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function useMyLocation() {
    if (!navigator.geolocation) { setError("This browser can’t share your location."); return; }
    setLoading(true); setError(""); setWeather(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          // reverse geocode with open-meteo doesn't exist, use nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
          const d = await res.json();
          const name = d.address?.city || d.address?.town || d.address?.village || `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;
          const data = await fetchWeather(coords.latitude, coords.longitude, `${name}, ${d.address?.country ?? ""}`);
          setWeather(data);
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
      },
      () => { setError("Location access was denied. Search for a city instead."); setLoading(false); }
    );
  }

  const cur = weather?.current;
  const wx = cur ? describeWeather(cur.weatherCode, cur.isDay) : null;
  const NowIcon = wx?.Icon;

  return (
    <div className="wx">
      <div className="wx-search">
        <label>
          <Search size={16} aria-hidden />
          <input
            className="wb-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="City, ZIP, IP or 51.5,-0.1"
            aria-label="Search for a place"
            enterKeyHint="search"
          />
        </label>
        <button className="wb-btn" onClick={() => search()} disabled={loading}>Search</button>
        <button className="wb-icon-btn" onClick={useMyLocation} title="Use my location" aria-label="Use my location">
          <Navigation size={17} />
        </button>
      </div>

      {error && <p role="alert" style={{ margin: 0, fontSize: ".88rem", color: "#f87171" }}>{error}</p>}

      {loading && (
        <div className="wb-state" role="status" aria-live="polite">
          <div className="wb-spinner" />
          <p>Fetching the forecast…</p>
        </div>
      )}

      {!loading && !weather && !error && (
        <div className="wb-state">
          <CloudSun size={36} strokeWidth={1.3} aria-hidden />
          <h2>Where to?</h2>
          <p>Search a place above, or start with one of these.</p>
          <div className="wx-chips">
            {QUICK.map((c) => (
              <button key={c} className="wx-chip" onClick={() => { setQuery(c); search(c); }}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {weather && !loading && cur && wx && NowIcon && (
        <div className="wx-grid">
          <div className="wb-panel wx-now">
            <div className="wx-loc"><MapPin size={14} aria-hidden /> <span>{weather.location}</span></div>
            <div className="wx-temp">
              <strong>{cur.temp}°</strong>
              <NowIcon strokeWidth={1.1} aria-hidden />
            </div>
            <div>
              <div className="wx-cond">{wx.label}</div>
              <div className="label" style={{ marginTop: ".35rem" }}>Feels like {cur.feelsLike}°C</div>
            </div>
            <div className="wx-stats">
              <div><small><Droplets size={12} aria-hidden /> Humidity</small><b>{cur.humidity}%</b></div>
              <div><small><Wind size={12} aria-hidden /> Wind</small><b>{cur.windSpeed} km/h</b></div>
              <div><small><Eye size={12} aria-hidden /> Visibility</small><b>{cur.visibility} km</b></div>
            </div>
          </div>

          <div className="wb-panel wx-days" aria-label="7-day forecast">
            {weather.daily.map((day, i) => {
              const { Icon } = describeWeather(day.weatherCode);
              return (
                <div key={day.date} className="wx-day">
                  <Icon size={20} strokeWidth={1.5} aria-hidden />
                  <span style={{ fontWeight: 600 }}>{formatDay(day.date, i)}</span>
                  <em>{day.precipitation > 0 ? `${day.precipitation} mm` : ""}</em>
                  <span style={{ color: "var(--fg-muted)", textAlign: "right" }}>{day.minTemp}°</span>
                  <b style={{ textAlign: "right" }}>{day.maxTemp}°</b>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WeatherClient() {
  return (
    <ToolShell tool={getTool("weather")!} layout="bare">
      <WeatherForecast />
    </ToolShell>
  );
}
