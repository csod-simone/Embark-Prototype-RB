/**
 * One directory of every learner the prototype can open a profile for.
 *
 * Learner lists live in several places (the manager cohort roster, the
 * facilitator roster, the admin enrollment lists, analytics tables) and each
 * uses its own ids. Before this module, learner-detail pages only knew the six
 * ids in `cohortLearners` and silently fell back to the first record — which is
 * why every other learner opened Jordan Kim's profile.
 *
 * Here every known id is normalised into a single `LearnerRecord`, and the
 * details a source doesn't carry (readiness, hands raised, Sage activity,
 * pacing, assessment history) are generated deterministically from the learner
 * id, so the same person always looks the same in every role's view.
 *
 * Jordan Kim keeps her live progress: the `useLearnerRecord` hook overlays
 * `useJordanProgress()` on her record. No other learner's data is changed.
 */

import type { BandLabel, Session } from "@/data/mockData";
import { cohortLearners } from "@/data/mockData";
import { swapRathbonesTerms } from "@/data/rathbonesTerms";
import { buildMod3Flow } from "@/pages/embark/learner/home/JourneyTabs";
import {
  IM_INTAKE_COHORT_NAME,
  IM_INTAKE_JOURNEY_NAME,
  IM_INTAKE_PATH_NAMES,
  IM_MANAGER_NAME,
} from "@/pages/embark/admin/journeys/data";
import { TRAINER_LEARNERS } from "@/data/trainerLearners";
import {
  CSR_COHORT_NAME,
  CSR_DEMO_COHORT_NAME,
  CSR_LINE_OF_BUSINESS,
  type CsrItem,
  type CsrModality,
} from "@/data/csrOnboarding";
import {
  CSR_COHORT_LEARNERS,
  CSR_DEMO_COHORT_LEARNERS,
  SEED_LEARNERS,
} from "@/pages/embark/admin/cohorts/enrollmentData";
import type { CsrItemState } from "@/hooks/use-csr-progress";

export type LearnerStatusLabel = "Not started" | "In progress" | "Completed" | "At risk";
export type CoarseReadinessLabel = "High" | "Developing" | "Low";

export type LearnerHandRaised = {
  id: string;
  moduleName: string;
  sessionName: string;
  message: string;
  raisedAt: string;
  status: "open" | "resolved";
  readinessScore: number;
  readinessBand: BandLabel;
};

export type LearnerSageSession = {
  name: string;
  date: string;
  interactions: string;
  escalations: string;
  canView: boolean;
  /** Where the learner launched Sage from, when recorded. */
  source?: string;
  /** Id of the recorded conversation, when this row came from live activity. */
  sessionId?: string;
  /** ISO timestamp of the latest message, used for sorting. */
  lastInteractionAt?: string;
};


export type LearnerAssessmentRow = {
  id: string;
  title: string;
  type: string;
  date: string;
  attemptNumber: number;
  attempts: number;
  score: number;
  passed: boolean;
};

export type LearnerEventRow = {
  name: string;
  date: string;
  registration: "Registered" | "Assigned";
  attendance: "Attended" | "Absent" | "Upcoming";
};

export type LearnerWeekProgress = {
  id: string;
  number: number;
  name: string;
  state: "completed" | "in_progress" | "locked" | "exempt" | "remediation";
  items: CsrItem[];
  states: CsrItemState[];
  itemsComplete: number;
  itemsTotal: number;
};

export type LearnerRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  lob: string;
  cohort: string;
  journeyName: string;
  managerName: string;
  facilitatorName: string;
  businessLeaderName: string;
  enrolledDate: string;
  lastActive: string;
  status: LearnerStatusLabel;
  progress: number;
  readinessScore: number;
  band: BandLabel;
  readiness: CoarseReadinessLabel;
  openItems: number;
  isJordan: boolean;
  /**
   * Id the assessment records store keys attempts under. Rosters open the same
   * person under different ids (`tla-5`, `csr-d*`); Jordan's live attempts are
   * always saved against `l1`.
   */
  recordsId: string;
  /** Week-by-week path progression for this learner. */
  weeks: LearnerWeekProgress[];
  handsRaised: LearnerHandRaised[];
  sageStruggles: { topic: string; detail: string }[];
  sageSessions: LearnerSageSession[];
  assessments: LearnerAssessmentRow[];
  events: LearnerEventRow[];
  pacing: { day: number; pct: number }[];
  coachingHistory: { date: string; note: string }[];
};

export const JORDAN_ID = "l1";

// ---------------------------------------------------------------- seeded rng

