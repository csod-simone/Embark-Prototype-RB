import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SageTag } from "@/components/embark/SageTag";

type Priority = "critical" | "high" | "medium";
export type Status = "open" | "in_progress" | "resolved";

export type Hand = {
  id: string;
  name: string;
  initials: string;
  cohort: string;
  priority: Priority;
  raised: string;
  topic: string;
  message: string;
  sage: string;
  actions: string[];
};

export const hands: Hand[] = [
  {
    id: "h1",
    name: "Jordan Kim",
    initials: "JK",
    cohort: "Medicare CSR Cohort A",
    priority: "critical",
    raised: "Raised 3 days ago",
    topic: "Knowledge check 1 — repeated failure, confidence very low",
    message:
      "I've failed Knowledge check 1 and I genuinely don't understand client relationship foundations no matter how many times I read them. I'm starting to feel like this job might not be for me. Can someone actually talk me through it?",
    sage:
      "Jordan has attempted Knowledge check 1, scoring 58% and 61%. Sage identified consistent errors on client relationship foundations. Sage has paused auto-progression. Engagement has dropped significantly in the last 9 days.",
    actions: ["Schedule coaching session", "Send reassurance nudge", "Assign supplementary resource"],
  },
  {
    id: "h2",
    name: "Leon Müller",
    initials: "LM",
    cohort: "Medicare CSR Cohort A",
    priority: "critical",
    raised: "Raised 5 days ago",
    topic: "Client relationships foundations — confused after the knowledge check",
    message:
      "The knowledge check said I got the Client relationships foundations questions wrong but it didn't explain why. I've re-read the article three times and I still can't see what I'm missing. I need someone to explain what the right answer actually is.",
    sage:
      "Leon scored 54% on Knowledge check 1 with errors concentrated on Client relationships foundations. Sage attempted to re-explain the step but Leon's follow-up questions suggest the article may not be clear enough yet.",
    actions: ["Explain concept directly", "Share worked example", "Schedule 1:1 session"],
  },
  {
    id: "h3",
    name: "Tom Hartley",
    initials: "TH",
    cohort: "Medicare CSR Cohort A",
    priority: "high",
    raised: "Raised 4 days ago",
    topic: "Advice documentation — unclear on what to record",
    message:
      "I keep getting confused about what has to go in the file note after a suitability conversation. The step makes it sound like it depends but doesn't tell you what it depends on.",
    sage:
      "Tom has raised 3 related questions on Advice documentation in the last 14 days. Sage provided general guidance but escalated because the file note is part of the journey record. This pattern of repeated questions on the same step suggests a gap rather than a one-off query.",
    actions: ["Clarify PA initiation rules", "Share process flowchart", "Review module content"],
  },
  {
    id: "h4",
    name: "Marcus Webb",
    initials: "MW",
    cohort: "Medicare CSR Cohort A",
    priority: "high",
    raised: "Raised 2 days ago",
    topic: "IM Intake Pathway — feeling behind, asking for support",
    message:
      "I've been struggling to find time to study this week and I'm worried I won't hit the IM Intake Pathway deadline. Is there any flexibility or can someone help me figure out a plan to catch up?",
    sage:
      "Marcus has not completed a session in 9 days and is approaching the end of IM Intake Pathway. Sage flagged a drop in engagement after Client relationships foundations. This is Marcus's first hand raised — no prior escalations on record.",
    actions: ["Agree catch-up plan", "Adjust deadline", "Send encouragement nudge"],
  },
  {
    id: "h5",
    name: "Ryan O'Brien",
    initials: "RO",
    cohort: "Medicare CSR Cohort A",
    priority: "medium",
    raised: "Raised 1 day ago",
    topic: "General check-in — not sure if on track, wants reassurance",
    message:
      "I'm not sure if I'm where I should be at this point. I've done all the reading but I haven't started the assessment yet. Am I behind? Just want to make sure I'm not missing something.",
    sage:
      "Ryan is at 38% completion — slightly behind the cohort average of 44% but not critically so. No failed assessments on record. This hand raised appears to be a confidence check rather than a performance issue. A brief reassuring response may be sufficient.",
    actions: ["Send reassurance message", "Share progress summary", "No action needed"],
  },
];

export const priorityMeta: Record<
  Priority,
  { label: string; chip: string; border: "warning" | "brand"; rank: number }
> = {
  critical: {
    label: "Critical",
    chip: "bg-destructive/10 text-destructive border-destructive/30",
    border: "warning",
    rank: 0,
  },
  high: {
    label: "High",
    chip: "bg-status-warning text-status-warning-fg border-status-warning-outline",
    border: "warning",
    rank: 1,
  },
  medium: {
    label: "Medium",
    chip: "bg-primary/10 text-primary border-primary/30",
    border: "brand",
    rank: 2,
  },
};

