import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useOrganisation, type OrgId } from "@/hooks/use-organisation";

export type WelcomeContent = {
  headline: string;
  programmeLine: string;
  description: string;
  personalisedHeading: string;
  personalisedParagraph1: string;
  personalisedParagraph2: string;
  nextHeading: string;
  /** The "What happens next" steps, fully configurable in length and order. */
  steps: string[];
  sageHeading: string;
  sageQuote: string;
  cta: string;
};


export type TransparencyContent = {
  headline: string;
  subheading: string;
  signals: string[];
  footnote1: string;
  footnote2: string;
  cta: string;
};

export type ExperienceContent = {
  welcome: WelcomeContent;
  transparency: TransparencyContent;
};

export const DEFAULT_EXPERIENCE_CONTENT: ExperienceContent = {
  welcome: {
    headline: "Welcome to Aetna CSR onboarding",
    programmeLine: "{{cohort_name}} · {{start_date}}",
    description:
      "This program prepares you to serve Aetna members across Medicare plans — handling benefits questions, claims, and escalations with confidence.",
    personalisedHeading: "Personalized for you",
    personalisedParagraph1:
      "Welcome to Embark, Jordan! Your onboarding journey is designed around your role, line of business and the learning required for your role.",
    personalisedParagraph2:
      "As you progress, Pre-Checks at defined points in your journey will help identify what you already know and where additional learning or reinforcement may be useful.",
    nextHeading: "What happens next",
    steps: [
      "Work through your learning with Sage",
      "Demonstrate your knowledge and skills along the way",
      "Get targeted reinforcement and support when you need it",
    ],

    sageHeading: "Meet Sage our AI Assistant",
    sageQuote:
      "Hi Jordan, I'm Sage, your AI tutor. I'll be with you throughout your journey — answering questions, checking your understanding, and helping reinforce areas as you learn. You can ask me anything at any time. Let's get started.",
    cta: "Continue: See what Embark knows about you",
  },
  transparency: {
    headline: "Here's what Embark knows about you",
    subheading:
      "This information comes from your HR profile and helps provide context throughout your onboarding experience.",
    signals: [
      "Your current role: Customer Service Representative",
      "Your line of business: Medicare",
      "Your work history: 2 years in insurance customer service",
      "Skills on your profile: Customer Communication, Insurance Terminology, Claims Basics",
      "Certifications on file: None on file",
    ],
    footnote1:
      "You can speak to your manager or HR if you have questions about what's on your profile.",
    footnote2:
      "As you progress, Embark will gather additional evidence through learning, Pre-Checks, assessments and other experiences to provide more targeted support along the way.",
    cta: "Continue to baseline assessment →",
  },
};

/** A completely blank welcome screen, used when creating a new cohort. */
export const EMPTY_WELCOME_CONTENT: WelcomeContent = {
  headline: "",
  programmeLine: "",
  description: "",
  personalisedHeading: "",
  personalisedParagraph1: "",
  personalisedParagraph2: "",
  nextHeading: "",
  steps: [],
  sageHeading: "",
  sageQuote: "",
  cta: "",
};

/**
 * Merges a stored welcome record onto a base, migrating legacy records that used
 * the fixed step1/step2/step3 fields into the configurable steps list.
 */
export function normaliseWelcome(
  stored: unknown,
  base: WelcomeContent,
): WelcomeContent {
  const raw = (stored ?? {}) as Partial<WelcomeContent> & Record<string, unknown>;
  const legacy = [raw.step1, raw.step2, raw.step3].filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0,
  );
  const steps = Array.isArray(raw.steps)
    ? raw.steps.filter((s): s is string => typeof s === "string")
    : legacy.length > 0
      ? legacy
      : base.steps;
  const { step1: _1, step2: _2, step3: _3, ...rest } = raw;
  return { ...base, ...(rest as Partial<WelcomeContent>), steps };
}



/** Tags that auto-populate the Program Line from the learner's cohort. */
export const PROGRAMME_LINE_TAGS: { tag: string; label: string; example: string }[] = [
  { tag: "{{cohort_name}}", label: "Cohort title", example: "ICHD Q3 2026" },
  { tag: "{{start_date}}", label: "Start date", example: "July 14, 2026" },
  {
    tag: "{{target_completion_date}}",
    label: "Target completion date",
    example: "August 15, 2026",
  },
];

/** Sample values used when no cohort context is available (e.g. portal previews). */
const TAG_VALUES: Record<string, string> = {
  "{{cohort_name}}": "ICHD Q3 2026",
  "{{start_date}}": "July 14, 2026",
  "{{target_completion_date}}": "August 15, 2026",
  // Legacy tag kept so previously saved content keeps rendering.
  "{{cohort_dates}}": "July 14, 2026",
};

