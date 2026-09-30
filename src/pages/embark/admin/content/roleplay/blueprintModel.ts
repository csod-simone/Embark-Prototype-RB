/** Role-play blueprint authoring model + stub service (admin Content). */

export type BlueprintEntryMode = "create" | "edit";

export type CreationMethod = "ai" | "form" | null;

export type ExperienceTypeId =
  | "open-practice"
  | "guided-coaching"
  | "tutor"
  | "assessed";

export type BlueprintStageId =
  | "method"
  | "generate"
  | "type"
  | "core"
  | "knowledge"
  | "resources"
  | "criteria"
  | "completion"
  | "review"
  | "validate"
  | "versions"
  | "publish";

export type LifecycleStatus = "draft" | "in-review" | "published" | "archived";
export type ValidationStatus = "pending" | "warnings" | "passed" | "failed";
export type ProvenanceKind = "ai-assisted" | "author-authored" | "mixed";
export type FactReveal = "ai-reveals" | "tell-user-first";
export type ResourcePurpose = "character-accuracy" | "evaluator-only";
export type ContractTestStatus = "passed" | "failed" | "not-run";

export type BlueprintVersionSource = "ai-quality-fix" | "admin-edit" | "initial" | "import";

export type BlueprintVersionDiffPart =
  | { kind: "same"; text: string }
  | { kind: "add"; text: string }
  | { kind: "remove"; text: string };

export type BlueprintVersionFieldDiff = {
  fieldLabel: string;
  fieldPath: string;
  wordsAdded: number;
  wordsRemoved: number;
  parts: BlueprintVersionDiffPart[];
};

export type BlueprintVersion = {
  id: string;
  number: number;
  createdAt: string;
  source: BlueprintVersionSource;
  summary: string;
  isCurrent?: boolean;
  /** Diff vs the previous version; omitted for v1. */
  comparison?: {
    wordsAdded: number;
    wordsRemoved: number;
    fieldsChanged: number;
    fields: BlueprintVersionFieldDiff[];
  };
};

export function versionSourceLabel(source: BlueprintVersionSource): string {
  switch (source) {
    case "ai-quality-fix":
      return "AI quality fix";
    case "admin-edit":
      return "Admin edit";
    case "initial":
      return "Initial draft";
    case "import":
      return "Imported";
  }
}

