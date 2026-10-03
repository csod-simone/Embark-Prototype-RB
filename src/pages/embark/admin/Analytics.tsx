import { SageTag } from "@/components/embark/SageTag";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowUp, Download, Target } from "lucide-react";
import { StatTile } from "@/components/embark/StatTile";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import {
  ExportPreviewDialog,
  type ExportFilterSnapshot,
} from "./analytics/ExportPreviewDialog";
import {
  cohortRiskBreakdown,
  heatmapRows,
  journeyGroups,
  managers,
  modules,
  monthlyTrend,
  riskSegments,
  weeklyTrend,
  type HeatCell,
} from "./analytics/analyticsData";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function scoreColor(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-success-dark";
  if (score >= 65) return "text-warning-foreground dark:text-warning";
  return "text-destructive";
}

function atRiskColor(count: number) {
  if (count === 0) return "text-success-dark";
  if (count <= 3) return "text-warning-foreground dark:text-warning";
  return "text-destructive";
}

const maxBar = Math.max(...journeyGroups.flatMap((g) => g.rows.map((r) => r.pct)), 1);

type SkillStatus = "Demonstrated" | "In Progress" | "Not Started";
type SkillRow = { name: string; pct: number; status: SkillStatus };

const medicareSkills: SkillRow[] = [
  { name: "Medicare product knowledge", pct: 82, status: "Demonstrated" },
  { name: "Coverage determination", pct: 58, status: "In Progress" },
  { name: "Coordination of benefits", pct: 51, status: "In Progress" },
  { name: "Member eligibility verification", pct: 79, status: "Demonstrated" },
  { name: "Prior authorisation handling", pct: 47, status: "In Progress" },
  { name: "Claims & billing fundamentals", pct: 12, status: "In Progress" },
  { name: "Regulatory compliance awareness", pct: 71, status: "Demonstrated" },
  { name: "Escalation & appeals process", pct: 44, status: "In Progress" },
];

const generalSkills: SkillRow[] = [
  { name: "Organisational culture & values", pct: 88, status: "Demonstrated" },
  { name: "Workplace policy compliance", pct: 74, status: "Demonstrated" },
  { name: "Role clarity & goal alignment", pct: 61, status: "In Progress" },
  { name: "Systems & tools proficiency", pct: 39, status: "In Progress" },
  { name: "Benefits & wellbeing awareness", pct: 0, status: "Not Started" },
];

const strongestSkills = [
  { name: "Organisational culture & values", pct: 88 },
  { name: "Medicare product knowledge", pct: 82 },
  { name: "Workplace policy compliance", pct: 74 },
  { name: "Member eligibility verification", pct: 76 },
  { name: "Regulatory compliance awareness", pct: 71 },
];

const skillGaps = [
  { name: "Claims & billing fundamentals", pct: 11 },
  { name: "Benefits & wellbeing awareness", pct: 0 },
  { name: "Escalation & appeals process", pct: 44 },
  { name: "Prior authorisation handling", pct: 47 },
  { name: "Coordination of benefits", pct: 51 },
];

function statusPillClass(status: SkillStatus) {
  if (status === "Demonstrated") return "bg-success-dark/15 text-success-dark";
  if (status === "In Progress") return "bg-primary/15 text-primary";
  return "bg-muted text-muted-foreground";
}

function heatCellClass(v: HeatCell) {
  if (v === null) return "";
  if (v >= 75) return "bg-success-dark/10";
  if (v >= 50) return "bg-warning/10";
  return "bg-destructive/10";
}

function SkillBarRow({ row }: { row: SkillRow }) {
  const fill =
    row.status === "Demonstrated" ? "bg-success" : row.status === "In Progress" ? "bg-primary" : "";
  return (
    <div className="flex items-center gap-3">
      <div className="w-[220px] shrink-0 text-sm font-medium text-foreground">{row.name}</div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        {row.status !== "Not Started" && (
          <div className={cn("h-full rounded-full", fill)} style={{ width: `${row.pct}%` }} />
        )}
      </div>
      <div className="w-10 shrink-0 text-right text-xs text-muted-foreground">{row.pct}%</div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
          statusPillClass(row.status),
        )}
      >
        {row.status}
      </span>
    </div>
  );
}

