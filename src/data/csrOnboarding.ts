/**
 * CSR Onboarding program — six weekly paths grouped into one journey.
 * Used by the Admin curriculum/journey/cohort screens and by Jordan Kim's
 * learner experience.
 */
import { findAssignedJourneyItem } from "./assignedLearning";

export type CsrModality =
  | "Pre-Check"
  | "eLearning"
  | "Role-play"
  | "Readiness Check"
  | "Comprehension Check"
  | "Proficiency Check"
  | "Storyline Demo"
  | "Zenerate Simulation"
  | "Benchmark Check"
  | "Article"
  | "Knowledge check"
  | "Role play"
  | "Module assessment"
  | "Chapter gate"
  | "Micro-learning";

export type CsrItem = {
  id: string;
  order: number;
  modality: CsrModality;
  title: string;
  duration: number;
  /** AI-recommended addition surfaced by the adaptive framework. */
  recommended?: boolean;
  /** Facilitator who assigned this item as additional learning. */
  assignedBy?: string;
  /** Reason the facilitator gave, shown to the learner. */
  assignedReason?: string;
};

export type CsrWeek = {
  id: string;
  number: number;
  name: string;
  items: CsrItem[];
};

export const CSR_JOURNEY_ID = "j-csr-onboarding";
export const CSR_JOURNEY_NAME = "CSR Onboarding Journey";
export const CSR_COHORT_ID = "cohort-csr-onboarding";
export const CSR_COHORT_NAME = "CSR Onboarding Cohort";
export const CSR_LINE_OF_BUSINESS = "Aetna";

/**
 * The single live workshop attached to the CSR Onboarding Journey. Shared by
 * the learner Live Events screens, the facilitator event, the admin content
 * library and the journey detail page so the details can never drift.
 * Journey-level only: it is not an activity inside any weekly curriculum and
 * does not gate learner progress.
 */
export const CSR_LIVE_EVENT = {
  id: "csr-live-event-w5",
  title: "CSR Onboarding Live Workshop — CSR Onboarding Week 5",
  shortTitle: "Aetna CSR Live Workshop — Week 5",
  weekId: "cur-csr-week-5",
  weekName: "CSR Onboarding Week 5",
  date: "2026-07-24T09:00:00Z",
  dateLabel: "Friday, 24 July 2026",
  dateShortLabel: "Jul 24, 2026",
  timeLabel: "9:00 AM – 10:00 AM",
  timeShortLabel: "9:00 AM",
  format: "In-person",
  location: "CVS Training Center, Hartford CT — Room 4B",
  locationShort: "CVS Training Center, Hartford CT",
  facilitatorName: "Sarah Mitchell",
  facilitatorInitials: "SM",
  facilitatorRole: "Senior Learning Facilitator",
  description:
    "This live session works through the Week 5 member scenarios: coverage termination, COBRA elections and the benefit standards behind them. Facilitators walk through real call recordings, demonstrate best-practice explanations, and open the floor for Q&A. Attendance is optional but strongly recommended for learners currently working through Week 5.",
} as const;

/**
 * Selectable sessions for the CSR Onboarding live workshop. Shared by the
 * admin cohort "Events and Sessions" step and the learner Live Events screen
 * so the same four options appear on both surfaces.
 */
export type LiveEventSession = {
  id: string;
  name: string;
  dayLabel: string;
  dateLabel: string;
  timeLabel: string;
  facilitatorName: string;
  format: string;
  location: string;
  capacity: number;
  registered: number;
  /** ISO start date/time, used to determine whether a session is still upcoming. */
  startsAt: string;
};