/** Stub immutable snapshots for the Version history stage. */
export function stubBlueprintVersions(title: string): BlueprintVersion[] {
  const short = title.length > 40 ? `${title.slice(0, 37)}…` : title;
  return [
    {
      id: "v9",
      number: 9,
      createdAt: "2026-08-27T11:29:44",
      source: "ai-quality-fix",
      isCurrent: true,
      summary:
        "Repaired the debrief contract so strengths are optional (0–3) and gaps remain required — matching the compiled review design.",
      comparison: {
        wordsAdded: 36,
        wordsRemoved: 3,
        fieldsChanged: 1,
        fields: [
          {
            fieldLabel: "Review design",
            fieldPath: "/outcomeDesign",
            wordsAdded: 36,
            wordsRemoved: 3,
            parts: [
              { kind: "same", text: '{\n  "debriefInstruction": "' },
              {
                kind: "remove",
                text: "Write two strengths and two gaps",
              },
              {
                kind: "add",
                text:
                  "Write zero to three strengths (optional) and one to three gaps (required). Ground every point in transcript evidence",
              },
              {
                kind: "same",
                text: ` for ${short}."\n}`,
              },
            ],
          },
        ],
      },
    },
    {
      id: "v8",
      number: 8,
      createdAt: "2026-08-26T16:04:12",
      source: "admin-edit",
      summary:
        "Clarified the safety stop and automatic ending copy so suitability breaches fail the run immediately.",
      comparison: {
        wordsAdded: 18,
        wordsRemoved: 7,
        fieldsChanged: 2,
        fields: [
          {
            fieldLabel: "Completion",
            fieldPath: "/completion/safetyStop",
            wordsAdded: 11,
            wordsRemoved: 4,
            parts: [
              { kind: "same", text: '"safetyStop": "' },
              { kind: "remove", text: "End on policy breach" },
              {
                kind: "add",
                text: "End immediately if the learner promises guaranteed returns",
              },
              { kind: "same", text: '"' },
            ],
          },
          {
            fieldLabel: "Automatic ending",
            fieldPath: "/completion/automaticEnding",
            wordsAdded: 7,
            wordsRemoved: 3,
            parts: [
              { kind: "same", text: '"automaticEnding": "' },
              { kind: "remove", text: "Pass when criteria met" },
              {
                kind: "add",
                text: "Success when both required criteria observed; fail on suitability breach",
              },
              { kind: "same", text: '"' },
            ],
          },
        ],
      },
    },
    {
      id: "v7",
      number: 7,
      createdAt: "2026-08-25T09:18:03",
      source: "ai-quality-fix",
      summary:
        "Mapped the optional next-step criterion and repaired a feedback-not-grounded quality warning.",
      comparison: {
        wordsAdded: 12,
        wordsRemoved: 2,
        fieldsChanged: 1,
        fields: [
          {
            fieldLabel: "Evaluation",
            fieldPath: "/criteria/c3/competency",
            wordsAdded: 12,
            wordsRemoved: 2,
            parts: [
              { kind: "same", text: '"competency": ' },
              { kind: "remove", text: "null" },
              { kind: "add", text: '"Deal progression"' },
            ],
          },
        ],
      },
    },
    {
      id: "v6",
      number: 6,
      createdAt: "2026-08-22T14:41:55",
      source: "admin-edit",
      summary: "Pinned retention-policy.pdf to v2 and set resource purpose to character accuracy.",
      comparison: {
        wordsAdded: 9,
        wordsRemoved: 1,
        fieldsChanged: 1,
        fields: [
          {
            fieldLabel: "Resources",
            fieldPath: "/resources/r1/pinnedVersion",
            wordsAdded: 9,
            wordsRemoved: 1,
            parts: [
              { kind: "same", text: '"pinnedVersion": ' },
              { kind: "remove", text: "null" },
              { kind: "add", text: '"v2"' },
            ],
          },
        ],
      },
    },
    {
      id: "v5",
      number: 5,
      createdAt: "2026-08-20T11:02:30",
      source: "admin-edit",
      summary: "Added fact cards for competitor pitch and retirement-timing fear with reveal gates.",
      comparison: {
        wordsAdded: 42,
        wordsRemoved: 0,
        fieldsChanged: 1,
        fields: [
          {
            fieldLabel: "Knowledge",
            fieldPath: "/knowledge",
            wordsAdded: 42,
            wordsRemoved: 0,
            parts: [
              { kind: "same", text: '"knowledge": [\n' },
              {
                kind: "add",
                text:
                  '  { "title": "Client received a competitor pitch…", "reveal": "tell-user-first" },\n  { "title": "Fear about retirement timing", "reveal": "ai-reveals" }\n',
              },
              { kind: "same", text: "]" },
            ],
          },
        ],
      },
    },
    {
      id: "v4",
      number: 4,
      createdAt: "2026-08-18T15:27:08",
      source: "ai-quality-fix",
      summary: "Inferred Assessed simulation from fixed criteria + automatic pass/fail ending.",
      comparison: {
        wordsAdded: 6,
        wordsRemoved: 4,
        fieldsChanged: 1,
        fields: [
          {
            fieldLabel: "Experience type",
            fieldPath: "/experienceType",
            wordsAdded: 6,
            wordsRemoved: 4,
            parts: [
              { kind: "same", text: '"experienceType": "' },
              { kind: "remove", text: "guided-coaching" },
              { kind: "add", text: "assessed" },
              { kind: "same", text: '"' },
            ],
          },
        ],
      },
    },
    {
      id: "v3",
      number: 3,
      createdAt: "2026-08-17T10:11:44",
      source: "admin-edit",
      summary: "Refined persona and AI role behaviour for a guarded, fee-sensitive client.",
      comparison: {
        wordsAdded: 28,
        wordsRemoved: 9,
        fieldsChanged: 2,
        fields: [
          {
            fieldLabel: "Persona",
            fieldPath: "/persona",
            wordsAdded: 14,
            wordsRemoved: 5,
            parts: [
              { kind: "same", text: '"persona": "' },
              { kind: "remove", text: "Frustrated client" },
              {
                kind: "add",
                text: "Margaret Doyle — 12-year client, portfolio at risk, risk-averse",
              },
              { kind: "same", text: '"' },
            ],
          },
        ],
      },
    },
    {
      id: "v2",
      number: 2,
      createdAt: "2026-08-16T13:55:19",
      source: "admin-edit",
      summary: "Set practice objective around retention without breaching suitability.",
      comparison: {
        wordsAdded: 22,
        wordsRemoved: 6,
        fieldsChanged: 1,
        fields: [
          {
            fieldLabel: "Practice objective",
            fieldPath: "/practiceObjective",
            wordsAdded: 22,
            wordsRemoved: 6,
            parts: [
              { kind: "same", text: '"practiceObjective": "' },
              { kind: "remove", text: "Handle a difficult client call" },
              {
                kind: "add",
                text:
                  "Retain an at-risk client threatening to move their portfolio, without breaching suitability",
              },
              { kind: "same", text: '"' },
            ],
          },
        ],
      },
    },
    {
      id: "v1",
      number: 1,
      createdAt: "2026-08-15T09:00:00",
      source: "initial",
      summary: "Initial immutable snapshot after draft generation.",
    },
  ];
}

