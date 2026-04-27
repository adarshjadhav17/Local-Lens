export type WeatherSummary = {
  temp: string;
  condition: string;
  detail: string;
  location: string;
};

export type WeatherApiResponse =
  | {
      weather: WeatherSummary;
    }
  | {
      error: string;
    };
