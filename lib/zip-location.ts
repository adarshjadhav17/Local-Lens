import type { ZipLocation } from "@/types/zip-location";

type ZippopotamusPlace = {
  "place name": string;
  longitude: string;
  state: string;
  "state abbreviation": string;
  latitude: string;
};

type ZippopotamusResponse = {
  "post code": string;
  places: ZippopotamusPlace[];
};

type OpenMeteoGeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  admin1?: string;
  postcodes?: string[];
};

type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[];
};

async function getZippopotamusLocation(zip: string): Promise<ZipLocation | null> {
  const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
    next: { revalidate: 60 * 60 * 24 }
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("ZIP lookup failed.");
  }

  const data = (await response.json()) as ZippopotamusResponse;
  const place = data.places[0];

  if (!place) {
    return null;
  }

  return {
    zip: data["post code"],
    city: place["place name"],
    state: place["state abbreviation"],
    latitude: Number(place.latitude),
    longitude: Number(place.longitude)
  };
}

async function getOpenMeteoLocation(zip: string): Promise<ZipLocation | null> {
  const params = new URLSearchParams({
    name: zip,
    count: "10",
    language: "en",
    format: "json",
    countryCode: "US"
  });

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
    next: { revalidate: 60 * 60 * 24 }
  });

  if (!response.ok) {
    throw new Error("ZIP lookup failed.");
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;
  const result = data.results?.find(
    (candidate) => candidate.country_code === "US" && candidate.postcodes?.includes(zip)
  );

  if (!result) {
    return null;
  }

  return {
    zip,
    city: result.name,
    state: result.admin1 ?? "",
    latitude: result.latitude,
    longitude: result.longitude
  };
}

export async function getZipLocation(zip: string): Promise<ZipLocation> {
  const zippopotamusLocation = await getZippopotamusLocation(zip);

  if (zippopotamusLocation) {
    return zippopotamusLocation;
  }

  const openMeteoLocation = await getOpenMeteoLocation(zip);

  if (openMeteoLocation) {
    return openMeteoLocation;
  }

  throw new Error("ZIP code was not found.");
}
