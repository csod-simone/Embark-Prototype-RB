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
import { AlertTriangle, ArrowUp, BarChart3, Search, Users } from "lucide-react";
import { StatTile } from "@/components/embark/StatTile";
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
  { name: "New Starter Cohort Q3", pct: 0 },
];

const riskSegments = [
  { key: "on-track", label: "On Track", count: 37, color: "bg-success", dot: "bg-success" },
  { key: "at-risk", label: "At Risk", count: 8, color: "bg-warning", dot: "bg-warning" },
  { key: "critical", label: "Critical", count: 5, color: "bg-destructive", dot: "bg-destructive" },
  { key: "not-started", label: "Not Started", count: 3, color: "bg-muted-foreground/40", dot: "bg-muted-foreground/60" },
];

const monthlyTrend = [
  { period: "Feb 26", value: 0 },
  { period: "Mar 26", value: 6 },
  { period: "Apr 26", value: 14 },
  { period: "May 26", value: 22 },
  { period: "Jun 26", value: 31 },
  { period: "Jul 26", value: 38 },
  { period: "Aug 26", value: 44 },
];

const weeklyTrend = [
  { period: "W1 Jul", value: 31 },
  { period: "W2 Jul", value: 33 },
  { period: "W3 Jul", value: 36 },
  { period: "W4 Jul", value: 38 },
  { period: "W1 Aug", value: 41 },
  { period: "W2 Aug", value: 44 },
];

