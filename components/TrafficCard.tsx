import type { Traffic } from "@/types/local-area";

export function TrafficCard({ traffic }: { traffic: Traffic }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-moss">Traffic</p>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="text-2xl font-black text-ink">{traffic.status}</span>
        <span className="text-sm font-bold text-sunrise">{traffic.commute}</span>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
        {traffic.alerts.map((alert) => (
          <li key={alert}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}
