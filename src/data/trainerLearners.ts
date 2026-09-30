export type TrainerLearnerStatus = "Not started" | "In progress" | "Completed" | "At risk";
export type TrainerLearnerReadiness = "High" | "Developing" | "Low";

export type TrainerLearner = {
  id: string;
  name: string;
  email: string;
  cohort: string;
  status: TrainerLearnerStatus;
  progress: number;
  readiness: TrainerLearnerReadiness;
  lastActive: string;
};

export const TRAINER_COHORTS = [
  "Medicare CSR Cohort A",
  "Medicare CSR Cohort B",
  "New Starter Cohort Q3",
];

type Row = [string, string, TrainerLearnerStatus, number, TrainerLearnerReadiness, string];

function build(cohort: string, prefix: string, rows: Row[]): TrainerLearner[] {
  return rows.map(([name, email, status, progress, readiness, lastActive], i) => ({
    id: `${prefix}-${i + 1}`,
    name,
    email,
    cohort,
    status,
    progress,
    readiness,
    lastActive,
  }));
}

const COHORT_A = build("Medicare CSR Cohort A", "tla", [
  ["Sarah Mitchell", "s.mitchell@example.com", "In progress", 65, "Developing", "2 Jan 2025"],
  ["James Okafor", "j.okafor@example.com", "In progress", 80, "High", "3 Jan 2025"],
  ["Priya Sharma", "p.sharma@example.com", "At risk", 30, "Low", "28 Dec 2024"],
  ["Tom Hartley", "t.hartley@example.com", "At risk", 34, "Low", "27 Dec 2024"],
  ["Jordan Kim", "j.kim@example.com", "In progress", 58, "Developing", "3 Jan 2025"],
  ["Leon Müller", "l.muller@example.com", "At risk", 22, "Low", "23 Dec 2024"],
  ["Ryan O'Brien", "r.obrien@example.com", "In progress", 71, "High", "3 Jan 2025"],
  ["Marcus Webb", "m.webb@example.com", "In progress", 62, "Developing", "2 Jan 2025"],
  ["Nadia Haddad", "n.haddad@example.com", "Completed", 100, "High", "30 Dec 2024"],
  ["Owen Bennett", "o.bennett@example.com", "In progress", 47, "Developing", "1 Jan 2025"],
  ["Grace Adeyemi", "g.adeyemi@example.com", "In progress", 88, "High", "3 Jan 2025"],
  ["Hector Alvarez", "h.alvarez@example.com", "In progress", 54, "Developing", "2 Jan 2025"],
  ["Ivy Chen", "i.chen@example.com", "Completed", 100, "High", "29 Dec 2024"],
  ["Kofi Mensah", "k.mensah@example.com", "In progress", 69, "Developing", "3 Jan 2025"],
  ["Laura Pisani", "l.pisani@example.com", "In progress", 76, "High", "2 Jan 2025"],
  ["Ella Novak", "e.novak@example.com", "At risk", 18, "Low", "20 Dec 2024"],
  ["Samir Rahman", "s.rahman@example.com", "In progress", 61, "Developing", "3 Jan 2025"],
  ["Tara Lindqvist", "t.lindqvist@example.com", "In progress", 83, "High", "3 Jan 2025"],
]);

const COHORT_B = build("Medicare CSR Cohort B", "tlb", [
  ["Daniel Torres", "d.torres@example.com", "Not started", 0, "Low", "—"],
  ["Amelia Chen", "a.chen@example.com", "In progress", 50, "Developing", "1 Jan 2025"],
  ["Marcus Williams", "m.williams@example.com", "In progress", 72, "High", "3 Jan 2025"],
  ["Aisha Patel", "a.patel@example.com", "In progress", 64, "Developing", "2 Jan 2025"],
  ["Priya Nair", "p.nair@example.com", "Completed", 100, "High", "31 Dec 2024"],
  ["Sofia Reyes", "s.reyes@example.com", "Completed", 100, "High", "31 Dec 2024"],
  ["Chloe Nguyen", "c.nguyen@example.com", "Completed", 100, "High", "30 Dec 2024"],
  ["Ben Carter", "b.carter@example.com", "At risk", 26, "Low", "22 Dec 2024"],
  ["Yusuf Demir", "y.demir@example.com", "In progress", 57, "Developing", "2 Jan 2025"],
  ["Maria Costa", "m.costa@example.com", "In progress", 79, "High", "3 Jan 2025"],
  ["Nathan Brooks", "n.brooks@example.com", "At risk", 31, "Low", "24 Dec 2024"],
  ["Zoe Fitzgerald", "z.fitzgerald@example.com", "In progress", 68, "Developing", "3 Jan 2025"],
]);

