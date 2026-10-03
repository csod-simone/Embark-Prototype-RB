import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AiFlag } from "@/components/embark/AiFlag";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DecisionType = "module_skip" | "score_change";

interface Decision {
  date: string;
  decision: string;
  rationale: string;
  type: DecisionType;
  moduleName?: string;
}

const decisions: Decision[] = [
  {
    date: "Jul 14",
    decision: "Path personalized: Discovery and objectives skipped",
    rationale:
      "A strong result on the previous step skipped the next article. Revert is available until Jul 21, 2026.",
    type: "module_skip",
    moduleName: "Discovery and objectives",
  },
  {
    date: "Jul 19",
    decision: "Readiness score decreased: -3 points",
    rationale: "Knowledge check 1 below the pass mark (61%)",
    type: "score_change",
  },
];

export function AiDecisionsCard({
  forceOpen = false,
  learnerName = "this learner",
  readOnly = false,
}: {
  forceOpen?: boolean;
  learnerName?: string;
  readOnly?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [reverted, setReverted] = useState<Record<number, boolean>>({});
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (forceOpen) setExpanded(true);
  }, [forceOpen]);

  const pending = pendingIndex !== null ? decisions[pendingIndex] : null;

  const handleConfirmRevert = () => {
    if (pendingIndex === null || !pending) return;
    const idx = pendingIndex;
    const moduleName = pending.moduleName ?? "The module";
    setReverted((r) => ({ ...r, [idx]: true }));
    setPendingIndex(null);
    toast.success(
      `AI decision reverted — ${moduleName} has been returned to ${learnerName}'s journey.`,
    );
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs tracking-wide font-medium text-muted-foreground">
          AI decisions
        </span>
        <AiFlag label="AI" className="px-2 py-0.5 text-[11px]" />
      </div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex items-center gap-1 text-sm text-secondary-foreground hover:underline"
        aria-expanded={expanded}
      >
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4" /> Collapse
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" /> Show decisions
          </>
        )}
      </button>
      {expanded && (
        <ul className="mt-3 flex flex-col gap-1">
          {decisions.map((d, i) => {
            const isReverted = !!reverted[i];
            const isRevertible = !readOnly && d.type === "module_skip" && !isReverted;

            const rowInner = (
              <>
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground whitespace-nowrap mt-0.5">
                  {d.date}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{d.decision}</p>
                  <p className="text-xs italic text-muted-foreground mt-0.5">
                    {d.rationale}
                  </p>
                </div>
                {isReverted && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground whitespace-nowrap mt-0.5">
                    Reverted
                  </span>
                )}
                {isRevertible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingIndex(i);
                    }}
                  >
                    <Undo2 className="h-3.5 w-3.5 mr-1" />
                    Revert
                  </Button>
                )}
              </>
            );

            if (isRevertible) {
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setPendingIndex(i)}
                    className="w-full flex items-start gap-3 rounded-md p-2 -mx-2 text-left hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    {rowInner}
                  </button>
                </li>
              );
            }

            return (
              <li key={i} className="flex items-start gap-3 p-2 -mx-2">
                {rowInner}
              </li>
            );
          })}
        </ul>
      )}

      <Dialog
        open={pendingIndex !== null}
        onOpenChange={(open) => !open && setPendingIndex(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Revert AI decision?</DialogTitle>
          </DialogHeader>
          {pending && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-foreground">
                You are about to revert the following AI decision for{" "}
                {learnerName}:
              </p>
              <ul className="text-sm text-foreground flex flex-col gap-1 pl-4 list-disc">
                <li>
                  Decision type:{" "}
                  {pending.type === "module_skip" ? "week skip" : "Decision"}
                </li>
                {pending.moduleName && (
                  <li>Module affected: {pending.moduleName}</li>
                )}
                <li>Decision made: {pending.date}</li>
              </ul>
              <p className="text-sm text-foreground">
                Reverting this decision will return {pending.moduleName} to the
                learner's journey. The learner will be required to complete
                this module.
              </p>
              <p className="text-xs text-muted-foreground">
                This change will take effect immediately. The learner will be
                notified that their journey has been updated.
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button variant="secondary" onClick={() => setPendingIndex(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRevert}>
              Revert decision
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
