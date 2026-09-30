import type { CohortLearner } from "@/data/mockData";

export interface LearnerExtras {
  topFactors: { text: string; direction: "up" | "down" }[];
  lastTutor: string;
  flags: { label: string; variant: "danger" | "warning" | "muted" }[];
}

export const learnerExtras: Record<string, LearnerExtras> = {
  l1: {
    topFactors: [
      { text: "Assessment performance: 61% (failed Module 3)", direction: "down" },
      { text: "Pace: on track", direction: "up" },
    ],
    lastTutor: "Discussed Part B deductibles · 2 hours ago",
    flags: [{ label: "Open hand raised 2h", variant: "warning" }],
  },
  l3: {
    topFactors: [
      { text: "Assessment performance: 54% (below 70% threshold)", direction: "down" },
      { text: "No login activity: 4 days", direction: "down" },
    ],
    lastTutor: "Asked about CO-4 denial codes · 4 days ago",
    flags: [
      { label: "No login 4 days", variant: "danger" },
      { label: "Failed Module 2 ×2", variant: "danger" },
    ],
  },
};

export function getExtras(l: CohortLearner): LearnerExtras {
  return (
    learnerExtras[l.id] ?? {
      topFactors: [],
      lastTutor: "No recent escalations",
      flags: [],
    }
  );
}