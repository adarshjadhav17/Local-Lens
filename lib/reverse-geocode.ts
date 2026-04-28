type TomTomReverseGeocodeResponse = {
  addresses?: Array<{
    address?: {
      postalCode?: string;
      countryCode?: string;
    };
  }>;
};

export async function getZipFromCoordinates(latitude: number, longitude: number) {
  const apiKey = process.env.TOMTOM_API_KEY;

  if (!apiKey) {
    return "";
  }

  const params = new URLSearchParams({
    key: apiKey,
    radius: "10000"
  });
  const response = await fetch(
    `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?${params}`,
    {
      next: { revalidate: 60 * 60 * 24 }
    }
  );

  if (!response.ok) {
    return "";
  }

  const data = (await response.json()) as TomTomReverseGeocodeResponse;
  const address = data.addresses?.find((candidate) => candidate.address?.countryCode === "US")
    ?.address;

  return address?.postalCode ?? "";
}
