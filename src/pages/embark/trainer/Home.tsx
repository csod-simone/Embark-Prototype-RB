import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, RefreshCw,
  ArrowUp, Bell, GraduationCap,
} from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SageTag } from "@/components/embark/SageTag";
import { CohortPrimaryTrainer } from "@/components/embark/CohortPrimaryTrainer";
import { CohortFilterOption } from "@/components/embark/CohortFilterOption";
import { getTrainerLearnerStats } from "@/data/trainerLearners";
import { useTrainerFilters } from "@/hooks/use-trainer-filters";
import {
  TrainerFilterPanel,
  FilterCheckboxGroup,
  FilterDateRange,
} from "@/components/embark/trainer/TrainerFilterPanel";

// ---------- Reusable bits ----------

function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-muted text-foreground font-semibold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size <= 28 ? 11 : 12 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

type ChipTone = "warning" | "destructive" | "success" | "primary" | "muted";
function Chip({ tone, children }: { tone: ChipTone; children: React.ReactNode }) {
  const map: Record<ChipTone, string> = {
    warning: "bg-warning/15 text-warning-foreground dark:text-warning border-warning/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    success: "bg-success-dark/15 text-success-dark border-success-dark/30",
    primary: "bg-primary/15 text-primary border-primary/30",
    muted: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium", map[tone])}>
      {children}
    </span>
  );
}

function StatBox({
  label, value, tone = "default", sub,
}: { label: string; value: number | string; tone?: "default"|"warning"|"destructive"|"success"|"primary"; sub: string }) {
  const toneMap = {
    default: "text-foreground",
    warning: "text-warning-foreground dark:text-warning",
    destructive: "text-destructive",
    success: "text-success-dark",
    primary: "text-primary",
  };
  return (
    <div className="rounded-lg border border-border bg-background px-4 py-3">
      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-2xl font-bold leading-tight", toneMap[tone])}>{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function SectionHeading({
  title, sub, right,
}: { title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4 mt-10">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
      {right && <div className="flex items-center gap-3 flex-shrink-0">{right}</div>}
    </div>
  );
}

function SageBlock({ children, variant = "muted" }: { children: React.ReactNode; variant?: "muted"|"brand" }) {
  return (
    <div className={cn(
      "mt-3 rounded-md p-3 text-sm",
      variant === "brand" ? "bg-primary/5 border border-primary/20" : "bg-muted/60 border border-border",
    )}>
      <div className="flex items-start gap-2">
        <SageTag className="mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <span className="text-sm font-medium text-primary">Sage: </span>
          <span className="text-sm text-muted-foreground">{children}</span>
        </div>
      </div>
    </div>
  );
}

// ---------- At-Risk data ----------

type AtRisk = {
  id: string;
  initials: string; name: string; cohort: string;
  chip: { tone: ChipTone; label: string };
  details: { icon: string; text: string }[];
  sage: string;
  secondary: { label: string; onClick: () => void };
};

// ---------- Escalation data ----------

type Escalation = {
  id: string; initials: string; name: string; cohort: string;
  ago: string; question: string; sageAnswer: string;
  thread: { role: "learner"|"sage"; text: string }[];
  status: "open" | "resolved";
  resolvedAt?: string;
};

