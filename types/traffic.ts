export type TrafficLevel = "Low" | "Medium" | "High" | "Severe";

export type HighwayDelay = {
  name: string;
  delayMinutes: number;
  level: TrafficLevel;
};

export type TrafficRouteEstimate = {
  label: string;
  destination: string;
  distanceMiles: number;
  travelMinutes: number;
  delayMinutes: number;
  level: TrafficLevel;
  source: "Estimated" | "Live";
};

export type TrafficSnapshot = {
  level: TrafficLevel;
  summary: string;
  highwayDelays: HighwayDelay[];
  routeEstimates: TrafficRouteEstimate[];
  source: "Estimated" | "Live";
};