const SENTINEL = "\u0000";

/** Formats a single cohort date; returns an empty string when unset. */
export function formatCohortDate(date?: Date): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Formats a cohort date range, omitting whichever date has not been configured. */
export function formatCohortDates(start?: Date, end?: Date): string {
  const s = formatCohortDate(start);
  const e = formatCohortDate(end);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

/**
 * Replaces known cohort tags with live values; unknown tags are left untouched.
 * When a value is provided but empty, the tag is dropped along with an adjacent
 * separator so the line never shows blank or invalid content.
 */
export function resolveProgrammeLine(
  value: string,
  values?: Partial<
    Record<"cohort_name" | "start_date" | "target_completion_date" | "cohort_dates", string>
  >,
): string {
  const map: Record<string, string> = values
    ? {
        "{{cohort_name}}": values.cohort_name ?? "",
        "{{start_date}}": values.start_date ?? "",
        "{{target_completion_date}}": values.target_completion_date ?? "",
        // Legacy tag maps to the start date so existing content keeps working.
        "{{cohort_dates}}": values.cohort_dates ?? values.start_date ?? "",
      }
    : TAG_VALUES;
  const withSentinels = Object.entries(map).reduce(
    (acc, [tag, v]) => acc.split(tag).join(v.trim() ? v : SENTINEL),
    value,
  );
  return withSentinels
    .replace(/\s*[·|,–—-]\s*\u0000/g, "")
    .replace(/\u0000\s*[·|,–—-]\s*/g, "")
    .split(SENTINEL)
    .join("")
    .trim();
}


/** Default transparency CTA label, which depends on whether the baseline assessment runs. */
export const TRANSPARENCY_CTA_DEFAULTS = {
  withBaseline: "Continue to baseline assessment →",
  withoutBaseline: "Start my journey →",
} as const;

export function defaultTransparencyCta(baselineAssessment: boolean) {
  return baselineAssessment
    ? TRANSPARENCY_CTA_DEFAULTS.withBaseline
    : TRANSPARENCY_CTA_DEFAULTS.withoutBaseline;
}

/** Resolves the CTA to show: a customised label wins, otherwise the state-based default. */
export function resolveTransparencyCta(cta: string, baselineAssessment: boolean) {
  const isDefault =
    cta.trim() === TRANSPARENCY_CTA_DEFAULTS.withBaseline ||
    cta.trim() === TRANSPARENCY_CTA_DEFAULTS.withoutBaseline;
  return isDefault ? defaultTransparencyCta(baselineAssessment) : cta;
}

const storageKey = (org: OrgId) => `embark:experience-content:v2:${org}`;

function read(org: OrgId): ExperienceContent {
  if (typeof window === "undefined") return DEFAULT_EXPERIENCE_CONTENT;
  try {
    const raw = window.localStorage.getItem(storageKey(org));
    if (!raw) return DEFAULT_EXPERIENCE_CONTENT;
    const parsed = JSON.parse(raw) as Partial<ExperienceContent>;
    return {
      welcome: normaliseWelcome(parsed.welcome, DEFAULT_EXPERIENCE_CONTENT.welcome),

      transparency: {
        ...DEFAULT_EXPERIENCE_CONTENT.transparency,
        ...(parsed.transparency ?? {}),
      },
    };
  } catch {
    return DEFAULT_EXPERIENCE_CONTENT;
  }
}

type Ctx = ExperienceContent & {
  saveWelcome: (next: WelcomeContent) => void;
  saveTransparency: (next: TransparencyContent) => void;
};

const ExperienceContentContext = createContext<Ctx>({
  ...DEFAULT_EXPERIENCE_CONTENT,
  saveWelcome: () => {},
  saveTransparency: () => {},
});

export function ExperienceContentProvider({ children }: { children: ReactNode }) {
  const { org } = useOrganisation();
  const [state, setState] = useState<ExperienceContent>(() => read(org));

  useEffect(() => {
    setState(read(org));
  }, [org]);

  const persist = useCallback(
    (next: ExperienceContent) => {
      setState(next);
      try {
        window.localStorage.setItem(storageKey(org), JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
    },
    [org],
  );

  const saveWelcome = useCallback(
    (welcome: WelcomeContent) => persist({ ...state, welcome }),
    [persist, state],
  );
  const saveTransparency = useCallback(
    (transparency: TransparencyContent) => persist({ ...state, transparency }),
    [persist, state],
  );

  const value = useMemo<Ctx>(
    () => ({ ...state, saveWelcome, saveTransparency }),
    [state, saveWelcome, saveTransparency],
  );

  return (
    <ExperienceContentContext.Provider value={value}>
      {children}
    </ExperienceContentContext.Provider>
  );
}

export const useExperienceContent = () => useContext(ExperienceContentContext);
