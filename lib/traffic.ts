import { getDistanceMiles } from "@/lib/geo";
import type { TrafficLevel, TrafficSnapshot } from "@/types/traffic";
import type { ZipLocation } from "@/types/zip-location";

type MetroArea = {
  name: string;
  downtown: {
    name: string;
    latitude: number;
    longitude: number;
  };
  airport: {
    name: string;
    latitude: number;
    longitude: number;
  };
  highways: string[];
};

type TomTomFlowResponse = {
  flowSegmentData?: {
    currentSpeed?: number;
    freeFlowSpeed?: number;
    currentTravelTime?: number;
    freeFlowTravelTime?: number;
    roadClosure?: boolean;
  };
};

const metroAreas: MetroArea[] = [
  {
    name: "Chicago",
    downtown: { name: "Downtown Chicago", latitude: 41.8781, longitude: -87.6298 },
    airport: { name: "O'Hare International Airport", latitude: 41.9742, longitude: -87.9073 },
    highways: ["I-90/I-94", "I-290", "Lake Shore Drive"]
  },
  {
    name: "New York",
    downtown: { name: "Midtown Manhattan", latitude: 40.7549, longitude: -73.984 },
    airport: { name: "LaGuardia Airport", latitude: 40.7769, longitude: -73.874 },
    highways: ["FDR Drive", "West Side Highway", "I-495"]
  },
  {
    name: "Austin",
    downtown: { name: "Downtown Austin", latitude: 30.2672, longitude: -97.7431 },
    airport: { name: "Austin-Bergstrom Airport", latitude: 30.1975, longitude: -97.6664 },
    highways: ["I-35", "MoPac", "US-183"]
  },
  {
    name: "Phoenix",
    downtown: { name: "Downtown Phoenix", latitude: 33.4484, longitude: -112.074 },
    airport: { name: "Phoenix Sky Harbor", latitude: 33.4342, longitude: -112.0116 },
    highways: ["Loop 202", "US-60", "I-10"]
  },
  {
    name: "San Francisco",
    downtown: { name: "Downtown San Francisco", latitude: 37.7749, longitude: -122.4194 },
    airport: { name: "San Francisco International Airport", latitude: 37.6213, longitude: -122.379 },
    highways: ["US-101", "I-80", "I-280"]
  },
  {
    name: "Los Angeles",
    downtown: { name: "Downtown Los Angeles", latitude: 34.0522, longitude: -118.2437 },
    airport: { name: "Los Angeles International Airport", latitude: 33.9416, longitude: -118.4085 },
    highways: ["I-10", "US-101", "I-405"]
  },
  {
    name: "San Diego",
    downtown: { name: "Downtown San Diego", latitude: 32.7157, longitude: -117.1611 },
    airport: { name: "San Diego International Airport", latitude: 32.7338, longitude: -117.1933 },
    highways: ["I-5", "I-8", "I-15"]
  },
  {
    name: "San Jose",
    downtown: { name: "Downtown San Jose", latitude: 37.3382, longitude: -121.8863 },
    airport: { name: "San Jose Mineta International Airport", latitude: 37.3639, longitude: -121.9289 },
    highways: ["US-101", "I-280", "SR-87"]
  },
  {
    name: "Seattle",
    downtown: { name: "Downtown Seattle", latitude: 47.6062, longitude: -122.3321 },
    airport: { name: "Seattle-Tacoma International Airport", latitude: 47.4502, longitude: -122.3088 },
    highways: ["I-5", "I-90", "SR-99"]
  },
  {
    name: "Portland",
    downtown: { name: "Downtown Portland", latitude: 45.5152, longitude: -122.6784 },
    airport: { name: "Portland International Airport", latitude: 45.5898, longitude: -122.5951 },
    highways: ["I-5", "I-84", "US-26"]
  },
  {
    name: "Las Vegas",
    downtown: { name: "Downtown Las Vegas", latitude: 36.1699, longitude: -115.1398 },
    airport: { name: "Harry Reid International Airport", latitude: 36.084, longitude: -115.1537 },
    highways: ["I-15", "US-95", "I-215"]
  },
  {
    name: "Denver",
    downtown: { name: "Downtown Denver", latitude: 39.7392, longitude: -104.9903 },
    airport: { name: "Denver International Airport", latitude: 39.8561, longitude: -104.6737 },
    highways: ["I-25", "I-70", "US-36"]
  },
  {
    name: "Dallas",
    downtown: { name: "Downtown Dallas", latitude: 32.7767, longitude: -96.797 },
    airport: { name: "Dallas Fort Worth International Airport", latitude: 32.8998, longitude: -97.0403 },
    highways: ["I-35E", "I-30", "US-75"]
  },
  {
    name: "Houston",
    downtown: { name: "Downtown Houston", latitude: 29.7604, longitude: -95.3698 },
    airport: { name: "George Bush Intercontinental Airport", latitude: 29.9902, longitude: -95.3368 },
    highways: ["I-10", "I-45", "US-59"]
  },
  {
    name: "Atlanta",
    downtown: { name: "Downtown Atlanta", latitude: 33.749, longitude: -84.388 },
    airport: { name: "Hartsfield-Jackson Atlanta International Airport", latitude: 33.6407, longitude: -84.4277 },
    highways: ["I-75/I-85", "I-20", "I-285"]
  },
  {
    name: "Miami",
    downtown: { name: "Downtown Miami", latitude: 25.7617, longitude: -80.1918 },
    airport: { name: "Miami International Airport", latitude: 25.7959, longitude: -80.287 },
    highways: ["I-95", "SR-836", "Florida Turnpike"]
  },
  {
    name: "Boston",
    downtown: { name: "Downtown Boston", latitude: 42.3601, longitude: -71.0589 },
    airport: { name: "Boston Logan International Airport", latitude: 42.3656, longitude: -71.0096 },
    highways: ["I-90", "I-93", "US-1"]
  },
  {
    name: "Washington, DC",
    downtown: { name: "Downtown Washington, DC", latitude: 38.9072, longitude: -77.0369 },
    airport: { name: "Reagan National Airport", latitude: 38.8512, longitude: -77.0402 },
    highways: ["I-395", "I-66", "I-495"]
  },
  {
    name: "Philadelphia",
    downtown: { name: "Center City Philadelphia", latitude: 39.9526, longitude: -75.1652 },
    airport: { name: "Philadelphia International Airport", latitude: 39.8744, longitude: -75.2424 },
    highways: ["I-76", "I-95", "I-676"]
  },
  {
    name: "Minneapolis",
    downtown: { name: "Downtown Minneapolis", latitude: 44.9778, longitude: -93.265 },
    airport: { name: "Minneapolis-Saint Paul International Airport", latitude: 44.8848, longitude: -93.2223 },
    highways: ["I-35W", "I-94", "MN-62"]
  },
  {
    name: "Detroit",
    downtown: { name: "Downtown Detroit", latitude: 42.3314, longitude: -83.0458 },
    airport: { name: "Detroit Metro Airport", latitude: 42.2162, longitude: -83.3554 },
    highways: ["I-75", "I-94", "M-10"]
  },
  {
    name: "Charlotte",
    downtown: { name: "Uptown Charlotte", latitude: 35.2271, longitude: -80.8431 },
    airport: { name: "Charlotte Douglas International Airport", latitude: 35.214, longitude: -80.9431 },
    highways: ["I-77", "I-85", "I-485"]
  },
  {
    name: "San Antonio",
    downtown: { name: "Downtown San Antonio", latitude: 29.4241, longitude: -98.4936 },
    airport: { name: "San Antonio International Airport", latitude: 29.5337, longitude: -98.4698 },
    highways: ["I-10", "I-35", "Loop 410"]
  },
  {
    name: "Orlando",
    downtown: { name: "Downtown Orlando", latitude: 28.5383, longitude: -81.3792 },
    airport: { name: "Orlando International Airport", latitude: 28.4312, longitude: -81.3081 },
    highways: ["I-4", "SR-408", "Florida Turnpike"]
  },
  {
    name: "Tampa",
    downtown: { name: "Downtown Tampa", latitude: 27.9506, longitude: -82.4572 },
    airport: { name: "Tampa International Airport", latitude: 27.9755, longitude: -82.5332 },
    highways: ["I-275", "I-4", "Selmon Expressway"]
  },
  {
    name: "Nashville",
    downtown: { name: "Downtown Nashville", latitude: 36.1627, longitude: -86.7816 },
    airport: { name: "Nashville International Airport", latitude: 36.1263, longitude: -86.6774 },
    highways: ["I-40", "I-65", "I-24"]
  },
  {
    name: "Raleigh",
    downtown: { name: "Downtown Raleigh", latitude: 35.7796, longitude: -78.6382 },
    airport: { name: "Raleigh-Durham International Airport", latitude: 35.8801, longitude: -78.788 },
    highways: ["I-40", "I-440", "US-1"]
  },
  {
    name: "St. Louis",
    downtown: { name: "Downtown St. Louis", latitude: 38.627, longitude: -90.1994 },
    airport: { name: "St. Louis Lambert International Airport", latitude: 38.7487, longitude: -90.37 },
    highways: ["I-64", "I-70", "I-44"]
  },
  {
    name: "Kansas City",
    downtown: { name: "Downtown Kansas City", latitude: 39.0997, longitude: -94.5786 },
    airport: { name: "Kansas City International Airport", latitude: 39.2976, longitude: -94.7139 },
    highways: ["I-35", "I-70", "I-29"]
  },
  {
    name: "Columbus",
    downtown: { name: "Downtown Columbus", latitude: 39.9612, longitude: -82.9988 },
    airport: { name: "John Glenn Columbus International Airport", latitude: 39.998, longitude: -82.8919 },
    highways: ["I-70", "I-71", "I-270"]
  },
  {
    name: "Cleveland",
    downtown: { name: "Downtown Cleveland", latitude: 41.4993, longitude: -81.6944 },
    airport: { name: "Cleveland Hopkins International Airport", latitude: 41.4117, longitude: -81.8498 },
    highways: ["I-90", "I-71", "I-77"]
  },
  {
    name: "Indianapolis",
    downtown: { name: "Downtown Indianapolis", latitude: 39.7684, longitude: -86.1581 },
    airport: { name: "Indianapolis International Airport", latitude: 39.7169, longitude: -86.2956 },
    highways: ["I-65", "I-70", "I-465"]
  },
  {
    name: "Milwaukee",
    downtown: { name: "Downtown Milwaukee", latitude: 43.0389, longitude: -87.9065 },
    airport: { name: "Milwaukee Mitchell International Airport", latitude: 42.9476, longitude: -87.8966 },
    highways: ["I-94", "I-43", "I-794"]
  },
  {
    name: "Sacramento",
    downtown: { name: "Downtown Sacramento", latitude: 38.5816, longitude: -121.4944 },
    airport: { name: "Sacramento International Airport", latitude: 38.6954, longitude: -121.5908 },
    highways: ["I-5", "US-50", "CA-99"]
  },
  {
    name: "Salt Lake City",
    downtown: { name: "Downtown Salt Lake City", latitude: 40.7608, longitude: -111.891 },
    airport: { name: "Salt Lake City International Airport", latitude: 40.7899, longitude: -111.9791 },
    highways: ["I-15", "I-80", "I-215"]
  },
  {
    name: "New Orleans",
    downtown: { name: "Downtown New Orleans", latitude: 29.9511, longitude: -90.0715 },
    airport: { name: "Louis Armstrong New Orleans International Airport", latitude: 29.9934, longitude: -90.258 },
    highways: ["I-10", "US-90", "I-610"]
  },
  {
    name: "Memphis",
    downtown: { name: "Downtown Memphis", latitude: 35.1495, longitude: -90.049 },
    airport: { name: "Memphis International Airport", latitude: 35.0424, longitude: -89.9767 },
    highways: ["I-40", "I-55", "I-240"]
  },
  {
    name: "Oklahoma City",
    downtown: { name: "Downtown Oklahoma City", latitude: 35.4676, longitude: -97.5164 },
    airport: { name: "Will Rogers World Airport", latitude: 35.3931, longitude: -97.6007 },
    highways: ["I-35", "I-40", "I-44"]
  }
];

