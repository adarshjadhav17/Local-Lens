import { NextResponse } from "next/server";
import { incorrectZipMessage, normalizeZip } from "@/lib/local-area";
import { getZipFromCoordinates } from "@/lib/reverse-geocode";

function parseCoordinate(value: string | null) {
  if (!value) {
    return null;
  }

  const coordinate = Number(value);

  return Number.isFinite(coordinate) ? coordinate : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = parseCoordinate(searchParams.get("lat"));
  const longitude = parseCoordinate(searchParams.get("lon"));

  if (latitude === null || longitude === null) {
    return NextResponse.json({ error: "Location coordinates are required." }, { status: 400 });
  }

  const zip = normalizeZip(await getZipFromCoordinates(latitude, longitude));

  if (zip.length !== 5) {
    return NextResponse.json({ error: incorrectZipMessage }, { status: 404 });
  }

  return NextResponse.json({ zip });
}