function hashOf(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rngFor(id: string): () => number {
  let a = hashOf(id) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, list: readonly T[]): T {
  return list[Math.floor(rand() * list.length) % list.length];
}

// ------------------------------------------------------------- raw source rows

type RawLearner = {
  id: string;
  name: string;
  email?: string;
  cohort?: string;
  progress?: number;
  status?: LearnerStatusLabel;
  readiness?: CoarseReadinessLabel;
  readinessScore?: number;
  band?: BandLabel;
  lastActive?: string;
  enrolledDate?: string;
  openItems?: number;
  lob?: string;
};

const DEMO_ENROLMENT_IDS = new Set(CSR_DEMO_COHORT_LEARNERS.map((l) => l.id));
const PROD_ENROLMENT_IDS = new Set(CSR_COHORT_LEARNERS.map((l) => l.id));

function emailFor(name: string): string {
  const display = swapRathbonesTerms(name);
  const [first, ...rest] = display.toLowerCase().split(" ");
  return `${first}.${rest.join("") || first}@rathbones.com`.replace(/[^a-z0-9.@]/g, "");
}

const RAW: RawLearner[] = [
  // Manager cohort roster — this is the demo cohort's roster.
  ...cohortLearners.map<RawLearner>((l) => ({
    id: l.id,
    name: l.name,
    cohort: IM_INTAKE_COHORT_NAME,
    progress: l.progress,
    readinessScore: l.readinessScore,
    band: l.band,
    lastActive: l.lastActive,
    openItems: l.openItems,
    lob: l.lob,
  })),
  // Facilitator roster across all cohorts.
  ...TRAINER_LEARNERS.map<RawLearner>((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    cohort: l.cohort,
    progress: l.progress,
    status: l.status,
    readiness: l.readiness,
    lastActive: l.lastActive,
  })),
  // Admin enrollment lists.
  ...CSR_DEMO_COHORT_LEARNERS.map<RawLearner>((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    cohort: CSR_DEMO_COHORT_NAME,
    progress: l.progress,
    enrolledDate: l.enrolledDate,
    status: l.status === "completed" ? "Completed" : l.status === "not_started" ? "Not started" : "In progress",
  })),
  ...CSR_COHORT_LEARNERS.map<RawLearner>((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    cohort: CSR_COHORT_NAME,
    progress: l.progress,
    enrolledDate: l.enrolledDate,
    status: l.status === "completed" ? "Completed" : l.status === "not_started" ? "Not started" : "In progress",
  })),
  ...SEED_LEARNERS.map<RawLearner>((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    progress: l.progress,
    enrolledDate: l.enrolledDate,
    status: l.status === "completed" ? "Completed" : l.status === "not_started" ? "Not started" : "In progress",
  })),
];

// ------------------------------------------------------------- derivations

const BAND_ORDER: { min: number; band: BandLabel }[] = [
  { min: 95, band: "Fast Tracker" },
  { min: 85, band: "Ready" },
  { min: 65, band: "On Track" },
  { min: 50, band: "Needs Attention" },
  { min: 0, band: "At Risk" },
];

function bandForScore(score: number): BandLabel {
  return BAND_ORDER.find((b) => score >= b.min)!.band;
}

function coarseFor(band: BandLabel): CoarseReadinessLabel {
  if (band === "Ready" || band === "Fast Tracker") return "High";
  if (band === "On Track" || band === "Needs Attention") return "Developing";
  return "Low";
}

function readinessScoreFrom(raw: RawLearner, rand: () => number): number {
  if (raw.readinessScore != null) return raw.readinessScore;
  if (raw.readiness === "High") return 84 + Math.floor(rand() * 12);
  if (raw.readiness === "Low") return 30 + Math.floor(rand() * 18);
  if (raw.readiness === "Developing") return 58 + Math.floor(rand() * 18);
  const base = raw.progress ?? 50;
  return Math.max(18, Math.min(98, Math.round(base * 0.7 + 15 + rand() * 14)));
}

const MANAGERS = ["Dana Whitfield", "Priya Raman", "Chris Delgado", "Nina Fairbanks"];
const FACILITATORS = ["Alex Morgan", "Sam Patel", "Jamie Rivera"];
const BUSINESS_LEADERS = ["Taylor Reyes", "Morgan Hale"];

const EMPTY_PROGRESS = {
  articleDone: false,
  videoDone: false,
  assessmentPassed: false,
  rolePlayDone: false,
};

