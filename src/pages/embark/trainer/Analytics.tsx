import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowUp, BarChart3, ClipboardCheck, Search, Target, Users } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { CohortPrimaryTrainer } from "@/components/embark/CohortPrimaryTrainer";
import { CohortFilterOption } from "@/components/embark/CohortFilterOption";
import { SageTag } from "@/components/embark/SageTag";
import { useTrainerFilters } from "@/hooks/use-trainer-filters";
import {
  TrainerFilterPanel,
  FilterCheckboxGroup,
  FilterDateRange,
} from "@/components/embark/trainer/TrainerFilterPanel";

type Risk = "On Track" | "At Risk" | "Critical" | "Not Started";

const LEARNER_PAGE_SIZE = 10;


type LearnerRow = {
  id: string;
  name: string;
  cohort: string;
  completion: number;
  avgScore: number | null;
  risk: Risk;
  lastActive: string | null;
};

const cohortBars = [
  { name: "Medicare CSR Cohort A", pct: 38 },
  { name: "Medicare CSR Cohort B", pct: 52 },
];

const riskSegments = [
  { key: "on-track", label: "On Track", count: 29, pct: 69, bar: "bg-success", dot: "bg-success" },
  { key: "at-risk", label: "At Risk", count: 8, pct: 19, bar: "bg-warning", dot: "bg-warning" },
  { key: "critical", label: "Critical", count: 5, pct: 12, bar: "bg-destructive", dot: "bg-destructive" },
];

const cohortRiskBreakdown = [
  {
    cohort: "Medicare CSR Cohort A",
    segments: [
      { dot: "bg-success", count: "14" },
      { dot: "bg-warning", count: "5" },
      { dot: "bg-destructive", count: "3" },
    ],
  },
  {
    cohort: "Medicare CSR Cohort B",
    segments: [
      { dot: "bg-success", count: "15" },
      { dot: "bg-warning", count: "3" },
      { dot: "bg-destructive", count: "1" },
    ],
  },
];

const monthlyTrend = [
  { period: "Feb 26", cohortA: 0, cohortB: 0 },
  { period: "Mar 26", cohortA: 5, cohortB: 0 },
  { period: "Apr 26", cohortA: 12, cohortB: 8 },
  { period: "May 26", cohortA: 20, cohortB: 18 },
  { period: "Jun 26", cohortA: 29, cohortB: 34 },
  { period: "Jul 26", cohortA: 38, cohortB: 47 },
  { period: "Aug 26", cohortA: 38, cohortB: 52 },
];

const weeklyTrend = [
  { period: "W1 Jul", cohortA: 29, cohortB: 34 },
  { period: "W2 Jul", cohortA: 32, cohortB: 39 },
  { period: "W3 Jul", cohortA: 35, cohortB: 44 },
  { period: "W4 Jul", cohortA: 38, cohortB: 47 },
  { period: "W1 Aug", cohortA: 38, cohortB: 50 },
  { period: "W2 Aug", cohortA: 38, cohortB: 52 },
];

type ModuleRow = {
  module: string;
  cohort: string;
  avgScore: number | null;
  submissions: number;
  below65: number | null;
};

const modules: ModuleRow[] = [
  { module: "Module 1: Medicare Foundations", cohort: "Medicare CSR Cohort A + Medicare CSR Cohort B", avgScore: 83, submissions: 38, below65: 2 },
  { module: "Module 2: Eligibility & Enrolment", cohort: "Medicare CSR Cohort A + Medicare CSR Cohort B", avgScore: 79, submissions: 36, below65: 4 },
  { module: "Module 3: Coverage Determination & COB", cohort: "Medicare CSR Cohort A + Medicare CSR Cohort B", avgScore: 66, submissions: 28, below65: 8 },
  { module: "Module 4: Claims & Billing", cohort: "Medicare CSR Cohort A + Medicare CSR Cohort B", avgScore: null, submissions: 0, below65: null },
];

