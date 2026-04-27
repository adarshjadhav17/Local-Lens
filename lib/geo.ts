const earthRadiusMiles = 3958.8;

export function getDistanceMiles(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
) {
  const originLat = toRadians(origin.latitude);
  const destinationLat = toRadians(destination.latitude);
  const latDelta = toRadians(destination.latitude - origin.latitude);
  const lonDelta = toRadians(destination.longitude - origin.longitude);

  const angle =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(originLat) *
      Math.cos(destinationLat) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