export type BlueprintExperienceType = {
  id: ExperienceTypeId;
  label: string;
  description: string;
  /** Only Assessed emits scored data / pass-fail. */
  emitsScoredData: boolean;
};

export const BLUEPRINT_EXPERIENCE_TYPES: BlueprintExperienceType[] = [
  {
    id: "open-practice",
    label: "Open practice",
    description:
      "Free rehearsal. Records observations for a recap; never passes, fails, or steers to a hidden answer.",
    emitsScoredData: false,
  },
  {
    id: "guided-coaching",
    label: "Guided coaching",
    description: "Real-time nudges toward the objective. Formative only.",
    emitsScoredData: false,
  },
  {
    id: "tutor",
    label: "Tutor",
    description: "Explains and demonstrates. No assessment.",
    emitsScoredData: false,
  },
  {
    id: "assessed",
    label: "Assessed simulation",
    description:
      "Pass/fail + evidence review. Turns on scoring, completion, review, and the publish gate.",
    emitsScoredData: true,
  },
];

export type KnowledgeFact = {
  id: string;
  title: string;
  detail: string;
  reveal: FactReveal;
};

export type BlueprintResource = {
  id: string;
  name: string;
  pinnedVersion: string | null;
  detail: string;
};

export type EvaluationCriterion = {
  id: string;
  label: string;
  detail: string;
  required: boolean;
  competency: string | null;
};

export type ContractTest = {
  id: string;
  label: string;
  detail?: string;
  status: ContractTestStatus;
  required: boolean;
};

export type BlueprintGovernance = {
  lifecycle: LifecycleStatus;
  version: string;
  provenance: ProvenanceKind;
  provenanceDetail: string;
  experienceTypeInferred: boolean;
  validationPendingCount: number;
  validationSummary: string;
  runsAvailable: boolean;
};

export type BlueprintDraft = {
  id: string;
  title: string;
  creationMethod: CreationMethod;
  experienceType: ExperienceTypeId | null;
  experienceTypeConfirmed: boolean;
  practiceObjective: string;
  aiRoleBehaviour: string;
  persona: string;
  timeBudget: string;
  knowledge: KnowledgeFact[];
  resources: BlueprintResource[];
  resourcePurpose: ResourcePurpose;
  criteria: EvaluationCriterion[];
  targetDuration: string;
  safetyStop: string;
  automaticEnding: string;
  reviewTemplate: string;
  statusScale: string;
  contractTests: ContractTest[];
  qualityRunNote: string;
  governance: BlueprintGovernance;
  phase1Complete: boolean;
  /** Stages the author has visited/completed (for rail ticks). */
  completedStages: BlueprintStageId[];
};

export type StageMeta = {
  id: BlueprintStageId;
  name: string;
  meta: string;
  group: "phase1" | "phase2" | "assurance";
  /** Assessed-only stages stay visible but gated in UI copy when not assessed. */
  assessedOnly?: boolean;
};

