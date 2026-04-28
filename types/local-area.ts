export type Weather = {
  temp: string;
  condition: string;
  detail: string;
};

export type Traffic = {
  status: string;
  commute: string;
  alerts: string[];
};

export type LocalItem = {
  title: string;
  meta: string;
  description: string;
  tag: string;
  url?: string;
};

export type AreaSnapshot = {
  zip: string;
  name: string;
  weather: Weather;
  traffic: Traffic;
  events: LocalItem[];
  restaurants: LocalItem[];
  deals: LocalItem[];
};