export async function getTrafficSnapshot(location: ZipLocation, now = new Date()): Promise<TrafficSnapshot> {
  const metro = getNearestMetro(location);
  const liveTraffic = await getLiveTrafficSnapshot(location, metro);

  if (liveTraffic) {
    return liveTraffic;
  }

  const level = getTrafficLevel(now);
  const highwayDelays = getHighwayDelays(metro?.highways ?? ["Primary roads"], level);
  const routeEstimates = metro ? getRouteEstimates(location, metro, level) : [];

  return {
    level,
    summary: getTrafficSummary(level, metro?.name),
    highwayDelays,
    routeEstimates,
    source: "Estimated"
  };
}

async function getLiveTrafficSnapshot(
  location: ZipLocation,
  metro: MetroArea | undefined
): Promise<TrafficSnapshot | null> {
  const apiKey = process.env.TOMTOM_API_KEY;

  if (!apiKey) {
    return null;
  }

  const params = new URLSearchParams({
    key: apiKey,
    point: `${location.latitude},${location.longitude}`,
    unit: "mph"
  });

  const response = await fetch(
    `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative/10/json?${params}`,
    { next: { revalidate: 2 * 60 } }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as TomTomFlowResponse;
  const flow = data.flowSegmentData;

  if (
    !flow ||
    typeof flow.currentTravelTime !== "number" ||
    typeof flow.freeFlowTravelTime !== "number" ||
    typeof flow.currentSpeed !== "number" ||
    typeof flow.freeFlowSpeed !== "number"
  ) {
    return null;
  }

  const delayMinutes = Math.max(
    0,
    Math.round((flow.currentTravelTime - flow.freeFlowTravelTime) / 60)
  );
  const level = flow.roadClosure
    ? "Severe"
    : getLevelFromSpeedRatio(flow.currentSpeed / Math.max(flow.freeFlowSpeed, 1), delayMinutes);

  return {
    level,
    summary: flow.roadClosure
      ? "A nearby road segment is reported closed."
      : `Nearby traffic is moving at ${Math.round(flow.currentSpeed)} mph versus ${Math.round(
          flow.freeFlowSpeed
        )} mph in free-flow conditions.`,
    highwayDelays: [
      {
        name: metro?.highways[0] ?? "Nearby major road",
        delayMinutes,
        level
      }
    ],
    routeEstimates: metro ? getRouteEstimates(location, metro, level) : [],
    source: "Live"
  };
}

function getNearestMetro(location: ZipLocation) {
  return metroAreas
    .map((metro) => ({
      metro,
      distance: getDistanceMiles(location, metro.downtown)
    }))
    .filter(({ distance }) => distance <= 50)
    .sort((left, right) => left.distance - right.distance)[0]?.metro;
}

function getTrafficLevel(now: Date): TrafficLevel {
  const hour = now.getHours();
  const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;

  if (!isWeekday) {
    return hour >= 11 && hour <= 18 ? "Medium" : "Low";
  }

  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
    return "High";
  }

  if ((hour >= 6 && hour < 7) || (hour > 9 && hour <= 10) || (hour >= 15 && hour < 16)) {
    return "Medium";
  }

  return "Low";
}

