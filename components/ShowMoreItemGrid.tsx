"use client";

import { useState } from "react";
import { ItemGrid } from "@/components/ItemGrid";
import type { LocalItem } from "@/types/local-area";

const INITIAL_VISIBLE_ITEMS = 4;
const VISIBLE_ITEMS_INCREMENT = 4;

export function ShowMoreItemGrid({ items }: { items: LocalItem[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ITEMS);
  const visibleItems = items.slice(0, visibleCount);
  const hiddenCount = Math.max(items.length - visibleCount, 0);

  return (
    <div className="space-y-4">
      <ItemGrid items={visibleItems} />

      {hiddenCount > 0 ? (
        <button
          type="button"
          className="w-full rounded-lg border border-tide/30 bg-white px-4 py-3 text-sm font-bold text-tide shadow-sm transition hover:border-tide hover:bg-tide/5 focus:outline-none focus:ring-2 focus:ring-tide focus:ring-offset-2"
          onClick={() => setVisibleCount((current) => current + VISIBLE_ITEMS_INCREMENT)}
        >
          Show more restaurants ({hiddenCount} more)
        </button>
      ) : null}
    </div>
  );
}