function modalityFor(session: Session): CsrModality {
  if (session.id.startsWith("micro-")) return "Micro-learning";
  if (session.sessionKind === "knowledge_check") return "Knowledge check";
  if (session.sessionKind === "module_assessment") return "Module assessment";
  if (session.sessionKind === "chapter_gate") return "Chapter gate";
  if (session.sessionKind === "roleplay" || session.modality === "role_play") return "Role play";
  return "Article";
}

function itemFromSession(session: Session, index: number): CsrItem {
  return {
    id: session.id,
    order: index + 1,
    modality: modalityFor(session),
    title: session.name,
    duration: session.duration,
  };
}

/** The same Managing Clients steps the learner sees, with completion applied. */
export function weekFromSessions(sessions: Session[]): LearnerWeekProgress {
  const items = sessions.map(itemFromSession);
  const states: CsrItemState[] = sessions.map((session) => {
    if (session.status === "completed") return "completed";
    if (session.status === "skipped") return "skipped";
    if (session.status === "in_progress") return "in_progress";
    return "locked";
  });
  const itemsComplete = states.filter((state) => state === "completed" || state === "skipped").length;
  const state: LearnerWeekProgress["state"] =
    itemsComplete === states.length && states.length > 0
      ? "completed"
      : states.some((itemState) => itemState === "in_progress" || itemState === "completed" || itemState === "skipped")
        ? "in_progress"
        : "locked";
  return {
    id: "im-intake",
    number: 1,
    name: IM_INTAKE_PATH_NAMES[0],
    state,
    items,
    states,
    itemsComplete,
    itemsTotal: states.length,
  };
}

const LATER_PATHS: {
  id: string;
  name: string;
  items: { id: string; modality: CsrModality; title: string; duration: number }[];
}[] = [
  {
    id: "compliance-refresher",
    name: IM_INTAKE_PATH_NAMES[1],
    items: [
      { id: "cmp-1", modality: "Article", title: "FCA conduct essentials", duration: 20 },
      { id: "cmp-2", modality: "Article", title: "Financial crime and market abuse", duration: 15 },
      { id: "cmp-a", modality: "Knowledge check", title: "Conduct knowledge check", duration: 10 },
    ],
  },
  {
    id: "discretionary",
    name: IM_INTAKE_PATH_NAMES[2],
    items: [
      { id: "dpm-1", modality: "Article", title: "Discretionary mandate types", duration: 20 },
      { id: "dpm-2", modality: "Article", title: "Reporting a portfolio valuation", duration: 15 },
      { id: "dpm-a", modality: "Knowledge check", title: "Discretionary knowledge check", duration: 10 },
    ],
  },
];

/** Paths that stay locked until IM Intake Pathway is complete. */
export function lockedLaterPaths(): LearnerWeekProgress[] {
  return LATER_PATHS.map((path, index) => ({
    id: path.id,
    number: index + 2,
    name: path.name,
    state: "locked",
    items: path.items.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 })),
    states: path.items.map(() => "locked"),
    itemsComplete: 0,
    itemsTotal: path.items.length,
  }));
}

const MANAGING_CLIENTS_ITEMS = buildMod3Flow(EMPTY_PROGRESS, "rathbones").map(itemFromSession);

/** Managing Clients progress for a learner, from their overall completion. */
function weeksFor(progress: number, rand: () => number): LearnerWeekProgress[] {
  const total = MANAGING_CLIENTS_ITEMS.length;
  const settledTarget = Math.round((progress / 100) * total);
  let settled = 0;
  let currentPlaced = false;
  const states: CsrItemState[] = MANAGING_CLIENTS_ITEMS.map((item) => {
    if (settled < settledTarget) {
      settled += 1;
      const skippable = item.modality === "Article";
      return skippable && rand() < 0.12 ? "skipped" : "completed";
    }
    if (!currentPlaced) {
      currentPlaced = true;
      return "in_progress";
    }
    return "locked";
  });
  const itemsComplete = states.filter((state) => state === "completed" || state === "skipped").length;
  const state: LearnerWeekProgress["state"] =
    itemsComplete === states.length && states.length > 0
      ? "completed"
      : states.some((itemState) => itemState === "in_progress" || itemState === "completed" || itemState === "skipped")
        ? "in_progress"
        : "locked";
  return [
    {
      id: "im-intake",
      number: 1,
      name: IM_INTAKE_PATH_NAMES[0],
      state,
      items: MANAGING_CLIENTS_ITEMS,
      states,
      itemsComplete,
      itemsTotal: states.length,
    },
    ...lockedLaterPaths(),
  ];
}

