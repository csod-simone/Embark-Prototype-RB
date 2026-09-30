import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhaseProgressStepper({
  phases,
  onPhaseClick,
}: {
  phases: Array<{ label: string; status: "complete" | "active" | "upcoming" }>;
  onPhaseClick?: (index: number) => void;
}) {
  return (
    <div className="flex items-start justify-between w-full">
      {phases.map((p, i) => {
        const clickable = p.status === "complete" && !!onPhaseClick;
        return (
          <div key={i} className="flex-1 flex flex-col items-center min-w-0">
            <div className="flex items-center w-full">
              <div
                className={cn(
                  "flex-1 h-px",
                  i === 0
                    ? "opacity-0"
                    : phases[i - 1].status === "upcoming"
                      ? "bg-border"
                      : "bg-primary",
                )}
              />
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onPhaseClick?.(i)}
                className={cn(
                  "inline-flex items-center justify-center h-8 w-8 rounded-full border-2 flex-shrink-0 transition-colors",
                  p.status === "complete" && "bg-success border-success-dark text-success-foreground",
                  p.status === "active" && "bg-primary border-primary text-primary-foreground",
                  p.status === "upcoming" && "bg-background border-border text-muted-foreground pointer-events-none",
                  clickable && "cursor-pointer hover:opacity-80",
                )}
                aria-label={p.label}
              >
                {p.status === "complete" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-semibold">{i + 1}</span>
                )}
              </button>
              <div
                className={cn(
                  "flex-1 h-px",
                  i === phases.length - 1
                    ? "opacity-0"
                    : p.status === "complete"
                      ? "bg-primary"
                      : "bg-border",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 text-xs text-center px-1 truncate max-w-full",
                p.status === "active" ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}