const initialEscalations: Escalation[] = [
  {
    id: "esc-tom-1", initials: "TH", name: "Tom Hartley", cohort: "Medicare CSR Cohort A", ago: "3 days ago",
    question: "If a Medicare Advantage member receives emergency care out of network, and the claim is denied, what is the exact appeals process timeline and who is responsible for initiating it — the member or the plan?",
    sageAnswer: "Sage provided a general overview of Medicare Advantage appeals timelines but flagged uncertainty around plan-specific variations and member vs. plan initiation responsibilities. Confidence score: 52%. Sage escalated to avoid providing potentially incorrect compliance guidance.",
    thread: [
      { role: "learner", text: "I've been reading through the appeals module but I'm confused about who actually kicks off the process" },
      { role: "sage", text: "Great question — in most cases the member or their representative initiates the appeal within 60 days of the adverse decision. However plan-specific timelines can vary..." },
      { role: "learner", text: "But what if the member doesn't know they have the right to appeal?" },
      { role: "sage", text: "That's where the plan's Notice of Denial plays a role — the plan is required to include appeal rights in the denial notice. Let me check the specific COB rules for your plan..." },
      { role: "sage", text: "I want to make sure I give you accurate guidance on this one — I'm going to flag this for your trainer to confirm the specifics." },
    ],
    status: "open",
  },
  {
    id: "esc-jordan-1", initials: "JK", name: "Jordan Kim", cohort: "Medicare CSR Cohort A", ago: "5 days ago",
    question: "The module says coordination of benefits follows a specific order but I don't understand how to apply it when a member has both Medicare and Medicaid. Which pays first and are there exceptions?",
    sageAnswer: "Sage outlined the general Medicare-Medicaid COB rule (Medicare primary, Medicaid secondary) but flagged that Dual Eligible Special Needs Plan (D-SNP) variations and state-specific Medicaid rules create exceptions it could not confirm with confidence. Confidence score: 48%.",
    thread: [
      { role: "learner", text: "Which pays first — Medicare or Medicaid — when a member is dual eligible?" },
      { role: "sage", text: "Generally Medicare is primary and Medicaid is secondary, but D-SNP and state Medicaid variations may apply — flagging for trainer confirmation." },
    ],
    status: "open",
  },
  {
    id: "esc-aisha-1", initials: "AP", name: "Aisha Patel", cohort: "Medicare CSR Cohort B", ago: "6 days ago",
    question: "What happens if a prior authorisation is approved but then the member's plan changes mid-year? Does the auth transfer or does the member need to reapply?",
    sageAnswer: "Sage advised that prior authorisations are generally plan-specific and may not transfer following a plan change, but could not confirm the exact reapplication process or whether mid-year exceptions apply for continuity of care. Confidence score: 44%.",
    thread: [
      { role: "learner", text: "If the member changes plans mid-year, does their prior auth still apply?" },
      { role: "sage", text: "Prior auths are typically plan-specific, so the member may need to reapply — but continuity-of-care exceptions may exist. I'll flag this for your trainer." },
    ],
    status: "open",
  },
  {
    id: "esc-tom-2", initials: "TH", name: "Tom Hartley", cohort: "Medicare CSR Cohort A", ago: "8 days ago",
    question: "If a member calls to dispute a claim and I realise mid-call that it involves a COB situation I haven't seen before, what are my escalation options in the system and what do I tell the member while I'm resolving it?",
    sageAnswer: "Sage provided standard call-handling and hold guidance but was unable to confirm the specific internal escalation workflow or approved member-facing language for complex COB disputes. Confidence score: 39%. Escalated to avoid non-compliant member guidance.",
    thread: [
      { role: "learner", text: "What do I say to the member while I figure out a COB dispute mid-call?" },
      { role: "sage", text: "General hold guidance applies, but I can't confirm the approved member-facing language for complex COB — flagging for trainer." },
    ],
    status: "open",
  },
  {
    id: "esc-leon-1", initials: "LM", name: "Leon Müller", cohort: "Medicare CSR Cohort A", ago: "9 days ago",
    question: "The assessment question asked about the difference between a coverage determination and an appeal. I got it wrong and I still don't really understand the difference — can you explain it more clearly than the module did?",
    sageAnswer: "Sage provided a definition of both terms but flagged that the learner's follow-up questions indicated the module explanation may itself be insufficient. Confidence score: 61%. Escalated because the issue may require content review rather than a simple answer.",
    thread: [
      { role: "learner", text: "What's the actual difference between a coverage determination and an appeal?" },
      { role: "sage", text: "A coverage determination is the initial decision; an appeal challenges it. Your follow-ups suggest the module explanation may be unclear — flagging for trainer." },
    ],
    status: "open",
  },
];

// ---------- Nudge data ----------

type NudgeType = "Check-in" | "Encouragement" | "Deadline reminder" | "Re-engagement";
type NudgeStatus = "pending" | "editing" | "suppressed" | "removing";
type Nudge = {
  id: string; initials: string; learner: string; cohort: string;
  type: NudgeType; scheduled: string; message: string; status: NudgeStatus;
};

