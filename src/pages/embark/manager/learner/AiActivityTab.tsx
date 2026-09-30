import { useState } from "react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { TranscriptModal } from "./TranscriptModal";
import type { LearnerRecord } from "@/data/learnerDirectory";

export function AiActivityTab({ learner }: { learner: LearnerRecord }) {
  const [transcriptSession, setTranscriptSession] = useState<string | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const struggles = learner.sageStruggles;
  // Most recently updated conversation first; rows without a live timestamp keep their order.
  const sessionRows = [...learner.sageSessions].sort(
    (a, b) =>
      (b.lastInteractionAt ? Date.parse(b.lastInteractionAt) : 0) -
      (a.lastInteractionAt ? Date.parse(a.lastInteractionAt) : 0),
  );
  const firstName = learner.name.split(" ")[0];

  const openTranscript = (sessionId?: string) => {
    setTranscriptSession(sessionId ?? null);
    setTranscriptOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <LeftBorderCard borderVariant="warning">
        <div className="text-xs tracking-wide font-medium text-muted-foreground mb-3">
          Topics {firstName} has struggled with
        </div>
        {struggles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reinforcement topics yet — no assessment or Sage evidence recorded.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {struggles.map((s) => (
              <li key={s.topic} className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-medium text-foreground">{s.topic}</span>
                <span className="text-xs text-muted-foreground">{s.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </LeftBorderCard>

      <div className="rounded-md border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-left text-xs tracking-wide text-muted-foreground">
              <th className="px-4 py-2 font-medium">Session</th>
              <th className="px-4 py-2 font-medium">Source</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Interactions</th>
              <th className="px-4 py-2 font-medium">Escalations</th>
              <th className="px-4 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessionRows.map((r) => (
              <tr key={r.sessionId ?? r.name} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.source ?? "Journey"}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.interactions}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.escalations}</td>
                <td className="px-4 py-3 text-right">
                  {r.canView ? (
                    <button
                      type="button"
                      onClick={() => openTranscript(r.sessionId)}
                      className="text-sm text-secondary-foreground hover:underline"
                    >
                      View transcript ↗
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TranscriptModal
        open={transcriptOpen}
        onOpenChange={setTranscriptOpen}
        sessionId={transcriptSession}
      />
    </div>
  );
}
