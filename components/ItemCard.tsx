"use client";

import type { LocalItem } from "@/types/local-area";
import { recordItemInterest } from "@/lib/interests";

export function ItemCard({ item }: { item: LocalItem }) {
  function handleItemClick() {
    recordItemInterest(item);
  }

  return (
    <article className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">{item.title}</h3>
          <p className="mt-1 text-sm font-medium text-moss">{item.meta}</p>
        </div>
        <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-xs font-bold text-sunrise">
          {item.tag}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/70">{item.description}</p>
      {item.url ? (
        <a
          className="mt-3 inline-flex text-sm font-bold text-tide transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-tide focus:ring-offset-2"
          href={item.url}
          onClick={handleItemClick}
          rel="noreferrer"
          target="_blank"
        >
          View details
        </a>
      ) : null}
    </article>
  );
}
