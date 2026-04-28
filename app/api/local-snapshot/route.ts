import { NextResponse } from "next/server";
import { getNearbyEvents } from "@/lib/events";
import { getAreaSnapshot, hasMockArea, incorrectZipMessage, normalizeZip } from "@/lib/local-area";
import { getNearbyRestaurants } from "@/lib/places";
import { getTrafficSnapshot } from "@/lib/traffic";
import { getCurrentWeather } from "@/lib/weather";
import { getZipLocation } from "@/lib/zip-location";
import type { AreaSnapshot } from "@/types/local-area";
import type { ZipLocation } from "@/types/zip-location";

function getResolvedArea(area: AreaSnapshot, location: ZipLocation, isMockFallback: boolean) {
  if (!isMockFallback) {
    return area;
  }

  return {
    ...area,
    name: `${location.city}, ${location.state}`
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = normalizeZip(searchParams.get("zip") ?? "");

  if (zip.length !== 5) {
    return NextResponse.json({ error: incorrectZipMessage }, { status: 400 });
  }

  try {
    const area = getAreaSnapshot(zip);
    const isMockFallback = !hasMockArea(zip);
    const location = await getZipLocation(zip);
    const [weather, traffic, restaurants, events] = await Promise.all([
      getCurrentWeather(location),
      getTrafficSnapshot(location),
      getNearbyRestaurants(location),
      getNearbyEvents(location)
    ]);
    const resolvedArea = getResolvedArea(area, location, isMockFallback);

    return NextResponse.json({
      snapshot: {
        area: {
          ...resolvedArea,
          events: events ?? resolvedArea.events,
          restaurants: restaurants ?? resolvedArea.restaurants
        },
        weather,
        traffic,
        isMockFallback
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Local snapshot is unavailable.";
    const isZipLookupError = message.toLowerCase().includes("zip");

    return NextResponse.json(
      { error: isZipLookupError ? incorrectZipMessage : message },
      { status: isZipLookupError ? 400 : 502 }
    );
  }
}
