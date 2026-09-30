import type { BandLabel } from "@/data/mockData";
import { cn } from "@/lib/utils";

function bandForScore(score: number): BandLabel {
  if (score < 50) return "At Risk";
  if (score < 70) return "Needs Attention";
  if (score < 85) return "On Track";
  if (score < 100) return "Ready";
  return "Fast Tracker";
}

function colorForScore(score: number): string {
  if (score < 50) return "hsl(var(--status-critical-fg))";
  if (score < 70) return "hsl(var(--status-warning-fg))";
  if (score < 85) return "hsl(var(--status-success-fg))";
  if (score < 100) return "hsl(var(--secondary-foreground))";
  return "hsl(var(--accent))";
}

const sizeMap = {
  sm: { d: 40, s: 4, f: "text-xs" },
  md: { d: 72, s: 6, f: "text-base" },
  lg: { d: 128, s: 10, f: "text-2xl" },
};

export function ReadinessRing({
  score,
  size,
  showLabel = false,
}: {
  score: number;
  size: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const { d, s, f } = sizeMap[size];
  const r = (d - s) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const dash = (pct / 100) * c;
  const color = colorForScore(score);
  const band = bandForScore(score);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: d, height: d }}>
        <svg width={d} height={d} className="-rotate-90">
          <circle
            cx={d / 2}
            cy={d / 2}
            r={r}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={s}
          />
          <circle
            cx={d / 2}
            cy={d / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={s}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
          />
        </svg>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-semibold text-foreground",
            f,
          )}
        >
          {Math.round(score)}
        </span>
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">{band}</span>
      )}
    </div>
  );
}