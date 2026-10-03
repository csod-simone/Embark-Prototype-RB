import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SageAvatar, AskSageIcon } from "@/components/embark/AskSageIcon";
import { ApprovalReviewSheet, type ApprovalStatus } from "@/components/embark/manager/ApprovalReviewSheet";
import { HandReviewSheet } from "@/components/embark/manager/HandReviewSheet";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { requests } from "@/pages/embark/manager/Approvals";
import { unusualModuleTimes, unusualTimeInsight } from "@/data/moduleTime";
import { MANAGER_PROFILE_SIGNALS } from "@/data/managerSageSignals";
import { useAssessmentAttempts } from "@/hooks/use-assessment-attempts";
import { hands as handRecords, initialStatuses, type Status } from "@/pages/embark/manager/HandsRaised";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ApprovalItem = { id: string; learner: string; type: string; submitted: string; to: string };
type HandItem = { id: string; learner: string; context: string; raised: string; to: string };
type Insight = { id: string; text: string; tag?: string; timestamp: string; to: string };
type Upcoming = {
  id: string;
  due: string;
  imminent?: boolean;
  title: string;
  learner: string;
  tag: string;
  to: string;
};
type AssessmentFollowUp = {
  id: string;
  learner: string;
  assessment: string;
  reason: string;
  tone: "warning" | "destructive";
  score: string;
  raised: string;
  to: string;
};

// Mirrors the pending requests on /manager/approvals
const approvals: ApprovalItem[] = [
  { id: "r5", learner: "Priya Sharma", type: "Module Skip", submitted: "1 day ago", to: "/manager/approvals" },
  { id: "r3", learner: "Marcus Webb", type: "Journey Exception", submitted: "2 days ago", to: "/manager/approvals" },
];

// Mirrors the open hands on /manager/hands-raised
const hands: HandItem[] = [
  {
    id: "h5",
    learner: "Ryan O'Brien",
    context: "General check-in — not sure if on track, wants reassurance",
    raised: "1 day ago",
    to: "/manager/hands-raised",
  },
  {
    id: "h4",
    learner: "Marcus Webb",
    context: "IM Intake Pathway — feeling behind, asking for support",
    raised: "2 days ago",
    to: "/manager/learner/l3",
  },
  {
    id: "h1",
    learner: "Jordan Kim",
    context: "Knowledge check 1 — repeated failure, confidence very low",
    raised: "3 days ago",
    to: "/manager/learner/l1",
  },
  {
    id: "h3",
    learner: "Tom Hartley",
    context: "Advice documentation — unclear on what to record",
    raised: "4 days ago",
    to: "/manager/hands-raised",
  },
  {
    id: "h2",
    learner: "Leon Müller",
    context: "Client relationships foundations — confused after the knowledge check",
    raised: "5 days ago",
    to: "/manager/hands-raised",
  },
];

const insights: Insight[] = [
  ...unusualModuleTimes().map((row) => ({
    id: `time-${row.learnerId}-${row.weekId}`,
    text: unusualTimeInsight(row),
    tag: row.learnerName,
    timestamp: "Today",
    to: `/manager/learner/${row.learnerId}#signal-module-time-${row.weekId}`,
  })),
  ...MANAGER_PROFILE_SIGNALS.map((signal) => ({
    id: signal.id,
    text: signal.overview,
    tag: signal.learnerName,
    timestamp: "Today",
    to: `/manager/learner/${signal.learnerId}#${signal.id}`,
  })),
  {
    id: "i1",
    text: "Jordan Kim has failed Knowledge check 1 and has raised their hand for help. A check-in on Client relationships foundations would help.",
    tag: "Jordan Kim",
    timestamp: "Today",
    to: "/manager/learner/l1?tab=help_requests#signal-hand-l1-hr1",
  },
  {
    id: "i2",
    text: "Marcus Webb has not completed a session in 9 days and is still on Knowledge check 1. A catch-up on the mandate would help before discovery.",
    tag: "Marcus Webb",
    timestamp: "Today",
    to: "/manager/learner/l3#signal-session-mc-k1",
  },
  {
    id: "i3",
    text: "Three learners in IM Intake Cohort A are behind the cohort on Client relationships foundations. A short prompt would help them into discovery.",
    tag: "IM Intake Cohort A",
    timestamp: "Yesterday",
    to: "/manager/cohorts#signal-cohort-foundations",
  },
];

const assessmentFollowUps: AssessmentFollowUp[] = [
  {
    id: "af1",
    learner: "Jordan Kim",
    assessment: "Module assessment",
    reason: "Did not advance",
    tone: "destructive",
    score: "61%",
    raised: "3 days ago",
    to: "/manager/learner/l1?tab=assessments",
  },
];

