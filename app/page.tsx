"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { DiscoverySection } from "@/components/DiscoverySection";
import { ItemGrid } from "@/components/ItemGrid";
import { PageHeader } from "@/components/PageHeader";
import { ShowMoreItemGrid } from "@/components/ShowMoreItemGrid";
import { SnapshotOverview } from "@/components/SnapshotOverview";
import { useInterestProfile } from "@/hooks/useInterestProfile";
import { useLocalSnapshot } from "@/hooks/useLocalSnapshot";
import { rankItemsByInterests } from "@/lib/interests";
import { getAreaSnapshot, incorrectZipMessage, normalizeZip } from "@/lib/local-area";

const defaultZip = "60614";
const storedZipKey = "nearcast:lastZip";
const storedZipChangeEvent = "nearcast:lastZipChange";

function getStoredZipSnapshot() {
  const storedZip = normalizeZip(window.localStorage.getItem(storedZipKey) ?? "");

  return storedZip.length === 5 ? storedZip : defaultZip;
}

function getServerZipSnapshot() {
  return defaultZip;
}

function subscribeToStoredZip(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(storedZipChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(storedZipChangeEvent, onStoreChange);
  };
}

export default function Home() {
  const storedZip = useSyncExternalStore(
    subscribeToStoredZip,
    getStoredZipSnapshot,
    getServerZipSnapshot
  );
  const [zipDraft, setZipDraft] = useState<string | null>(null);
  const [submittedZip, setSubmittedZip] = useState<string | null>(null);
  const [zipValidationError, setZipValidationError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const interestProfile = useInterestProfile();
  const activeZip = submittedZip ?? storedZip;
  const zipInput = zipDraft ?? submittedZip ?? storedZip;

  const fallbackArea = useMemo(() => getAreaSnapshot(activeZip), [activeZip]);
  const { snapshot, isLoading, error: snapshotError } = useLocalSnapshot(activeZip);
  const area = snapshot?.area ?? fallbackArea;
  const isMockFallback = snapshot?.isMockFallback ?? true;
  const zipLookupError = snapshotError === incorrectZipMessage ? snapshotError : null;
  const validationError = zipValidationError ?? locationError ?? zipLookupError;
  const rankedEvents = useMemo(
    () => rankItemsByInterests(area.events, interestProfile),
    [area.events, interestProfile]
  );
  const rankedRestaurants = useMemo(
    () => rankItemsByInterests(area.restaurants, interestProfile),
    [area.restaurants, interestProfile]
  );

  function handleZipInputChange(value: string) {
    setZipDraft(normalizeZip(value));
    setZipValidationError(null);
    setLocationError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (zipInput.length !== 5) {
      setZipValidationError(incorrectZipMessage);
      return;
    }

    setZipValidationError(null);
    setLocationError(null);
    setZipDraft(null);
    saveZip(zipInput);
  }

  async function handleUseCurrentLocation() {
    setZipValidationError(null);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Location is not available in this browser.");
      return;
    }

    setIsLocating(true);

    try {
      const position = await getCurrentPosition();
      const params = new URLSearchParams({
        lat: String(position.coords.latitude),
        lon: String(position.coords.longitude)
      });
      const response = await fetch(`/api/location-zip?${params}`);
      const data = (await response.json()) as { zip?: string; error?: string };

      if (!response.ok || !data.zip) {
        throw new Error(data.error ?? "Could not find a ZIP code for your current location.");
      }

      setZipDraft(null);
      saveZip(data.zip);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not find a ZIP code for your location.";
      setLocationError(message);
    } finally {
      setIsLocating(false);
    }
  }

  function saveZip(zip: string) {
    setSubmittedZip(zip);
    window.localStorage.setItem(storedZipKey, zip);
    window.dispatchEvent(new Event(storedZipChangeEvent));
  }

  return (
    <main className="min-h-screen px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          zipInput={zipInput}
          validationError={validationError}
          isLocating={isLocating}
          onZipInputChange={handleZipInputChange}
          onUseCurrentLocation={handleUseCurrentLocation}
          onSubmit={handleSubmit}
        />

        <SnapshotOverview
          area={area}
          isMockFallback={isMockFallback}
          liveWeather={snapshot?.weather ?? null}
          trafficSnapshot={snapshot?.traffic ?? null}
          isWeatherLoading={isLoading}
          snapshotError={snapshotError}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <DiscoverySection title="Nearby Events" eyebrow="Today and soon">
            <ShowMoreItemGrid key={`events-${activeZip}`} items={rankedEvents} itemName="events" />
          </DiscoverySection>

          <DiscoverySection title="Restaurants & Fast Food" eyebrow="Within 10 miles">
            <ShowMoreItemGrid
              key={`restaurants-${activeZip}`}
              items={rankedRestaurants}
              itemName="restaurants"
            />
          </DiscoverySection>

          <DiscoverySection title="Local Deals" eyebrow="Nearby offers">
            <ItemGrid items={area.deals} />
          </DiscoverySection>
        </div>
      </div>
    </main>
  );
}

function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 10 * 60 * 1000,
      timeout: 10000
    });
  });
}
