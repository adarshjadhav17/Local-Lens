import type { AreaSnapshot } from "@/types/local-area";
import type { TrafficSnapshot } from "@/types/traffic";
import type { WeatherSummary } from "@/types/weather";

export type LocalSnapshot = {
  area: AreaSnapshot;
  weather: WeatherSummary;
  traffic: TrafficSnapshot;
  isMockFallback: boolean;
};

export type LocalSnapshotApiResponse =
  | {
      snapshot: LocalSnapshot;
    }
  | {
      error: string;
    };
