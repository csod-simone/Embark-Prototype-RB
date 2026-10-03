import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { ModuleStatusIcon } from "@/components/embark/ModuleStatusIcon";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { InlineExpandRow } from "@/components/embark/InlineExpandRow";
import { AiSkippedChip } from "@/components/embark/AiSkippedChip";
import { type CsrItem } from "@/data/csrOnboarding";
import { type CsrItemState } from "@/hooks/use-csr-progress";
import type { LearnerRecord } from "@/data/learnerDirectory";
import { formatModuleTime, timeForWeek, unusualTimeInsight, type ModuleTime } from "@/data/moduleTime";
import { useTutorName } from "@/hooks/use-branding";
import { cn } from "@/lib/utils";

/** Read-only view of the activities inside one path week. */
function ActivityRow({ item, state, signalId }: { item: CsrItem; state: CsrItemState; signalId?: string }) {
  const isLocked = state === "locked";
  const isSkipped = state === "skipped";
  const isCompleted = state === "completed";
  const isInProgress = state === "in_progress";
  const isExempt = state === "exempt";
  const isRemediation = state === "remediation";
  const tutorName = useTutorName();

  const statusLabel = isExempt ? "Exempt" : isRemediation ? "Remediation" : isLocked
    ? "Not started · locked"
    : isSkipped
    ? `Skipped by ${tutorName} · not completed`
    : isCompleted
    ? "Completed"
    : isInProgress
    ? "In progress"
    : "Not started";

  return (
    <div id={signalId} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0 scroll-mt-4 rounded-sm">
      {isLocked ? (
        <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" aria-label="Locked" />
      ) : (
        <ModuleStatusIcon
          status={isExempt ? "exempt" : isRemediation ? "remediation" : isSkipped ? "skipped" : isCompleted ? "completed" : "in_progress"}
        />
      )}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm truncate",
            isCompleted && "text-foreground",
            isInProgress && "text-primary font-medium",
            isExempt && "text-success font-medium",
            isRemediation && "text-warning-foreground dark:text-warning font-medium",
            (isLocked || isSkipped) && "text-muted-foreground",
            isSkipped && "line-through",
          )}
        >
          {item.assignedBy ? item.title : `${item.order}. ${item.title}`}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {statusLabel} · {item.duration} min
        </div>
        {item.assignedBy && item.assignedReason && (
          <div className="text-xs text-warning-foreground dark:text-warning truncate">
            Assigned by {item.assignedBy} — {item.assignedReason}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {item.modality}
        </span>
        {isSkipped && (
          <AiSkippedChip className="px-2 py-0.5 text-[10px]" iconSize={10} />
        )}
        {item.assignedBy && (
          <span className="inline-flex items-center rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground dark:text-warning flex-shrink-0">
            Assigned by facilitator
          </span>
        )}
        {isExempt && (
          <span className="inline-flex items-center rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success flex-shrink-0">
            Exempt
          </span>
        )}
        {isRemediation && (
          <span className="inline-flex items-center rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground dark:text-warning flex-shrink-0">
            Remediation
          </span>
        )}
      </div>
    </div>
  );
}

function timeLabel(time: ModuleTime): string {
  if (!time.started) return "Time on module · not started";
  return `Time on module · ${formatModuleTime(time.spentMin)}`;
}

export function JourneyTrack({
  learner,
  promptCheckIn = false,
}: {
  learner: LearnerRecord;
  /** Manager only. Admin can see the time without a check-in prompt. */
  promptCheckIn?: boolean;
}) {
  const { hash } = useLocation();
  const sessionTarget = hash.startsWith("#signal-session-") ? hash.slice("#signal-session-".length) : null;
  const weekForSession = sessionTarget
    ? learner.weeks.find((week) => week.items.some((item) => item.id === sessionTarget))?.id ?? null
    : null;
  const [openWeek, setOpenWeek] = useState<string | null>(weekForSession);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const times = learner.weeks.map((week) => timeForWeek(learner.id, week));
  const unusual = promptCheckIn ? times.filter((time) => time.unusual && !dismissed[time.weekId]) : [];

  useEffect(() => {
    if (weekForSession) setOpenWeek(weekForSession);
  }, [weekForSession]);

  return (
    <section className="flex flex-col gap-3">
      <LeftBorderCard borderVariant="warning" padding="sm">
        <span className="text-xs tracking-wide font-medium text-muted-foreground">
          {learner.journeyName}
        </span>
      </LeftBorderCard>
      {unusual.map((time) => (
        <div key={time.weekId} id={`signal-module-time-${time.weekId}`} className="scroll-mt-4 rounded-md">
          <LeftBorderCard borderVariant="warning">
            <p className="text-sm text-foreground">
              {unusualTimeInsight({ ...time, learnerId: learner.id, learnerName: learner.name })}
            </p>
            <button
              type="button"
              onClick={() => setDismissed((prev) => ({ ...prev, [time.weekId]: true }))}
              className="mt-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </LeftBorderCard>
        </div>
      ))}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {learner.weeks.map((m, weekIndex) => {
          const time = times[weekIndex];
          const ordered = m.items;
          const states = m.states;
          const sessionsTotal = m.itemsTotal || 1;
          const sessionsComplete = m.itemsComplete;

          const trigger = (
            <div className="flex items-center gap-3">
              <ModuleStatusIcon status={m.state} />
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "text-sm truncate",
                    m.state === "in_progress" && "text-primary font-medium",
                    m.state === "exempt" && "text-success font-medium",
                    m.state === "remediation" && "text-warning-foreground dark:text-warning font-medium",
                    m.state === "locked" && "text-muted-foreground",
                    m.state === "completed" && "font-medium text-foreground",
                  )}
                >
                  {m.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">{timeLabel(time)}</div>
              </div>
              {m.state === "completed" && (
                <span className="text-xs text-muted-foreground">
                  {sessionsComplete}/{sessionsTotal} activities complete
                </span>
              )}
              {m.state === "in_progress" && (
                <div className="flex items-center gap-2 min-w-[120px]">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(sessionsComplete / sessionsTotal) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {sessionsComplete}/{sessionsTotal} sessions
                  </span>
                </div>
              )}
              {m.state === "exempt" && (
                <span className="inline-flex items-center rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success flex-shrink-0">
                  Exempt
                </span>
              )}
              {m.state === "remediation" && (
                <span className="inline-flex items-center rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground dark:text-warning flex-shrink-0">
                  Remediation
                </span>
              )}
            </div>
          );

          return (
            <InlineExpandRow
              key={m.id}
              isExpanded={openWeek === m.id}
              onToggle={() => setOpenWeek((cur) => (cur === m.id ? null : m.id))}
              trigger={trigger}
              content={
                ordered.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">
                    No activities available for this path.
                  </p>
                ) : (
                  <div>
                    {ordered.map((item, i) => (
                      <ActivityRow
                        key={item.id}
                        item={item}
                        state={states[i]}
                        signalId={`signal-session-${item.id}`}
                      />
                    ))}
                  </div>
                )
              }
            />
          );
        })}
      </div>
    </section>
  );
}