const upcoming: Upcoming[] = [
  {
    id: "u1",
    due: "Tomorrow",
    imminent: true,
    title: "Session completion — Discovery and objectives",
    learner: "Marcus Webb",
    tag: "Module",
    to: "/manager/learner/l3",
  },
  {
    id: "u2",
    due: "In 2 days",
    imminent: true,
    title: "Assessment deadline — Knowledge check 1",
    learner: "Jordan Kim",
    tag: "Assessment",
    to: "/manager/learner/l1/assessments",
  },
  {
    id: "u4",
    due: "In 6 days",
    title: "Session completion — Advice documentation",
    learner: "Priya Sharma",
    tag: "Module",
    to: "/manager/learner/l2",
  },
];

function SectionCard({
  title,
  description,
  flag,
  children,
}: {
  title: string;
  description: string;
  flag?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {flag && (
          <Badge variant="ai" className="gap-1 border-transparent px-2.5 py-0.5 text-xs font-medium">
            <AskSageIcon size={14} />
            AI
          </Badge>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground py-3">{children}</p>;
}

function Chip({
  tone,
  children,
}: {
  tone: "warning" | "destructive" | "primary" | "muted";
  children: React.ReactNode;
}) {
  const map = {
    warning: "bg-warning/15 text-warning-foreground dark:text-warning border-warning/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    primary: "bg-primary/15 text-primary border-primary/30",
    muted: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium", map[tone])}>
      {children}
    </span>
  );
}

function AttentionCard({
  title,
  description,
  count,
  countLabel,
  children,
}: {
  title: string;
  description: string;
  count: number;
  countLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <Chip tone="muted">{count} {countLabel}</Chip>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ManagerOverview() {
  const [statuses, setStatuses] = useState<Record<string, ApprovalStatus>>(() =>
    Object.fromEntries(approvals.map((a) => [a.id, "pending" as ApprovalStatus])),
  );
  const [selection, setSelection] = useState<string | null>(null);
  const [handStatuses, setHandStatuses] = useState<Record<string, Status>>(() => ({ ...initialStatuses }));
  const [handSelection, setHandSelection] = useState<string | null>(null);
  const { paused: pausedAssessments, checkIns } = useAssessmentAttempts();
  const scoreLabel = (score?: number, total?: number) =>
    score != null && total ? `${Math.round((score / total) * 100)}%` : "—";
  const liveFollowUps: AssessmentFollowUp[] = [
    ...checkIns.map((item) => ({
      id: `checkin-${item.id}`,
      learner: "Andrew Burton",
      assessment: item.name ?? "Assessment",
      reason: "Check-in",
      tone: "warning" as const,
      score: scoreLabel(item.score, item.total),
      raised: "Just now",
      to: "/manager/learner/l1?tab=assessments",
    })),
    ...pausedAssessments.map((item) => ({
      id: `pause-${item.id}`,
      learner: "Andrew Burton",
      assessment: item.name ?? "Assessment",
      reason: item.kind === "chapter_gate" ? "At risk — single attempt" : "At risk — retakes used",
      tone: "destructive" as const,
      score: scoreLabel(item.score, item.total),
      raised: "Just now",
      to: "/manager/learner/l1?tab=assessments",
    })),
  ];
  const followUps = [...liveFollowUps, ...assessmentFollowUps];

  const openApprovals = approvals.filter((a) => statuses[a.id] === "pending");
  const selectedRequest = requests.find((r) => r.id === selection);
  const currentIndex = selection ? openApprovals.findIndex((a) => a.id === selection) : -1;
  const nextItem = currentIndex >= 0 ? openApprovals[currentIndex + 1] : openApprovals[0];
  const nextLabel = selection && nextItem ? "Next request" : null;

  const openHands = hands.filter((h) => handStatuses[h.id] !== "resolved");
  const selectedHand = handRecords.find((h) => h.id === handSelection);
  const handIndex = handSelection ? openHands.findIndex((h) => h.id === handSelection) : -1;
  const nextHand = handIndex >= 0 ? openHands[handIndex + 1] : openHands[0];
  const handNextLabel = handSelection && nextHand ? "Next raised hand" : null;
  const attentionCount = openApprovals.length + openHands.length + assessmentFollowUps.length;

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-6">
        <p className="text-sm text-muted-foreground">Here's what needs your attention today.</p>

        <div id="needs-attention-now">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground">Needs Attention Now</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Open requests and raised hands that require your response.
              </p>
            </div>
            <Chip tone="primary">
              {attentionCount} {attentionCount === 1 ? "item needs action" : "items need action"}
            </Chip>
          </div>
          <div className="space-y-8">
            <AttentionCard
              title="Approval Requests"
              description="These requests are awaiting your decision before the learner can continue."
              count={openApprovals.length}
              countLabel={openApprovals.length === 1 ? "open request" : "open requests"}
            >
              {openApprovals.length === 0 ? (
                <EmptyText>No open approval requests right now.</EmptyText>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Request Type</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openApprovals.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium text-foreground">{a.learner}</TableCell>
                        <TableCell>{a.type}</TableCell>
                        <TableCell className="text-muted-foreground">{a.submitted}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="secondary" onClick={() => setSelection(a.id)}>
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </AttentionCard>

            <AttentionCard
              title="Raised Hands"
              description="These learners asked for help and are waiting on a response."
              count={openHands.length}
              countLabel="awaiting response"
            >
              {openHands.length === 0 ? (
                <EmptyText>No raised hands right now.</EmptyText>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Context</TableHead>
                      <TableHead>Raised</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openHands.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="font-medium text-foreground whitespace-nowrap">
                          {h.learner}
                        </TableCell>
                        <TableCell className="max-w-[18rem] truncate" title={h.context}>
                          {h.context}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {h.raised}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="secondary" onClick={() => setHandSelection(h.id)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </AttentionCard>

            <AttentionCard
              title="Assessment Follow-ups"
              description="Module assessments and knowledge checks that did not advance and need a follow-up before the learner can continue."
              count={followUps.length}
              countLabel={followUps.length === 1 ? "needs follow-up" : "need follow-up"}
            >
              {followUps.length === 0 ? (
                <EmptyText>No assessment follow-ups right now.</EmptyText>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Learner</TableHead>
                      <TableHead>Assessment</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Raised</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {followUps.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium text-foreground whitespace-nowrap">{a.learner}</TableCell>
                        <TableCell className="max-w-[16rem] truncate" title={a.assessment}>{a.assessment}</TableCell>
                        <TableCell>
                          <Chip tone={a.tone}>{a.reason}</Chip>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{a.score}</TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">{a.raised}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="secondary" asChild>
                            <Link to={a.to}>Review</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </AttentionCard>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard
            title="Sage Insights"
            description="AI-generated insights from Sage to help you support your team."
            flag
          >
            {insights.length === 0 ? (
              <EmptyText>
                Sage doesn't have any insights for you right now. Check back soon.
              </EmptyText>
            ) : (
              insights.map((insight, i) => (
                <Link
                  key={insight.id}
                  to={insight.to}
                  className={cn(
                    "flex items-start gap-3 py-3 -mx-2 px-2 rounded-md transition-colors hover:bg-muted/50",
                    i > 0 && "border-t border-border",
                  )}
                >
                  <SageAvatar size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{insight.text}</p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {insight.tag && <Badge variant="tertiary">{insight.tag}</Badge>}
                      <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))
            )}
          </SectionCard>

          <SectionCard
            title="Coming Up Soon"
            description="Deadlines and milestones due within the next 7 days."
          >
            {upcoming.length === 0 ? (
              <EmptyText>
                Nothing due in the next 7 days. Great work keeping your team on track!
              </EmptyText>
            ) : (
              upcoming.map((item, i) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className={cn(
                    "block py-3 -mx-2 px-2 rounded-md transition-colors hover:bg-muted/50",
                    i > 0 && "border-t border-border",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        item.imminent ? "text-warning-foreground dark:text-warning" : "text-muted-foreground",
                      )}
                    >
                      {item.due}
                    </span>
                    <Badge variant="tertiary">{item.tag}</Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.learner}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              ))
            )}
          </SectionCard>
        </div>
      </PageContainer>
      <ApprovalReviewSheet
        request={selectedRequest}
        status={selection ? statuses[selection] ?? "pending" : "pending"}
        onOpenChange={(open) => {
          if (!open) setSelection(null);
        }}
        onStatusChange={(id, status) => setStatuses((prev) => ({ ...prev, [id]: status }))}
        nextLabel={nextLabel}
        onNext={() => {
          if (nextItem) setSelection(nextItem.id);
        }}
      />
      <HandReviewSheet
        hand={selectedHand}
        status={handSelection ? handStatuses[handSelection] ?? "open" : "open"}
        onOpenChange={(open) => {
          if (!open) setHandSelection(null);
        }}
        onStatusChange={(id, status) => setHandStatuses((prev) => ({ ...prev, [id]: status }))}
        nextLabel={handNextLabel}
        onNext={() => {
          if (nextHand) setHandSelection(nextHand.id);
        }}
      />
    </>
  );
}