function getHighwayDelays(highways: string[], level: TrafficLevel) {
  return highways.map((name, index) => {
    const delayMinutes = getBaseDelay(level) + index * 2;

    return {
      name,
      delayMinutes,
      level: getLevelFromDelay(delayMinutes)
    };
  });
}

function getRouteEstimates(location: ZipLocation, metro: MetroArea, level: TrafficLevel) {
  const downtownDistance = getDistanceMiles(location, metro.downtown);
  const airportDistance = getDistanceMiles(location, metro.airport);

  return [
    {
      label: "To downtown",
      destination: metro.downtown.name,
      distanceMiles: Math.round(downtownDistance),
      delayMinutes: getRouteDelay(downtownDistance, level),
      level
    },
    {
      label: "To airport",
      destination: metro.airport.name,
      distanceMiles: Math.round(airportDistance),
      delayMinutes: getRouteDelay(airportDistance, level),
      level
    }
  ];
}

function getBaseDelay(level: TrafficLevel) {
  const delays: Record<TrafficLevel, number> = {
    Low: 2,
    Medium: 7,
    High: 14,
    Severe: 24
  };

  return delays[level];
}

function getRouteDelay(distanceMiles: number, level: TrafficLevel) {
  return Math.round(getBaseDelay(level) + distanceMiles * getDelayMultiplier(level));
}

