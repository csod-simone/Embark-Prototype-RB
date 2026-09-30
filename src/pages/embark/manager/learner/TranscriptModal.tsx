import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { TutorBubble } from "@/components/embark/TutorBubble";
import { LearnerBubble } from "@/components/embark/LearnerBubble";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { coverageDeterminationTutorContext } from "@/data/mockData";

export function TranscriptModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Accepted so profile tabs can open a specific conversation. */
  sessionId?: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Sage transcript — Client relationships foundations</DialogTitle>
          <DialogDescription>7 interactions · 1 escalation raised</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-2 pr-1">
          {coverageDeterminationTutorContext.map((m, i) => {
            if (m.role === "learner") {
              return <LearnerBubble key={i} message={m.text} />;
            }
            if (m.isEscalation) {
              return (
                <div key={i} className="w-full">
                  <LeftBorderCard borderVariant="warning">
                    <span className="inline-flex items-center rounded-full bg-warning/15 text-warning-foreground dark:text-warning px-2 py-0.5 text-[10px] font-semibold tracking-wide mb-2">
                      Escalation raised
                    </span>
                    <TutorBubble message={m.text} citation={m.citation} isProactive={m.isProactive} />
                  </LeftBorderCard>
                </div>
              );
            }
            return <TutorBubble key={i} message={m.text} citation={m.citation} isProactive={m.isProactive} />;
          })}
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center rounded-md border border-border bg-background px-3.5 py-2 text-sm text-foreground hover:bg-muted"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}