export default function Analytics() {
  const [journey, setJourney] = useState("all");
  const [cohort, setCohort] = useState("all");
  const [range, setRange] = useState("30d");
  const [trendMode, setTrendMode] = useState<"weekly" | "monthly">("monthly");
  const [skillJourney, setSkillJourney] = useState("all");
  const [skillCohort, setSkillCohort] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [exportSnapshot, setExportSnapshot] = useState<ExportFilterSnapshot | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const trendData = trendMode === "monthly" ? monthlyTrend : weeklyTrend;

  const handleExport = () => {
    if (exporting) return;
    setExporting(true);
    const snapshot: ExportFilterSnapshot = { journey, cohort, range, trendMode };
    window.setTimeout(() => {
      setExportSnapshot(snapshot);
      setExportOpen(true);
      setExporting(false);
    }, 400);
  };

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Organisation-wide learning performance across all journeys, cohorts, managers, and learners.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={journey} onValueChange={setJourney}>
              <SelectTrigger className="w-56" aria-label="Journey filter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Journeys</SelectItem>
                <SelectItem value="medicare">Medicare CSR Onboarding</SelectItem>
                <SelectItem value="general">General New Hire Onboarding</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cohort} onValueChange={setCohort}>
              <SelectTrigger className="w-56" aria-label="Cohort filter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cohorts</SelectItem>
                <SelectItem value="cohort-a">Medicare CSR Cohort A</SelectItem>
                <SelectItem value="cohort-b">Medicare CSR Cohort B</SelectItem>
                <SelectItem value="cohort-q3">New Starter Cohort Q3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-44" aria-label="Date range"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download size={14} className="mr-1.5" aria-hidden="true" />
              {exporting ? "Preparing report…" : "Export Report"}
            </Button>
          </div>
        </div>

        {/* Section 1: Stat row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatTile label="Total Learners" value={53} subLabel="Enrolled across all active cohorts" className="rounded-2xl shadow-sm" />
          <StatTile label="Active Cohorts" value={2} variant="brand" subLabel="Currently in progress" className="rounded-2xl shadow-sm" />
          <div className="rounded-2xl border border-border bg-card shadow-sm px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">Avg Completion</div>
            <div className="mt-1 text-2xl font-bold leading-tight text-foreground">44%</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Across all active cohorts</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-success-dark">
              <ArrowUp size={12} aria-hidden="true" /><span>+6% vs last month</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-sm px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">At-Risk Learners</div>
            <div className="mt-1 text-2xl font-bold leading-tight text-warning-foreground dark:text-warning">8</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Flagged across all cohorts</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <ArrowUp size={12} aria-hidden="true" /><span>+2 vs last month</span>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-sm px-4 py-3">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">Avg Assessment Score</div>
            <div className="mt-1 text-2xl font-bold leading-tight text-foreground">76%</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Across all submitted assessments</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-success-dark">
              <ArrowUp size={12} aria-hidden="true" /><span>+3% vs last month</span>
            </div>
          </div>
        </div>

        {/* Section 2: Journey & Cohort Performance */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Journey &amp; Cohort Performance</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left: bar chart */}
            <div className="rounded-2xl border border-border bg-card shadow-sm p-5">
              <div className="text-sm font-medium text-foreground">Completion Rate by Cohort</div>
              <div className="mt-4 space-y-4">
                {journeyGroups.map((group) => (
                  <div key={group.journey} className="space-y-2">
                    <div className="text-[11px] font-semibold tracking-wide text-muted-foreground border-b border-border pb-1">
                      {group.journey}
                    </div>
                    <div className="space-y-3 pt-1">
                      {group.rows.map((row) => {
                        const relative = row.pct === 0 ? 100 : (row.pct / maxBar) * 100;
                        return (
                          <div key={row.name} className="flex items-center gap-3">
                            <div className="w-48 shrink-0 text-sm text-foreground">{row.name}</div>
                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn("h-full rounded-full", row.pct === 0 ? "bg-muted-foreground/30" : "bg-primary")}
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
                ))}
              </div>
            </div>

            {/* Right: risk distribution */}
            <div id="risk-distribution" className="rounded-2xl border border-border bg-card shadow-sm p-5">
              <div className="text-sm font-medium text-foreground">Learner Risk Distribution</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Across all active cohorts — 42 enrolled learners</div>
              <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
                {riskSegments.map((seg) => (
                  <div key={seg.key} className={cn("h-full", seg.bar)} style={{ width: `${seg.pct}%` }} />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {riskSegments.map((seg) => (
                  <div key={seg.key} className="flex items-center gap-2 text-sm text-foreground">
                    <span className={cn("h-2 w-2 rounded-full", seg.dot)} aria-hidden="true" />
                    <span>{seg.label} <span className="text-muted-foreground">({seg.count})</span></span>
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
                    {cohortRiskBreakdown.map((row) => (
                      <tr key={row.cohort} className="border-t border-border">
                        <td className="px-3 py-2 text-foreground">{row.cohort}</td>
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
            </div>
          </div>
        </section>

        {/* Section 3: Completion Trend */}
        <div id="completion-trend" className="rounded-2xl border border-border bg-card shadow-sm p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-foreground">Completion Trend — Organisation Wide</div>
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
                  formatter={(v: number, name) => [`${v}%`, name === "cohortA" ? "Cohort A" : "Cohort B"]}
                />
                <Line type="monotone" dataKey="cohortA" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cohortB" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--success))", stroke: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-foreground">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" /><span>Cohort A</span></div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" /><span>Cohort B</span></div>
          </div>
        </div>

        {/* Section 4: Manager Performance */}
        <section className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Manager Performance</h3>
            <p className="mt-1 text-sm text-muted-foreground">Completion rates and risk signals by cohort manager</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manager</TableHead>
                  <TableHead>Cohorts</TableHead>
                  <TableHead>Total Learners</TableHead>
                  <TableHead>Avg Completion</TableHead>
                  <TableHead>At-Risk Learners</TableHead>
                  <TableHead>Avg Assessment Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                          {initials(m.name)}
                        </div>
                        <span className="text-sm text-foreground">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">{m.cohorts}</TableCell>
                    <TableCell className="text-sm text-foreground">{m.learners}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${m.completion}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{m.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn("text-sm font-medium", atRiskColor(m.atRisk))}>{m.atRisk}</TableCell>
                    <TableCell className={cn("text-sm font-medium", scoreColor(m.avgScore))}>{m.avgScore}%</TableCell>
                    <TableCell className="text-right">
                      <Link to="/manager/cohorts" className="text-xs font-medium text-primary hover:underline">
                        View cohorts →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Section 5: Assessment Performance */}
        <section id="assessment-performance" className="space-y-4 scroll-mt-20">
          <div>
            <h3 className="text-base font-semibold text-foreground">Assessment Performance by Module</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Average scores per module across all cohorts — identifies content areas where learners are struggling.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Journey</TableHead>
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
                      <TableCell className="text-xs text-muted-foreground">{m.journey}</TableCell>
                      <TableCell className={cn("text-sm font-medium", scoreColor(m.avgScore))}>
                        {m.avgScore === null ? "—" : `${m.avgScore}%`}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{m.submissions}</TableCell>
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

        {/* Section 6: Sage Insights */}
        <div className="rounded-2xl border border-border bg-card shadow-sm p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-foreground">Sage Insights</div>
            <SageTag label="AI" />
          </div>
          <div className="space-y-3">
            <LeftBorderCard borderVariant="warning">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertTriangle size={16} className="text-warning-foreground dark:text-warning" aria-hidden="true" />
                  <span>Module 3 assessment scores below threshold — organisation wide</span>
                </div>
                <a href="#assessment-performance" className="shrink-0 text-xs font-medium text-primary hover:underline">
                  View module data ↑
                </a>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The average assessment score for Module 3 (Coverage Determination &amp; COB) is 66% across both active cohorts — below the 70% minimum threshold. 8 learners have scored below 65%. Sage recommends reviewing the module content for clarity gaps and scheduling targeted coaching for affected learners before they progress to Module 4.
              </p>
            </LeftBorderCard>

            <LeftBorderCard borderVariant="warning">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertTriangle size={16} className="text-warning-foreground dark:text-warning" aria-hidden="true" />
                  <span>At-risk learner count trending upward</span>
                </div>
                <a href="#risk-distribution" className="shrink-0 text-xs font-medium text-primary hover:underline">
                  View risk breakdown ↑
                </a>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The number of at-risk learners has increased from 6 to 8 over the last 30 days. Critical learners have increased from 3 to 5. The majority of at-risk learners are concentrated in Medicare CSR Cohort A. If this trend continues, overall cohort completion is likely to fall short of the 30 September target.
              </p>
            </LeftBorderCard>

            <LeftBorderCard borderVariant="brand">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Target size={16} className="text-primary" aria-hidden="true" />
                  <span>Medicare CSR Cohort B tracking ahead of schedule</span>
                </div>
                <Link to="/manager/cohorts/cohort-b" className="shrink-0 text-xs font-medium text-primary hover:underline">
                  View cohort →
                </Link>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Cohort B is at 52% average completion — 14 percentage points ahead of Cohort A at the same programme stage. Average assessment score is 82%. At this pace, Cohort B is on track to complete 3 weeks ahead of the 30 September target date. Consider sharing facilitation practices from Cohort B&apos;s trainer (David Okafor) with Cohort A&apos;s manager.
              </p>
            </LeftBorderCard>

            <LeftBorderCard borderVariant="brand">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Target size={16} className="text-primary" aria-hidden="true" />
                  <span>Onboarding efficiency improving month-over-month</span>
                </div>
                <a href="#completion-trend" className="shrink-0 text-xs font-medium text-primary hover:underline">
                  View trend ↑
                </a>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Organisation-wide average completion has increased by 6 percentage points since last month. Month-on-month completion velocity has been consistent across both active cohorts. New Starter Cohort Q3 begins 1 September — early engagement data will be available within the first two weeks.
              </p>
            </LeftBorderCard>
          </div>
        </div>

        {/* Section 7: Skill Development */}
        <section className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Skill Development</h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Skills being built across your learner population as a direct result of activity in Embark — based on content completed, assessments passed, and Sage interaction patterns.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={skillJourney} onValueChange={setSkillJourney}>
                <SelectTrigger className="w-56" aria-label="Skill journey filter"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Journeys</SelectItem>
                  <SelectItem value="medicare">Medicare CSR Onboarding</SelectItem>
                  <SelectItem value="general">General New Hire Onboarding</SelectItem>
                </SelectContent>
              </Select>
              <Select value={skillCohort} onValueChange={setSkillCohort}>
                <SelectTrigger className="w-56" aria-label="Skill cohort filter"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cohorts</SelectItem>
                  <SelectItem value="cohort-a">Medicare CSR Cohort A</SelectItem>
                  <SelectItem value="cohort-b">Medicare CSR Cohort B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary stat row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Skills Being Developed" value={12} variant="brand" subLabel="Across all active journeys" className="rounded-2xl shadow-sm" />
            <StatTile label="Skills Demonstrated" value={7} variant="success" subLabel="Evidenced by assessment performance" className="rounded-2xl shadow-sm" />
            <StatTile label="Skills In Progress" value={5} variant="default" subLabel="Partially evidenced — still developing" className="rounded-2xl shadow-sm" />
            <div className="rounded-2xl border border-border bg-card shadow-sm px-4 py-3">
              <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">Avg Skill Readiness</div>
              <div className="mt-1 text-2xl font-bold leading-tight text-foreground">64%</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Across all learners and skills</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-success-dark">
                <ArrowUp size={12} aria-hidden="true" /><span>+8% vs last month</span>
              </div>
            </div>
          </div>

          {/* Journey breakdown */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[
              { title: "Medicare CSR Onboarding", learners: 42, rows: medicareSkills, insight: "Coverage determination and coordination of benefits are the lowest-developed skills across this journey — consistent with Module 3 assessment performance. 8 learners have not yet demonstrated these skills." },
              { title: "General New Hire Onboarding", learners: 18, rows: generalSkills, insight: "Organisational culture and policy compliance are demonstrating strong across this cohort. Systems proficiency is in progress — most learners have engaged with the content but have not yet completed the Module 1 assessment to evidence the skill." },
            ].map((col) => (
              <div key={col.title} className="rounded-2xl border border-border bg-card shadow-sm p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-foreground">{col.title}</div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {col.learners} learners
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Skills mapped to {col.title} content — progress based on completed modules, assessment scores, and Sage interaction depth.
                </p>
                <div className="mt-4 space-y-3">
                  {col.rows.map((row) => <SkillBarRow key={row.name} row={row} />)}
                </div>
                <div className="mt-4 flex items-start gap-2 border-t border-border pt-3">
                  <SageTag label="AI" className="mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <span className="font-medium text-primary">Sage: </span>
                    <span className="text-muted-foreground">{col.insight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div id="skill-cohort-heatmap" className="rounded-2xl border border-border bg-card shadow-sm p-5 scroll-mt-20">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-foreground">Skill Readiness by Cohort</div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Average skill readiness score per cohort — based on content completion and assessment evidence
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast({ title: "CSV download coming soon" })}
                className="shrink-0 text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                Download CSV
              </button>
            </div>
            <div className="overflow-hidden rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead>Medicare CSR Cohort A</TableHead>
                    <TableHead>Medicare CSR Cohort B</TableHead>
                    <TableHead>New Starter Cohort Q3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {heatmapRows.map((row) => (
                    <TableRow key={row.skill}>
                      <TableCell className="text-sm text-foreground">{row.skill}</TableCell>
                      {([row.cohortA, row.cohortB, row.q3] as HeatCell[]).map((v, i) => (
                        <TableCell key={i} className={cn("text-sm font-medium", heatCellClass(v))}>
                          {v === null ? <span className="text-muted-foreground">—</span> : `${v}%`}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="bg-muted/40 py-2 text-xs italic text-muted-foreground">
                      Skill readiness scores are derived from module completion rates, assessment scores, and Sage interaction patterns. They are indicative signals, not formal competency certifications.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Top skills + gaps */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[
              { title: "Strongest Skills", sub: "Highest average readiness across your learner population", data: strongestSkills, color: "text-success-dark", fill: "bg-success" },
              { title: "Skill Gaps", sub: "Lowest average readiness — skills most in need of intervention", data: skillGaps, color: "text-destructive", fill: "bg-destructive" },
            ].map((col) => (
              <div key={col.title} className="rounded-2xl border border-border bg-card shadow-sm p-5">
                <div className="text-sm font-medium text-foreground">{col.title}</div>
                <p className="mt-0.5 text-xs text-muted-foreground">{col.sub}</p>
                <div className="mt-3 divide-y divide-border">
                  {col.data.map((s, idx) => (
                    <div key={s.name} className="flex items-center gap-3 py-2 hover:bg-muted/40">
                      <span className="w-6 shrink-0 text-xs text-muted-foreground">{idx + 1}.</span>
                      <span className="flex-1 text-sm text-foreground">{s.name}</span>
                      <span className={cn("text-sm font-medium", col.color)}>{s.pct}%</span>
                      <div className="h-1.5 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", col.fill)} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sage Skill Insights */}
          <div className="rounded-2xl border border-border bg-card shadow-sm p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-foreground">Sage Skill Insights</div>
              <SageTag label="AI" />
            </div>
            <div className="space-y-3">
              <LeftBorderCard borderVariant="warning">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertTriangle size={16} className="text-warning-foreground dark:text-warning" aria-hidden="true" />
                    <span>Coverage determination and COB skills are lagging across both Medicare CSR cohorts</span>
                  </div>
                  <a href="#assessment-performance" className="shrink-0 text-xs font-medium text-primary hover:underline">
                    View Module 3 →
                  </a>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Coverage determination (average 58%) and coordination of benefits (51%) are the two lowest-developed skills across the Medicare CSR Onboarding journey. Both map directly to Module 3 content, which has an average assessment score of 66% — below the 70% threshold. Without intervention, learners advancing to production may lack confidence handling real COB and coverage determination queries.
                </p>
              </LeftBorderCard>

              <LeftBorderCard borderVariant="brand">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Target size={16} className="text-primary" aria-hidden="true" />
                    <span>Medicare CSR Cohort B is developing skills significantly faster than Cohort A</span>
                  </div>
                  <a href="#skill-cohort-heatmap" className="shrink-0 text-xs font-medium text-primary hover:underline">
                    View cohort comparison ↑
                  </a>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Across all 8 Medicare CSR skills, Cohort B averages 13 percentage points higher readiness than Cohort A at the same programme stage. Cohort B has demonstrated 5 skills vs Cohort A&apos;s 2. The engagement and pacing patterns in Cohort B may be worth examining as a model for future cohort facilitation.
                </p>
              </LeftBorderCard>

              <LeftBorderCard borderVariant="warning">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertTriangle size={16} className="text-warning-foreground dark:text-warning" aria-hidden="true" />
                    <span>Claims &amp; billing fundamentals remain undeveloped across all cohorts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/content")}
                    className="shrink-0 text-xs font-medium text-primary hover:underline"
                  >
                    View content →
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Claims &amp; billing fundamentals show just 11% average readiness — the lowest of any skill across the platform. Module 4 content has been published but no learners have yet completed it or submitted assessments. This is expected at the current programme stage, but should be monitored closely over the next 30 days as cohorts advance.
                </p>
              </LeftBorderCard>
            </div>
          </div>
        </section>
      </PageContainer>
      <ExportPreviewDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        snapshot={exportSnapshot}
      />
    </>
  );
}