const COHORT_Q3 = build("New Starter Cohort Q3", "tlq", [
  ["Fatima Al-Hassan", "f.alhassan@example.com", "Not started", 0, "Low", "—"],
  ["Luca Rossi", "l.rossi@example.com", "In progress", 45, "Developing", "31 Dec 2024"],
  ["Dana Osei", "d.osei@example.com", "In progress", 52, "Developing", "2 Jan 2025"],
  ["Erik Johansson", "e.johansson@example.com", "In progress", 60, "Developing", "3 Jan 2025"],
  ["Hannah Lowe", "h.lowe@example.com", "In progress", 74, "High", "3 Jan 2025"],
  ["Idris Bello", "i.bello@example.com", "At risk", 20, "Low", "21 Dec 2024"],
  ["Julia Kaminski", "j.kaminski@example.com", "In progress", 66, "Developing", "2 Jan 2025"],
  ["Peter Nolan", "p.nolan@example.com", "In progress", 49, "Developing", "1 Jan 2025"],
  ["Rina Watanabe", "r.watanabe@example.com", "In progress", 81, "High", "3 Jan 2025"],
  ["Victor Silva", "v.silva@example.com", "Not started", 0, "Low", "—"],
  ["Wanda Ferreira", "w.ferreira@example.com", "In progress", 55, "Developing", "2 Jan 2025"],
  ["Xavier Dupont", "x.dupont@example.com", "In progress", 70, "High", "3 Jan 2025"],
]);

export const TRAINER_LEARNERS: TrainerLearner[] = [...COHORT_A, ...COHORT_B, ...COHORT_Q3];

export type TrainerLearnerStats = {
  total: number;
  onTrack: number;
  needAttention: number;
};

/**
 * Learner counts scoped to the active trainer view.
 * "Need attention" covers learners at risk or not yet started;
 * everyone else (in progress / completed) is on track.
 */
export function getTrainerLearnerStats(
  inScope: (cohort: string) => boolean,
): TrainerLearnerStats {
  const scoped = TRAINER_LEARNERS.filter((l) => inScope(l.cohort));
  const needAttention = scoped.filter(
    (l) => l.status === "At risk" || l.status === "Not started",
  ).length;
  return {
    total: scoped.length,
    onTrack: scoped.length - needAttention,
    needAttention,
  };
}

// ---------- Cohort metadata (used by the trainer filter panel) ----------

export type CohortStatus = "Active" | "Upcoming" | "Completed";

export type TrainerCohortMeta = {
  name: string;
  /** ISO date (yyyy-mm-dd) the cohort journey starts. */
  journeyStart: string;
  /** ISO date (yyyy-mm-dd) the cohort journey is expected to complete. */
  journeyEnd: string;
  status: CohortStatus;
  topic: string;
};

export const TRAINER_COHORT_META: TrainerCohortMeta[] = [
  {
    name: "Medicare CSR Cohort A",
    journeyStart: "2026-02-02",
    journeyEnd: "2026-09-30",
    status: "Active",
    topic: "Medicare Foundations",
  },
  {
    name: "Medicare CSR Cohort B",
    journeyStart: "2026-04-06",
    journeyEnd: "2026-11-27",
    status: "Active",
    topic: "Coverage & Claims",
  },
  {
    name: "New Starter Cohort Q3",
    journeyStart: "2026-07-06",
    journeyEnd: "2027-02-26",
    status: "Upcoming",
    topic: "New Starter Onboarding",
  },
];

export const COHORT_STATUSES: CohortStatus[] = ["Active", "Upcoming", "Completed"];

export function cohortMetaFor(cohort: string): TrainerCohortMeta | undefined {
  const value = cohort.toLowerCase();
  return TRAINER_COHORT_META.find(
    (c) => value.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(value),
  );
}