export const STAGE_ORDER: StageMeta[] = [
  { id: "method", name: "Creation method", meta: "Design with AI / form", group: "phase1" },
  { id: "generate", name: "Generate draft", meta: "Assistant Q&A or form", group: "phase1" },
  { id: "type", name: "Experience type", meta: "Consequence switch", group: "phase2" },
  { id: "core", name: "Brief", meta: "Objective · role · persona", group: "phase2" },
  { id: "knowledge", name: "Knowledge", meta: "Fact cards + reveal", group: "phase2" },
  { id: "resources", name: "Resources", meta: "Upload · pin version", group: "phase2" },
  { id: "criteria", name: "Evaluation", meta: "Criteria → competency", group: "phase2" },
  {
    id: "completion",
    name: "Completion",
    meta: "Time · safety stop",
    group: "phase2",
    assessedOnly: true,
  },
  {
    id: "review",
    name: "Review",
    meta: "Feedback + status",
    group: "phase2",
    assessedOnly: true,
  },
  { id: "validate", name: "Validate", meta: "Contract tests", group: "assurance" },
  { id: "versions", name: "Version history", meta: "Immutable snapshots", group: "assurance" },
  { id: "publish", name: "Publish", meta: "Approval gate", group: "assurance" },
];

export const PLATFORM_GUARDRAILS = [
  {
    title: "Safety pause",
    detail: "a credible real-world emergency pauses the simulation",
  },
  {
    title: "Participation boundary",
    detail: "abuse or a protected-data demand ends the interaction",
  },
  {
    title: "Verified decision",
    detail: "the evaluator supplies evidence; policy decides the consequence",
  },
] as const;

const DEFAULT_REVIEW_TEMPLATE = `## What you did well
{{strengths grounded in transcript}}

## Where to focus next
{{gaps mapped to required criteria}}

## Final status
{{status from scale}}`;

function blankGovernance(overrides: Partial<BlueprintGovernance> = {}): BlueprintGovernance {
  return {
    lifecycle: "draft",
    version: "v0.1",
    provenance: "author-authored",
    provenanceDetail: "source: not yet generated",
    experienceTypeInferred: false,
    validationPendingCount: 0,
    validationSummary: "Not run",
    runsAvailable: false,
    ...overrides,
  };
}

export function createEmptyBlueprint(title = "Untitled role-play"): BlueprintDraft {
  return {
    id: `rp-draft-${crypto.randomUUID().slice(0, 8)}`,
    title,
    creationMethod: null,
    experienceType: null,
    experienceTypeConfirmed: false,
    practiceObjective: "",
    aiRoleBehaviour: "",
    persona: "",
    timeBudget: "Target 8 min · Maximum 12 min",
    knowledge: [],
    resources: [],
    resourcePurpose: "character-accuracy",
    criteria: [],
    targetDuration: "Target 8 min · Hard stop 12 min",
    safetyStop: "",
    automaticEnding: "",
    reviewTemplate: DEFAULT_REVIEW_TEMPLATE,
    statusScale: "Not yet · Developing · Meets · Exceeds",
    contractTests: [
      {
        id: "structural",
        label: "Structural validation",
        detail: "All required fields present · every required criterion maps to a competency",
        status: "not-run",
        required: true,
      },
      {
        id: "handshake",
        label: "All required evidence can reach a completion handshake",
        status: "not-run",
        required: true,
      },
      {
        id: "fair-opportunity",
        label: "A fair opportunity without evidence does not become success",
        status: "not-run",
        required: true,
      },
      {
        id: "negative-turn",
        label: "Configured negative-turn threshold reaches formal failure",
        detail: "Required before publish",
        status: "not-run",
        required: true,
      },
    ],
    qualityRunNote: "",
    governance: blankGovernance(),
    phase1Complete: false,
    completedStages: [],
  };
}

