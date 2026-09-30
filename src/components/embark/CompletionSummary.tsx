import { LeftBorderCard } from "@/components/embark/LeftBorderCard";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function CompletionSummary({
  label = "You've already completed this — you're reviewing it now.",
  completedDate,
  score,
  achievement,
}: {
  label?: string;
  completedDate?: string;
  score?: number;
  achievement?: string;
}) {
  return (
    <LeftBorderCard borderVariant="success" padding="sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center rounded-full bg-success-dark/15 text-success-dark px-2 py-0.5 text-[10px] font-semibold flex-shrink-0">
            ✓ Complete
          </span>
          <span className="text-sm text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {completedDate && <span>Completed {formatDate(completedDate)}</span>}
          {score !== undefined && (
            <span className="font-semibold text-success-dark">Score: {score}%</span>
          )}
          {achievement && <span>{achievement}</span>}
        </div>
      </div>
    </LeftBorderCard>
  );
}
