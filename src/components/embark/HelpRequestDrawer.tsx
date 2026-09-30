import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { useHelpDrawer } from "./HelpDrawerContext";

const SUBMITTED_DATE = "Jul 19, 2026";
const CONTEXT_LINE = "Module: Benefits Navigation — Module 3 Assessment";
const SUBMITTED_MESSAGE =
  "I'm struggling with coordination of benefits. I got 61% on the module assessment and I'm not sure I understand when Medicare pays first versus when the secondary plan does. Can someone help me go through this?";
const RESPONSE_TEXT =
  "Hi Jordan — great question. Let's talk through this. The key rule is: Medicare is always primary for Medicare members, even when they have secondary coverage. The secondary plan only steps in after Medicare has paid its 80%. I'll add a note to your session in this week's training. In the meantime, Sage can walk you through some examples if you ask about COB scenarios.";

export function HelpRequestDrawer() {
  const { open, closeDrawer, resolved, markResolved } = useHelpDrawer();
  const [responded, setResponded] = useState(false);

  // Reset dev toggle when reopening after resolution isn't necessary, but keep clean.
  useEffect(() => {
    if (resolved) setResponded(true);
  }, [resolved]);

  const statusPill = resolved ? (
    <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-semibold">
      RESOLVED
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-warning/15 text-warning-foreground dark:text-warning px-2 py-0.5 text-[10px] font-semibold">
      OPEN
    </span>
  );

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeDrawer()}>
      <SheetContent side="right" className="w-full sm:max-w-[400px] p-0 flex flex-col">
        <VisuallyHidden>
          <SheetTitle>My Raise Hand Request</SheetTitle>
          <SheetDescription>View the detail of your raise hand request.</SheetDescription>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4 border-b border-border">
          <div className="space-y-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground">My Raise Hand Request</h3>
            <p className="text-xs text-muted-foreground">Submitted {SUBMITTED_DATE}</p>
          </div>
          <div className="flex items-start gap-2 flex-shrink-0">
            {statusPill}
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section className="space-y-3">
            <div className="text-[10px] font-semibold tracking-wide text-muted-foreground">
              What I submitted
            </div>
            <p className="text-xs text-muted-foreground">{CONTEXT_LINE}</p>
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-sm text-foreground whitespace-pre-wrap">{SUBMITTED_MESSAGE}</p>
            </div>
            <p className="text-xs">
              <span className="text-muted-foreground">Sent to: </span>
              <span className="text-foreground">Taylor Reyes (Manager)</span>
            </p>
          </section>

          <section className="space-y-2">
            <div className="text-[10px] font-semibold tracking-wide text-muted-foreground">
              Manager response
            </div>
            {!responded ? (
              <p className="text-sm italic text-muted-foreground">
                Taylor Reyes hasn't responded yet. You'll receive a notification when they do.
              </p>
            ) : (
              <div className="rounded-md border border-border bg-background p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">Taylor Reyes · Manager</span>
                  <span className="text-xs text-muted-foreground">{SUBMITTED_DATE}</span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{RESPONSE_TEXT}</p>
              </div>
            )}
          </section>

          {/* Dev toggle */}
          {!resolved && (
            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResponded((v) => !v)}
              >
                {responded ? "Reset (dev)" : "Simulate response (dev)"}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {!responded ? (
            <div className="flex justify-end">
              <Button variant="secondary" onClick={closeDrawer}>Close</Button>
            </div>
          ) : resolved ? (
            <div className="flex justify-end">
              <Button variant="secondary" onClick={closeDrawer}>Close</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Button variant="secondary" onClick={closeDrawer}>Close</Button>
              <Button
                onClick={() => {
                  markResolved();
                  closeDrawer();
                }}
              >
                Mark as resolved ✓
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
