"use client";
import { useState } from "react";
import { Search, MapPin, Wind, Droplets, Eye, Thermometer, Navigation } from "lucide-react";

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

// WMO weather codes → label + emoji
function describeWeather(code: number, isDay = true): { label: string; emoji: string } {
  if (code === 0) return { label: "Clear Sky", emoji: isDay ? "☀️" : "🌙" };
  if (code <= 2) return { label: "Partly Cloudy", emoji: "⛅" };
  if (code === 3) return { label: "Overcast", emoji: "☁️" };
  if (code <= 49) return { label: "Foggy", emoji: "🌫️" };
  if (code <= 59) return { label: "Drizzle", emoji: "🌦️" };
  if (code <= 69) return { label: "Rain", emoji: "🌧️" };
  if (code <= 79) return { label: "Snow", emoji: "❄️" };
  if (code <= 84) return { label: "Rain Showers", emoji: "🌧️" };
  if (code <= 94) return { label: "Thunderstorm", emoji: "⛈️" };
  return { label: "Thunderstorm", emoji: "⛈️" };
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

export default function WeatherForecast() {
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
      () => { setError("Location access denied"); setLoading(false); }
    );
  }

  const cur = weather?.current;
  const wx = cur ? describeWeather(cur.weatherCode, cur.isDay) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>Tool</p>
        <h1 className="text-4xl font-black tracking-tight grad-text">Weather Forecast</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>Search by city, ZIP code, IP address, or coordinates</p>
      </div>

      {/* search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-muted)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="London · 10001 · 8.8.8.8 · 51.5,-0.1"
            className="w-full rounded-2xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg)" }}
          />
        </div>
        <button onClick={() => search()}
          className="btn-grad rounded-2xl px-5 py-3 text-sm font-bold transition-opacity hover:opacity-90">
          Search
        </button>
        <button onClick={useMyLocation} title="Use my location"
          className="rounded-2xl px-4 py-3 transition-all hover:border-violet-500"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
          <Navigation size={16} />
        </button>
      </div>

      {/* error */}
      {error && <p className="text-sm text-center text-red-400">{error}</p>}

      {/* loading */}
      {loading && (
        <div className="card p-10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* weather */}
      {weather && !loading && (
        <div className="space-y-4">
          {/* current */}
          <div className="card p-6 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-15 grad-bg" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={13} style={{ color: "var(--fg-muted)" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--fg-muted)" }}>{weather.location}</span>
                </div>
                <div className="text-8xl font-black grad-text leading-none">{cur!.temp}°</div>
                <div className="text-lg font-semibold mt-1" style={{ color: "var(--fg)" }}>{wx!.label}</div>
                <div className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>Feels like {cur!.feelsLike}°C</div>
              </div>
              <div className="text-7xl">{wx!.emoji}</div>
            </div>

            {/* stats row */}
            <div className="grid grid-cols-4 gap-3 mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
              {[
                { icon: <Droplets size={14} />, label: "Humidity", val: `${cur!.humidity}%` },
                { icon: <Wind size={14} />, label: "Wind", val: `${cur!.windSpeed} km/h` },
                { icon: <Eye size={14} />, label: "Visibility", val: `${cur!.visibility} km` },
                { icon: <Thermometer size={14} />, label: "Feels Like", val: `${cur!.feelsLike}°` },
              ].map(({ icon, label, val }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-1" style={{ color: "var(--accent)" }}>{icon}</div>
                  <div className="text-xs" style={{ color: "var(--fg-muted)" }}>{label}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: "var(--fg)" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-day forecast */}
          <div className="card p-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-4 px-2" style={{ color: "var(--fg-muted)" }}>7-Day Forecast</p>
            <div className="space-y-1">
              {weather.daily.map((day, i) => {
                const { emoji } = describeWeather(day.weatherCode);
                return (
                  <div key={day.date} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--bg-card-hover)]">
                    <span className="text-xl w-8">{emoji}</span>
                    <span className="text-sm font-semibold flex-1" style={{ color: "var(--fg)" }}>{formatDay(day.date, i)}</span>
                    {day.precipitation > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
                        💧 {day.precipitation}mm
                      </span>
                    )}
                    <span className="text-sm font-bold w-8 text-right" style={{ color: "var(--fg)" }}>{day.maxTemp}°</span>
                    <span className="text-sm w-8 text-right" style={{ color: "var(--fg-muted)" }}>{day.minTemp}°</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
