export type JourneyStatus = "active" | "draft" | "inactive";

export type LineOfBusiness =
  | "Medicare"
  | "Medicaid"
  | "Commercial"
  | "Marketplace"
  | "Dual Eligibles";

export const LINES_OF_BUSINESS: LineOfBusiness[] = [
  "Medicare",
  "Medicaid",
  "Commercial",
  "Marketplace",
  "Dual Eligibles",
];

export type CurriculumOption = {
  id: string;
  name: string;
  status: "active" | "draft" | "inactive";
  contentCount: number;
  estimatedDuration: string;
  lineOfBusiness: LineOfBusiness[];
};

export const CURRICULA_OPTIONS: CurriculumOption[] = [
  {
    id: "cur-medicare-onboarding",
    name: "IM Intake Pathway",
    status: "active",
    contentCount: 12,
    estimatedDuration: "3 hrs 35 min",
    lineOfBusiness: ["Medicare"],
  },
  {
    id: "cur-new-hire-foundations",
    name: "New Hire Foundations Path",
    status: "active",
    contentCount: 6,
    estimatedDuration: "2 hrs 30 min",
    lineOfBusiness: ["Medicare", "Medicaid"],
  },
  {
    id: "cur-compliance-refresher",
    name: "Compliance Refresher Path",
    status: "active",
    contentCount: 3,
    estimatedDuration: "45 min",
    lineOfBusiness: ["Medicare", "Medicaid", "Commercial"],
  },
  {
    id: "cur-medicare-advantage",
    name: "Discretionary Portfolio Management",
    status: "active",
    contentCount: 3,
    estimatedDuration: "45 min",
    lineOfBusiness: ["Medicare"],
  },
  {
    id: "cur-medicaid-onboarding",
    name: "Custody Services Onboarding Path",
    status: "draft",
    contentCount: 7,
    estimatedDuration: "3 hrs",
    lineOfBusiness: ["Medicaid"],
  },
  {
    id: "cur-claims-billing",
    name: "Trade and Settlement Essentials Path",
    status: "active",
    contentCount: 5,
    estimatedDuration: "2 hrs 10 min",
    lineOfBusiness: ["Commercial"],
  },
  {
    id: "cur-commercial-product",
    name: "Private Client Product Path",
    status: "draft",
    contentCount: 4,
    estimatedDuration: "1 hr 50 min",
    lineOfBusiness: ["Commercial"],
  },
  {
    id: "cur-suitability-file",
    name: "Suitability File Standards Path",
    status: "active",
    contentCount: 2,
    estimatedDuration: "25 min",
    lineOfBusiness: ["Medicare"],
  },
];

export type JourneySettings = {
  completionRule: "all" | "minimum";
  minimumCurricula?: number;
  progression: "sequential" | "open";
  durationDays?: number;
  allowRestart: boolean;
  awardCertificate: boolean;
  notifyAdmin: boolean;
};

export type JourneyItemType = "curriculum" | "roleplay" | "assessment" | "event";

export type JourneyItem = {
  type: JourneyItemType;
  id: string;
};

export type SimpleContentOption = {
  id: string;
  name: string;
  status: "active" | "draft" | "inactive";
  meta: string;
};

export const ROLEPLAY_OPTIONS: SimpleContentOption[] = [
  {
    id: "rp1",
    name: "Pharmacy Technician — Counselling a Patient on a New Medication",
    status: "active",
    meta: "Role-play · Module 1: Medicare Foundations",
  },
  {
    id: "rp2",
    name: "Health Coach Intake Conversation",
    status: "draft",
    meta: "Role-play · Module 2: Role Orientation",
  },
  {
    id: "rp3",
    name: "Handling a Medicare Part D Coverage Question",
    status: "active",
    meta: "Role-play · Module 3: Coverage Determination & COB",
  },
];

export const ASSESSMENT_OPTIONS: SimpleContentOption[] = [
  { id: "m4", name: "Module 1 Assessment", status: "active", meta: "Assessment · Module 1: Medicare Foundations" },
  { id: "m8", name: "Module 2 Assessment", status: "active", meta: "Assessment · Module 2: Eligibility & Enrolment" },
  { id: "m12", name: "Module 3 Assessment", status: "active", meta: "Assessment · Module 3: Coverage Determination & COB" },
  { id: "m15", name: "Module 4 Assessment", status: "draft", meta: "Assessment · Module 4: Claims & Billing" },
  { id: "n4", name: "New Hire Module 1 Assessment", status: "active", meta: "Assessment · Module 1: Workplace Foundations" },
];

