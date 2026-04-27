import { LocalSnapshotHero } from "@/components/LocalSnapshotHero";
import { TrafficCard } from "@/components/TrafficCard";
import { WeatherCard } from "@/components/WeatherCard";
import type { AreaSnapshot } from "@/types/local-area";
import type { TrafficSnapshot } from "@/types/traffic";
import type { WeatherSummary } from "@/types/weather";

export function SnapshotOverview({
  area,
  isMockFallback,
  liveWeather,
  trafficSnapshot,
  isWeatherLoading,
  snapshotError
}: {
  area: AreaSnapshot;
  isMockFallback: boolean;
  liveWeather: WeatherSummary | null;
  trafficSnapshot: TrafficSnapshot | null;
  isWeatherLoading: boolean;
  snapshotError: string | null;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <LocalSnapshotHero area={area} isMockFallback={isMockFallback} />

      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <WeatherCard
          fallbackWeather={area.weather}
          liveWeather={liveWeather}
          isLoading={isWeatherLoading}
          error={snapshotError}
        />
        <TrafficCard fallbackTraffic={area.traffic} trafficSnapshot={trafficSnapshot} />
      </div>
    </section>
  );
}
