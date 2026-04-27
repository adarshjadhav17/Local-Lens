import type { Traffic } from "@/types/local-area";
import type { TrafficLevel, TrafficSnapshot } from "@/types/traffic";

const levelClasses: Record<TrafficLevel, string> = {
  Low: "bg-emerald-100 text-emerald-800",
  Medium: "bg-amber-100 text-amber-800",
  High: "bg-orange-100 text-orange-800",
  Severe: "bg-red-100 text-red-800"
};

export function TrafficCard({
  fallbackTraffic,
  trafficSnapshot
}: {
  fallbackTraffic: Traffic;
  trafficSnapshot: TrafficSnapshot | null;
}) {
  if (!trafficSnapshot) {
    return (
      <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-moss">Traffic</p>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <span className="text-2xl font-black text-ink">{fallbackTraffic.status}</span>
          <span className="text-sm font-bold text-sunrise">{fallbackTraffic.commute}</span>
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
          {fallbackTraffic.alerts.map((alert) => (
            <li key={alert}>{alert}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-moss">Traffic</p>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-tide">
          {trafficSnapshot.source}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-2xl font-black text-ink">{trafficSnapshot.level}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${levelClasses[trafficSnapshot.level]}`}>
          Traffic level
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-ink/70">{trafficSnapshot.summary}</p>
      {trafficSnapshot.notice ? (
        <p className="mt-2 rounded-md bg-paper/70 px-3 py-2 text-xs font-semibold leading-5 text-ink/60">
          {trafficSnapshot.notice}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">Highways</p>
          <div className="mt-2 grid gap-2">
            {trafficSnapshot.highwayDelays.map((highway) => (
              <div
                key={highway.name}
                className="flex items-center justify-between gap-3 rounded-md bg-paper/70 px-3 py-2"
              >
                <span className="text-sm font-bold text-ink">{highway.name}</span>
                <span className="text-right text-sm font-bold text-sunrise">
                  +{highway.delayMinutes} min
                  <span className="block text-xs font-semibold text-ink/45">{highway.source}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {trafficSnapshot.routeEstimates.length > 0 ? (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/45">Routes</p>
            <div className="mt-2 grid gap-2">
              {trafficSnapshot.routeEstimates.map((route) => (
                <div key={route.label} className="rounded-md border border-ink/10 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-ink">{route.label}</span>
                    <span className="text-sm font-bold text-sunrise">
                      {route.travelMinutes} min
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold leading-5 text-ink/50">
                    {route.destination} · {route.distanceMiles} mi · +{route.delayMinutes} min ·{" "}
                    {route.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
