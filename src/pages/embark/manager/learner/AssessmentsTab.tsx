import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import type { LearnerAssessmentRow } from "@/data/learnerDirectory";
import { useAssessmentAttempts } from "@/hooks/use-assessment-attempts";

export function AssessmentsTab({
  learnerId,
  history = [],
  readOnly = false,
}: {
  learnerId: string;
  learnerName?: string;
  history?: LearnerAssessmentRow[];
  readOnly?: boolean;
}) {
  const { paused, checkIns, reopen, acknowledgeCheckIn } = useAssessmentAttempts();
  const showLive = learnerId === "l1";
  const priorResults = [...history].sort(
    (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0),
  );

  return (
    <div className="flex flex-col gap-6">
      {showLive && !readOnly &&
        checkIns.map((item) => (
          <LeftBorderCard key={item.id} borderVariant="warning">
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">
                Check-in — {item.name ?? "Assessment"}
              </div>
              <p className="text-sm text-foreground">
                This learner did not advance
                {item.score != null && item.total
                  ? ` and scored ${Math.round((item.score / item.total) * 100)}%.`
                  : "."}{" "}
                Retakes are still available, and gap micro-learning stays on their journey. Check in with them about this result.
              </p>
              <Button type="button" variant="secondary" onClick={() => acknowledgeCheckIn(item.id)}>
                Record check-in
              </Button>
            </div>
          </LeftBorderCard>
        ))}
      {showLive && !readOnly &&
        paused.map((item) => (
          <LeftBorderCard key={item.id} borderVariant="danger">
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">
                At-risk check-in — {item.name ?? "Assessment"}
              </div>
              <p className="text-sm text-foreground">
                This learner used every retake
                {item.score != null && item.total
                  ? ` and last scored ${Math.round((item.score / item.total) * 100)}%.`
                  : "."}{" "}
                The journey stays paused until you check in and reopen the module.
              </p>
              <Button type="button" onClick={() => reopen(item.id)}>
                Check in and reopen
              </Button>
            </div>
          </LeftBorderCard>
        ))}

      <div className="rounded-md border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-left text-xs tracking-wide text-muted-foreground">
              <th className="px-4 py-2 font-medium">Assessment</th>
              <th className="px-4 py-2 font-medium">Type</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Attempt</th>
              <th className="px-4 py-2 font-medium">Score</th>
              <th className="px-4 py-2 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {priorResults.length === 0 && (
              <tr className="border-t border-border">
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  No assessment attempts recorded yet.
                </td>
              </tr>
            )}
            {priorResults.map((h) => (
              <tr key={h.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{h.title}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{h.type}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{h.date}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {h.attemptNumber} of {h.attempts}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">{h.score}%</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {h.passed ? "Passed" : "Not passed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-md border border-border bg-background p-4">
        <div className="text-xs tracking-wide font-medium text-muted-foreground mb-3">
          Comprehension check summary
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <p className="text-sm text-foreground">Embedded activities completed: 14 of 20</p>
          <p className="text-xs text-muted-foreground">Completion-only · no pass mark</p>
        </div>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-success-dark">
          <Check className="h-3.5 w-3.5" />
          No discrepancy between comprehension checks and formal assessments
        </p>
      </section>
    </div>
  );
}