const learners: LearnerRow[] = [
  { id: "jordan-kim", name: "Jordan Kim", cohort: "Medicare CSR Cohort A", completion: 28, avgScore: 58, risk: "Critical", lastActive: "9 days ago" },
  { id: "priya-nair", name: "Priya Nair", cohort: "Medicare CSR Cohort B", completion: 71, avgScore: 91, risk: "On Track", lastActive: "Today" },
  { id: "marcus-webb", name: "Marcus Webb", cohort: "Medicare CSR Cohort A", completion: 35, avgScore: 72, risk: "At Risk", lastActive: "9 days ago" },
  { id: "sofia-reyes", name: "Sofia Reyes", cohort: "Medicare CSR Cohort B", completion: 65, avgScore: 84, risk: "On Track", lastActive: "Yesterday" },
  { id: "dana-osei", name: "Dana Osei", cohort: "New Starter Cohort Q3", completion: 0, avgScore: null, risk: "Not Started", lastActive: null },
  { id: "tom-hartley", name: "Tom Hartley", cohort: "Medicare CSR Cohort A", completion: 42, avgScore: 63, risk: "At Risk", lastActive: "3 days ago" },
  { id: "aisha-patel", name: "Aisha Patel", cohort: "Medicare CSR Cohort B", completion: 58, avgScore: 88, risk: "On Track", lastActive: "Today" },
  { id: "leon-muller", name: "Leon Müller", cohort: "Medicare CSR Cohort A", completion: 19, avgScore: 54, risk: "Critical", lastActive: "11 days ago" },
  { id: "chloe-nguyen", name: "Chloe Nguyen", cohort: "Medicare CSR Cohort B", completion: 44, avgScore: 77, risk: "On Track", lastActive: "2 days ago" },
  { id: "ryan-obrien", name: "Ryan O'Brien", cohort: "Medicare CSR Cohort A", completion: 38, avgScore: 68, risk: "At Risk", lastActive: "5 days ago" },
];

type Escalation = { id: string; name: string; cohort: string; count: number };

/** Resolve the relative "last active" labels used in the mock data against a date range. */
function lastActiveInRange(
  lastActive: string | null,
  range: { from?: Date; to?: Date },
): boolean {
  if (!range.from && !range.to) return true;
  if (!lastActive) return false;
  const today = new Date();
  let daysAgo: number | null = null;
  if (/today/i.test(lastActive)) daysAgo = 0;
  else if (/yesterday/i.test(lastActive)) daysAgo = 1;
  else {
    const m = lastActive.match(/(\d+)\s*day/i);
    if (m) daysAgo = Number(m[1]);
  }
  if (daysAgo === null) return true;
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
  if (range.from && date < new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate())) return false;
  if (range.to && date > new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate())) return false;
  return true;
}
const escalations: Escalation[] = [
  { id: "tom-hartley", name: "Tom Hartley", cohort: "Medicare CSR Cohort A", count: 3 },
  { id: "jordan-kim", name: "Jordan Kim", cohort: "Medicare CSR Cohort A", count: 1 },
  { id: "aisha-patel", name: "Aisha Patel", cohort: "Medicare CSR Cohort B", count: 1 },
];

