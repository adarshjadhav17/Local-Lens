import type { Weather } from "@/types/local-area";
import type { WeatherSummary } from "@/types/weather";

type WeatherTheme = "clear" | "cloudy" | "rain" | "snow" | "storm" | "fog";

function getWeatherTheme(condition: string): WeatherTheme {
  const value = condition.toLowerCase();

  if (value.includes("thunder")) {
    return "storm";
  }

  if (value.includes("rain") || value.includes("drizzle") || value.includes("shower")) {
    return "rain";
  }

  if (value.includes("snow")) {
    return "snow";
  }

  if (value.includes("fog")) {
    return "fog";
  }

  if (value.includes("cloud")) {
    return "cloudy";
  }

  return "clear";
}

function getWeatherCardClass(theme: WeatherTheme) {
  const base = "relative overflow-hidden rounded-lg border p-5 shadow-sm";

  const themes: Record<WeatherTheme, string> = {
    clear: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-100",
    cloudy: "border-slate-200 bg-gradient-to-br from-slate-100 via-white to-sky-100",
    rain: "border-cyan-200 bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100",
    snow: "border-sky-100 bg-gradient-to-br from-white via-sky-50 to-slate-100",
    storm: "border-indigo-200 bg-gradient-to-br from-slate-200 via-slate-100 to-indigo-100",
    fog: "border-stone-200 bg-gradient-to-br from-stone-100 via-white to-slate-100"
  };

  return `${base} ${themes[theme]}`;
}

function WeatherVisual({ theme }: { theme: WeatherTheme }) {
  if (theme === "clear") {
    return (
      <div className="pointer-events-none absolute right-5 top-5 h-16 w-16 rounded-full bg-amber-300/80 shadow-[0_0_42px_rgba(251,191,36,0.55)]" />
    );
  }

  if (theme === "rain" || theme === "storm") {
    return (
      <div className="pointer-events-none absolute inset-y-3 right-4 w-24 opacity-70">
        <div className="absolute right-2 top-2 h-9 w-16 rounded-full bg-slate-400/45" />
        <div className="absolute right-8 top-5 h-7 w-14 rounded-full bg-slate-500/35" />
        <div className="absolute bottom-3 right-4 grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="h-8 w-0.5 rotate-12 rounded-full bg-cyan-500/45"
            />
          ))}
        </div>
      </div>
    );
  }

  if (theme === "snow") {
    return (
      <div className="pointer-events-none absolute inset-y-3 right-4 grid w-24 grid-cols-4 content-center gap-3 opacity-70">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className="h-2 w-2 rounded-full bg-sky-200 shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute right-4 top-6 h-20 w-28 opacity-70">
      <div className="absolute left-0 top-6 h-10 w-20 rounded-full bg-white/80 shadow-sm" />
      <div className="absolute left-8 top-2 h-12 w-16 rounded-full bg-slate-200/80 shadow-sm" />
      <div className="absolute left-12 top-8 h-9 w-16 rounded-full bg-slate-300/60 shadow-sm" />
    </div>
  );
}

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
  const theme = getWeatherTheme(weather.condition);

  return (
    <div className={getWeatherCardClass(theme)}>
      <WeatherVisual theme={theme} />

      <div className="relative flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-moss">Weather</p>
        <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-tide shadow-sm">
          {isLoading ? "Loading" : liveWeather ? "Live" : "Mock"}
        </span>
      </div>
      <div className="relative mt-3 flex max-w-[75%] flex-wrap items-baseline gap-3">
        <span className="text-4xl font-black text-ink">{weather.temp}</span>
        <span className="font-bold text-tide">{weather.condition}</span>
      </div>
      <p className="relative mt-3 max-w-[82%] text-sm leading-6 text-ink/70">{weather.detail}</p>
      {liveWeather ? (
        <p className="relative mt-2 text-xs font-semibold text-ink/50">{liveWeather.location}</p>
      ) : null}
      {error ? <p className="relative mt-2 text-xs font-semibold text-sunrise">{error}</p> : null}
    </div>
  );
}
