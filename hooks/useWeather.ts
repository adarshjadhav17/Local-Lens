"use client";

import { useEffect, useState } from "react";
import type { WeatherApiResponse, WeatherSummary } from "@/types/weather";

type WeatherState = {
  weather: WeatherSummary | null;
  isLoading: boolean;
  error: string | null;
};

export function useWeather(zip: string): WeatherState {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const response = await fetch(`/api/weather?zip=${zip}`, {
          signal: controller.signal
        });
        const data = (await response.json()) as WeatherApiResponse;

        if (!response.ok || "error" in data) {
          throw new Error("error" in data ? data.error : "Weather is unavailable.");
        }

        setState({ weather: data.weather, isLoading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Weather is unavailable.";
        setState({ weather: null, isLoading: false, error: message });
      }
    }

    loadWeather();

    return () => controller.abort();
  }, [zip]);

  return state;
}
