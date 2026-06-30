"use client";

import {
  CloudSun,
  Droplets,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Sunrise,
  ThermometerSun,
  Trash2,
  Wind,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  describeWeather,
  fetchWeather,
  GeoResult,
  searchLocations,
  WeatherData,
} from "@/lib/weather";

const starterCities = ["Buenos Aires", "London", "Tokyo"];

export function WeatherDashboard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [selectedWeather, setSelectedWeather] = useState<WeatherData | null>(
    null,
  );
  const [saved, setSaved] = useState<WeatherData[]>([]);
  const [status, setStatus] = useState<"idle" | "searching" | "loading">(
    "idle",
  );
  const [error, setError] = useState("");

  const featuredCities = useMemo(
    () => starterCities.filter((city) => city.toLowerCase() !== query.trim()),
    [query],
  );

  async function handleSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const term = query.trim();
    if (!term) return;

    setStatus("searching");
    setError("");
    setResults([]);

    try {
      const locations = await searchLocations(term);
      if (locations.length === 0) {
        setError("No matching cities found. Try a nearby larger city.");
        return;
      }

      setResults(locations);
      await loadWeather(locations[0], false);
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Something went wrong while searching.",
      );
    } finally {
      setStatus("idle");
    }
  }

  async function loadWeather(location: GeoResult, shouldSave = true) {
    setStatus("loading");
    setError("");

    try {
      const weather = await fetchWeather(location);
      setSelectedWeather(weather);

      if (shouldSave) {
        setSaved((current) => [
          weather,
          ...current.filter((item) => item.location.id !== weather.location.id),
        ]);
      }
    } catch (weatherError) {
      setError(
        weatherError instanceof Error
          ? weatherError.message
          : "Could not load that forecast.",
      );
    } finally {
      setStatus("idle");
    }
  }

  async function quickSearch(city: string) {
    setQuery(city);
    setStatus("searching");
    setError("");

    try {
      const [location] = await searchLocations(city);
      if (location) {
        setResults([location]);
        await loadWeather(location);
      }
    } catch {
      setError("Could not load that city right now.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <main className="weather-shell">
      <section className="hero-panel" aria-labelledby="weather-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            Frontend-only forecast
          </div>
          <h1 id="weather-title">Weather App</h1>
          <p>
            Search any city and compare current conditions, wind, humidity, and
            a five-day outlook without accounts, keys, or a database.
          </p>
        </div>

        <form className="search-panel" onSubmit={handleSearch}>
          <label htmlFor="city-search">City</label>
          <div className="search-row">
            <Search aria-hidden="true" size={20} />
            <input
              id="city-search"
              type="search"
              placeholder="Search Buenos Aires, Madrid, Seoul..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            <button type="submit" disabled={status !== "idle" || !query.trim()}>
              {status === "searching" ? (
                <Loader2 className="spin" size={18} aria-hidden="true" />
              ) : (
                <Search size={18} aria-hidden="true" />
              )}
              Search
            </button>
          </div>

          <div className="quick-picks" aria-label="Quick city picks">
            {featuredCities.map((city) => (
              <button key={city} type="button" onClick={() => quickSearch(city)}>
                {city}
              </button>
            ))}
          </div>
        </form>
      </section>

      {error ? <p className="notice error">{error}</p> : null}

      {results.length > 1 ? (
        <section className="result-strip" aria-label="City matches">
          {results.map((result) => (
            <button
              className="result-pill"
              key={result.id}
              type="button"
              onClick={() => loadWeather(result)}
            >
              <MapPin size={15} aria-hidden="true" />
              <span>{result.name}</span>
              <small>
                {[result.admin1, result.country].filter(Boolean).join(", ")}
              </small>
            </button>
          ))}
        </section>
      ) : null}

      <section className="dashboard-grid">
        {selectedWeather ? (
          <WeatherFocus weather={selectedWeather} />
        ) : (
          <EmptyState status={status} />
        )}

        <aside className="saved-panel" aria-labelledby="saved-title">
          <div className="panel-heading">
            <h2 id="saved-title">Saved Cities</h2>
            {saved.length ? (
              <button
                type="button"
                className="icon-button"
                onClick={() => setSaved([])}
                aria-label="Clear saved cities"
                title="Clear saved cities"
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {saved.length ? (
            <div className="saved-list">
              {saved.map((item) => (
                <button
                  key={item.location.id}
                  type="button"
                  className="saved-city"
                  onClick={() => setSelectedWeather(item)}
                >
                  <span>
                    <strong>{item.location.name}</strong>
                    <small>{item.location.country}</small>
                  </span>
                  <b>{item.current.temperature}°</b>
                </button>
              ))}
            </div>
          ) : (
            <p className="muted">
              Select a city result to keep it here for quick comparison.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}

function WeatherFocus({ weather }: { weather: WeatherData }) {
  const condition = describeWeather(weather.current.weatherCode);
  const observedAt = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(weather.current.time));

  return (
    <article className="focus-card">
      <div className="focus-top">
        <div>
          <p className="location-line">
            <MapPin size={17} aria-hidden="true" />
            {[weather.location.admin1, weather.location.country]
              .filter(Boolean)
              .join(", ")}
          </p>
          <h2>{weather.location.name}</h2>
          <p>{condition}</p>
        </div>
        <WeatherGlyph code={weather.current.weatherCode} isDay={weather.current.isDay} />
      </div>

      <div className="temperature-band">
        <strong>{weather.current.temperature}°</strong>
        <span>Feels like {weather.current.apparentTemperature}°</span>
      </div>

      <div className="metric-grid">
        <Metric
          icon={<Droplets size={19} aria-hidden="true" />}
          label="Humidity"
          value={`${weather.current.humidity}%`}
        />
        <Metric
          icon={<Wind size={19} aria-hidden="true" />}
          label="Wind"
          value={`${weather.current.windSpeed} km/h`}
        />
        <Metric
          icon={<CloudSun size={19} aria-hidden="true" />}
          label="Clouds"
          value={`${weather.current.cloudCover}%`}
        />
        <Metric
          icon={<Sunrise size={19} aria-hidden="true" />}
          label="Observed"
          value={observedAt}
        />
      </div>

      <div className="forecast">
        {weather.daily.map((day) => (
          <div className="forecast-day" key={day.date}>
            <span>
              {new Intl.DateTimeFormat("en", { weekday: "short" }).format(
                new Date(`${day.date}T12:00:00`),
              )}
            </span>
            <WeatherGlyph code={day.weatherCode} isDay />
            <strong>
              {day.max}° / {day.min}°
            </strong>
            <small>{day.precipitationProbability}% rain</small>
          </div>
        ))}
      </div>
    </article>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function WeatherGlyph({ code, isDay }: { code: number; isDay: boolean }) {
  const isWet = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
  const isCloudy = [2, 3, 45, 48].includes(code);
  const className = isWet ? "rainy" : isCloudy ? "cloudy" : isDay ? "sunny" : "night";

  return (
    <div className={`weather-glyph ${className}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function EmptyState({ status }: { status: "idle" | "searching" | "loading" }) {
  return (
    <article className="focus-card empty-state">
      {status === "idle" ? (
        <>
          <ThermometerSun size={42} aria-hidden="true" />
          <h2>Start with a city</h2>
          <p>Your weather snapshot will appear here with a five-day forecast.</p>
        </>
      ) : (
        <>
          <Loader2 className="spin" size={42} aria-hidden="true" />
          <h2>Checking the sky</h2>
          <p>Fetching live conditions from the weather service.</p>
        </>
      )}
    </article>
  );
}