const learners: LearnerRow[] = [
  { id: "jordan-kim", name: "Jordan Kim", cohort: "Cohort A", completion: 28, avgScore: 58, risk: "Critical", lastActive: "9 days ago" },
  { id: "priya-nair", name: "Priya Nair", cohort: "Cohort B", completion: 71, avgScore: 91, risk: "On Track", lastActive: "Today" },
  { id: "marcus-webb", name: "Marcus Webb", cohort: "Cohort A", completion: 35, avgScore: 72, risk: "At Risk", lastActive: "9 days ago" },
  { id: "sofia-reyes", name: "Sofia Reyes", cohort: "Cohort B", completion: 65, avgScore: 84, risk: "On Track", lastActive: "Yesterday" },
  { id: "dana-osei", name: "Dana Osei", cohort: "New Starter Q3", completion: 0, avgScore: null, risk: "Not Started", lastActive: null },
  { id: "tom-hartley", name: "Tom Hartley", cohort: "Cohort A", completion: 42, avgScore: 63, risk: "At Risk", lastActive: "3 days ago" },
  { id: "aisha-patel", name: "Aisha Patel", cohort: "Cohort B", completion: 58, avgScore: 88, risk: "On Track", lastActive: "Today" },
  { id: "leon-muller", name: "Leon Müller", cohort: "Cohort A", completion: 19, avgScore: 54, risk: "Critical", lastActive: "11 days ago" },
  { id: "chloe-nguyen", name: "Chloe Nguyen", cohort: "Cohort B", completion: 44, avgScore: 77, risk: "On Track", lastActive: "2 days ago" },
  { id: "ryan-obrien", name: "Ryan O'Brien", cohort: "Cohort A", completion: 38, avgScore: 68, risk: "At Risk", lastActive: "5 days ago" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
  const [range, setRange] = useState("30d");
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
        // demo-only; keep as-is
        break;
      case "name":
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [search, sort, cohortAllowed, progressAllowed]);

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
  const maxBar = Math.max(...visibleCohortBars.map((b) => b.pct), 1);

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track cohort performance, learner progress, and risk signals across all cohorts you manage.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <TrainerFilterPanel
              active={filters.active}
              onClear={() => {
                filters.clear();
                setRange("30d");
              }}
              sections={[
                {
                  title: "Cohort",
                  content: (
                    <>
                      <FilterCheckboxGroup
                        idPrefix="ma-cohort"
                        label="Cohort"
                        options={filters.cohortOptions}
                        selected={filters.cohorts}
                        onToggle={filters.toggleCohort}
                      />
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
                        idPrefix="ma-status"
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
                      idPrefix="ma-progress"
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
                      idPrefix="ma-topic"
                      label="Topic"
                      options={filters.topicOptions}
                      selected={filters.topics}
                      onToggle={filters.toggleTopic}
                    />
                  ),
                },
                {
                  title: "",
                  content: (
                    <>
                      <div className="flex w-full flex-col items-start gap-1.5">
                        <span className="text-xs text-muted-foreground">Date range</span>
                        <Select value={range} onValueChange={setRange}>
                          <SelectTrigger className="w-full" aria-label="Date range">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="all">All time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Section navigation chips */}
        <div className="flex flex-row items-center gap-2 flex-wrap md:flex-nowrap">
          {[
            { id: "cohort-completion-overview", label: "Cohort Completion Overview", Icon: BarChart3 },
            { id: "learner-performance", label: "Learner Performance", Icon: Users },
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatTile
            label="Total Learners"
            value={53}
            subLabel="Across all active cohorts"
          />
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              Avg Completion
            </div>
            <div className="mt-1 text-2xl font-bold leading-tight text-primary">44%</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Across all active cohorts</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-success-dark">
              <ArrowUp size={12} aria-hidden="true" />
              <span>+6% vs last month</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              At-Risk Learners
            </div>
            <div className="mt-1 text-2xl font-bold leading-tight text-warning-foreground dark:text-warning">8</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Require attention</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <ArrowUp size={12} aria-hidden="true" />
              <span>+2 vs last month</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              Avg Assessment Score
            </div>
            <div className="mt-1 text-2xl font-bold leading-tight text-foreground">76%</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Across all submitted assessments</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-success-dark">
              <ArrowUp size={12} aria-hidden="true" />
              <span>+3% vs last month</span>
            </div>
          </div>
        </div>

        {/* Section 2: Cohort completion overview */}
        <section id="cohort-completion-overview" className="space-y-4 scroll-mt-20">

          <h3 className="text-base font-semibold text-foreground">Cohort Completion Overview</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left: bar chart */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="text-sm font-medium text-foreground">Completion Rate by Cohort</div>
              <div className="mt-4 space-y-4">
                {visibleCohortBars.map((row) => {
                  const relative = (row.pct / maxBar) * 100;
                  return (
                    <div key={row.name} className="flex items-center gap-3">
                      <div className="w-44 shrink-0 text-sm text-foreground">{row.name}</div>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${relative}%` }}
                        />
                      </div>
                      <div className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                        {row.pct === 0 ? "Not started" : `${row.pct}%`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: risk distribution */}
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="text-sm font-medium text-foreground">Learner Risk Distribution</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Across all active cohorts</div>
              <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full">
                {riskSegments.map((seg) => {
                  const total = riskSegments.reduce((s, r) => s + r.count, 0);
                  const pct = (seg.count / total) * 100;
                  return (
                    <div
                      key={seg.key}
                      className={cn("h-full", seg.color)}
                      style={{ width: `${pct}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {riskSegments.map((seg) => (
                  <div key={seg.key} className="flex items-center gap-2 text-sm text-foreground">
                    <span className={cn("h-2 w-2 rounded-full", seg.dot)} aria-hidden="true" />
                    <span>
                      {seg.label} ({seg.count})
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs italic text-muted-foreground">
                15% of active learners are at risk or critical — above the 10% threshold. Consider reviewing coaching assignments.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Completion trend */}
        <div className="rounded-lg border border-border bg-background p-5">
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
                <XAxis
                  dataKey="period"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(v: number) => [`${v}%`, "Completion"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  dot={{ r: 5, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 4: Learner performance */}
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
                    <TableCell className="text-sm text-muted-foreground">{row.cohort}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${row.completion}%` }}
                          />
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
                      <Link
                        to={`/manager/learner/${row.id}`}
                        className="text-sm text-primary hover:underline"
                      >
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

        {/* Section 5: Sage Insights */}
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-foreground">Sage Insights</div>
            <SageTag label="Powered by Sage" />
          </div>
          <div className="space-y-3">
            <LeftBorderCard borderVariant="warning">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertTriangle size={16} className="text-warning-foreground dark:text-warning" aria-hidden="true" />
                  <span>Engagement drop detected — Cohort A</span>
                </div>
                <Link to="/manager/cohorts/cohort-a" className="shrink-0 text-sm text-primary hover:underline">
                  View cohort →
                </Link>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                5 learners in Medicare CSR Cohort A have not logged a session in over 7 days. Average weekly session frequency has dropped from 3.2 to 1.1 sessions per learner. Engagement typically drops before module deadline misses — early intervention is recommended.
              </p>
            </LeftBorderCard>

            <LeftBorderCard borderVariant="warning">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertTriangle size={16} className="text-warning-foreground dark:text-warning" aria-hidden="true" />
                  <span>Assessment scores below threshold — Cohort A</span>
                </div>
                <Link to="/manager/cohorts/cohort-a" className="shrink-0 text-sm text-primary hover:underline">
                  View cohort →
                </Link>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                3 learners in Cohort A have scored below 65% on the Module 3 assessment, with errors concentrated on COB rules and Coverage Determination. The cohort average for Module 3 is 66%, compared to 79% for Cohort B on the same content. Consider a group coaching session or supplementary resource for affected learners.
              </p>
            </LeftBorderCard>

            <LeftBorderCard borderVariant="brand">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <SageTag />
                  <span>Cohort B outperforming benchmark</span>
                </div>
                <Link to="/manager/cohorts/cohort-b" className="shrink-0 text-sm text-primary hover:underline">
                  View cohort →
                </Link>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Medicare CSR Cohort B is tracking 14 percentage points ahead of the programme average at this stage of the journey. Average assessment score is 84%, and no learners are currently flagged as critical. This cohort is on pace to complete 3 weeks ahead of the target date.
              </p>
            </LeftBorderCard>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