export const CSR_LIVE_EVENT_SESSIONS: LiveEventSession[] = [
  {
    id: "csr-live-session-a",
    name: "CSR Onboarding Live Session A",
    dayLabel: "Monday 9:00 AM",
    dateLabel: "Monday, 20 July 2026",
    timeLabel: "9:00 AM – 10:00 AM",
    facilitatorName: "Sarah Mitchell",
    format: "In-person",
    location: "CVS Training Center, Hartford CT — Room 4B",
    capacity: 25,
    registered: 12,
    startsAt: "2026-07-20T09:00:00",
  },
  {
    id: "csr-live-session-b",
    name: "CSR Onboarding Live Session B",
    dayLabel: "Tuesday 1:00 PM",
    dateLabel: "Tuesday, 21 July 2026",
    timeLabel: "1:00 PM – 2:00 PM",
    facilitatorName: "David Okafor",
    format: "Virtual",
    location: "Microsoft Teams",
    capacity: 30,
    registered: 18,
    startsAt: "2026-07-21T13:00:00",
  },
  {
    id: "csr-live-session-c",
    name: "CSR Onboarding Live Session C",
    dayLabel: "Wednesday 10:00 AM",
    dateLabel: "Wednesday, 22 July 2026",
    timeLabel: "10:00 AM – 11:00 AM",
    facilitatorName: "Priya Shen",
    format: "Virtual",
    location: "Microsoft Teams",
    capacity: 30,
    registered: 7,
    startsAt: "2026-07-22T10:00:00",
  },
  {
    id: "csr-live-session-d",
    name: "CSR Onboarding Live Session D",
    dayLabel: "Thursday 2:00 PM",
    dateLabel: "Thursday, 23 July 2026",
    timeLabel: "2:00 PM – 3:00 PM",
    facilitatorName: "Sarah Mitchell",
    format: "In-person",
    location: "CVS Training Center, Hartford CT — Room 2A",
    capacity: 25,
    registered: 21,
    startsAt: "2026-07-23T14:00:00",
  },
];

export function findLiveEventSession(id: string | undefined): LiveEventSession | undefined {
  return CSR_LIVE_EVENT_SESSIONS.find((s) => s.id === id);
}

/** True when the session starts strictly after the given moment. */
export function isUpcomingSession(s: LiveEventSession, now: Date = new Date()): boolean {
  return new Date(s.startsAt).getTime() > now.getTime();
}