/** Stub library of saved blueprints keyed by Content library ids. */
const LIBRARY: Record<string, BlueprintDraft> = {
  rp1: {
    id: "rp1",
    title: "Pharmacy Technician — Counselling a Patient on a New Medication",
    creationMethod: "ai",
    experienceType: "assessed",
    experienceTypeConfirmed: false,
    practiceObjective:
      "Counsel a patient starting a new medication: confirm understanding of dose, side effects, and when to seek help — without giving medical advice beyond the dispensing brief.",
    aiRoleBehaviour:
      "Anxious first-time patient. Opens worried about side effects; calms if the learner checks understanding before listing warnings.",
    persona: "Elena Ruiz — first-fill patient, Spanish-preferring caregiver present",
    timeBudget: "Target 8 min · Maximum 12 min",
    knowledge: [
      {
        id: "k1",
        title: "Medication has food interaction guidance",
        detail: "Surfaced only if the learner asks about meals or timing.",
        reveal: "ai-reveals",
      },
      {
        id: "k2",
        title: "Patient already read a conflicting blog post",
        detail: "Given to the learner up front.",
        reveal: "tell-user-first",
      },
    ],
    resources: [
      {
        id: "r1",
        name: "dispensing-counseling-guide.pdf",
        pinnedVersion: "v2",
        detail: "Extracted 14 pages",
      },
    ],
    resourcePurpose: "character-accuracy",
    criteria: [
      {
        id: "c1",
        label: "Confirmed dose and schedule in plain language",
        detail: "Behavioural · never coaches to a hidden answer",
        required: true,
        competency: "Patient education",
      },
      {
        id: "c2",
        label: "Stayed within dispensing scope",
        detail: "Compliance flag",
        required: true,
        competency: "Regulatory adherence",
      },
      {
        id: "c3",
        label: "Closed with a concrete next step",
        detail: "Presence",
        required: false,
        competency: null,
      },
    ],
    targetDuration: "Target 8 min · Hard stop 12 min",
    safetyStop: "End immediately if the learner invents clinical advice beyond the brief",
    automaticEnding:
      "Success when both required criteria observed; fail on scope breach",
    reviewTemplate: DEFAULT_REVIEW_TEMPLATE,
    statusScale: "Not yet · Developing · Meets · Exceeds",
    contractTests: [
      {
        id: "structural",
        label: "Structural validation",
        detail: "All required fields present · every required criterion maps to a competency",
        status: "passed",
        required: true,
      },
      {
        id: "handshake",
        label: "All required evidence can reach a completion handshake",
        status: "passed",
        required: true,
      },
      {
        id: "fair-opportunity",
        label: "A fair opportunity without evidence does not become success",
        status: "passed",
        required: true,
      },
      {
        id: "negative-turn",
        label: "Configured negative-turn threshold reaches formal failure",
        detail: "Required before publish",
        status: "not-run",
        required: true,
      },
    ],
    qualityRunNote:
      "v0.2 FAIL → 1 repair → v0.3 WARNING. Resolved: feedback-not-grounded. Remaining: 1 criterion unmapped.",
    governance: blankGovernance({
      version: "v0.3",
      provenance: "ai-assisted",
      provenanceDetail: "source: assistant Q&A + dispensing-counseling-guide.pdf",
      experienceTypeInferred: true,
      validationPendingCount: 2,
      validationSummary: "2 checks pending",
    }),
    phase1Complete: true,
    completedStages: ["method", "generate"],
  },
  rp2: {
    ...createEmptyBlueprint("Health Coach Intake Conversation"),
    id: "rp2",
    creationMethod: "form",
    experienceType: "guided-coaching",
    experienceTypeConfirmed: true,
    practiceObjective: "Complete a supportive intake without diagnosing.",
    aiRoleBehaviour: "Guarded new member curious about coaching cadence.",
    persona: "Jordan Lee — new member, time-poor",
    phase1Complete: true,
    completedStages: ["method", "generate", "type"],
    governance: blankGovernance({
      version: "v0.2",
      provenance: "author-authored",
      provenanceDetail: "source: structured form",
      validationPendingCount: 1,
      validationSummary: "1 check pending",
    }),
  },
  rp3: {
    ...createEmptyBlueprint("Handling a Medicare Part D Coverage Question"),
    id: "rp3",
    creationMethod: "ai",
    experienceType: "open-practice",
    experienceTypeConfirmed: true,
    practiceObjective: "Explain Part D coverage paths without promising plan outcomes.",
    aiRoleBehaviour: "Frustrated beneficiary comparing plan options.",
    persona: "Sam Okonkwo — Part D member at open enrollment",
    phase1Complete: true,
    completedStages: ["method", "generate", "type", "core"],
    governance: blankGovernance({
      version: "v0.1",
      provenance: "mixed",
      provenanceDetail: "source: assistant Q&A + author edits",
      validationPendingCount: 3,
      validationSummary: "3 checks pending",
    }),
  },
};