const initialNudges: Nudge[] = [
  { id: "n1", initials: "JK", learner: "Jordan Kim", cohort: "Medicare CSR Cohort A",
    type: "Re-engagement", scheduled: "Today at 2:00 PM",
    message: "Hey Jordan — we noticed you haven't logged a session in a little while. Module 3 is a big one and we want to make sure you feel supported. What's getting in the way? Let's figure it out together.",
    status: "pending" },
  { id: "n2", initials: "LM", learner: "Leon Müller", cohort: "Medicare CSR Cohort A",
    type: "Encouragement", scheduled: "Today at 4:00 PM",
    message: "Hi Leon — we know Module 3 has been challenging. Lots of learners find Coverage Determination tricky at first. You've got this — want to try the practice scenario again before your next attempt?",
    status: "pending" },
  { id: "n3", initials: "RO", learner: "Ryan O'Brien", cohort: "Medicare CSR Cohort A",
    type: "Re-engagement", scheduled: "Tomorrow at 9:00 AM",
    message: "Hi Ryan — it's been a couple of weeks and we want to check in. No pressure — just let us know how you're going and if there's anything we can do to help you get back on track.",
    status: "pending" },
  { id: "n4", initials: "TH", learner: "Tom Hartley", cohort: "Medicare CSR Cohort A",
    type: "Check-in", scheduled: "Tomorrow at 11:00 AM",
    message: "Hey Tom — you've had a few questions flagged for trainer review. Your trainer is on it and will be in touch shortly. In the meantime, the Module 3 recap might help — want me to pull it up?",
    status: "pending" },
  { id: "n5", initials: "MW", learner: "Marcus Webb", cohort: "Medicare CSR Cohort A",
    type: "Deadline reminder", scheduled: "In 2 days at 9:00 AM",
    message: "Hi Marcus — just a reminder that your Module 3 completion is due on 10 August. You're at 35% — a couple of focused sessions this week should get you there. You've done great work on earlier modules.",
    status: "pending" },
  { id: "n6", initials: "DO", learner: "Dana Osei", cohort: "New Starter Cohort Q3",
    type: "Check-in", scheduled: "In 3 days at 10:00 AM",
    message: "Hi Dana — your cohort kicks off on 1 September and we're looking forward to having you. Your personalised journey is being prepared based on your background. Any questions before you start?",
    status: "pending" },
];

const nudgeToneMap: Record<NudgeType, ChipTone> = {
  "Check-in": "primary",
  "Encouragement": "success",
  "Deadline reminder": "warning",
  "Re-engagement": "destructive",
};

// ---------- Graduation data ----------

type Decision = null | "approve" | "soft" | "flag";
type Grad = {
  id: string; initials: string; name: string; cohort: string;
  readinessChip: { tone: ChipTone; label: string };
  signals: { tone: "success"|"warning"; label: string }[];
  evidence: [string, string][];
  sageVariant: "brand" | "warning";
  sage: string;
  decision: Decision;
  decidedAt?: string;
  notes: string;
};

const initialGrads: Grad[] = [
  {
    id: "g-priya", initials: "PN", name: "Priya Nair", cohort: "Medicare CSR Cohort B",
    readinessChip: { tone: "success", label: "Ready — Approve to proceed" },
    signals: [
      { tone: "success", label: "✓ 100% journey complete" },
      { tone: "success", label: "✓ Avg score: 91%" },
      { tone: "success", label: "✓ All assessments passed" },
      { tone: "success", label: "✓ 0 open escalations" },
      { tone: "success", label: "✓ Consistent engagement" },
    ],
    evidence: [
      ["Journey completion", "100%"],
      ["Module assessment scores", "M1: 88% · M2: 94% · M3: 91%"],
      ["Assessment attempts", "All first attempt"],
      ["Escalations", "0 unresolved"],
      ["Coaching sessions", "1 completed (optional stretch session)"],
      ["Last active", "Today"],
      ["Engagement trend", "Consistently high throughout journey"],
    ],
    sageVariant: "brand",
    sage: "Priya has met all programme completion criteria and performance thresholds. Assessment scores are above the cohort average at every module. Sage recommends approval to production. No soft landing or additional practice indicators are present.",
    decision: null, notes: "",
  },
  {
    id: "g-sofia", initials: "SR", name: "Sofia Reyes", cohort: "Medicare CSR Cohort B",
    readinessChip: { tone: "warning", label: "Ready — Review recommended" },
    signals: [
      { tone: "success", label: "✓ 100% journey complete" },
      { tone: "success", label: "✓ Avg score: 84%" },
      { tone: "warning", label: "⚠ Module 2 score: 69% (borderline)" },
      { tone: "success", label: "✓ All assessments passed" },
      { tone: "success", label: "✓ 1 resolved escalation" },
    ],
    evidence: [
      ["Journey completion", "100%"],
      ["Module assessment scores", "M1: 91% · M2: 69% · M3: 92%"],
      ["Assessment attempts", "M2: 2 attempts"],
      ["Escalations", "1 resolved"],
      ["Coaching sessions", "0"],
      ["Last active", "Yesterday"],
      ["Engagement trend", "Strong, minor dip at Module 2"],
    ],
    sageVariant: "brand",
    sage: "Sofia has completed the full journey and scores are generally strong. The Module 2 borderline score (69% on second attempt) is noted but not disqualifying. Sage recommends approval to production with an optional check-in at 30 days. A soft landing may be considered if the trainer has concerns about Eligibility & Enrolment knowledge in live scenarios.",
    decision: null, notes: "",
  },
  {
    id: "g-chloe", initials: "CN", name: "Chloe Nguyen", cohort: "Medicare CSR Cohort B",
    readinessChip: { tone: "warning", label: "Review needed — not fully ready" },
    signals: [
      { tone: "success", label: "✓ Journey complete" },
      { tone: "warning", label: "⚠ Avg score: 77%" },
      { tone: "warning", label: "⚠ Module 3 score: 71% (second attempt)" },
      { tone: "success", label: "✓ No open escalations" },
      { tone: "warning", label: "⚠ Engagement dip — last 2 weeks" },
    ],
    evidence: [
      ["Journey completion", "100%"],
      ["Module assessment scores", "M1: 82% · M2: 78% · M3: 71%"],
      ["Assessment attempts", "M3: 2 attempts"],
      ["Escalations", "0 unresolved"],
      ["Coaching sessions", "0"],
      ["Last active", "2 days ago"],
      ["Engagement trend", "Declining in final 2 weeks of journey"],
    ],
    sageVariant: "warning",
    sage: "Chloe has completed the journey but her Module 3 score on second attempt (71%) and declining engagement in the final two weeks suggest she may not be fully confident in Coverage Determination and COB rules. Sage recommends a soft landing with supervised practice on live calls, or a targeted coaching session before production sign-off.",
    decision: null, notes: "",
  },
];

