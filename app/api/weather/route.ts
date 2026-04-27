import { NextResponse } from "next/server";
import { getCurrentWeather } from "@/lib/weather";
import { getZipLocation } from "@/lib/zip-location";
import { incorrectZipMessage, normalizeZip } from "@/lib/local-area";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = normalizeZip(searchParams.get("zip") ?? "");

  if (zip.length !== 5) {
    return NextResponse.json({ error: incorrectZipMessage }, { status: 400 });
  }

  try {
    const location = await getZipLocation(zip);
    const weather = await getCurrentWeather(location);

    return NextResponse.json({ weather });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Weather is unavailable.";
    const isZipLookupError = message.toLowerCase().includes("zip");

    return NextResponse.json(
      { error: isZipLookupError ? incorrectZipMessage : message },
      { status: isZipLookupError ? 400 : 502 }
    );
  }
}
