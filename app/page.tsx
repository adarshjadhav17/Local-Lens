"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { DiscoverySection } from "@/components/DiscoverySection";
import { ItemGrid } from "@/components/ItemGrid";
import { PageHeader } from "@/components/PageHeader";
import { SnapshotOverview } from "@/components/SnapshotOverview";
import { getAreaSnapshot, hasMockArea, normalizeZip } from "@/lib/local-area";

const defaultZip = "60614";

export default function Home() {
  const [zipInput, setZipInput] = useState(defaultZip);
  const [activeZip, setActiveZip] = useState(defaultZip);

  const area = useMemo(() => getAreaSnapshot(activeZip), [activeZip]);
  const isMockFallback = !hasMockArea(activeZip);

  function handleZipInputChange(value: string) {
    setZipInput(normalizeZip(value));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (zipInput.length === 5) {
      setActiveZip(zipInput);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <PageHeader
          zipInput={zipInput}
          onZipInputChange={handleZipInputChange}
          onSubmit={handleSubmit}
        />

        <SnapshotOverview area={area} isMockFallback={isMockFallback} />

        <div className="grid gap-8 lg:grid-cols-3">
          <DiscoverySection title="Nearby Events" eyebrow="Today and soon">
            <ItemGrid items={area.events} />
          </DiscoverySection>

          <DiscoverySection title="New Restaurants & Cafes" eyebrow="Fresh openings">
            <ItemGrid items={area.restaurants} />
          </DiscoverySection>

          <DiscoverySection title="Local Deals" eyebrow="Nearby offers">
            <ItemGrid items={area.deals} />
          </DiscoverySection>
        </div>
      </div>
    </main>
  );
}
