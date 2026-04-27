import { LocalSnapshotHero } from "@/components/LocalSnapshotHero";
import { TrafficCard } from "@/components/TrafficCard";
import { WeatherCard } from "@/components/WeatherCard";
import type { AreaSnapshot } from "@/types/local-area";

export function SnapshotOverview({
  area,
  isMockFallback
}: {
  area: AreaSnapshot;
  isMockFallback: boolean;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <LocalSnapshotHero area={area} isMockFallback={isMockFallback} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <WeatherCard weather={area.weather} />
        <TrafficCard traffic={area.traffic} />
      </div>
    </section>
  );
}
