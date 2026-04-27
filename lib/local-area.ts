import { fallbackArea, mockAreas } from "@/data/mock-areas";

export const incorrectZipMessage = "Incorrect ZIP code.";

export function normalizeZip(value: string) {
  return value.replace(/\D/g, "").slice(0, 5);
}

export function getAreaSnapshot(zip: string) {
  return mockAreas[zip] ?? { ...fallbackArea, zip };
}

export function hasMockArea(zip: string) {
  return zip in mockAreas;
}
