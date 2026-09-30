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
    <div className="bg-background border-b border-border px-6 py-5">
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm mb-3"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-foreground">{learner.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {learner.role} · {learner.lob}
          </p>
          <p className="text-sm text-muted-foreground">
            {learner.cohort} · Enrolled {formatEnrolled(learner.enrolledDate)}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <ReadinessRing size="md" score={learner.readinessScore} showLabel />
          <span className="text-xs text-muted-foreground">Updated 2 hours ago</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        {!readOnly && (
          <button
            type="button"
            onClick={onRespondToHelp}
            className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3.5 py-2 text-sm font-medium hover:bg-primary/90"
          >
            Respond to hand raised
            {helpBadge > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary-foreground/20 text-primary-foreground text-[11px] font-semibold px-1.5">
                {helpBadge}
              </span>
            )}
          </button>
        )}
        {onAssignLearning && (
          <button
            type="button"
            onClick={onAssignLearning}
            className="inline-flex items-center rounded-md border border-border bg-background px-3.5 py-2 text-sm text-foreground hover:bg-muted"
          >
            Assign Additional Learning
          </button>
        )}
        <button
          type="button"
          onClick={onViewAiRationale}
          className="inline-flex items-center rounded-md border border-border bg-background px-3.5 py-2 text-sm text-foreground hover:bg-muted"
        >
          View AI rationale
        </button>
      </div>
    </div>
  );
}
/** "2026-08-31" → "Aug 31, 2026"; already-formatted values pass through. */
function formatEnrolled(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
