import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { SageTag } from "@/components/embark/SageTag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Request } from "@/pages/embark/manager/Approvals";

export type ApprovalStatus = "pending" | "approved" | "declined";

const chipVariant: Record<Request["type"], "default" | "secondary" | "warning"> = {
  coaching: "default",
  exception: "warning",
  skip: "secondary",
};

/**
 * Fly-out for a manager overview approval. Same detail and actions as the
 * Approval Requests page, so the manager can act without leaving the overview.
 */
export function ApprovalReviewSheet({
  request,
  status,
  onOpenChange,
  onStatusChange,
  nextLabel,
  onNext,
}: {
  request?: Request;
  status: ApprovalStatus;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: ApprovalStatus) => void;
  nextLabel: string | null;
  onNext: () => void;
}) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  const reset = () => setConfirming(false);

  return (
    <Sheet
      open={!!request}
      onOpenChange={(open) => {
        if (!open) reset();
        onOpenChange(open);
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto flex flex-col gap-0">
        <SheetHeader className="text-left">
          <SheetTitle>Approval request</SheetTitle>
          <SheetDescription>
            {request
              ? `Review and action ${request.learner}'s item without leaving your workspace.`
              : "Review and action this item without leaving your workspace."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex-1">
          {request && (
            <RequestDetail
              request={request}
              status={status}
              confirming={confirming}
              onSetStatus={(next) => {
                onStatusChange(request.id, next);
                setConfirming(false);
              }}
              onStartConfirm={() => setConfirming(true)}
              onCancelConfirm={() => setConfirming(false)}
              onViewLearner={() => navigate(`/manager/learner/${request.learnerId}`)}
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

function RequestDetail({
  request: r,
  status,
  confirming,
  onSetStatus,
  onStartConfirm,
  onCancelConfirm,
  onViewLearner,
}: {
  request: Request;
  status: ApprovalStatus;
  confirming: boolean;
  onSetStatus: (status: ApprovalStatus) => void;
  onStartConfirm: () => void;
  onCancelConfirm: () => void;
  onViewLearner: () => void;
}) {
  const isSkip = r.type === "skip";
  const tint =
    status === "approved"
      ? "bg-success-dark/5"
      : status === "declined"
        ? isSkip
          ? "bg-warning/5"
          : "bg-destructive/5"
        : "bg-background";

  return (
    <div className={`rounded-2xl border border-border p-4 shadow-sm ${tint}`}>
      <div className="flex items-center justify-between gap-4">
        <Badge variant={chipVariant[r.type]}>{r.typeLabel}</Badge>
        <span className="text-xs text-muted-foreground">{r.submitted}</span>
      </div>

      <div className="mt-3">
        <div className="text-sm font-medium text-foreground">{r.learner}</div>
        <div className="text-sm text-muted-foreground">{r.cohort}</div>
        <p className="mt-2 text-sm text-foreground">{r.detail}</p>
      </div>

      <div className="mt-3">
        <LeftBorderCard borderVariant="brand" padding="sm">
          <div className="flex items-center gap-2">
            <SageTag label="AI" />
            <span className="text-sm font-medium text-primary">Sage insight:</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{r.sage}</p>
        </LeftBorderCard>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        {status === "pending" && (
          <>
            <div className="flex items-center gap-2">
              {isSkip ? (
                <>
                  <Button size="sm" onClick={() => onSetStatus("approved")}>
                    Accept skip
                  </Button>
                  <Button size="sm" variant="secondary" onClick={onStartConfirm}>
                    Revert skip
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => onSetStatus("approved")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" onClick={onStartConfirm}>
                    Decline
                  </Button>
                </>
              )}
              <button
                type="button"
                onClick={onViewLearner}
                className="ml-auto text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                View learner profile
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            {confirming && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {isSkip ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Reverting this skip will add the module back to {r.learner}'s journey
                      immediately. {r.learner} will be notified.
                    </span>
                    <Button size="sm" variant="destructive" onClick={() => onSetStatus("declined")}>
                      Yes, revert
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Are you sure you want to decline this request?
                    </span>
                    <Button size="sm" variant="destructive" onClick={() => onSetStatus("declined")}>
                      Yes, decline
                    </Button>
                  </>
                )}
                <Button size="sm" variant="secondary" onClick={onCancelConfirm}>
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}
        {status === "approved" && (
          <div className="flex items-center gap-2">
            {isSkip ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-dark">
                <Check className="h-4 w-4" aria-hidden />
                Skip accepted — logged in audit trail
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-dark">
                <Check className="h-4 w-4" aria-hidden />
                Approved
              </span>
            )}
            <button
              type="button"
              onClick={onViewLearner}
              className="ml-auto text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View learner profile
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        )}
        {status === "declined" && (
          <div className="flex items-center gap-2">
            {isSkip ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warning-foreground dark:text-warning">
                <span aria-hidden>↩</span>
                Skip reverted — module restored to {r.learner}'s journey
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
                <X className="h-4 w-4" aria-hidden />
                Declined
              </span>
            )}
            <button
              type="button"
              onClick={onViewLearner}
              className="ml-auto text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View learner profile
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