/** Future sessions only, soonest first. */
export function upcomingSessions(
  sessions: LiveEventSession[],
  now: Date = new Date(),
): LiveEventSession[] {
  return sessions
    .filter((s) => isUpcomingSession(s, now))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

/** Single-line metadata summary for a live event session. */
export function liveEventSessionMeta(s: LiveEventSession): string {
  return `${s.dateLabel} · ${s.timeLabel} · ${s.facilitatorName} · ${s.format} · ${s.location}`;
}




/** Checks whose results feed the existing adaptive journey logic. */
export const ADAPTIVE_CHECK_MODALITIES: CsrModality[] = [
  "Pre-Check",
  "Benchmark Check",
  "Readiness Check",
  "Zenerate Simulation",
];

export function isAdaptiveCheck(item: CsrItem): boolean {
  return ADAPTIVE_CHECK_MODALITIES.includes(item.modality);
}

const DURATION_BY_MODALITY: Record<CsrModality, number> = {
  "Pre-Check": 15,
  eLearning: 8,
  "Role-play": 12,
  "Readiness Check": 20,
  "Comprehension Check": 6,
  "Proficiency Check": 30,
  "Storyline Demo": 10,
  "Zenerate Simulation": 14,
  "Benchmark Check": 18,
  Article: 20,
  "Knowledge check": 10,
  "Role play": 20,
  "Module assessment": 25,
  "Chapter gate": 15,
  "Micro-learning": 8,
};

function buildItems(
  weekNumber: number | string,
  rows: [CsrModality, string][],
): CsrItem[] {
  return rows.map(([modality, title], i) => ({
    id: `csr-w${weekNumber}-i${i + 1}`,
    order: i + 1,
    modality,
    title,
    duration: DURATION_BY_MODALITY[modality],
  }));
}

const WEEK_1: [CsrModality, string][] = [
  ["Pre-Check", "Week 1 Pre-Check"],
  ["eLearning", "Welcome to Aetna Member Support"],
  ["eLearning", "Navigating the Member Record"],
  ["Role-play", "Role-play: First Member Call"],
  ["Readiness Check", "Week 1 Readiness Check"],
];

const WEEK_2: [CsrModality, string][] = [
  ["Pre-Check", "Week 2 Pre-Check"],
  ["eLearning", "Call Handling Fundamentals"],
  ["eLearning", "Active Listening and Empathy on Calls"],
  ["Role-play", "Role-play: De-escalating a Frustrated Member"],
  ["Readiness Check", "Week 2 Readiness Check"],
];

const WEEK_3: [CsrModality, string][] = [
  ["Pre-Check", "Week 3 Pre-Check"],
  ["eLearning", "Plan Benefits Basics"],
  ["eLearning", "Eligibility and Enrolment Essentials"],
  ["Role-play", "Role-play: Explaining Plan Coverage"],
  ["Readiness Check", "Week 3 Readiness Check"],
];

const WEEK_4: [CsrModality, string][] = [
  ["Pre-Check", "Week 4 Pre-Check"],
  ["eLearning", "Claims Lifecycle Overview"],
  ["eLearning", "Reading an Explanation of Benefits"],
  ["Role-play", "Role-play: Resolving a Claim Query"],
  ["Readiness Check", "Week 4 Readiness Check"],
];

const WEEK_6: [CsrModality, string][] = [
  ["Pre-Check", "Week 6 Pre-Check"],
  ["eLearning", "Escalations and Grievance Handling"],
  ["eLearning", "Quality, Compliance and Call Documentation"],
  ["Role-play", "Role-play: Complex Escalation Handover"],
  ["Readiness Check", "Week 6 Readiness Check"],
  ["Proficiency Check", "CSR Onboarding Proficiency Check"],
];

const WEEK_5: [CsrModality, string][] = [
  ["Pre-Check", "Week 5 Pre-Check"],
  ["eLearning", "Unit 5 Call Study"],
  ["eLearning", "24 Hour Service Excellence Station"],
  ["eLearning", "How Does the Member View Plan Information?"],
  ["eLearning", "Why Does Coverage End?"],
  ["eLearning", "COBRA"],
  ["Comprehension Check", "Comprehension Check - COBRA"],
  ["eLearning", "Call Example: Ownership"],
  ["eLearning", "Aetna Benefit Standards"],
  ["eLearning", "Liberalization"],
  ["Storyline Demo", "Precertification"],
  ["Comprehension Check", "Comprehension Check - Precertification"],
  ["Storyline Demo", "Clinical Policy Bulletin (CPBs)"],
  ["Comprehension Check", "Comprehension Check - CPBs"],
  ["eLearning", "Therapy"],
  ["eLearning", "Pharmacy"],
  ["Zenerate Simulation", "GPS - Pharmacy Benefits Part 1 - Zenarate Simulation"],
  ["Zenerate Simulation", "GPS - Pharmacy Benefits Part 2 - Zenarate Simulation"],
  ["eLearning", "Claim Examples (Chiro/PT/OT)"],
  ["eLearning", "Mastering Critical Thinking Skills"],
  ["Zenerate Simulation", "GPS - Physical Therapy and Durable Medical Equipment - Zenarate Simulation"],
  ["eLearning", "Vendor Products"],
  ["eLearning", "EPDB Provider Search Review"],
  ["eLearning", "Radiology and Lab"],
  ["Comprehension Check", "Comprehension Check - Radiology and Lab"],
  ["eLearning", "HAIRPENS"],
  ["eLearning", "Bariatric Surgery"],
  ["Comprehension Check", "Institutes of Quality (IOQ)"],
  ["eLearning", "Telemedicine and Teladoc"],
  ["Storyline Demo", "Locating Participating Pharmacies"],
  ["eLearning", "Transfer to Aetna Pharmacy and Pharmacy Activities"],
  ["eLearning", "Pharmacy Key Points"],
  ["eLearning", "Claim Examples (HAIRPENS, Bariatric, Telemedicine)"],
  ["Comprehension Check", "Lifelines"],
  ["Zenerate Simulation", "Skill Builder - HAIRPENS"],
  ["eLearning", "Member Communications"],
  ["eLearning", "Confidentiality Review"],
  ["Storyline Demo", "Maternity"],
  ["eLearning", "Putting It All Together - Maternity"],
  ["Comprehension Check", "Comprehension Check - Maternity"],
  ["eLearning", "Emergency Room"],
  ["eLearning", "Urgent Care"],
  ["eLearning", "Claim Examples (Maternity, ER, UC)"],
  ["eLearning", "Weekly Updates"],
  ["Benchmark Check", "Unit 5 Section 3 Benchmark Check"],
  ["eLearning", "Walking in Someone Else's Shoes"],
  ["eLearning", "Enhanced Clinical Review Program (ECRP)"],
  ["eLearning", "Call Example: Prior Authorization"],
  ["Comprehension Check", "Comprehension Check - NPL Tool"],
  ["Storyline Demo", "Iris Assistant to Determine Coverage Activity"],
  ["Storyline Demo", "EviCore Access Request"],
  ["eLearning", "Network Inadequacy"],
  ["eLearning", "Walk-in Clinics"],
  ["eLearning", "Prosthetics and Orthotics"],
  ["Comprehension Check", "Comprehension Check - Prosthetics and Orthotics"],
  ["eLearning", "Claim Examples (Walk-in Clinic and Orthotic)"],
  ["eLearning", "AA Online Reference (AAOLR)"],
  ["Comprehension Check", "Type of Service Codes (TOS)"],
  ["eLearning", "First Impression Treatment (FIT)"],
  ["Zenerate Simulation", "GPS - Orthotics & Enhanced Clinical Review Program - Zenarate Simulation"],
  ["eLearning", "CVS Enterprise Orientation"],
  ["eLearning", "Infertility"],
  ["eLearning", "PSPP Infertility Benefits Activity"],
  ["eLearning", "Claim Examples (AHF)"],
  ["Readiness Check", "Unit 5 Readiness Check"],
  ["Zenerate Simulation", "Weight Loss Surgery Benefits - Zenarate Simulation"],
];

export const CSR_WEEKS: CsrWeek[] = [
  { id: "cur-csr-week-1", number: 1, name: "CSR Onboarding Week 1", items: buildItems(1, WEEK_1) },
  { id: "cur-csr-week-2", number: 2, name: "CSR Onboarding Week 2", items: buildItems(2, WEEK_2) },
  { id: "cur-csr-week-3", number: 3, name: "CSR Onboarding Week 3", items: buildItems(3, WEEK_3) },
  { id: "cur-csr-week-4", number: 4, name: "CSR Onboarding Week 4", items: buildItems(4, WEEK_4) },
  { id: "cur-csr-week-5", number: 5, name: "CSR Onboarding Week 5", items: buildItems(5, WEEK_5) },
  { id: "cur-csr-week-6", number: 6, name: "CSR Onboarding Week 6", items: buildItems(6, WEEK_6) },
];

/**
 * Demo-only Week 5 path. A shorter, separately-managed copy of Week 5 used by
 * the CSR Onboarding Journey - Demo. The production Week 5 above is untouched.
 */
const WEEK_5_DEMO: [CsrModality, string][] = [
  ["Pre-Check", "Week 5 Pre-Check"],
  ["eLearning", "Unit 5 Call Study"],
  ["eLearning", "24 Hour Service Excellence Station"],
  ["Comprehension Check", "Comprehension Check - COBRA"],
  ["eLearning", "Aetna Benefit Standards"],
  // "GPS - Pharmacy Benefits Part 1 - Zenarate Simulation" is not a standalone
  // activity here: it runs as a component inside the Week 5 Pre-Check.
  ["eLearning", "Claim Examples (HAIRPENS, Bariatric, Telemedicine)"],
  ["Benchmark Check", "Unit 5 Section 3 Benchmark Check"],
  ["eLearning", "Prosthetics and Orthotics"],
  ["Comprehension Check", "Comprehension Check - Prosthetics and Orthotics"],
  ["eLearning", "Claim Examples (Walk-in Clinic and Orthotic)"],
  ["eLearning", "AA Online Reference (AAOLR)"],
  ["eLearning", "CVS Enterprise Orientation"],
  ["eLearning", "Infertility"],
  ["eLearning", "PSPP Infertility Benefits Activity"],
  ["eLearning", "Claim Examples (AHF)"],
  ["Readiness Check", "Unit 5 Readiness Check"],
  ["Zenerate Simulation", "Weight Loss Surgery Benefits - Zenarate Simulation"],
];

export const CSR_DEMO_WEEK_ID = "cur-csr-week-5-demo";
export const CSR_DEMO_JOURNEY_ID = "j-csr-onboarding-demo";
export const CSR_DEMO_JOURNEY_NAME = "CSR Onboarding Journey - Demo";
export const CSR_DEMO_COHORT_ID = "cohort-csr-onboarding-demo";
export const CSR_DEMO_COHORT_NAME = "CSR Onboarding Cohort - Demo";

export const CSR_WEEK_5_DEMO: CsrWeek = {
  id: CSR_DEMO_WEEK_ID,
  number: 5,
  name: "CSR Onboarding Week 5 - Demo",
  items: buildItems("5d", WEEK_5_DEMO),
};

/** Items the adaptive framework must never skip. */
const demoItemIdByTitle = (title: string): string => {
  const found = CSR_WEEK_5_DEMO.items.find((i) => i.title === title);
  return found ? found.id : "";
};

export const CSR_MANDATORY_ITEM_IDS: string[] = [
  demoItemIdByTitle("Unit 5 Call Study"),
  demoItemIdByTitle("CVS Enterprise Orientation"),
].filter(Boolean);

/** Every path defined by the programme, production and demo. */
export const CSR_ALL_WEEKS: CsrWeek[] = [...CSR_WEEKS, CSR_WEEK_5_DEMO];

/** The paths the current learner (Jordan Kim) experiences — demo Week 5. */
export const CSR_LEARNER_WEEKS: CsrWeek[] = CSR_WEEKS.map((w) =>
  w.id === "cur-csr-week-5" ? CSR_WEEK_5_DEMO : w,
);

export const CSR_CURRICULA_IDS = CSR_WEEKS.map((w) => w.id);

/** Path sequence of the demo journey: Weeks 1–4, demo Week 5, Week 6. */
export const CSR_DEMO_CURRICULA_IDS = CSR_LEARNER_WEEKS.map((w) => w.id);

export function findCsrWeek(id: string): CsrWeek | undefined {
  return CSR_ALL_WEEKS.find((w) => w.id === id);
}

export function findCsrItem(id: string): { week: CsrWeek; item: CsrItem } | undefined {
  for (const week of CSR_ALL_WEEKS) {
    const item = week.items.find((i) => i.id === id);
    if (item) return { week, item };
  }
  // Adaptively added items live in the adaptation table, not in the week list,
  // but they are real curriculum items once added — resolve them the same way.
  for (const [checkId, adaptation] of Object.entries(CSR_ADAPTATIONS)) {
    const item = adaptation.add?.find((i) => i.id === id);
    if (!item) continue;
    const owner = findCsrItem(checkId);
    if (owner) return { week: owner.week, item };
  }
  // Facilitator-assigned additional learning sits in the week of the assessment
  // the follow-up relates to.
  const assigned = findAssignedJourneyItem(id);
  if (assigned) {
    const owner = assigned.anchorItemId ? findCsrItem(assigned.anchorItemId) : undefined;
    // Ad-hoc assignments have no anchor — they sit alongside the journey.
    return { week: owner?.week ?? CSR_ALL_WEEKS[0], item: assigned.item };
  }
  return undefined;
}


export function csrWeekDurationLabel(week: CsrWeek): string {
  const mins = week.items.reduce((sum, i) => sum + i.duration, 0);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h} hr${h > 1 ? "s" : ""} ${m} min` : `${m} min`;
}

/** Routes each modality onto the existing learner players. */
export function routeForCsrItem(item: CsrItem): string {
  switch (item.modality) {
    case "Pre-Check":
    case "Benchmark Check":
    case "Readiness Check":
    case "Proficiency Check":
      return `/learner/assessment/${item.id}`;
    case "Comprehension Check":
      return `/learner/comprehension/${item.id}`;
    case "Role-play":
    case "Zenerate Simulation":
      return `/learner/role-play/${item.id}`;
    default:
      return `/learner/session/${item.id}`;
  }
}

/**
 * Adaptive outcomes applied by the existing adaptive framework once a check is
 * completed: content is skipped when already mastered, or recommended content
 * is added. No new rules — the same skip / add / keep semantics used elsewhere.
 */
export const CSR_ADAPTATIONS: Record<string, { skip?: string[]; add?: CsrItem[] }> = {
  // Week 5 Pre-Check
  "csr-w5-i1": {
    skip: ["csr-w5-i3", "csr-w5-i23"],
    add: [
      {
        id: "csr-w5-add1",
        order: 6.5,
        modality: "eLearning",
        title: "Coverage Termination Deep Dive",
        duration: 8,
        recommended: true,
      },
    ],
  },
  // Comprehension Check - COBRA
  "csr-w5-i7": {
    skip: ["csr-w5-i8"],
  },
  // Unit 5 Section 3 Benchmark Check
  "csr-w5-i45": {
    add: [
      {
        id: "csr-w5-add2",
        order: 45.5,
        modality: "eLearning",
        title: "Prior Authorization Refresher",
        duration: 8,
        recommended: true,
      },
    ],
  },
};