/** Demo seed matching the reference “Retention call” copy when creating via AI path mid-flow. */
export function seedRetentionDraft(base: BlueprintDraft): BlueprintDraft {
  return {
    ...base,
    title: base.title === "Untitled role-play" ? "Retention call — de-escalation" : base.title,
    experienceType: "assessed",
    experienceTypeConfirmed: false,
    practiceObjective:
      "Retain an at-risk client threatening to move their portfolio, without breaching suitability or making unauthorised promises.",
    aiRoleBehaviour:
      "Long-standing client, frustrated by recent underperformance. Opens guarded; warms if the learner acknowledges the concern before defending fees.",
    persona: "Margaret Doyle — 12-year client, portfolio at risk, risk-averse",
    knowledge: [
      {
        id: "k1",
        title: "Portfolio underperformed vs benchmark",
        detail: "Surfaced only if the learner probes performance.",
        reveal: "ai-reveals",
      },
      {
        id: "k2",
        title: "Client received a competitor pitch offering lower fees",
        detail: "Given to the learner up front.",
        reveal: "tell-user-first",
      },
      {
        id: "k3",
        title: "Client's real driver is fear about retirement timing",
        detail: "The need behind the fee objection.",
        reveal: "ai-reveals",
      },
    ],
    resources: [
      {
        id: "r1",
        name: "retention-policy.pdf",
        pinnedVersion: "v2",
        detail: "Extracted 14 pages",
      },
      {
        id: "r2",
        name: "suitability-guidance.docx",
        pinnedVersion: null,
        detail: "Available in library — pin a version to ground the model against it.",
      },
    ],
    criteria: [
      {
        id: "c1",
        label: "Acknowledged the concern before defending fees",
        detail: "Behavioural · never coaches to a hidden answer",
        required: true,
        competency: "Empathetic listening",
      },
      {
        id: "c2",
        label: "Stayed within suitability boundaries",
        detail: "Compliance flag",
        required: true,
        competency: "Regulatory adherence",
      },
      {
        id: "c3",
        label: "Proposed a concrete next step",
        detail: "Presence",
        required: false,
        competency: null,
      },
    ],
    safetyStop: "End immediately if the learner promises guaranteed returns",
    automaticEnding:
      "Success when both required criteria observed; fail on suitability breach",
    contractTests: [
      {
        id: "structural",
        label: "Structural validation",
        detail: "All required fields present · every required criterion maps to a competency",
        status: "passed",
        required: true,
      },
      {
        id: "handshake",
        label: "All required evidence can reach a completion handshake",
        status: "passed",
        required: true,
      },
      {
        id: "fair-opportunity",
        label: "A fair opportunity without evidence does not become success",
        status: "passed",
        required: true,
      },
      {
        id: "negative-turn",
        label: "Configured negative-turn threshold reaches formal failure",
        detail: "Required before publish",
        status: "not-run",
        required: true,
      },
    ],
    qualityRunNote:
      "v0.2 FAIL → 1 repair → v0.3 WARNING. Resolved: feedback-not-grounded. Remaining: 1 criterion unmapped.",
    governance: {
      ...base.governance,
      version: "v0.3",
      provenance: "ai-assisted",
      provenanceDetail: "source: assistant Q&A + retention-policy.pdf",
      experienceTypeInferred: true,
      validationPendingCount: 2,
      validationSummary: "2 checks pending",
    },
  };
}

export function isAssessed(draft: BlueprintDraft): boolean {
  return draft.experienceType === "assessed";
}

export function experienceTypeLabel(id: ExperienceTypeId | null): string {
  return BLUEPRINT_EXPERIENCE_TYPES.find((t) => t.id === id)?.label ?? "Not set";
}

export function unmappedRequiredCriteria(draft: BlueprintDraft): EvaluationCriterion[] {
  return draft.criteria.filter((c) => c.required && !c.competency);
}

