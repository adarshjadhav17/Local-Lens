import type { AreaSnapshot } from "@/types/local-area";
import type { WeatherSummary } from "@/types/weather";

export type LocalSnapshot = {
  area: AreaSnapshot;
  weather: WeatherSummary;
  isMockFallback: boolean;
};

export type LocalSnapshotApiResponse =
  | {
      snapshot: LocalSnapshot;
    }
  | {
      error: string;
    };
