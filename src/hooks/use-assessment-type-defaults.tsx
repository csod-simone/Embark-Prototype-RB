import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useOrganisation, type OrgId } from "@/hooks/use-organisation";
import {
  ASSESSMENT_TYPES,
  ASSESSMENT_DEFAULTS,
  type AssessmentType,
} from "@/data/assessmentTypes";

/** Components an assessment type may be built from. */
export type AssessmentComponents = {
  /** Authored question sets (Multiple Choice, True/False, Multi-Select, Short Answer). */
  questions: boolean;
  /** Assessment content items (SCORM, Role-Play, Simulation). */
  content: boolean;
};

export const QUESTION_TYPE_LABELS = [
  "Multiple Choice",
  "True/False",
  "Multi-Select",
  "Short Answer",
] as const;

export const CONTENT_TYPE_LABELS = ["SCORM", "Role-Play", "Simulation"] as const;

export type AssessmentTypeDefault = {
  /** Whether this type requires an advancement score at all. */
  requiresScore: boolean;
  /** Default advancement threshold percentage (0-100). */
  threshold: number;
  /** Whether authors may change the threshold while creating or editing an assessment. */
  allowOverride: boolean;
  /** Guidance shown to authors under the Assessment Type field. */
  description: string;
  /** Which components authors may build this assessment type from. */
  components: AssessmentComponents;
};

/** Types that are scored. All Rathbones assessment types are scored. */
export const SCORED_TYPES = ASSESSMENT_TYPES.filter(
  (t) => ASSESSMENT_DEFAULTS[t].scored,
);

const DEFAULT_DESCRIPTIONS: Record<AssessmentType, string> = {
  "Knowledge Check":
    "Knowledge Checks follow each course. The pass mark is 80%, with up to 3 retakes.",
  "Module Assessment":
    "Module Assessments are the major assessment at the end of a module. The pass mark is 80%, with up to 3 retakes. A sustained fail pauses progress until the line manager reopens it.",
  "Chapter Gate":
    "Chapter Gates allow one attempt. A score below 80% flags the line manager and pauses progress until they check in.",
};

/** Authors can adjust the threshold for course and module checks. The chapter gate rule stays fixed. */
const DEFAULT_ALLOW_OVERRIDE: Record<AssessmentType, boolean> = {
  "Knowledge Check": true,
  "Module Assessment": true,
  "Chapter Gate": false,
};

export type AssessmentTypeDefaultsState = Record<AssessmentType, AssessmentTypeDefault>;

function seedDefaults(): AssessmentTypeDefaultsState {
  return ASSESSMENT_TYPES.reduce((acc, t) => {
    acc[t] = {
      requiresScore: ASSESSMENT_DEFAULTS[t].scored,
      threshold: ASSESSMENT_DEFAULTS[t].passThreshold,
      allowOverride: DEFAULT_ALLOW_OVERRIDE[t],
      description: DEFAULT_DESCRIPTIONS[t],
      components: { questions: true, content: false },
    };
    return acc;
  }, {} as AssessmentTypeDefaultsState);
}

const STORAGE_KEY = "embark:assessment-type-defaults:v1";

function read(org: OrgId): AssessmentTypeDefaultsState {
  const seeded = seedDefaults();
  if (typeof window === "undefined") return seeded;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY}:${org}`);
    if (!raw) return seeded;
    const parsed = JSON.parse(raw) as Partial<AssessmentTypeDefaultsState>;
    ASSESSMENT_TYPES.forEach((t) => {
      if (parsed[t]) {
        seeded[t] = {
          ...seeded[t],
          ...parsed[t],
          components: { ...seeded[t].components, ...(parsed[t]?.components ?? {}) },
        };
      }
    });
    return seeded;
  } catch {
    return seeded;
  }
}

type Ctx = {
  defaults: AssessmentTypeDefaultsState;
  defaultsFor: (type: AssessmentType) => AssessmentTypeDefault;
  setDefault: <K extends keyof AssessmentTypeDefault>(
    type: AssessmentType,
    key: K,
    value: AssessmentTypeDefault[K],
  ) => void;
};

const AssessmentTypeDefaultsContext = createContext<Ctx>({
  defaults: seedDefaults(),
  defaultsFor: (t) => seedDefaults()[t],
  setDefault: () => {},
});

export function AssessmentTypeDefaultsProvider({ children }: { children: React.ReactNode }) {
  const { org } = useOrganisation();
  const [defaults, setDefaults] = useState<AssessmentTypeDefaultsState>(() => read(org));

  useEffect(() => {
    setDefaults(read(org));
  }, [org]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`${STORAGE_KEY}:${org}`, JSON.stringify(defaults));
    } catch {
      // ignore
    }
  }, [defaults, org]);

  const setDefault = useCallback<Ctx["setDefault"]>((type, key, value) => {
    setDefaults((prev) => ({ ...prev, [type]: { ...prev[type], [key]: value } }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({ defaults, defaultsFor: (t) => defaults[t], setDefault }),
    [defaults, setDefault],
  );

  return (
    <AssessmentTypeDefaultsContext.Provider value={value}>
      {children}
    </AssessmentTypeDefaultsContext.Provider>
  );
}

export const useAssessmentTypeDefaults = () => useContext(AssessmentTypeDefaultsContext);
