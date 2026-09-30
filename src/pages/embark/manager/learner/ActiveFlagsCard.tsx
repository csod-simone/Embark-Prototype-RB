import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { atRiskFlags } from "@/data/mockData";
import type { LearnerRecord } from "@/data/learnerDirectory";
import { useAssessmentAttempts } from "@/hooks/use-assessment-attempts";

export function ActiveFlagsCard({ learner }: { learner: LearnerRecord }) {
  const flag = atRiskFlags.find((f) => f.learnerId === learner.id);
  const { paused } = useAssessmentAttempts();
  const liveFlags = learner.recordsId === "l1" ? paused : [];
  const isAtRisk =
    learner.band === "At Risk" || learner.status === "At risk" || !!flag || liveFlags.length > 0;

  return (
    <LeftBorderCard borderVariant={isAtRisk ? "danger" : "success"}>
      <div className="text-xs tracking-wide font-medium text-muted-foreground mb-2">
        Active flags
      </div>
      {!isAtRisk && (
        <p className="text-sm text-muted-foreground">
          No active at-risk flags. Monitor pacing and hand raised resolution.
        </p>
      )}
      {isAtRisk && (
        <ul className="flex flex-col gap-1.5">
          {liveFlags.map((item) => (
            <li key={item.id} className="text-sm">
              <span className="text-foreground font-medium">
                Retakes used on {item.name ?? "assessment"}
              </span>
              <span className="text-xs text-muted-foreground ml-2">journey paused</span>
            </li>
          ))}
          {(flag?.conditions ?? [
            { label: `Last active ${learner.lastActive}`, threshold: "threshold: 3 days" },
            { label: `Readiness at ${learner.readinessScore}`, threshold: "threshold: 50" },
          ]).map((c, i) => (
            <li key={i} className="text-sm">
              <span className="text-foreground font-medium">{c.label}</span>
              <span className="text-xs text-muted-foreground ml-2">{c.threshold}</span>
            </li>
          ))}
        </ul>
      )}
    </LeftBorderCard>
  );
}