function assessmentsFor(
  weeks: LearnerWeekProgress[],
  rand: () => number,
  readinessScore: number,
): LearnerAssessmentRow[] {
  const rows: LearnerAssessmentRow[] = [];
  for (const w of weeks) {
    w.items.forEach((item, i) => {
      const settled = w.states[i] === "completed";
      if (!settled) return;
      if (
        item.modality !== "Knowledge check" &&
        item.modality !== "Module assessment" &&
        item.modality !== "Chapter gate"
      ) {
        return;
      }
      const spread = Math.round((rand() - 0.4) * 16);
      const score = Math.max(35, Math.min(100, readinessScore + spread));
      const attempts = item.modality === "Chapter gate" ? 1 : 4;
      rows.push({
        id: `${item.id}-a1`,
        title: item.title,
        type: item.modality,
        date: `${["3", "9", "14", "21", "27"][rows.length % 5]} Aug 2026`,
        attemptNumber: score < 80 && attempts > 1 ? 2 : 1,
        attempts,
        score,
        passed: score >= 80,
      });
    });
  }
  return rows.slice(0, 8);
}

const STRUGGLE_TOPICS = [
  "client relationship foundations",
  "discovery and objectives",
  "suitability under pressure",
  "advice documentation",
  "the annual risk budget and fee share",
  "what to record after a suitability conversation",
];

function handsFor(
  record: Pick<LearnerRecord, "id" | "name" | "readinessScore" | "band">,
  weeks: LearnerWeekProgress[],
  rand: () => number,
  openItems: number,
): LearnerHandRaised[] {
  const count = openItems > 0 ? openItems : rand() < 0.45 ? 1 : 0;
  if (count === 0) return [];
  const activeWeek = weeks.find((w) => w.state === "in_progress") ?? weeks[0];
  return Array.from({ length: Math.min(count, 3) }, (_, i) => {
    const item = activeWeek.items[Math.floor(rand() * activeWeek.items.length)] ?? activeWeek.items[0];
    return {
      id: `${record.id}-hr${i + 1}`,
      moduleName: activeWeek.name,
      sessionName: item?.title ?? "Session",
      message: `I'm not confident about ${pick(rand, STRUGGLE_TOPICS).toLowerCase()} yet — could we go over it before my next assessment?`,
      raisedAt: `${10 + i * 3} Aug 2026`,
      status: i === 0 ? "open" : "resolved",
      readinessScore: record.readinessScore,
      readinessBand: record.band,
    };
  });
}

function sageFor(
  weeks: LearnerWeekProgress[],
  rand: () => number,
): { struggles: LearnerRecord["sageStruggles"]; sessions: LearnerSageSession[] } {
  const activeWeek = weeks.find((w) => w.state === "in_progress") ?? weeks[0];
  // Two distinct topics: offset the second pick so it can never repeat.
  const first = Math.floor(rand() * STRUGGLE_TOPICS.length);
  const struggles = [first, (first + 1 + Math.floor(rand() * (STRUGGLE_TOPICS.length - 1))) % STRUGGLE_TOPICS.length].map(
    (idx) => ({
      topic: STRUGGLE_TOPICS[idx],
      detail: `Appeared in ${2 + Math.floor(rand() * 3)} sessions · ${1 + Math.floor(rand() * 4)} comprehension check failures`,
    }),
  );
  const sessions = activeWeek.items.slice(0, 3).map((item, i) => ({
    name: item.title,
    date: `Aug ${4 + i * 3}`,
    interactions: i === 2 ? "In progress" : `${3 + Math.floor(rand() * 6)} interactions`,
    escalations: rand() < 0.25 ? "1 escalation" : "None",
    canView: i !== 2,
  }));
  return { struggles, sessions };
}

function eventsFor(rand: () => number): LearnerEventRow[] {
  const names = [
    "Investment Management intake workshop",
    "Intake workshop — afternoon",
  ];
  return names.slice(0, 2 + (rand() < 0.5 ? 1 : 0)).map((name, i) => ({
    name,
    date: `${12 + i * 5} Aug 2026`,
    registration: rand() < 0.7 ? "Registered" : "Assigned",
    attendance: i === 0 ? (rand() < 0.8 ? "Attended" : "Absent") : "Upcoming",
  }));
}

function pacingFor(progress: number, rand: () => number): { day: number; pct: number }[] {
  const days = 5;
  return Array.from({ length: days }, (_, i) => {
    const d = i + 1;
    const target = (progress / days) * d;
    const jitter = i === days - 1 ? 0 : (rand() - 0.5) * 6;
    return { day: d, pct: Math.max(0, Math.min(100, Math.round(target + jitter))) };
  });
}

