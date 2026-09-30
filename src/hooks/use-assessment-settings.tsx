import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useOrganisation, type OrgId } from "@/hooks/use-organisation";

export type AnswerReviewMode = "none" | "on-pass" | "always";

export const ANSWER_REVIEW_OPTIONS: { value: AnswerReviewMode; label: string }[] = [
  { value: "none", label: "No, learners cannot review which answers were right/wrong" },
  {
    value: "on-pass",
    label: "Learners can review which answers were right/wrong after they advance through the assessment",
  },
  {
    value: "always",
    label: "Learners can review which answers were right/wrong after each submission",
  },
];

type State = {
  flagForReview: boolean;
  baselineAssessment: boolean;
};

const DEFAULT: State = { flagForReview: true, baselineAssessment: false };
const STORAGE_KEY = "embark:assessment-settings";
const ANSWER_REVIEW_KEY = "embark:assessment-answer-review";
const DEFAULT_ANSWER_REVIEW: AnswerReviewMode = "on-pass";

function readAnswerReview(org: OrgId): AnswerReviewMode {
  if (typeof window === "undefined") return DEFAULT_ANSWER_REVIEW;
  const raw = window.localStorage.getItem(`${ANSWER_REVIEW_KEY}:${org}`);
  return raw === "none" || raw === "always" || raw === "on-pass" ? raw : DEFAULT_ANSWER_REVIEW;
}

type Ctx = State & {
  setField: (key: keyof State, value: boolean) => void;
  answerReview: AnswerReviewMode;
  setAnswerReview: (value: AnswerReviewMode) => void;
};

const AssessmentSettingsContext = createContext<Ctx>({
  ...DEFAULT,
  setField: () => {},
  answerReview: DEFAULT_ANSWER_REVIEW,
  setAnswerReview: () => {},
});

export function AssessmentSettingsProvider({ children }: { children: React.ReactNode }) {
  const { org } = useOrganisation();
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return DEFAULT;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT;
      return { ...DEFAULT, ...JSON.parse(raw) } as State;
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const setField = useCallback((key: keyof State, value: boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const [answerReview, setAnswerReviewState] = useState<AnswerReviewMode>(() =>
    readAnswerReview(org),
  );

  useEffect(() => {
    setAnswerReviewState(readAnswerReview(org));
  }, [org]);

  const setAnswerReview = useCallback(
    (value: AnswerReviewMode) => {
      setAnswerReviewState(value);
      try {
        window.localStorage.setItem(`${ANSWER_REVIEW_KEY}:${org}`, value);
      } catch {
        // ignore
      }
    },
    [org],
  );

  return (
    <AssessmentSettingsContext.Provider
      value={{ ...state, setField, answerReview, setAnswerReview }}
    >
      {children}
    </AssessmentSettingsContext.Provider>
  );
}

export const useAssessmentSettings = () => useContext(AssessmentSettingsContext);