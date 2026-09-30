export type SageContextKind = "article" | "assessment" | "overview" | "dashboard";

export type SageContext = {
  kind: SageContextKind;
  articleTitle?: string;
  moduleName?: string;
  sessionName?: string;
  assessmentName?: string;
  /** Plausible prior topic within the module, used to connect content. */
  priorTopic?: string;
  /** Key points / topics used by contextual responses. */
  topics?: string[];
  /** Approximate hours to complete the module. */
  moduleHours?: string;
  /** Sessions that come before the current one, if any. */
  prerequisites?: string[];
};

const BENEFITS = "Benefits Navigation";
const CLAIMS = "Claims and Billing";

const ROUTE_CONTEXTS: { match: (p: string) => boolean; context: SageContext }[] = [
  {
    match: (p) => p === "/learner/session/s-article",
    context: {
      kind: "article",
      articleTitle: "Coverage Determination",
      moduleName: BENEFITS,
      sessionName: "Session 1 of 4",
      priorTopic: "the Medicare coverage basics from your onboarding sessions",
      topics: [
        "How Medicare decides whether a service is covered",
        "What the Part B deductible means for a member",
        "How coordination of benefits (COB) affects what a member owes",
        "When prior authorisation is required",
      ],
      prerequisites: [],
    },
  },
  {
    match: (p) => p === "/learner/session/s-video",
    context: {
      kind: "article",
      articleTitle: "Medicare Plan Types",
      moduleName: BENEFITS,
      sessionName: "Session 2 of 4",
      priorTopic: "Coverage Determination from Session 1",
      topics: [
        "The difference between Original Medicare and Medicare Advantage",
        "What Part C and Part D each cover",
        "How plan type changes the answer you give a member",
        "Where to check a member's plan type before advising them",
      ],
      prerequisites: ["Session 1 — Coverage Determination"],
    },
  },
  {
    match: (p) => p === "/learner/session/mod4-s1",
    context: {
      kind: "article",
      articleTitle: "Introduction to Claims Processing",
      moduleName: CLAIMS,
      sessionName: "Session 1 of 4",
      priorTopic: "the benefits knowledge you built in Benefits Navigation",
      topics: [
        "The lifecycle of a claim from submission to payment",
        "Common reasons a claim is rejected",
        "How billing codes drive the outcome of a claim",
        "What a member can see about their own claim",
      ],
      prerequisites: [],
    },
  },
  {
    match: (p) => p.startsWith("/learner/assessment/"),
    context: {
      kind: "assessment",
      assessmentName: "Benefits Navigation — Module Assessment",
      moduleName: BENEFITS,
      sessionName: "Session 3 of 4",
      topics: [
        "Coverage determination and medical necessity",
        "Part A, Part B, Part C and Part D basics",
        "Deductibles and the 80/20 split",
        "Coordination of benefits with secondary insurance",
        "When prior authorisation is required",
      ],
    },
  },
  {
    match: (p) => p.startsWith("/learner/role-play/"),
    context: {
      kind: "overview",
      moduleName: BENEFITS,
      sessionName: "Session 4 of 4 — Benefits Lookup Practice",
      moduleHours: "3",
      topics: [
        "Handling a live benefits question with confidence",
        "Verifying a member's plan and COB record",
        "Explaining costs clearly and accurately",
      ],
      prerequisites: [
        "Session 1 — Coverage Determination",
        "Session 2 — Medicare Plan Types",
        "Session 3 — Module Assessment",
      ],
    },
  },
  {
    match: (p) => p.startsWith("/learner/session/"),
    context: {
      kind: "overview",
      moduleName: BENEFITS,
      sessionName: "this session",
      moduleHours: "3",
      topics: [
        "How Medicare coverage decisions are made",
        "The main Medicare plan types and what they cover",
        "How to explain member costs accurately",
      ],
      prerequisites: [],
    },
  },
  {
    match: (p) => p === "/learner/journey",
    context: {
      kind: "overview",
      moduleName: BENEFITS,
      sessionName: "Session 3 — Benefits Lookup Practice",
      moduleHours: "3",
      topics: [
        "How Medicare coverage decisions are made",
        "The main Medicare plan types and what they cover",
        "How to explain member costs accurately",
      ],
      prerequisites: ["Session 1 — Coverage Determination", "Session 2 — Medicare Plan Types"],
    },
  },
  {
    match: (p) => p.startsWith("/learner/graduating/article/"),
    context: {
      kind: "article",
      articleTitle: "Dispute Resolution",
      moduleName: CLAIMS,
      sessionName: "Module 4 · Article",
      priorTopic: "the claims handling basics from earlier in Claims and Billing",
      topics: [
        "When a member can formally dispute a claim decision",
        "The steps in the dispute resolution process",
        "What evidence needs to be captured on the case",
        "How to set expectations with the member on timelines",
      ],
      prerequisites: [],
    },
  },
  {
    match: (p) => p.startsWith("/learner/graduating"),
    context: { kind: "dashboard" },
  },
  {
    match: (p) => p.startsWith("/upskiller"),
    context: { kind: "dashboard" },
  },
  {
    match: (p) => p.startsWith("/readiness"),
    context: { kind: "dashboard" },
  },
];

/** Progress facts used by the dashboard (Context D) responses. */
export const LEARNER_PROGRESS = {
  day: "Day 5 of 15",
  modulesDone: "2 of 8 modules",
  recentItem: "Coverage Determination in Benefits Navigation",
  nextItem: "Session 3 of Benefits Navigation: Benefits Lookup Practice",
  upcoming: [
    "Benefits Lookup Practice — a 10 minute role play",
    "Benefits Navigation module assessment",
    "Claims and Billing kicks off next week",
  ],
  highlights: [
    "You're on Day 5 of 15 and 2 of 8 modules are complete",
    "Your Medicare track sessions are all on time",
    "One focus area flagged: Part B deductibles with secondary insurance",
  ],
};

const DASHBOARD_CONTEXT: SageContext = { kind: "dashboard" };

export function resolveSageContext(pathname: string): SageContext {
  const entry = ROUTE_CONTEXTS.find((r) => r.match(pathname));
  return entry ? entry.context : DASHBOARD_CONTEXT;
}

export const articleLabel = (c: SageContext) => c.articleTitle ?? "this article";
export const moduleLabel = (c: SageContext) => c.moduleName ?? "this module";
export const sessionLabel = (c: SageContext) => c.sessionName ?? "this session";
export const assessmentLabel = (c: SageContext) => c.assessmentName ?? "this assessment";
