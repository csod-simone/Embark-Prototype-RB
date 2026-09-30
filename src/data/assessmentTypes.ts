/**
 * Rathbones assessment types. Knowledge Checks follow each course, Module
 * Assessments close a module, and Chapter Gates are a single attempt.
 * Pass mark is 80%. Knowledge Checks and Module Assessments allow 3 retakes
 * (4 attempts in total, because retakes count against the attempts limit).
 */
export const ASSESSMENT_TYPES = [
  "Knowledge Check",
  "Module Assessment",
  "Chapter Gate",
] as const;

export type AssessmentType = (typeof ASSESSMENT_TYPES)[number];

export type AnswerReviewMode = "none" | "on-pass" | "always" | "final-attempt";

export type AssessmentConfig = {
  /** Percentage required to advance. 0 means the check never blocks. */
  passThreshold: number;
  /** Attempts allowed; null = unlimited. Retakes count against this limit. */
  attempts: number | null;
  /** Whether a failing score stops the learner from continuing. */
  blocking: boolean;
  /** Whether the result is a scored question set (false for embedded activities). */
  scored: boolean;
  /** Below this percentage the line manager is notified. */
  notifyBelow: number | null;
  /** Attempt 2 shows only the questions answered incorrectly on attempt 1. */
  narrowSecondAttempt: boolean;
  /** Also notify the line manager on a failing score. */
  notifyBusinessLeader: boolean;
  /** Passing this check triggers graduation. */
  graduates: boolean;
  /** When the learner can review right/wrong answers. */
  answerReview: AnswerReviewMode;
  /** Short learner-facing description shown on the briefing screen. */
  briefing: string;
};

export const ASSESSMENT_DEFAULTS: Record<AssessmentType, AssessmentConfig> = {
  "Knowledge Check": {
    passThreshold: 80,
    attempts: 4,
    blocking: true,
    scored: true,
    notifyBelow: null,
    narrowSecondAttempt: false,
    notifyBusinessLeader: false,
    graduates: false,
    answerReview: "on-pass",
    briefing:
      "This Knowledge Check follows a course. You need 80% to pass, and you can retake it up to 3 times.",
  },
  "Module Assessment": {
    passThreshold: 80,
    attempts: 4,
    blocking: true,
    scored: true,
    notifyBelow: null,
    narrowSecondAttempt: false,
    notifyBusinessLeader: true,
    graduates: false,
    answerReview: "on-pass",
    briefing:
      "This is the module assessment. You need 80% to pass, with up to 3 retakes. If you still do not pass, progress stays paused until your line manager reopens it.",
  },
  "Chapter Gate": {
    passThreshold: 80,
    attempts: 1,
    blocking: true,
    scored: true,
    notifyBelow: 80,
    narrowSecondAttempt: false,
    notifyBusinessLeader: true,
    graduates: false,
    answerReview: "on-pass",
    briefing:
      "This chapter gate allows one attempt. A score below 80% flags your line manager and pauses progress until they check in.",
  },
};

/** Whether a curriculum modality is one of the Rathbones assessment types. */
export function isAssessmentType(m: string | undefined): m is AssessmentType {
  return !!m && (ASSESSMENT_TYPES as readonly string[]).includes(m);
}

/** Types whose scores can be overridden at question level. */
export function supportsOverride(t: AssessmentType): boolean {
  return ASSESSMENT_DEFAULTS[t].scored;
}

export function attemptsLabelFor(cfg: AssessmentConfig): string {
  return cfg.attempts == null ? "Unlimited" : String(cfg.attempts);
}