export function requiredContractTestsPending(draft: BlueprintDraft): ContractTest[] {
  return draft.contractTests.filter((t) => t.required && t.status !== "passed");
}

export function canSubmitForPublish(draft: BlueprintDraft): {
  ok: boolean;
  blockers: string[];
} {
  const blockers: string[] = [];
  if (!draft.experienceType) blockers.push("Experience type is required");
  if (!draft.practiceObjective.trim()) blockers.push("Practice objective is required");
  if (unmappedRequiredCriteria(draft).length > 0) {
    blockers.push("Every required criterion must map to a competency");
  }
  if (requiredContractTestsPending(draft).length > 0) {
    blockers.push("Required contract tests must pass before publish");
  }
  return { ok: blockers.length === 0, blockers };
}

/** Stub service — mirrors how assessment stubs load from Content ids. */
export const blueprintService = {
  async load(contentId: string | undefined, titleFallback?: string): Promise<BlueprintDraft> {
    await Promise.resolve();
    if (contentId && LIBRARY[contentId]) {
      return structuredClone(LIBRARY[contentId]);
    }
    if (contentId) {
      const draft = createEmptyBlueprint(titleFallback ?? "Role-play");
      draft.id = contentId;
      draft.phase1Complete = true;
      draft.completedStages = ["method", "generate"];
      draft.governance.version = "v0.2";
      return draft;
    }
    return createEmptyBlueprint(titleFallback ?? "Untitled role-play");
  },

  async save(draft: BlueprintDraft): Promise<BlueprintDraft> {
    await Promise.resolve();
    LIBRARY[draft.id] = structuredClone(draft);
    return draft;
  },

  async runValidation(draft: BlueprintDraft): Promise<BlueprintDraft> {
    await Promise.resolve();
    const next = structuredClone(draft);
    const unmapped = unmappedRequiredCriteria(next).length;
    next.contractTests = next.contractTests.map((t) => {
      if (t.id === "structural") {
        return {
          ...t,
          status: unmapped > 0 || !next.practiceObjective.trim() ? "failed" : "passed",
          detail:
            unmapped > 0
              ? `${unmapped} required criterion still unmapped`
              : "All required fields present · every required criterion maps to a competency",
        };
      }
      if (t.id === "negative-turn") return t;
      return { ...t, status: "passed" as const };
    });
    const pending = next.contractTests.filter((t) => t.status !== "passed").length;
    next.governance.validationPendingCount = pending;
    next.governance.validationSummary =
      pending === 0 ? "All checks passed" : `${pending} check${pending === 1 ? "" : "s"} pending`;
    return next;
  },

  async submitForApproval(draft: BlueprintDraft): Promise<BlueprintDraft> {
    await Promise.resolve();
    const next = structuredClone(draft);
    next.governance.lifecycle = "in-review";
    LIBRARY[next.id] = next;
    return next;
  },

  async publish(draft: BlueprintDraft): Promise<BlueprintDraft> {
    await Promise.resolve();
    const next = structuredClone(draft);
    next.governance.lifecycle = "published";
    next.governance.version = next.governance.version.replace(/^v0\./, "v1.");
    next.governance.runsAvailable = true;
    LIBRARY[next.id] = next;
    return next;
  },
};

export function markStageComplete(
  draft: BlueprintDraft,
  stage: BlueprintStageId,
): BlueprintDraft {
  if (draft.completedStages.includes(stage)) return draft;
  return { ...draft, completedStages: [...draft.completedStages, stage] };
}

export function nextStageId(
  current: BlueprintStageId,
  assessed: boolean,
): BlueprintStageId | null {
  const sequence = STAGE_ORDER.filter((s) => assessed || !s.assessedOnly).map((s) => s.id);
  const i = sequence.indexOf(current);
  if (i < 0 || i >= sequence.length - 1) return null;
  return sequence[i + 1];
}

export function prevStageId(
  current: BlueprintStageId,
  assessed: boolean,
): BlueprintStageId | null {
  const sequence = STAGE_ORDER.filter((s) => assessed || !s.assessedOnly).map((s) => s.id);
  const i = sequence.indexOf(current);
  if (i <= 0) return null;
  return sequence[i - 1];
}