export function findRoleplay(id: string): SimpleContentOption | undefined {
  return ROLEPLAY_OPTIONS.find((r) => r.id === id);
}

export function findAssessment(id: string): SimpleContentOption | undefined {
  return ASSESSMENT_OPTIONS.find((a) => a.id === id);
}

export const EVENT_OPTIONS: SimpleContentOption[] = [
  {
    id: "evt-im-intake-workshop",
    name: "Investment Management intake workshop",
    status: "active",
    meta: "Live Event · Monday, 20 July 2026 · 9:00 AM – 10:30 AM · In-person · Rathbones Institute, London",
  },
];

export function findEvent(id: string): SimpleContentOption | undefined {
  return EVENT_OPTIONS.find((e) => e.id === id);
}


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
  startsAt: string;
};

export type JourneyLiveEvent = {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  format: string;
  location: string;
  facilitatorName: string;
  sessions?: LiveEventSession[];
};

export type Journey = {
  id: string;
  name: string;
  description: string;
  status: JourneyStatus;
  curriculaIds: string[];
  lineOfBusiness: LineOfBusiness[];
  assignedCohorts: number;
  lastModified: string;
  tags: string[];
  settings: JourneySettings;
  liveEvents?: JourneyLiveEvent[];
};

export const DEFAULT_SETTINGS: JourneySettings = {
  completionRule: "all",
  progression: "sequential",
  allowRestart: false,
  awardCertificate: false,
  notifyAdmin: true,
};

export const IM_INTAKE_JOURNEY_NAME = "Investment Manager Full Onboarding Journey";
export const IM_INTAKE_PATH_NAMES = [
  "IM Intake Pathway",
  "Compliance Refresher Path",
  "Discretionary Portfolio Management",
] as const;
export const IM_INTAKE_COHORT_ID = "cohort-a";
export const IM_INTAKE_COHORT_NAME = "IM Intake Cohort A";
export const IM_MANAGER_NAME = "Phoebe Kapoor";