// ---------- Page ----------

export default function TrainerHome() {
  const filters = useTrainerFilters();
  const { cohortAllowed, progressAllowed } = filters;
  const [escalations, setEscalations] = useState<Escalation[]>(initialEscalations);
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});
  const [nudges, setNudges] = useState<Nudge[]>(initialNudges);
  const [editingMsg, setEditingMsg] = useState<Record<string, string>>({});
  const [grads, setGrads] = useState<Grad[]>(initialGrads);

  const escalationRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scopedEscalations = escalations.filter((e) => cohortAllowed(e.cohort));
  const learnerStats = getTrainerLearnerStats(cohortAllowed);
  const scopedNudges = nudges.filter((n) => cohortAllowed(n.cohort));
  const scopedGrads = grads
    .filter((g) => cohortAllowed(g.cohort))
    .filter(() => progressAllowed("Completed"));

  const openEscalations = scopedEscalations.filter((e) => e.status === "open");
  const pendingNudges = scopedNudges.filter((n) => n.status !== "suppressed" && n.status !== "removing").length;
  const readyToGraduate = scopedGrads.filter((g) => g.decision === null).length;

  const scrollToLearner = (name: string) => {
    const target = escalations.find((e) => e.status === "open" && e.name === name);
    if (target) {
      escalationRefs.current[target.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      toast(`No open escalations for ${name}`);
    }
  };

  // ---- At-Risk cards ----
  const allAtRiskCards: AtRisk[] = [
    {
      id: "jordan-kim",
      initials: "JK", name: "Jordan Kim", cohort: "Medicare CSR Cohort A",
      chip: { tone: "warning", label: "Behind Pace" },
      details: [
        { icon: "📉", text: "38% complete — 12% behind cohort average" },
        { icon: "📅", text: "Last session: 9 days ago" },
      ],
      sage: "Jordan has not completed a session in 9 days and missed the Module 3 checkpoint. At current pace, completion by 30 Sep is unlikely without intervention.",
      secondary: { label: "Escalate", onClick: () => toast("Escalation raised") },
    },
    {
      id: "leon-muller",
      initials: "LM", name: "Leon Müller", cohort: "Medicare CSR Cohort A",
      chip: { tone: "destructive", label: "Low Score" },
      details: [
        { icon: "📝", text: "Module 3 assessment: 54% (2 attempts)" },
        { icon: "📅", text: "Last session: 11 days ago" },
      ],
      sage: "Leon has scored below 65% on two Module 3 attempts, with consistent errors on Coverage Determination. Sage has paused auto-progression pending trainer review.",
      secondary: { label: "Assign coaching", onClick: () => toast("Coaching assignment coming soon") },
    },
    {
      id: "tom-hartley",
      initials: "TH", name: "Tom Hartley", cohort: "Medicare CSR Cohort A",
      chip: { tone: "destructive", label: "Repeated Escalation" },
      details: [
        { icon: "❗", text: "3 unresolved escalations in 14 days" },
        { icon: "💬", text: "Topics: Prior Auth, COB rules, Appeals process" },
      ],
      sage: "Tom has escalated 3 questions in 14 days that Sage could not resolve with confidence. The pattern suggests a foundational gap in Medicare Advantage rules rather than isolated queries. A structured 1:1 session is recommended.",
      secondary: { label: "View escalations", onClick: () => scrollToLearner("Tom Hartley") },
    },
    {
      id: "ryan-obrien",
      initials: "RO", name: "Ryan O'Brien", cohort: "Medicare CSR Cohort A",
      chip: { tone: "muted", label: "Inactive" },
      details: [
        { icon: "😴", text: "No activity in 14 days" },
        { icon: "📊", text: "38% complete — previously on track" },
      ],
      sage: "Ryan was on track until 2 weeks ago when activity stopped entirely. No escalations or messages received. This pattern may indicate external factors — a direct outreach from you is recommended before automated nudging continues.",
      secondary: { label: "Suppress nudges", onClick: () => toast("Nudges suppressed for Ryan O'Brien") },
    },
  ];

  const atRiskCards = allAtRiskCards
    .filter((c) => cohortAllowed(c.cohort))
    .filter(() => progressAllowed("At risk"));

  const markResolved = (id: string) => {
    setEscalations((prev) =>
      prev.map((e) => e.id === id ? { ...e, status: "resolved" as const, resolvedAt: "just now" } : e)
    );
    toast.success("Escalation marked as resolved");
  };

  const markAllResolved = () => {
    setEscalations((prev) =>
      prev.map((e) => e.status === "open" ? { ...e, status: "resolved" as const, resolvedAt: "just now" } : e)
    );
    toast.success("All escalations marked as resolved");
  };

  const resolved = escalations.filter((e) => e.status === "resolved");

  // ---- Nudge handlers ----
  const startEdit = (n: Nudge) => {
    setEditingMsg((prev) => ({ ...prev, [n.id]: n.message }));
    setNudges((prev) => prev.map((x) => x.id === n.id ? { ...x, status: "editing" as const } : x));
  };
  const saveEdit = (id: string) => {
    setNudges((prev) => prev.map((x) => x.id === id ? { ...x, message: editingMsg[id] ?? x.message, status: "pending" as const } : x));
    toast.success("Nudge updated");
  };
  const cancelEdit = (id: string) => {
    setNudges((prev) => prev.map((x) => x.id === id ? { ...x, status: "pending" as const } : x));
  };
  const suppressNudge = (id: string) => {
    setNudges((prev) => prev.map((x) => x.id === id ? { ...x, status: "suppressed" as const } : x));
  };
  const undoSuppress = (id: string) => {
    setNudges((prev) => prev.map((x) => x.id === id ? { ...x, status: "pending" as const } : x));
  };
  const sendNow = (n: Nudge) => {
    setNudges((prev) => prev.map((x) => x.id === n.id ? { ...x, status: "removing" as const } : x));
    toast.success(`Nudge sent to ${n.learner}`);
    setTimeout(() => {
      setNudges((prev) => prev.filter((x) => x.id !== n.id));
    }, 350);
  };

  // ---- Graduation handlers ----
  const decide = (id: string, decision: Exclude<Decision, null>) => {
    setGrads((prev) => prev.map((g) => g.id === id ? { ...g, decision, decidedAt: "just now" } : g));
    const map = { approve: "Approved to production", soft: "Soft landing recommended", flag: "Flagged for additional practice" };
    toast.success(map[decision]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">

      <div className="flex-1 overflow-y-auto">
        <PageContainer as="div" className="py-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-foreground">Trainer Workspace</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your unified view of learner progress, risk signals, escalations, nudges, and graduation readiness.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <TrainerFilterPanel
                active={filters.active}
                onClear={filters.clear}
                sections={[
                  {
                    title: "Cohort",
                    content: (
                      <>
                        <FilterCheckboxGroup
                          idPrefix="tw-cohort"
                          label="Cohort"
                          options={filters.cohortOptions}
                          selected={filters.cohorts}
                          onToggle={filters.toggleCohort}
                          renderOption={(c) => <CohortFilterOption cohort={c} />}
                        />
                        {filters.primaryTrainerOptions.length > 0 && (
                          <FilterCheckboxGroup
                            idPrefix="tw-primary-trainer"
                            label="Primary trainer"
                            options={filters.primaryTrainerOptions}
                            selected={filters.primaryTrainers}
                            onToggle={filters.togglePrimaryTrainer}
                          />
                        )}
                        <FilterDateRange
                          label="Journey start date"
                          value={filters.journeyStart}
                          onChange={filters.setJourneyStart}
                        />
                        <FilterDateRange
                          label="Journey end date"
                          value={filters.journeyEnd}
                          onChange={filters.setJourneyEnd}
                        />
                        <FilterCheckboxGroup
                          idPrefix="tw-status"
                          label="Cohort status"
                          options={filters.statusOptions}
                          selected={filters.statuses}
                          onToggle={filters.toggleStatus}
                        />
                      </>
                    ),
                  },
                  {
                    title: "Learners",
                    content: (
                      <FilterCheckboxGroup
                        idPrefix="tw-progress"
                        label="Learner progress status"
                        options={["Not started", "In progress", "At risk", "Completed"]}
                        selected={filters.progress}
                        onToggle={filters.toggleProgress}
                      />
                    ),
                  },
                  {
                    title: "Content",
                    content: (
                      <FilterCheckboxGroup
                        idPrefix="tw-topic"
                        label="Topic"
                        options={filters.topicOptions}
                        selected={filters.topics}
                        onToggle={filters.toggleTopic}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* Section 1: Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatBox label="MY LEARNERS" value={learnerStats.total} sub="Across active cohorts" />
            <StatBox label="AT RISK" value={learnerStats.needAttention} tone="warning" sub="Require attention" />
            <StatBox label="Open escalations" value={openEscalations.length} tone="destructive" sub="Unresolved learner questions" />
            <StatBox label="Nudges pending review" value={pendingNudges} tone="primary" sub="Scheduled agent nudges to review" />
            <StatBox label="Ready to graduate" value={readyToGraduate} tone="success" sub="Awaiting your approval" />
          </div>

          {/* Quick access chips */}
          <div className="mt-6 flex flex-row items-center gap-2 flex-wrap md:flex-nowrap">
            {[
              { id: "at-risk-learners", label: "At-Risk Learners", Icon: AlertTriangle },
              { id: "escalation-queue", label: "Escalation Queue", Icon: ArrowUp },
              { id: "nudge-management", label: "Nudge Management", Icon: Bell },
              { id: "graduation-readiness", label: "Graduation Readiness", Icon: GraduationCap },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-label={`Jump to ${label} section`}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {/* Section 2: At-Risk */}
          <div id="at-risk-learners">
          <SectionHeading
            title="At-Risk Learners"
            sub="Learners flagged by Sage based on pace, scores, engagement, and escalation patterns"
            right={<Link to="/trainer/learners" className="text-sm text-primary hover:underline">View all learners →</Link>}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {atRiskCards.length === 0 ? (
              <p className="text-sm text-muted-foreground">No at-risk learners in your secondary trainer assignments.</p>
            ) : atRiskCards.map((c) => (
              <LeftBorderCard key={c.name} borderVariant="warning">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={c.initials} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.cohort}</div>
                      <CohortPrimaryTrainer cohort={c.cohort} />
                    </div>
                  </div>
                  <Chip tone={c.chip.tone}>{c.chip.label}</Chip>
                </div>
                <div className="mt-3 space-y-1">
                  {c.details.map((d, i) => (
                    <div key={i} className="text-sm text-muted-foreground">
                      <span className="mr-1.5">{d.icon}</span>{d.text}
                    </div>
                  ))}
                </div>
                <SageBlock>{c.sage}</SageBlock>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Nudge sent to ${c.name}`)}>Send nudge</Button>
                  <Button size="sm" variant="outline" onClick={c.secondary.onClick}>{c.secondary.label}</Button>
                  <Link to={`/trainer/learner/${c.id}`} className="ml-auto text-sm text-primary hover:underline">View profile →</Link>
                </div>
              </LeftBorderCard>
            ))}
          </div>
          </div>

          {/* Section 3: Escalation Queue */}
          <div id="escalation-queue">
          <SectionHeading
            title="Escalation Queue"
            sub="Unresolved learner questions Sage could not answer with sufficient confidence — full conversation context included"
            right={
              <>
                <Chip tone="destructive">{openEscalations.length} open</Chip>
                <button type="button" onClick={markAllResolved} className="text-sm text-muted-foreground hover:underline">Mark all resolved</button>
              </>
            }
          />
          <div className="space-y-4">
            {openEscalations.map((e) => {
              const expanded = expandedThreads[e.id];
              return (
                <div
                  key={e.id}
                  ref={(el) => { escalationRefs.current[e.id] = el; }}
                  className="rounded-lg border border-border bg-background p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar initials={e.initials} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{e.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{e.cohort}</div>
                        <CohortPrimaryTrainer cohort={e.cohort} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Chip tone="destructive">Open</Chip>
                      <span className="text-xs text-muted-foreground">Escalated {e.ago}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1.5">Learner question</div>
                    <p className="text-sm text-foreground">{e.question}</p>
                  </div>

                  <div className="mt-4">
                    <LeftBorderCard borderVariant="warning">
                      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1.5">Sage response — low confidence</div>
                      <p className="text-sm text-muted-foreground">{e.sageAnswer}</p>
                    </LeftBorderCard>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setExpandedThreads((p) => ({ ...p, [e.id]: !p[e.id] }))}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {expanded ? "Hide" : "Show"} conversation context {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {expanded && (
                      <div className="mt-2 max-h-[200px] overflow-y-auto rounded-md border border-border bg-muted/30 p-3 space-y-2">
                        {e.thread.map((m, i) => (
                          <div key={i} className="text-sm">
                            <span className={cn("font-medium mr-1.5", m.role === "sage" ? "text-primary" : "text-foreground")}>
                              {m.role === "sage" ? "Sage:" : `${e.name.split(" ")[0]}:`}
                            </span>
                            <span className="text-muted-foreground">{m.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1.5">Your response</div>
                    <Textarea rows={3} placeholder={`Type your response to ${e.name.split(" ")[0]} — this will be sent directly in the learning chat...`} />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Your response will appear in the learner's Sage chat as a trainer message. {e.name.split(" ")[0]} will be notified.
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 flex-wrap">
                    <Button size="sm" onClick={() => toast.success(`Response sent to ${e.name}`)}>Send response</Button>
                    <Button size="sm" variant="outline" onClick={() => markResolved(e.id)}>Mark resolved</Button>
                    <button type="button" onClick={() => toast("Escalation raised with manager")} className="ml-auto text-sm text-muted-foreground hover:underline">
                      Escalate to manager
                    </button>
                  </div>
                </div>
              );
            })}

            {resolved.map((e) => (
              <div key={e.id} className="rounded-lg border border-border bg-muted/30 p-3 flex items-center gap-3">
                <Avatar initials={e.initials} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{e.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{e.question}</div>
                </div>
                <Chip tone="success">✓ Resolved</Chip>
                <span className="text-xs text-muted-foreground flex-shrink-0">Resolved {e.resolvedAt}</span>
              </div>
            ))}
          </div>
          </div>

          {/* Section 4: Nudge Management */}
          <div id="nudge-management">
          <SectionHeading
            title="Nudge Management"
            sub="Review agent-scheduled nudges before they send. Adjust messaging, suppress where direct outreach is more appropriate, or trigger manual nudges."
            right={<Chip tone="primary">{pendingNudges} pending</Chip>}
          />
          <div className="space-y-2">
            {scopedNudges.length === 0 ? (
              <p className="text-sm text-muted-foreground">No nudges scheduled for your secondary trainer assignments.</p>
            ) : scopedNudges.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "rounded-lg border border-border bg-background p-3 transition-opacity duration-300",
                  n.status === "removing" && "opacity-0",
                )}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0" style={{ minWidth: 180 }}>
                    <Avatar initials={n.initials} size={28} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{n.learner}</div>
                      <div className="text-xs text-muted-foreground truncate">{n.cohort}</div>
                      <CohortPrimaryTrainer cohort={n.cohort} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <Chip tone={nudgeToneMap[n.type]}>{n.type}</Chip>
                      <span className="text-xs text-muted-foreground">Scheduled: {n.scheduled}</span>
                    </div>
                    <div className="text-sm text-muted-foreground italic truncate">{n.message}</div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {n.status === "pending" && (
                      <>
                        <button type="button" onClick={() => startEdit(n)} className="text-sm text-primary hover:underline">Edit</button>
                        <button type="button" onClick={() => suppressNudge(n.id)} className="text-sm text-muted-foreground hover:underline">Suppress</button>
                        <Button size="sm" variant="outline" onClick={() => sendNow(n)}>Send now</Button>
                      </>
                    )}
                    {n.status === "suppressed" && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground italic">Suppressed — you'll handle this directly</span>
                        <button type="button" onClick={() => undoSuppress(n.id)} className="text-sm text-muted-foreground hover:underline">Undo</button>
                      </div>
                    )}
                  </div>
                </div>

                {n.status === "editing" && (
                  <div className="mt-3">
                    <Textarea
                      rows={3}
                      value={editingMsg[n.id] ?? n.message}
                      onChange={(e) => setEditingMsg((p) => ({ ...p, [n.id]: e.target.value }))}
                    />
                    <div className="mt-2 flex items-center gap-3">
                      <Button size="sm" onClick={() => saveEdit(n.id)}>Save changes</Button>
                      <button type="button" onClick={() => cancelEdit(n.id)} className="text-sm text-muted-foreground hover:underline">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">Need to reach out to a learner directly?</span>
            <Button size="sm" variant="outline" onClick={() => toast("Nudge composer coming soon")}>Compose nudge</Button>
          </div>
          </div>

          {/* Section 5: Graduation */}
          <div id="graduation-readiness">
          <SectionHeading
            title="Graduation Readiness"
            sub="Sage surfaces readiness signals for each learner. Review the evidence, then approve advancement to production, recommend a soft landing, or flag for additional practice."
            right={<Chip tone="success">{readyToGraduate} ready for review</Chip>}
          />
          <div className="space-y-4">
            {scopedGrads.length === 0 ? (
              <p className="text-sm text-muted-foreground">No learners awaiting graduation review in your secondary trainer assignments.</p>
            ) : scopedGrads.map((g) => (
              <div
                key={g.id}
                className={cn(
                  "rounded-lg border border-border bg-background p-5",
                  g.decision === "approve" && "bg-success-dark/5",
                  g.decision === "soft" && "bg-warning/5",
                  g.decision === "flag" && "bg-destructive/5",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={g.initials} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">{g.name}</div>
                      <div className="text-xs text-muted-foreground">{g.cohort}</div>
                      <CohortPrimaryTrainer cohort={g.cohort} />
                    </div>
                  </div>
                  <Chip tone={g.readinessChip.tone}>{g.readinessChip.label}</Chip>
                </div>

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  {g.signals.map((s, i) => (
                    <Chip key={i} tone={s.tone === "success" ? "success" : "warning"}>{s.label}</Chip>
                  ))}
                </div>

                <div className="mt-4">
                  <Table>
                    <TableBody>
                      {g.evidence.map(([k, v]) => (
                        <TableRow key={k}>
                          <TableCell className="text-xs text-muted-foreground py-2 w-[40%]">{k}</TableCell>
                          <TableCell className="text-sm text-foreground py-2">{v}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4">
                  <LeftBorderCard borderVariant={g.sageVariant}>
                    <div className="flex items-start gap-2">
                      <SageTag className="mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-primary">Sage recommendation:</div>
                        <p className="text-sm text-muted-foreground mt-1">{g.sage}</p>
                      </div>
                    </div>
                  </LeftBorderCard>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  {g.decision === null ? (
                    <>
                      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-2">Your decision</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button size="sm" onClick={() => decide(g.id, "approve")}>Approve — advance to production</Button>
                        <Button size="sm" variant="outline" onClick={() => decide(g.id, "soft")}>Soft landing — supervised practice</Button>
                        <Button
                          size="sm" variant="outline"
                          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => decide(g.id, "flag")}
                        >
                          Flag — additional practice needed
                        </Button>
                      </div>
                      <Textarea
                        rows={2}
                        className="mt-3"
                        placeholder="Add any notes for the record — optional"
                        value={g.notes}
                        onChange={(ev) => setGrads((prev) => prev.map((x) => x.id === g.id ? { ...x, notes: ev.target.value } : x))}
                      />
                    </>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        {g.decision === "approve" && (
                          <><CheckCircle2 size={16} className="text-success-dark" /><span className="text-sm font-medium text-success-dark">Approved — advancing to production</span></>
                        )}
                        {g.decision === "soft" && (
                          <><RefreshCw size={16} className="text-warning-foreground dark:text-warning" /><span className="text-sm font-medium text-warning-foreground dark:text-warning">Soft landing recommended — supervised practice</span></>
                        )}
                        {g.decision === "flag" && (
                          <><AlertTriangle size={16} className="text-destructive" /><span className="text-sm font-medium text-destructive">Flagged — additional practice required</span></>
                        )}
                        <span className="text-xs text-muted-foreground ml-2">Decided {g.decidedAt}</span>
                      </div>
                      {g.notes.trim() && (
                        <div className="mt-2 rounded-md border border-border bg-muted/30 p-3">
                          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1">Notes</div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{g.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
