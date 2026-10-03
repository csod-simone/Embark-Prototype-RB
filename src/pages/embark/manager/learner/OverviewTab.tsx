import { useState } from "react";
import type { LearnerRecord } from "@/data/learnerDirectory";
import { Badge } from "@/components/ui/badge";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { profileSignalsFor } from "@/data/managerSageSignals";
import { JourneyTrack } from "./JourneyTrack";
import { PacingChart } from "./PacingChart";
import { ActiveFlagsCard } from "./ActiveFlagsCard";
import { AiDecisionsCard } from "./AiDecisionsCard";

type Attempt = {
  id: string;
  scenario: string;
  mode: "practice" | "assessment";
  attemptLabel?: string;
  date: string;
  score: number;
  passed?: boolean;
  escalated?: boolean;
};

const ROLE_PLAY_ATTEMPTS: Attempt[] = [
  {
    id: "a1",
    scenario: "Practice — Discovery with James Whitfield",
    mode: "practice",
    date: "12 Jan 2025, 2:15 PM",
    score: 64,
  },
  {
    id: "a2",
    scenario: "Practice — Suitability under pressure",
    mode: "practice",
    date: "13 Jan 2025, 9:40 AM",
    score: 78,
  },
  {
    id: "a3",
    scenario: "Formative — Suitability with Marcus Ellison",
    mode: "assessment",
    attemptLabel: "Attempt 1 of 1",
    date: "14 Jan 2025, 10:22 AM",
    score: 78,
    passed: true,
  },
];

function RolePlayHistorySection({ learner }: { learner: LearnerRecord }) {
  // Attempt scores track the learner's own readiness so no two profiles match.
  const attempts = ROLE_PLAY_ATTEMPTS.map((a, i) => ({
    ...a,
    score: Math.max(35, Math.min(100, learner.readinessScore - 10 + i * 7)),
    passed: a.mode === "assessment" ? learner.readinessScore >= 60 : a.passed,
  }));
  const anyEscalation = attempts.some((a) => a.escalated);
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Role-Play History</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          A record of this learner's role-play attempts and outcomes for this journey.
        </p>
      </div>

      {anyEscalation && (
        <LeftBorderCard borderVariant="warning">
          <p className="text-sm text-foreground">
            One or more role-play interactions for this learner included a serious escalation event. Review the flagged attempt(s) below.
          </p>
        </LeftBorderCard>
      )}

      <div className="space-y-3">
        {attempts.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{a.scenario}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Completed {a.date}
                  {a.attemptLabel ? ` · ${a.attemptLabel}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.mode === "assessment" ? "warning" : "secondary"}>
                  {a.mode === "assessment" ? "Assessment" : "Practice"}
                </Badge>
                {a.mode === "assessment" && (
                  <Badge variant={a.passed ? "success" : "destructive"}>
                    {a.passed ? "Advanced" : "Not advanced"}
                  </Badge>
                )}
                {a.escalated && <Badge variant="warning">Escalation Flagged</Badge>}
              </div>
            </div>
            <div className="text-sm font-medium text-foreground">
              {a.score} <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OverviewTab({
  learner,
  forceAiRationale,
  readOnly = false,
  promptCheckIn = false,
}: {
  learner: LearnerRecord;
  forceAiRationale: boolean;
  readOnly?: boolean;
  /** When time on a module looks unusual, ask the manager to check in. */
  promptCheckIn?: boolean;
}) {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const signals = promptCheckIn
    ? profileSignalsFor(learner.id).filter((signal) => !dismissed[signal.id])
    : [];

  return (
    <div className="flex flex-col gap-4">
      {signals.map((signal) => (
        <div key={signal.id} id={signal.id} className="scroll-mt-4 rounded-md">
          <LeftBorderCard borderVariant={signal.tone}>
            <p className="text-sm text-foreground">{signal.detail}</p>
            <button
              type="button"
              onClick={() => setDismissed((prev) => ({ ...prev, [signal.id]: true }))}
              className="mt-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </LeftBorderCard>
        </div>
      ))}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <JourneyTrack learner={learner} promptCheckIn={promptCheckIn} />
        <div className="flex min-w-0 flex-col gap-4">
          <ActiveFlagsCard learner={learner} />
          <AiDecisionsCard
            forceOpen={forceAiRationale}
            learnerName={learner.name}
            readOnly={readOnly}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <PacingChart learner={learner} />
        <RolePlayHistorySection learner={learner} />
      </div>
    </div>
  );
}
