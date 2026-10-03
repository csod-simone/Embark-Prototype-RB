import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { SageTag } from "@/components/embark/SageTag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  priorityMeta,
  statusMeta,
  type Hand,
  type Status,
} from "@/pages/embark/manager/HandsRaised";

/**
 * Fly-out for a manager overview raised hand. Same detail and actions as the
 * Hands Raised page, so the manager can respond without leaving the overview.
 */
export function HandReviewSheet({
  hand,
  status,
  onOpenChange,
  onStatusChange,
  nextLabel,
  onNext,
}: {
  hand?: Hand;
  status: Status;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: Status) => void;
  nextLabel: string | null;
  onNext: () => void;
}) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [confirmResolve, setConfirmResolve] = useState(false);

  const reset = () => {
    setComposerOpen(false);
    setComposerText("");
    setConfirmResolve(false);
  };

  return (
    <Sheet
      open={!!hand}
      onOpenChange={(open) => {
        if (!open) reset();
        onOpenChange(open);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto flex flex-col gap-0">
        <SheetHeader className="text-left">
          <SheetTitle>Raised hand</SheetTitle>
          <SheetDescription>
            {hand
              ? `Review and action ${hand.name}'s item without leaving your workspace.`
              : "Review and action this item without leaving your workspace."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex-1">
          {hand && (
            <HandDetail
              hand={hand}
              status={status}
              composerOpen={composerOpen}
              composerText={composerText}
              onComposerTextChange={setComposerText}
              onOpenComposer={() => {
                setComposerOpen(true);
                setComposerText("");
                setConfirmResolve(false);
              }}
              onCancelComposer={() => setComposerOpen(false)}
              onSendResponse={() => {
                toast.success(`Response sent to ${hand.name}`);
                setComposerOpen(false);
                setComposerText("");
                if (status === "open") onStatusChange(hand.id, "in_progress");
              }}
              onMarkInProgress={() => onStatusChange(hand.id, "in_progress")}
              confirmResolve={confirmResolve}
              onStartResolve={() => {
                setConfirmResolve(true);
                setComposerOpen(false);
              }}
              onCancelResolve={() => setConfirmResolve(false)}
              onConfirmResolve={() => {
                onStatusChange(hand.id, "resolved");
                setConfirmResolve(false);
                toast.success(`${hand.name}'s hand raised has been marked as resolved.`);
              }}
            />
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
          {nextLabel && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                reset();
                onNext();
              }}
            >
              {nextLabel}
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
      {initials}
    </div>
  );
}

function HandDetail({
  hand: h,
  status,
  composerOpen,
  composerText,
  onComposerTextChange,
  onOpenComposer,
  onCancelComposer,
  onSendResponse,
  onMarkInProgress,
  confirmResolve,
  onStartResolve,
  onCancelResolve,
  onConfirmResolve,
}: {
  hand: Hand;
  status: Status;
  composerOpen: boolean;
  composerText: string;
  onComposerTextChange: (value: string) => void;
  onOpenComposer: () => void;
  onCancelComposer: () => void;
  onSendResponse: () => void;
  onMarkInProgress: () => void;
  confirmResolve: boolean;
  onStartResolve: () => void;
  onCancelResolve: () => void;
  onConfirmResolve: () => void;
}) {
  const pm = priorityMeta[h.priority];
  const sm = statusMeta[status];

  return (
    <LeftBorderCard borderVariant={pm.border}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar initials={h.initials} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground">{h.name}</div>
            <div className="text-xs text-muted-foreground">{h.cohort}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={pm.chip} variant="outline">
            {pm.label}
          </Badge>
          <Badge className={sm.chip} variant="outline">
            {sm.label}
          </Badge>
          <span className="text-xs text-muted-foreground">{h.raised}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs tracking-wide text-muted-foreground">Topic</div>
        <div className="mt-1 text-sm font-medium text-foreground">{h.topic}</div>
      </div>

      <div className="mt-3 border-l-2 border-border bg-muted/40 px-3 py-2 rounded-sm">
        <p className="text-sm text-muted-foreground italic">"{h.message}"</p>
      </div>

      <div className="mt-3">
        <LeftBorderCard borderVariant="brand" padding="sm">
          <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <SageTag label="AI" />
            Sage context:
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{h.sage}</p>
        </LeftBorderCard>
      </div>

      <div className="mt-3">
        <div className="text-xs tracking-wide text-muted-foreground mb-2">Suggested actions</div>
        <div className="flex flex-wrap gap-2">
          {h.actions.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toast(a)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-muted"
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={onOpenComposer}>
          Respond to learner
        </Button>
        {status === "open" && (
          <Button size="sm" variant="secondary" onClick={onMarkInProgress}>
            Mark in progress
          </Button>
        )}
        <button
          type="button"
          onClick={onStartResolve}
          className="ml-auto text-sm text-muted-foreground hover:text-foreground"
        >
          {status === "in_progress" ? "Mark resolved" : "Resolve"}
        </button>
      </div>

      {composerOpen && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs tracking-wide text-muted-foreground mb-2">Your response</div>
          <Textarea
            rows={4}
            value={composerText}
            onChange={(e) => onComposerTextChange(e.target.value)}
            placeholder={`Type your message to ${h.name} — this will appear in their Sage learning chat as a message from you...`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            The learner will be notified and your message will appear in their Sage conversation
            thread.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" onClick={onSendResponse}>
              Send response
            </Button>
            <button
              type="button"
              onClick={onCancelComposer}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirmResolve && (
        <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Mark this as resolved? The learner will not be notified automatically.
          </span>
          <Button size="sm" onClick={onConfirmResolve}>
            Yes, resolve
          </Button>
          <Button size="sm" variant="secondary" onClick={onCancelResolve}>
            Cancel
          </Button>
        </div>
      )}
    </LeftBorderCard>
  );
}
