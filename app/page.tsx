"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { DiscoverySection } from "@/components/DiscoverySection";
import { ItemGrid } from "@/components/ItemGrid";
import { PageHeader } from "@/components/PageHeader";
import { ShowMoreItemGrid } from "@/components/ShowMoreItemGrid";
import { SnapshotOverview } from "@/components/SnapshotOverview";
import { useLocalSnapshot } from "@/hooks/useLocalSnapshot";
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
  const activeZip = submittedZip ?? storedZip;
  const zipInput = zipDraft ?? submittedZip ?? storedZip;

  const fallbackArea = useMemo(() => getAreaSnapshot(activeZip), [activeZip]);
  const { snapshot, isLoading, error: snapshotError } = useLocalSnapshot(activeZip);
  const area = snapshot?.area ?? fallbackArea;
  const isMockFallback = snapshot?.isMockFallback ?? true;
  const zipLookupError = snapshotError === incorrectZipMessage ? snapshotError : null;

  function handleZipInputChange(value: string) {
    setZipDraft(normalizeZip(value));
    setZipValidationError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (zipInput.length !== 5) {
      setZipValidationError(incorrectZipMessage);
      return;
    }

    setZipValidationError(null);
    setZipDraft(null);
    setSubmittedZip(zipInput);
    window.localStorage.setItem(storedZipKey, zipInput);
    window.dispatchEvent(new Event(storedZipChangeEvent));
  }

  return (
    <main className="min-h-screen px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          zipInput={zipInput}
          validationError={zipValidationError ?? zipLookupError}
          onZipInputChange={handleZipInputChange}
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
            <ShowMoreItemGrid key={`events-${activeZip}`} items={area.events} itemName="events" />
          </DiscoverySection>

          <DiscoverySection title="Restaurants & Fast Food" eyebrow="Within 10 miles">
            <ShowMoreItemGrid
              key={`restaurants-${activeZip}`}
              items={area.restaurants}
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
