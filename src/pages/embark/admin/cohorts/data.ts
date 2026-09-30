export type CohortStatus = "active" | "starting" | "completed" | "archived";

import {
  IM_INTAKE_COHORT_NAME,
  IM_INTAKE_JOURNEY_NAME,
  IM_MANAGER_NAME,
} from "@/pages/embark/admin/journeys/data";

export type Trainer = {
  id: string;
  name: string;
  role: string;
  activeCohorts: number;
};

export type Manager = {
  id: string;
  name: string;
  role: string;
  activeCohorts: number;
};

export type Cohort = {
  id: string;
  name: string;
  journey: string;
  status: CohortStatus;
  enrolled: number;
  primaryTrainerId: string | null;
  secondaryTrainerIds: string[];
  managerId: string | null;
  startDate?: string; // ISO
  targetDate?: string; // ISO
  maxSize: number;
  description?: string;
  lineOfBusiness?: string[];
};

export const TRAINERS: Trainer[] = [
  { id: "t-sarah", name: "Sarah Mitchell", role: "Senior Learning Facilitator", activeCohorts: 2 },
  { id: "t-david", name: "David Okafor", role: "Learning Facilitator", activeCohorts: 1 },
  { id: "t-priya", name: "Priya Shen", role: "Learning Facilitator", activeCohorts: 0 },
  { id: "t-marcus", name: "Marcus Webb", role: "Learning Facilitator", activeCohorts: 0 },
];

export const MANAGERS: Manager[] = [
  { id: "m-phoebe", name: IM_MANAGER_NAME, role: "Senior Investment Manager", activeCohorts: 1 },
  { id: "m-alex", name: "Alex Turner", role: "Cohort Manager", activeCohorts: 1 },
  { id: "m-jamie", name: "Jamie Lau", role: "Cohort Manager", activeCohorts: 1 },
  { id: "m-morgan", name: "Morgan Davis", role: "Team Manager", activeCohorts: 0 },
  { id: "m-riley", name: "Riley Chen", role: "Cohort Manager", activeCohorts: 0 },
];

export const SEED_COHORTS: Cohort[] = [
  {
    id: "cohort-a",
    name: IM_INTAKE_COHORT_NAME,
    journey: IM_INTAKE_JOURNEY_NAME,
    status: "active",
    enrolled: 6,
    primaryTrainerId: "t-sarah",
    secondaryTrainerIds: ["t-david"],
    managerId: "m-phoebe",
    startDate: "2026-07-14",
    targetDate: "2026-09-30",
    maxSize: 500,
  },
  {
    id: "cohort-b",
    name: "IM Intake Cohort B",
    journey: "Custody Services Investment Manager Onboarding Journey",
    status: "active",
    enrolled: 5,
    primaryTrainerId: "t-david",
    secondaryTrainerIds: [],
    managerId: "m-jamie",
    startDate: "2026-07-21",
    targetDate: "2026-09-30",
    maxSize: 500,
  },
  {
    id: "cohort-q3",
    name: "IM Intake Cohort Q3",
    journey: "New Hire Foundations Journey",
    status: "starting",
    enrolled: 3,
    primaryTrainerId: "t-sarah",
    secondaryTrainerIds: ["t-priya", "t-marcus"],
    managerId: "m-alex",
    startDate: "2026-09-01",
    targetDate: "2026-11-30",
    maxSize: 500,
  },
  {
    id: "cohort-suitability-a",
    name: "Suitability File Cohort A",
    journey: "Suitability File Standards Journey",
    status: "active",
    enrolled: 4,
    primaryTrainerId: "t-sarah",
    secondaryTrainerIds: [],
    managerId: "m-jamie",
    startDate: "2026-09-01",
    targetDate: "2026-10-15",
    maxSize: 24,
    description: "Started on the first version. Later versions apply only to learners who had not started.",
  },
  {
    id: "cohort-suitability-b",
    name: "Suitability File Cohort B",
    journey: "Suitability File Standards Journey",
    status: "active",
    enrolled: 3,
    primaryTrainerId: "t-david",
    secondaryTrainerIds: [],
    managerId: "m-alex",
    startDate: "2026-09-22",
    targetDate: "2026-10-31",
    maxSize: 24,
    description: "Opened on v2. Learners who had already started stay there. Learners who had not started moved to the current version.",
  },
];

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
