import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SageTag } from "@/components/embark/SageTag";

type RequestType = "coaching" | "exception" | "skip";
type Status = "pending" | "approved" | "declined";

export type Request = {
  id: string;
  type: RequestType;
  typeLabel: string;
  submitted: string;
  learner: string;
  learnerId: string;
  cohort: string;
  detail: string;
  sage: string;
};

export const requests: Request[] = [
  {
    id: "r3",
    type: "exception",
    typeLabel: "Journey Exception",
    submitted: "Submitted 2 days ago",
    learner: "Marcus Webb",
    learnerId: "marcus",
    cohort: "Medicare CSR Cohort A",
    detail:
      "Requesting an extension on the Module 3 completion deadline due to unexpected leave. Original deadline: 10 August 2026. Requesting extension to 24 August 2026.",
    sage:
      "Marcus completed Module 1 and Module 2 ahead of schedule. This is his first extension request. Granting a 2-week extension appears reasonable given prior performance.",
  },
  {
    id: "r5",
    type: "skip",
    typeLabel: "Module Skip",
    submitted: "Submitted 1 day ago",
    learner: "Priya Sharma",
    learnerId: "priya",
    cohort: "Medicare CSR Cohort B",
    detail:
      "A skip of the Commercial Plan Specifics module has been applied to Priya's journey. Review the Sage rationale and approve to accept, or decline to revert the skip and restore the module.",
    sage:
      "People Graph shows existing proficiency in commercial insurance products based on prior role history.",
  },
];

const chipVariant: Record<RequestType, "default" | "secondary" | "warning"> = {
  coaching: "default",
  exception: "warning",
  skip: "secondary",
};

const filterMap: Record<string, RequestType | "all"> = {
  all: "all",
  coaching: "coaching",
  exception: "exception",
  skip: "skip",
};

export default function Approvals() {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    () => Object.fromEntries(requests.map((r) => [r.id, "pending" as Status])),
  );
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const approvedNow = Object.values(statuses).filter((s) => s === "approved").length;
  const declinedNow = Object.values(statuses).filter((s) => s === "declined").length;
  const pendingCount = requests.length - approvedNow - declinedNow;
  const approvedCount = 11 + approvedNow;
  const declinedCount = 2 + declinedNow;

  const visible = useMemo(() => {
    const f = filterMap[filter];
    const filtered = f === "all" ? requests : requests.filter((r) => r.type === f);
    return [...filtered].sort((a, b) => {
      const ap = statuses[a.id] === "pending" ? 0 : 1;
      const bp = statuses[b.id] === "pending" ? 0 : 1;
      return ap - bp;
    });
  }, [filter, statuses]);

  const setStatus = (id: string, s: Status) => {
    setStatuses((prev) => ({ ...prev, [id]: s }));
    setConfirmingId(null);
  };

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Approval Requests</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and action pending requests from learners and the system.
            </p>
          </div>
          <div className="w-56 shrink-0">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger aria-label="Filter by type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All requests</SelectItem>
                <SelectItem value="coaching">Coaching sessions</SelectItem>
                <SelectItem value="exception">Journey exceptions</SelectItem>
                <SelectItem value="skip">Module skips</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="text-xs tracking-wide text-muted-foreground">Pending</div>
            <div className="mt-1 text-2xl font-bold text-warning-foreground dark:text-warning">{pendingCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Awaiting your action</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="text-xs tracking-wide text-muted-foreground">Approved this month</div>
            <div className="mt-1 text-2xl font-bold text-success-dark">{approvedCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Across all cohorts</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="text-xs tracking-wide text-muted-foreground">Declined this month</div>
            <div className="mt-1 text-2xl font-bold text-muted-foreground">{declinedCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Across all cohorts</div>
          </div>
        </div>

        {/* Pending */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Pending requests</h2>
            <span className="text-sm text-muted-foreground">{visible.length} requests</span>
          </div>

          <div className="space-y-3">
            {visible.map((r) => {
              const status = statuses[r.id];
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
                <div
                  key={r.id}
                  className={`rounded-2xl border border-border p-4 shadow-sm ${tint}`}
                >
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
                              <Button size="sm" onClick={() => setStatus(r.id, "approved")}>
                                Accept skip
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setConfirmingId(r.id)}
                              >
                                Revert skip
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" onClick={() => setStatus(r.id, "approved")}>
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setConfirmingId(r.id)}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => navigate(`/manager/learner/${r.learnerId}`)}
                            className="ml-auto text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                          >
                            View learner profile
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </div>
                        {confirmingId === r.id && (
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {isSkip ? (
                              <>
                                <span className="text-sm text-muted-foreground">
                                  Reverting this skip will add the module back to {r.learner}'s journey immediately. {r.learner} will be notified.
                                </span>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setStatus(r.id, "declined")}
                                >
                                  Yes, revert
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="text-sm text-muted-foreground">
                                  Are you sure you want to decline this request?
                                </span>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setStatus(r.id, "declined")}
                                >
                                  Yes, decline
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setConfirmingId(null)}
                            >
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
                          onClick={() => navigate(`/manager/learner/${r.learnerId}`)}
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
                          onClick={() => navigate(`/manager/learner/${r.learnerId}`)}
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
            })}
          </div>
        </section>

        {/* Recently actioned */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Recently actioned</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Requests you have approved or declined in the last 30 days
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
              <span className="inline-flex items-center gap-1.5 text-sm text-destructive font-medium">
                <X className="h-4 w-4" aria-hidden />
                Declined
              </span>
              <span className="text-sm text-foreground">Tom Hartley · Medicare CSR Cohort A</span>
              <span className="text-sm text-muted-foreground">Journey Exception</span>
              <span className="ml-auto text-sm text-muted-foreground">Actioned 6 days ago</span>
            </div>
          </div>
        </section>
      </PageContainer>
    </>
  );
}