export const statusMeta: Record<Status, { label: string; chip: string }> = {
  open: { label: "Open", chip: "border-destructive/40 text-destructive" },
  in_progress: { label: "In Progress", chip: "border-status-warning-outline text-status-warning-fg" },
  resolved: {
    label: "Resolved",
    chip: "bg-success-dark/10 text-success-dark border-success-dark/30",
  },
};

export const initialStatuses: Record<string, Status> = {
  h1: "open",
  h2: "in_progress",
  h3: "open",
  h4: "open",
  h5: "open",
};

type ResolvedDemo = {
  id: string;
  name: string;
  initials: string;
  topic: string;
  when: string;
};

const resolvedRows: ResolvedDemo[] = [
  { id: "r1", name: "Priya Nair", initials: "PN", topic: "Module 2 question — eligibility rules", when: "Resolved 2 hours ago" },
  { id: "r2", name: "Sofia Reyes", initials: "SR", topic: "Assessment submission issue — unsure if saved", when: "Resolved 5 hours ago" },
  { id: "r3", name: "Aisha Patel", initials: "AP", topic: "Module 1 recap — wanted confirmation before moving on", when: "Resolved 8 hours ago" },
];

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
      {initials}
    </div>
  );
}

export default function HandsRaised() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(initialStatuses);
  const [composerOpen, setComposerOpen] = useState<string | null>(null);
  const [composerText, setComposerText] = useState("");
  const [confirmResolve, setConfirmResolve] = useState<string | null>(null);
  const [resolvedNow, setResolvedNow] = useState<Set<string>>(new Set());
  const [expandedResolved, setExpandedResolved] = useState<string | null>(null);
  const [cohort, setCohort] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("open");
  const [search, setSearch] = useState("");

  const openCount = Object.entries(statuses).filter(([, s]) => s === "open").length;
  const inProgressCount = Object.entries(statuses).filter(([, s]) => s === "in_progress").length;
  const resolvedTodayCount = 3 + resolvedNow.size;

  const ordered = useMemo(() => {
    return [...hands].sort((a, b) => {
      const sa = statuses[a.id];
      const sb = statuses[b.id];
      const ra = sa === "resolved" ? 1 : 0;
      const rb = sb === "resolved" ? 1 : 0;
      if (ra !== rb) return ra - rb;
      return priorityMeta[a.priority].rank - priorityMeta[b.priority].rank;
    });
  }, [statuses]);

  const openComposer = (id: string) => {
    setComposerOpen(id);
    setComposerText("");
    setConfirmResolve(null);
  };

  const sendResponse = (h: Hand) => {
    toast.success(`Response sent to ${h.name}`);
    setComposerOpen(null);
    setComposerText("");
    setStatuses((prev) =>
      prev[h.id] === "open" ? { ...prev, [h.id]: "in_progress" } : prev,
    );
  };

  const markInProgress = (h: Hand) => {
    setStatuses((prev) => ({ ...prev, [h.id]: "in_progress" }));
  };

  const startResolve = (id: string) => {
    setConfirmResolve(id);
    setComposerOpen(null);
  };

  const confirmResolveNow = (h: Hand) => {
    setStatuses((prev) => ({ ...prev, [h.id]: "resolved" }));
    setResolvedNow((prev) => new Set(prev).add(h.id));
    setConfirmResolve(null);
    toast.success(`${h.name}'s hand raised has been marked as resolved.`);
  };

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Hands Raised</h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Learners who have signalled they need help or have unresolved questions escalated
              from Sage. Review and take action before issues affect progress.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-56">
              <Select value={cohort} onValueChange={setCohort}>
                <SelectTrigger aria-label="Cohort filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cohorts</SelectItem>
                  <SelectItem value="a">Medicare CSR Cohort A</SelectItem>
                  <SelectItem value="b">Medicare CSR Cohort B</SelectItem>
                  <SelectItem value="q3">New Starter Cohort Q3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as "all" | Status)}
              >
                <SelectTrigger aria-label="Status filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-md border border-border bg-background p-4">
            <div className="text-xs tracking-wide text-muted-foreground">Open</div>
            <div className="mt-1 text-2xl font-bold text-destructive">{openCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Awaiting action</div>
          </div>
          <div className="rounded-md border border-border bg-background p-4">
            <div className="text-xs tracking-wide text-muted-foreground">In progress</div>
            <div className="mt-1 text-2xl font-bold text-status-warning-fg">{inProgressCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Being actioned</div>
          </div>
          <div className="rounded-md border border-border bg-background p-4">
            <div className="text-xs tracking-wide text-muted-foreground">
              Resolved today
            </div>
            <div className="mt-1 text-2xl font-bold text-success-dark">{resolvedTodayCount}</div>
            <div className="mt-1 text-xs text-muted-foreground">Closed in the last 24 hours</div>
          </div>
          <div className="rounded-md border border-border bg-background p-4">
            <div className="text-xs tracking-wide text-muted-foreground">
              Avg response time
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">1.4 hrs</div>
            <div className="mt-1 text-xs text-muted-foreground">Last 30 days</div>
          </div>
        </div>

        {/* Open & In Progress */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">Open & In Progress</h2>
            <div className="w-72">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by learner name or topic..."
              />
            </div>
          </div>

          <div className="space-y-3">
            {ordered.map((h) => {
              const status = statuses[h.id];
              const pm = priorityMeta[h.priority];
              const sm = statusMeta[status];

              if (status === "resolved") {
                return (
                  <div
                    key={h.id}
                    className="rounded-md border border-border bg-muted/40 px-4 py-3 flex flex-wrap items-center gap-3"
                  >
                    <Avatar initials={h.initials} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{h.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{h.topic}</div>
                    </div>
                    <Badge className={sm.chip} variant="outline">
                      <Check className="h-3 w-3 mr-1" aria-hidden />
                      Resolved
                    </Badge>
                    <span className="text-xs text-muted-foreground">Resolved just now</span>
                  </div>
                );
              }

              return (
                <LeftBorderCard key={h.id} borderVariant={pm.border}>
                  {/* Top row */}
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

                  {/* Topic */}
                  <div className="mt-3">
                    <div className="text-xs tracking-wide text-muted-foreground">
                      Topic
                    </div>
                    <div className="mt-1 text-sm font-medium text-foreground">{h.topic}</div>
                  </div>

                  {/* Learner message */}
                  <div className="mt-3 border-l-2 border-border bg-muted/40 px-3 py-2 rounded-sm">
                    <p className="text-sm text-muted-foreground italic">"{h.message}"</p>
                  </div>

                  {/* Sage context */}
                  <div className="mt-3">
                    <LeftBorderCard borderVariant="brand" padding="sm">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        <SageTag />
                        Sage context:
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{h.sage}</p>
                    </LeftBorderCard>
                  </div>

                  {/* Suggested actions */}
                  <div className="mt-3">
                    <div className="text-xs tracking-wide text-muted-foreground mb-2">
                      Suggested actions
                    </div>
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

                  {/* Action row */}
                  <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => openComposer(h.id)}>
                      Respond to learner
                    </Button>
                    {status === "open" && (
                      <Button size="sm" variant="secondary" onClick={() => markInProgress(h)}>
                        Mark in progress
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => startResolve(h.id)}
                      className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                    >
                      {status === "in_progress" ? "Mark resolved" : "Resolve"}
                    </button>
                  </div>

                  {/* Composer */}
                  {composerOpen === h.id && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs tracking-wide text-muted-foreground mb-2">
                        Your response
                      </div>
                      <Textarea
                        rows={4}
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                        placeholder={`Type your message to ${h.name} — this will appear in their Sage learning chat as a message from you...`}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        The learner will be notified and your message will appear in their Sage
                        conversation thread.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Button size="sm" onClick={() => sendResponse(h)}>
                          Send response
                        </Button>
                        <button
                          type="button"
                          onClick={() => setComposerOpen(null)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Resolve confirm */}
                  {confirmResolve === h.id && (
                    <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Mark this as resolved? The learner will not be notified automatically.
                      </span>
                      <Button size="sm" onClick={() => confirmResolveNow(h)}>
                        Yes, resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setConfirmResolve(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </LeftBorderCard>
              );
            })}
          </div>
        </section>

        {/* Recently resolved */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Recently Resolved</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hands raised closed in the last 24 hours
            </p>
          </div>

          <div className="space-y-2">
            {resolvedRows.map((r) => {
              const isOpen = expandedResolved === r.id;
              return (
                <div key={r.id} className="rounded-md border border-border bg-muted/40">
                  <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <Avatar initials={r.initials} />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm text-foreground font-medium">{r.name}</span>
                      <span className="text-sm text-muted-foreground"> · {r.topic}</span>
                    </div>
                    <Badge className={statusMeta.resolved.chip} variant="outline">
                      <Check className="h-3 w-3 mr-1" aria-hidden />
                      Resolved
                    </Badge>
                    <span className="text-xs text-muted-foreground">{r.when}</span>
                    <button
                      type="button"
                      onClick={() => setExpandedResolved(isOpen ? null : r.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      {isOpen ? "Hide detail" : "View detail"}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="text-xs tracking-wide text-muted-foreground">
                        Topic
                      </div>
                      <div className="text-sm text-foreground">{r.topic}</div>
                      <div className="pt-2 border-t border-border">
                        <button
                          type="button"
                          onClick={() => toast(`${r.name}'s hand raised re-opened`)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Re-open
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </PageContainer>
    </>
  );
}
