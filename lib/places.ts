import type { LocalItem } from "@/types/local-area";
import type { ZipLocation } from "@/types/zip-location";

type GooglePlace = {
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  primaryTypeDisplayName?: {
    text?: string;
  };
  rating?: number;
  businessStatus?: string;
};

type GooglePlacesResponse = {
  places?: GooglePlace[];
};

const TEN_MILES_IN_METERS = 16093.44;
const MAX_NEARBY_RESULTS = 20;

export async function getNearbyRestaurants(location: ZipLocation): Promise<LocalItem[] | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.displayName,places.formattedAddress,places.primaryTypeDisplayName,places.rating,places.businessStatus"
    },
    body: JSON.stringify({
      includedPrimaryTypes: ["restaurant", "fast_food_restaurant"],
      maxResultCount: MAX_NEARBY_RESULTS,
      rankPreference: "POPULARITY",
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude
          },
          radius: TEN_MILES_IN_METERS
        }
      }
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as GooglePlacesResponse;
  const places = data.places ?? [];

  if (places.length === 0) {
    return null;
  }

  return places.map(toLocalItem);
}

function toLocalItem(place: GooglePlace): LocalItem {
  const title = place.displayName?.text ?? "Nearby place";
  const category = place.primaryTypeDisplayName?.text ?? "Restaurant or fast food";
  const rating = typeof place.rating === "number" ? `${place.rating.toFixed(1)} stars` : "Rating unavailable";
  const status = place.businessStatus === "OPERATIONAL" ? "Open business" : "Status unavailable";

  return {
    title,
    meta: `${category} · ${rating}`,
    description: `${place.formattedAddress ?? "Address unavailable"} · ${status}`,
    tag: "Live"
  };
}
