import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import type { LearnerRecord } from "@/data/learnerDirectory";

export function LearnerHeader({
  learner,
  helpBadge,
  onRespondToHelp,
  onViewAiRationale,
  onAssignLearning,
  readOnly = false,
  backTo,
  backLabel = "Back to my learners",
}: {
  learner: LearnerRecord;
  helpBadge: number;
  onRespondToHelp: () => void;
  onViewAiRationale: () => void;
  /** Facilitator and Admin only — opens the ad-hoc additional learning flow. */
  onAssignLearning?: () => void;
  readOnly?: boolean;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
      {backTo && (
        <Link
          to={backTo}
          className="mb-1 inline-flex items-center gap-1 rounded-sm text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-tight text-foreground">{learner.name}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {learner.role} · {learner.lob} · {learner.cohort} · Enrolled {formatEnrolled(learner.enrolledDate)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!readOnly && (
            <button
              type="button"
              onClick={onRespondToHelp}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Respond to hand raised
              {helpBadge > 0 && (
                <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-[11px] font-semibold text-primary-foreground">
                  {helpBadge}
                </span>
              )}
            </button>
          )}
          {onAssignLearning && (
            <button
              type="button"
              onClick={onAssignLearning}
              className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              Assign Additional Learning
            </button>
          )}
          <button
            type="button"
            onClick={onViewAiRationale}
            className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-muted"
          >
            View AI rationale
          </button>
        </div>
        <div className="flex items-center gap-2">
          <ReadinessRing size="sm" score={learner.readinessScore} showLabel />
          <span className="max-w-[4.5rem] text-[11px] leading-tight text-muted-foreground">Updated 2 hours ago</span>
        </div>
      </div>
    </section>
  );
}
/** "2026-08-31" → "Aug 31, 2026"; already-formatted values pass through. */
function formatEnrolled(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
