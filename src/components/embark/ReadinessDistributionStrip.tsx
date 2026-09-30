import { useState } from "react";
import type { BandLabel } from "@/data/mockData";
import { cn } from "@/lib/utils";

type Counts = { atRisk: number; needsAttention: number; onTrack: number; ready: number; fastTracker: number };

const segments: { key: keyof Counts; band: BandLabel; color: string }[] = [
  { key: "atRisk", band: "At Risk", color: "bg-destructive" },
  { key: "needsAttention", band: "Needs Attention", color: "bg-warning" },
  { key: "onTrack", band: "On Track", color: "bg-success" },
  { key: "ready", band: "Ready", color: "bg-secondary-foreground" },
  { key: "fastTracker", band: "Fast Tracker", color: "bg-accent" },
];

export function ReadinessDistributionStrip({
  counts,
  total,
  onSegmentClick,
}: {
  counts: Counts;
  total: number;
  onSegmentClick?: (band: BandLabel) => void;
}) {
  const [active, setActive] = useState<BandLabel | null>(null);
  const safeTotal = total > 0 ? total : 1;

  const handleClick = (band: BandLabel) => {
    if (!onSegmentClick) return;
    setActive(band);
    onSegmentClick(band);
  };

  return (
    <div className="w-full">
      <div className="flex w-full h-3 rounded-full overflow-hidden bg-muted" role="img" aria-label="Readiness distribution">
        {segments.map((s) => {
          const w = (counts[s.key] / safeTotal) * 100;
          if (w <= 0) return null;
          const clickable = !!onSegmentClick;
          return (
            <button
              key={s.key}
              type="button"
              disabled={!clickable}
              onClick={() => handleClick(s.band)}
              style={{ width: `${w}%` }}
              className={cn(
                s.color,
                "h-full transition-opacity",
                clickable && "hover:opacity-80 cursor-pointer",
                active && active !== s.band && "opacity-40",
              )}
              aria-label={`${counts[s.key]} ${s.band}`}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {segments.map((s) => (
          <div key={s.key} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", s.color)} />
            <span className="font-semibold text-foreground">{counts[s.key]}</span>
            <span className="text-muted-foreground">{s.band}</span>
          </div>
        ))}
      </div>
      {active && (
        <button
          type="button"
          onClick={() => setActive(null)}
          className="mt-2 text-xs text-secondary-foreground hover:underline"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}