export type JourneyGroup = { journey: string; rows: { name: string; pct: number }[] };

export const journeyGroups: JourneyGroup[] = [
  {
    journey: "Medicare CSR Onboarding",
    rows: [
      { name: "Medicare CSR Cohort A", pct: 38 },
      { name: "Medicare CSR Cohort B", pct: 52 },
    ],
  },
  {
    journey: "General New Hire Onboarding",
    rows: [{ name: "New Starter Cohort Q3", pct: 0 }],
  },
];

export const riskSegments = [
  { key: "on-track", label: "On Track", count: 37, pct: 70, bar: "bg-success", dot: "bg-success" },
  { key: "at-risk", label: "At Risk", count: 8, pct: 15, bar: "bg-warning", dot: "bg-warning" },
  { key: "critical", label: "Critical", count: 5, pct: 9, bar: "bg-destructive", dot: "bg-destructive" },
  { key: "not-started", label: "Not Started", count: 3, pct: 6, bar: "bg-muted-foreground/40", dot: "bg-muted-foreground/60" },
];

export const cohortRiskBreakdown = [
  { cohort: "Medicare CSR Cohort A", segments: [{ dot: "bg-success", count: "14" }, { dot: "bg-warning", count: "5" }, { dot: "bg-destructive", count: "3" }] },
  { cohort: "Medicare CSR Cohort B", segments: [{ dot: "bg-success", count: "14" }, { dot: "bg-warning", count: "3" }, { dot: "bg-destructive", count: "1" }] },
  { cohort: "New Starter Cohort Q3", segments: [{ dot: "bg-muted-foreground/60", count: "3 not started" }] },
];

export const monthlyTrend = [
  { period: "Feb 26", cohortA: 0, cohortB: 0 },
  { period: "Mar 26", cohortA: 5, cohortB: 0 },
  { period: "Apr 26", cohortA: 12, cohortB: 8 },
  { period: "May 26", cohortA: 20, cohortB: 18 },
  { period: "Jun 26", cohortA: 29, cohortB: 34 },
  { period: "Jul 26", cohortA: 38, cohortB: 47 },
  { period: "Aug 26", cohortA: 38, cohortB: 52 },
];

export const weeklyTrend = [
  { period: "W1 Jul", cohortA: 29, cohortB: 34 },
  { period: "W2 Jul", cohortA: 32, cohortB: 39 },
  { period: "W3 Jul", cohortA: 35, cohortB: 44 },
  { period: "W4 Jul", cohortA: 38, cohortB: 47 },
  { period: "W1 Aug", cohortA: 38, cohortB: 50 },
  { period: "W2 Aug", cohortA: 38, cohortB: 52 },
];

export type ManagerRow = {
  id: string;
  name: string;
  cohorts: number;
  learners: number;
  completion: number;
  atRisk: number;
  avgScore: number;
};

export const managers: ManagerRow[] = [
  { id: "alex-turner", name: "Alex Turner", cohorts: 2, learners: 35, completion: 43, atRisk: 6, avgScore: 74 },
  { id: "jamie-lau", name: "Jamie Lau", cohorts: 1, learners: 18, completion: 52, atRisk: 2, avgScore: 82 },
];

export type ModuleRow = {
  module: string;
  journey: string;
  avgScore: number | null;
  submissions: number;
  below65: number | null;
};

export const modules: ModuleRow[] = [
  { module: "Module 1: Medicare Foundations", journey: "Medicare CSR Onboarding", avgScore: 83, submissions: 38, below65: 2 },
  { module: "Module 2: Eligibility & Enrolment", journey: "Medicare CSR Onboarding", avgScore: 79, submissions: 36, below65: 4 },
  { module: "Module 3: Coverage Determination & COB", journey: "Medicare CSR Onboarding", avgScore: 66, submissions: 28, below65: 8 },
  { module: "Module 4: Claims & Billing", journey: "Medicare CSR Onboarding", avgScore: null, submissions: 0, below65: null },
  { module: "Module 1: Workplace Foundations", journey: "General New Hire Onboarding", avgScore: null, submissions: 0, below65: null },
];

export type HeatCell = number | null;

export const heatmapRows: { skill: string; cohortA: HeatCell; cohortB: HeatCell; q3: HeatCell }[] = [
  { skill: "Medicare product knowledge", cohortA: 78, cohortB: 91, q3: null },
  { skill: "Coverage determination", cohortA: 48, cohortB: 71, q3: null },
  { skill: "Coordination of benefits", cohortA: 43, cohortB: 64, q3: null },
  { skill: "Member eligibility verification", cohortA: 74, cohortB: 88, q3: null },
  { skill: "Prior authorisation handling", cohortA: 41, cohortB: 57, q3: null },
  { skill: "Claims & billing fundamentals", cohortA: 9, cohortB: 18, q3: null },
  { skill: "Regulatory compliance awareness", cohortA: 66, cohortB: 81, q3: null },
  { skill: "Escalation & appeals process", cohortA: 39, cohortB: 52, q3: null },
  { skill: "Organisational culture & values", cohortA: null, cohortB: null, q3: 88 },
  { skill: "Workplace policy compliance", cohortA: null, cohortB: null, q3: 74 },
  { skill: "Role clarity & goal alignment", cohortA: null, cohortB: null, q3: 61 },
  { skill: "Systems & tools proficiency", cohortA: null, cohortB: null, q3: 39 },
  { skill: "Benefits & wellbeing awareness", cohortA: null, cohortB: null, q3: 0 },
];

export const summaryStats = [
  { label: "Total Learners", value: "53", sub: "Enrolled across all active cohorts" },
  { label: "Active Cohorts", value: "2", sub: "Currently in progress" },
  { label: "Avg Completion", value: "44%", sub: "Across all active cohorts" },
  { label: "At-Risk Learners", value: "8", sub: "Flagged across all cohorts" },
  { label: "Avg Assessment Score", value: "76%", sub: "Across all submitted assessments" },
];

export const journeyFilterLabels: Record<string, string> = {
  all: "All Journeys",
  medicare: "Medicare CSR Onboarding",
  general: "General New Hire Onboarding",
};

export const cohortFilterLabels: Record<string, string> = {
  all: "All Cohorts",
  "cohort-a": "Medicare CSR Cohort A",
  "cohort-b": "Medicare CSR Cohort B",
  "cohort-q3": "New Starter Cohort Q3",
};

export const rangeFilterLabels: Record<string, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  all: "All time",
};