function coachingFor(rand: () => number, band: BandLabel): { date: string; note: string }[] {
  if (band === "Ready" || band === "Fast Tracker") return [];
  return [
    {
      date: `${5 + Math.floor(rand() * 20)} Aug 2026`,
      note:
        band === "At Risk"
          ? "Intervention logged: additional practice assigned and a check-in scheduled."
          : "Coaching note: reviewed pacing and agreed a plan for the next readiness check.",
    },
  ];
}

// ------------------------------------------------------------------ directory

function buildRecord(raw: RawLearner): LearnerRecord {
  const rand = rngFor(raw.id + raw.name);
  const isJordan = raw.id === JORDAN_ID || raw.name === "Jordan Kim";
  const cohort =
    raw.cohort ??
    (DEMO_ENROLMENT_IDS.has(raw.id)
      ? CSR_DEMO_COHORT_NAME
      : PROD_ENROLMENT_IDS.has(raw.id)
        ? CSR_COHORT_NAME
        : "New Starter Cohort Q3");
  const isDemoCohort = cohort === CSR_DEMO_COHORT_NAME;
  const progress = raw.progress ?? Math.round(rand() * 90);
  const readinessScore = readinessScoreFrom(raw, rand);
  const band = raw.band ?? bandForScore(readinessScore);
  const status: LearnerStatusLabel =
    raw.status ?? (progress === 0 ? "Not started" : progress >= 100 ? "Completed" : "In progress");
  const weeks = weeksFor(progress, rngFor(`${raw.id}-weeks`));
  const openItems = raw.openItems ?? (status === "At risk" ? 2 : rand() < 0.35 ? 1 : 0);
  const sage = sageFor(weeks, rngFor(`${raw.id}-sage`));

  const base = {
    id: raw.id,
    name: raw.name,
    email: raw.email ?? emailFor(raw.name),
    role: "Customer Service Representative",
    lob: raw.lob ?? CSR_LINE_OF_BUSINESS,
    cohort,
    journeyName: IM_INTAKE_JOURNEY_NAME,
    managerName: cohort === IM_INTAKE_COHORT_NAME ? IM_MANAGER_NAME : isJordan ? IM_MANAGER_NAME : pick(rngFor(`${raw.id}-mgr`), MANAGERS),
    facilitatorName: isDemoCohort ? "Alex Morgan" : pick(rngFor(`${raw.id}-fac`), FACILITATORS),
    businessLeaderName: isDemoCohort ? "Taylor Reyes" : pick(rngFor(`${raw.id}-bl`), BUSINESS_LEADERS),
    enrolledDate: raw.enrolledDate ?? (isDemoCohort ? "2026-08-31" : "2026-07-14"),
    lastActive: raw.lastActive ?? "2 days ago",
    status,
    progress,
    readinessScore,
    band,
    readiness: raw.readiness ?? coarseFor(band),
    openItems,
    isJordan,
    recordsId: isJordan ? JORDAN_ID : raw.id,
    weeks,
  };

  return {
    ...base,
    handsRaised: handsFor(base, weeks, rngFor(`${raw.id}-hands`), openItems),
    sageStruggles: sage.struggles,
    sageSessions: sage.sessions,
    assessments: assessmentsFor(weeks, rngFor(`${raw.id}-assess`), readinessScore),
    events: eventsFor(rngFor(`${raw.id}-events`)),
    pacing: pacingFor(progress, rngFor(`${raw.id}-pace`)),
    coachingHistory: coachingFor(rngFor(`${raw.id}-coach`), band),
  };
}

const BY_ID = new Map<string, LearnerRecord>();
for (const raw of RAW) {
  if (!BY_ID.has(raw.id)) BY_ID.set(raw.id, buildRecord(raw));
}

/** Name slugs ("jordan-kim") used by analytics tables as learner ids. */
const BY_SLUG = new Map<string, LearnerRecord>();
for (const record of BY_ID.values()) {
  const slug = record.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (!BY_SLUG.has(slug)) BY_SLUG.set(slug, record);
}

export const LEARNER_DIRECTORY: LearnerRecord[] = [...BY_ID.values()];

/** The selected learner, or undefined when the id is unknown. */
export function getLearnerRecord(id: string | undefined): LearnerRecord | undefined {
  if (!id) return undefined;
  return BY_ID.get(id) ?? BY_SLUG.get(id.toLowerCase());
}

/** The cohort a learner belongs to, for surfaces that only need the label. */
export function learnerCohortName(id: string | undefined): string | undefined {
  return getLearnerRecord(id)?.cohort;
}