export const JOURNEYS: Journey[] = [
  {
    id: "j-medicare-full",
    name: IM_INTAKE_JOURNEY_NAME,
    description:
      "End-to-end onboarding for new Investment Managers covering foundational training, compliance, and product knowledge.",
    status: "active",
    curriculaIds: [
      "cur-medicare-onboarding",
      "cur-compliance-refresher",
      "cur-medicare-advantage",
    ],
    lineOfBusiness: ["Medicare"],
    assignedCohorts: 1,
    lastModified: "2025-06-14",
    tags: ["Investment Management", "Onboarding", "Investment Manager"],
    settings: { ...DEFAULT_SETTINGS, durationDays: 90 },
    liveEvents: [
      {
        id: "evt-im-intake-workshop",
        title: "Investment Management intake workshop",
        dateLabel: "Monday, 20 July 2026",
        timeLabel: "9:00 AM – 10:30 AM",
        format: "In-person",
        location: "Rathbones Institute, London",
        facilitatorName: "Phoebe Kapoor",
        sessions: [
          {
            id: "im-intake-session-a",
            name: "Intake workshop — morning",
            dayLabel: "Monday 9:00 AM",
            dateLabel: "Monday, 20 July 2026",
            timeLabel: "9:00 AM – 10:30 AM",
            facilitatorName: "Phoebe Kapoor",
            format: "In-person",
            location: "Rathbones Institute, London",
            capacity: 24,
            registered: 8,
            startsAt: "2026-07-20T09:00:00",
          },
          {
            id: "im-intake-session-b",
            name: "Intake workshop — afternoon",
            dayLabel: "Monday 2:00 PM",
            dateLabel: "Monday, 20 July 2026",
            timeLabel: "2:00 PM – 3:30 PM",
            facilitatorName: "Phoebe Kapoor",
            format: "Virtual",
            location: "Online",
            capacity: 24,
            registered: 5,
            startsAt: "2026-07-20T14:00:00",
          },
        ],
      },
    ],
  },
  {
    id: "j-new-hire-foundations",
    name: "New Hire Foundations Journey",
    description:
      "Foundational learning journey for all new hires across Investment Management and Custody Services.",
    status: "active",
    curriculaIds: ["cur-new-hire-foundations", "cur-compliance-refresher"],
    lineOfBusiness: ["Medicare", "Medicaid"],
    assignedCohorts: 1,
    lastModified: "2025-06-10",
    tags: ["Foundations", "New Hire"],
    settings: { ...DEFAULT_SETTINGS, durationDays: 60 },
  },
  {
    id: "j-medicaid-onboarding",
    name: "Custody Services Investment Manager Onboarding Journey",
    description: "Onboarding pathway for Custody Services investment managers.",
    status: "active",
    curriculaIds: ["cur-medicaid-onboarding", "cur-compliance-refresher"],
    lineOfBusiness: ["Medicaid"],
    assignedCohorts: 1,
    lastModified: "2025-06-05",
    tags: ["Custody Services", "Onboarding"],
    settings: { ...DEFAULT_SETTINGS, durationDays: 75 },
  },
  {
    id: "j-commercial-product",
    name: "Private Client Lines Product Training Journey",
    description: "Product-focused training journey for private client representatives.",
    status: "active",
    curriculaIds: ["cur-commercial-product", "cur-claims-billing"],
    lineOfBusiness: ["Commercial"],
    assignedCohorts: 0,
    lastModified: "2025-05-28",
    tags: ["Private Client", "Product"],
    settings: { ...DEFAULT_SETTINGS },
  },
  {
    id: "j-dual-eligibles",
    name: "Multi-Mandate Clients Specialist Journey",
    description:
      "Specialist training combining Investment Management and Custody Services for multi-mandate clients.",
    status: "draft",
    curriculaIds: ["cur-medicare-onboarding", "cur-medicaid-onboarding"],
    lineOfBusiness: ["Dual Eligibles"],
    assignedCohorts: 0,
    lastModified: "2025-05-20",
    tags: ["Multi-Mandate Clients", "Specialist"],
    settings: { ...DEFAULT_SETTINGS, progression: "open" },
  },
  {
    id: "j-marketplace",
    name: "Client Introduction Network Onboarding Journey",
    description: "Initial onboarding journey for Client Introduction Network representatives.",
    status: "draft",
    curriculaIds: ["cur-new-hire-foundations"],
    lineOfBusiness: ["Marketplace"],
    assignedCohorts: 0,
    lastModified: "2025-05-15",
    tags: ["Client Introduction Network", "Onboarding"],
    settings: { ...DEFAULT_SETTINGS },
  },
  {
    id: "j-suitability-file",
    name: "Suitability File Standards Journey",
    description:
      "Short journey for the suitability file-note standard. The article is versioned; learners who already started it stay on the earlier version.",
    status: "active",
    curriculaIds: ["cur-suitability-file"],
    lineOfBusiness: ["Medicare"],
    assignedCohorts: 2,
    lastModified: "2026-09-28",
    tags: ["Suitability", "Versioned"],
    settings: { ...DEFAULT_SETTINGS, durationDays: 21 },
  },
];

export type AssignedCohort = {
  id: string;
  name: string;
  status: "active" | "starting" | "completed" | "archived";
  learners: number;
  assignedDate: string;
};

export const JOURNEY_COHORT_STUBS: AssignedCohort[] = [
  { id: IM_INTAKE_COHORT_ID, name: IM_INTAKE_COHORT_NAME, status: "active", learners: 6, assignedDate: "2026-07-14" },
];

export function findJourney(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}

export function findCurriculum(id: string): CurriculumOption | undefined {
  return CURRICULA_OPTIONS.find((c) => c.id === id);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const STATUS_LABEL: Record<JourneyStatus, string> = {
  active: "Active",
  draft: "Draft",
  inactive: "Inactive",
};

export function journeyLiveEventsByName(journeyName: string): JourneyLiveEvent[] {
  return JOURNEYS.find((j) => j.name === journeyName)?.liveEvents ?? [];
}

export function findJourneyLiveEventSession(id: string | undefined): LiveEventSession | undefined {
  if (!id) return undefined;
  for (const journey of JOURNEYS) {
    for (const event of journey.liveEvents ?? []) {
      const session = event.sessions?.find((item) => item.id === id);
      if (session) return session;
    }
  }
  return undefined;
}
