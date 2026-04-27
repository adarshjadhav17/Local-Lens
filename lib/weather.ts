import { getWeatherCondition } from "@/lib/weather-codes";
import type { WeatherSummary } from "@/types/weather";
import type { ZipLocation } from "@/types/zip-location";

type OpenMeteoCurrent = {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
};

type OpenMeteoResponse = {
  current: OpenMeteoCurrent;
};

export async function getCurrentWeather(location: ZipLocation): Promise<WeatherSummary> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto"
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    next: { revalidate: 10 * 60 }
  });

  if (!response.ok) {
    throw new Error("Weather lookup failed.");
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const current = data.current;

  return {
    temp: `${Math.round(current.temperature_2m)}°F`,
    condition: getWeatherCondition(current.weather_code),
    detail: `Feels like ${Math.round(current.apparent_temperature)}°F with wind near ${Math.round(
      current.wind_speed_10m
    )} mph.`,
    location: `${location.city}, ${location.state}`
  };
}