const escalationTopics = [
  { label: "Coverage Determination & COB", count: 4 },
  { label: "Prior Authorisation", count: 3 },
  { label: "Eligibility & Enrolment rules", count: 2 },
  { label: "Appeals process", count: 2 },
  { label: "Claims & Billing", count: 1 },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function scoreColor(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-success-dark";
  if (score >= 65) return "text-warning-foreground dark:text-warning";
  return "text-destructive";
}

function riskBadgeClass(risk: Risk) {
  switch (risk) {
    case "On Track":
      return "bg-success-dark/15 text-success-dark hover:bg-success-dark/15";
    case "At Risk":
      return "bg-warning/15 text-warning-foreground dark:text-warning hover:bg-warning/15";
    case "Critical":
      return "bg-destructive/15 text-destructive hover:bg-destructive/15";
    case "Not Started":
      return "bg-muted text-muted-foreground hover:bg-muted";
  }
}

export default function Analytics() {
  const filters = useTrainerFilters();
  const { cohortAllowed, progressAllowed } = filters;
  const [trendMode, setTrendMode] = useState<"weekly" | "monthly">("monthly");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [learnerPage, setLearnerPage] = useState(1);

  const trendData = trendMode === "monthly" ? monthlyTrend : weeklyTrend;

  const filteredLearners = useMemo(() => {
    const filtered = learners.filter(
      (l) =>
        cohortAllowed(l.cohort) &&
        progressAllowed(l.risk) &&
        lastActiveInRange(l.lastActive, filters.activity) &&
        l.name.toLowerCase().includes(search.toLowerCase()),
    );
    const sorted = [...filtered];
    switch (sort) {
      case "completion-desc":
        sorted.sort((a, b) => b.completion - a.completion);
        break;
      case "completion-asc":
        sorted.sort((a, b) => a.completion - b.completion);
        break;
      case "risk-desc": {
        const order: Record<Risk, number> = { Critical: 0, "At Risk": 1, "On Track": 2, "Not Started": 3 };
        sorted.sort((a, b) => order[a.risk] - order[b.risk]);
        break;
      }
      case "last-active":
        break;
      case "name":
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [search, sort, cohortAllowed, progressAllowed, filters.activity]);

  const totalLearnerPages = Math.max(
    1,
    Math.ceil(filteredLearners.length / LEARNER_PAGE_SIZE),
  );
  const currentLearnerPage = Math.min(learnerPage, totalLearnerPages);
  const learnerPageStart = (currentLearnerPage - 1) * LEARNER_PAGE_SIZE;
  const learnerPageRows = filteredLearners.slice(
    learnerPageStart,
    learnerPageStart + LEARNER_PAGE_SIZE,
  );

  const goToLearnerPage = (next: number) => {
    const target = Math.min(Math.max(1, next), totalLearnerPages);
    setLearnerPage(target);
    document
      .getElementById("learner-performance")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visibleCohortBars = cohortBars.filter((b) => cohortAllowed(b.name));
  const visibleEscalations = escalations.filter((e) => cohortAllowed(e.cohort));
  const maxBar = Math.max(...visibleCohortBars.map((b) => b.pct), 1);
  const maxTopic = Math.max(...escalationTopics.map((t) => t.count), 1);

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track learner progress, assessment performance, risk signals, and engagement across the cohorts you facilitate.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <TrainerFilterPanel
              active={filters.active}
              onClear={filters.clear}
              sections={[
                {
                  title: "Cohort",
                  content: (
                    <>
                      <FilterCheckboxGroup
                        idPrefix="ta-cohort"
                        label="Cohort"
                        options={filters.cohortOptions}
                        selected={filters.cohorts}
                        onToggle={filters.toggleCohort}
                        renderOption={(c) => <CohortFilterOption cohort={c} />}
                      />
                      {filters.primaryTrainerOptions.length > 0 && (
                        <FilterCheckboxGroup
                          idPrefix="ta-primary-trainer"
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
                        idPrefix="ta-status"
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
                      idPrefix="ta-progress"
                      label="Learner progress status"
                      options={["On Track", "At Risk", "Critical", "Not Started"]}
                      selected={filters.progress}
                      onToggle={filters.toggleProgress}
                    />
                  ),
                },
                {
                  title: "Content",
                  content: (
                    <FilterCheckboxGroup
                      idPrefix="ta-topic"
                      label="Topic"
                      options={filters.topicOptions}
                      selected={filters.topics}
                      onToggle={filters.toggleTopic}
                    />
                  ),
                },
                {
                  title: "Date",
                  content: (
                    <FilterDateRange
                      label="Date range"
                      value={filters.activity}
                      onChange={filters.setActivity}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Section navigation chips */}
        <div className="flex flex-row items-center gap-2 flex-wrap md:flex-nowrap">
          {[
            { id: "cohort-performance-overview", label: "Cohort Performance Overview", Icon: BarChart3 },
            { id: "assessment-performance", label: "Assessment Performance by Module", Icon: ClipboardCheck },
            { id: "learner-performance", label: "Learner Performance", Icon: Users },
            { id: "escalation-insights", label: "Escalation Insights", Icon: AlertTriangle },
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

        {/* Section 1: Stat row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">My Learners</div>
            <div className="mt-1 text-2xl font-bold leading-tight text-foreground">42</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Across active cohorts</div>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">Avg Completion</div>
            <div className="mt-1 text-2xl font-bold leading-tight text-primary">44%</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Across all active cohorts</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-success-dark">
              <ArrowUp size={12} aria-hidden="true" /><span>+6% vs last month</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">At Risk</div>
            <div className="mt-1 text-2xl font-bold leading-tight text-warning-foreground dark:text-warning">8</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Require attention</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <ArrowUp size={12} aria-hidden="true" /><span>+2 vs last month</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">Avg Assessment Score</div>
            <div className="mt-1 text-2xl font-bold leading-tight text-foreground">76%</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Across all submitted assessments</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-success-dark">
              <ArrowUp size={12} aria-hidden="true" /><span>+3% vs last month</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">Open Escalations</div>
            <div className="mt-1 text-2xl font-bold leading-tight text-destructive">5</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Unresolved learner questions</div>
          </div>
        </div>

        {/* Section 2: Cohort Performance Overview */}
        <section id="cohort-performance-overview" className="space-y-4 scroll-mt-20">

          <h3 className="text-base font-semibold text-foreground">Cohort Performance Overview</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left: bar chart */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="text-sm font-medium text-foreground">Completion Rate by Cohort</div>
              <div className="mt-4 space-y-4">
                {visibleCohortBars.map((row) => {
                  const relative = (row.pct / maxBar) * 100;
                  return (
                    <div key={row.name} className="flex items-center gap-3">
                      <div className="w-48 shrink-0 break-words text-sm text-foreground">{row.name}</div>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${relative}%` }} />
                      </div>
                      <div className="w-14 shrink-0 text-right text-xs text-muted-foreground">{row.pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: risk distribution */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="text-sm font-medium text-foreground">Learner Risk Distribution</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Across your active cohorts — 42 learners</div>
              <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
                {riskSegments.map((seg) => (
                  <div key={seg.key} className={cn("h-full", seg.bar)} style={{ width: `${seg.pct}%` }} />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {riskSegments.map((seg) => (
                  <div key={seg.key} className="flex items-center gap-2 text-sm text-foreground">
                    <span className={cn("h-2 w-2 rounded-full", seg.dot)} aria-hidden="true" />
                    <span>{seg.label} <span className="text-muted-foreground">({seg.count} · {seg.pct}%)</span></span>
                  </div>
                ))}
              </div>
              <div className="mt-5 overflow-hidden rounded-md border border-border">
                <table className="w-full text-xs text-muted-foreground">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Cohort</th>
                      <th className="px-3 py-2 text-left font-medium">Risk split</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortRiskBreakdown.filter((row) => cohortAllowed(row.cohort)).map((row) => (
                      <tr key={row.cohort} className="border-t border-border">
                        <td className="px-3 py-2 text-foreground">
                          {row.cohort}
                          <CohortPrimaryTrainer cohort={row.cohort} />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap items-center gap-3">
                            {row.segments.map((s, i) => (
                              <span key={i} className="flex items-center gap-1.5">
                                <span className={cn("h-2 w-2 rounded-full", s.dot)} aria-hidden="true" />
                                <span>{s.count}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs italic text-muted-foreground">
                19% of your learners are at risk — above the 10% programme threshold. 5 learners are critical. Review the At-Risk panel on your Home page for recommended actions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Completion Trend */}
        <div id="completion-trend" className="rounded-lg border border-border bg-background p-5 scroll-mt-20">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-foreground">Completion Trend</div>
            <Tabs value={trendMode} onValueChange={(v) => setTrendMode(v as "weekly" | "monthly")}>
              <TabsList className="h-8">
                <TabsTrigger value="weekly" className="h-6 px-3 text-xs">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="h-6 px-3 text-xs">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(v: number, name) => [
                    `${v}%`,
                    name === "cohortA" ? "Medicare CSR Cohort A" : "Medicare CSR Cohort B",
                  ]}
                />
                <Line type="monotone" dataKey="cohortA" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cohortB" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--success))", stroke: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-foreground">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" /><span>Medicare CSR Cohort A</span></div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" /><span>Medicare CSR Cohort B</span></div>
          </div>
        </div>

        {/* Section 4: Assessment Performance */}
        <section id="assessment-performance" className="space-y-4 scroll-mt-20">
          <div>
            <h3 className="text-base font-semibold text-foreground">Assessment Performance by Module</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Average scores per module across your cohorts — identifies where learners are struggling.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Below 65%</TableHead>
                  <TableHead>Flag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((m) => {
                  const showFlag = m.avgScore !== null && m.avgScore < 70;
                  return (
                    <TableRow key={m.module}>
                      <TableCell className="text-sm text-foreground">{m.module}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.cohort}</TableCell>
                      <TableCell className={cn("text-sm font-medium", scoreColor(m.avgScore))}>
                        {m.avgScore === null ? "—" : `${m.avgScore}%`}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{m.submissions === 0 ? "0" : m.submissions}</TableCell>
                      <TableCell className={cn("text-sm font-medium", m.below65 && m.below65 > 0 ? "text-destructive" : "text-muted-foreground")}>
                        {m.below65 === null ? "—" : m.below65}
                      </TableCell>
                      <TableCell>
                        {showFlag ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-warning-foreground dark:text-warning">
                            <AlertTriangle size={14} aria-hidden="true" />
                            Review recommended
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Section 5: Learner Performance */}
        <section id="learner-performance" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-base font-semibold text-foreground">Learner Performance</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setLearnerPage(1);
                  }}
                  placeholder="Search learners..."
                  className="h-9 w-56 pl-8"
                  aria-label="Search learners"
                />
              </div>
              <Select
                value={sort}
                onValueChange={(v) => {
                  setSort(v);
                  setLearnerPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-48" aria-label="Sort learners">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A–Z</SelectItem>
                  <SelectItem value="completion-desc">Completion ↓</SelectItem>
                  <SelectItem value="completion-asc">Completion ↑</SelectItem>
                  <SelectItem value="risk-desc">Risk ↓</SelectItem>
                  <SelectItem value="last-active">Last active ↓</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {learnerPageRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                          {initials(row.name)}
                        </div>
                        <span className="text-sm text-foreground">{row.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.cohort}
                      <CohortPrimaryTrainer cohort={row.cohort} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${row.completion}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{row.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-sm font-medium", scoreColor(row.avgScore))}>
                        {row.avgScore === null ? "—" : `${row.avgScore}%`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("border-0", riskBadgeClass(row.risk))} variant="secondary">
                        {row.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.lastActive ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/trainer/learner/${row.id}`} className="text-sm text-primary hover:underline">
                        View profile →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">
              Showing {filteredLearners.length === 0 ? 0 : learnerPageStart + 1}
              –{learnerPageStart + learnerPageRows.length} of {filteredLearners.length} learners
            </span>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={currentLearnerPage === 1}
                    className={cn(currentLearnerPage === 1 && "pointer-events-none opacity-50")}
                    onClick={(e) => {
                      e.preventDefault();
                      goToLearnerPage(currentLearnerPage - 1);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 text-sm text-muted-foreground">
                    Page {currentLearnerPage} of {totalLearnerPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={currentLearnerPage === totalLearnerPages}
                    className={cn(
                      currentLearnerPage === totalLearnerPages && "pointer-events-none opacity-50",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      goToLearnerPage(currentLearnerPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>

        {/* Section 6: Escalation Insights */}
        <section id="escalation-insights" className="space-y-4 scroll-mt-20">
          <div>
            <h3 className="text-base font-semibold text-foreground">Escalation Insights</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Volume and patterns of learner escalations across your cohorts.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left: escalations by learner */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="text-sm font-medium text-foreground">Open Escalations by Learner</div>
              <div className="mt-4 divide-y divide-border">
                {visibleEscalations.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                      {initials(e.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.cohort}</div>
                      <CohortPrimaryTrainer cohort={e.cohort} />
                    </div>
                    <Badge className="border-0 bg-destructive/15 text-destructive hover:bg-destructive/15" variant="secondary">
                      {e.count} open
                    </Badge>
                    <Link to="/trainer/home" className="text-xs font-medium text-primary hover:underline">
                      View →
                    </Link>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs italic text-muted-foreground">
                2 additional escalations resolved this week
              </p>
            </div>

            {/* Right: escalation topics */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="text-sm font-medium text-foreground">Common Escalation Topics</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Most frequent topics learners have escalated in the last 30 days
              </div>
              <div className="mt-4 divide-y divide-border">
                {escalationTopics.map((t, i) => (
                  <div key={t.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-5 shrink-0 text-xs text-muted-foreground">{i + 1}.</div>
                    <div className="min-w-0 flex-1 text-sm text-foreground">{t.label}</div>
                    <div className="text-sm font-medium text-foreground">{t.count}</div>
                    <div className="h-1.5 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(t.count / maxTopic) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Sage Insights */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-foreground">Sage Insights</div>
            <SageTag label="Powered by Sage" />
          </div>
          <div className="space-y-3">
            <LeftBorderCard borderVariant="warning">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertTriangle size={16} className="text-warning-foreground dark:text-warning" aria-hidden="true" />
                  <span>Module 3 assessment scores below threshold across both cohorts</span>
                </div>
                <a href="#assessment-performance" className="shrink-0 text-xs font-medium text-primary hover:underline">
                  View assessment data ↑
                </a>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The average score for Module 3 (Coverage Determination &amp; COB) is 66% across your cohorts — below the 70% minimum threshold. 8 learners have scored below 65%, with errors concentrated on COB rules and Coverage Determination definitions. Sage recommends a group coaching session or a supplementary worked-example resource before affected learners attempt the module again.
              </p>
            </LeftBorderCard>

            <LeftBorderCard borderVariant="warning">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertTriangle size={16} className="text-warning-foreground dark:text-warning" aria-hidden="true" />
                  <span>Escalation volume suggests a content gap — not individual learner issues</span>
                </div>
                <a href="#escalation-insights" className="shrink-0 text-xs font-medium text-primary hover:underline">
                  View escalations ↑
                </a>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                4 out of 5 open escalations relate to Coverage Determination, Prior Authorisation, or COB rules — all within Module 3 content. This pattern across multiple learners suggests the module itself may not be providing sufficient clarity for learners without prior insurance experience. Consider flagging this to your programme manager for a content review.
              </p>
            </LeftBorderCard>

            <LeftBorderCard borderVariant="brand">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Target size={16} className="text-primary" aria-hidden="true" />
                  <span>Medicare CSR Cohort B tracking ahead of schedule</span>
                </div>
                <Link to="/trainer/home" className="shrink-0 text-xs font-medium text-primary hover:underline">
                  View cohort →
                </Link>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Cohort B is at 52% average completion — 14 percentage points ahead of Cohort A at the same programme stage. Average assessment score is 84% and no learners are currently flagged as critical. At this pace, Cohort B is on track to complete ahead of the 30 September target. The engagement and performance patterns in Cohort B may be worth sharing with the wider training team.
              </p>
            </LeftBorderCard>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
