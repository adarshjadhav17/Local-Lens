import type { Weather } from "@/types/local-area";
import type { WeatherSummary } from "@/types/weather";

export function WeatherCard({
  fallbackWeather,
  liveWeather,
  isLoading,
  error
}: {
  fallbackWeather: Weather;
  liveWeather: WeatherSummary | null;
  isLoading: boolean;
  error: string | null;
}) {
  const weather = liveWeather ?? fallbackWeather;

  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-moss">Weather</p>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-tide">
          {isLoading ? "Loading" : liveWeather ? "Live" : "Mock"}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-4xl font-black text-ink">{weather.temp}</span>
        <span className="font-bold text-tide">{weather.condition}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/70">{weather.detail}</p>
      {liveWeather ? (
        <p className="mt-2 text-xs font-semibold text-ink/50">{liveWeather.location}</p>
      ) : null}
      {error ? <p className="mt-2 text-xs font-semibold text-sunrise">{error}</p> : null}
    </div>
  );
}
