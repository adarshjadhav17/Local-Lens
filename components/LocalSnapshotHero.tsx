import type { AreaSnapshot } from "@/types/local-area";

export function LocalSnapshotHero({
  area,
  isMockFallback
}: {
  area: AreaSnapshot;
  isMockFallback: boolean;
}) {
  return (
    <div className="rounded-lg bg-ink p-6 text-white shadow-soft sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/60">
        Local snapshot
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black sm:text-4xl">{area.name}</h2>
          <p className="mt-2 text-white/70">ZIP {area.zip}</p>
        </div>
        {isMockFallback ? (
          <span className="rounded-full bg-white/12 px-4 py-2 text-sm font-bold text-white">
            Sample mock data
          </span>
        ) : null}
      </div>
    </div>
  );
}
