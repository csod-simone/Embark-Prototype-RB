import { useState } from "react";
import { InlineExpandRow } from "@/components/embark/InlineExpandRow";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { BandPill } from "@/components/embark/BandPill";
import type { LearnerHandRaised, LearnerRecord } from "@/data/learnerDirectory";
import { TranscriptModal } from "./TranscriptModal";

type State = "awaiting_response" | "responded";

const SHOW_DEV =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_DEMO_SWITCHER === "true";

/** Hands raised by the learner whose profile is open. */
export function HelpRequestsTab({
  learner,
  readOnly = false,
}: {
  learner: LearnerRecord;
  readOnly?: boolean;
}) {
  if (learner.handsRaised.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
        {learner.name} has no hands raised.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {learner.handsRaised.map((request) => (
        <RequestRow
          key={request.id}
          learner={learner}
          request={request}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

function RequestRow({
  learner,
  request,
  readOnly,
}: {
  learner: LearnerRecord;
  request: LearnerHandRaised;
  readOnly: boolean;
}) {
  const [state, setState] = useState<State>(
    request.status === "resolved" ? "responded" : "awaiting_response",
  );
  const [draft, setDraft] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const firstName = learner.name.split(" ")[0];

  const send = () => {
    if (draft.trim().length === 0) return;
    setState("responded");
  };

  return (
    <div id={`signal-hand-${request.id}`} className="rounded-2xl border border-border bg-card shadow-sm scroll-mt-4">
      <InlineExpandRow
        defaultExpanded={request.status === "open"}
        trigger={
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-foreground">
              {request.moduleName} — {request.sessionName}
            </span>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-muted-foreground">{request.raisedAt}</span>
              {request.status === "open" ? (
                <span className="inline-flex items-center rounded-full bg-warning/10 text-warning-foreground dark:text-warning px-2 py-0.5 text-[11px] font-semibold tracking-wide">
                  Open
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground">
                  Resolved
                </span>
              )}
            </div>
          </div>
        }
        content={
          <div className="flex flex-col gap-4 mt-2">
            {/* Original request */}
            <div className="rounded-md bg-muted/40 p-4">
              <div className="text-xs tracking-wide font-medium text-muted-foreground mb-2">
                Original request
              </div>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                <li>
                  Session: {request.sessionName}, {request.moduleName}
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  <span>Sage summary: Last 5 exchanges</span>
                  <button
                    type="button"
                    onClick={() => setTranscriptOpen(true)}
                    className="text-secondary-foreground hover:underline"
                  >
                    View full transcript ↗
                  </button>
                </li>
              </ul>
              <div className="mt-3 flex items-center gap-3">
                <ReadinessRing size="sm" score={request.readinessScore} />
                <BandPill band={request.readinessBand} size="sm" />
                <span className="text-xs text-muted-foreground">
                  Readiness at time of request
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 text-sm text-foreground shadow-sm">
              {request.message}
            </div>

            {!readOnly && state === "awaiting_response" && (
              <div className="rounded-md border border-dashed border-border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  No response yet. Respond below.
                </p>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Write your response to ${firstName}...`}
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={send}
                    className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-3.5 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                    disabled={draft.trim().length === 0}
                  >
                    Send response
                  </button>
                  <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4" />
                    Mark resolved
                  </label>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Acknowledge only
                  </button>
                </div>
              </div>
            )}

            {!readOnly && state === "responded" && (
              <div className="flex flex-col gap-3">
                <LeftBorderCard borderVariant="brand">
                  <div className="text-xs text-muted-foreground mb-1">
                    {learner.facilitatorName} · Facilitator
                  </div>
                  <p className="text-sm text-foreground">
                    Hi {firstName}, great question. Work through the reference guide for this topic
                    and then book five minutes with me — we&apos;ll walk a live example together
                    before your next assessment.
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      Responded {request.raisedAt}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      Mark resolved
                    </button>
                  </div>
                </LeftBorderCard>
                <div>
                  <textarea
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder="Write a follow-up..."
                    rows={2}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    disabled={followUp.trim().length === 0}
                    className="mt-2 inline-flex items-center rounded-md border border-border bg-background px-3.5 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Send follow-up
                  </button>
                </div>
              </div>
            )}

            {!readOnly && SHOW_DEV && (
              <button
                type="button"
                onClick={() =>
                  setState((s) => (s === "responded" ? "awaiting_response" : "responded"))
                }
                className="self-start text-xs text-muted-foreground border border-dashed border-border rounded px-2 py-1 hover:bg-muted"
              >
                Simulate {state === "responded" ? "awaiting_response" : "responded"}
              </button>
            )}
          </div>
        }
      />
      <TranscriptModal open={transcriptOpen} onOpenChange={setTranscriptOpen} />
    </div>
  );
}