function getDelayMultiplier(level: TrafficLevel) {
  const multipliers: Record<TrafficLevel, number> = {
    Low: 0.08,
    Medium: 0.18,
    High: 0.35,
    Severe: 0.55
  };

  return multipliers[level];
}

function getLevelFromDelay(delayMinutes: number): TrafficLevel {
  if (delayMinutes >= 25) {
    return "Severe";
  }

  if (delayMinutes >= 12) {
    return "High";
  }

  if (delayMinutes >= 5) {
    return "Medium";
  }

  return "Low";
}

function getLevelFromSpeedRatio(speedRatio: number, delayMinutes: number): TrafficLevel {
  if (delayMinutes >= 25 || speedRatio < 0.35) {
    return "Severe";
  }

  if (delayMinutes >= 12 || speedRatio < 0.55) {
    return "High";
  }

  if (delayMinutes >= 5 || speedRatio < 0.8) {
    return "Medium";
  }

  return "Low";
}

function getTrafficSummary(level: TrafficLevel, metroName?: string) {
  const area = metroName ? `around ${metroName}` : "near this ZIP code";
  const descriptions: Record<TrafficLevel, string> = {
    Low: `Roads look light ${area}.`,
    Medium: `Expect some slowdowns ${area}.`,
    High: `Plan for heavier delays ${area}.`,
    Severe: `Major delays are likely ${area}.`
  };

  return descriptions[level];
}
