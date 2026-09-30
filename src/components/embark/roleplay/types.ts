import type { AiProvenanceRecord } from "@/lib/ai-compliance";

export type ScoringMode = "practice" | "assessment";
export type InputMode = "voice" | "text" | "choice";
export type Confidence = "High" | "Medium" | "Low";
export type CompletionStatus = "completed" | "ended-early" | "timeout" | "criteria-not-met";
export type TurnState = "listening" | "speaking" | "thinking" | "closing";
export type InputModality = "text" | "voice";
export type CriterionOrdinal = "Developing" | "Proficient" | "Strong";

/** Evidence status shown on the Final review Goals list (reference: Workforce AI Roleplay). */
export type GoalEvidenceStatus =
  | "achieved"
  | "partial"
  | "not-demonstrated"
  | "not-observed"
  | "not-assessed";

export interface FocusCriterion {
  id: string;
  label: string;
  /** Keywords that mark this criterion as touched during live practice (no scores). */
  touchKeywords?: string[];
}

export interface CriterionReview {
  criterionId: string;
  ordinal: CriterionOrdinal;
  narrative: string;
  evidenceQuote: string;
  /** Optional durable status for Final review; derived from ordinal when omitted. */
  status?: GoalEvidenceStatus;
}

export interface FeedbackHighlight {
  label: string;
  detail: string;
}

export interface GoalEvidence {
  criterionId: string;
  label: string;
  status: GoalEvidenceStatus;
  evidence: string;
}

export interface TurnAudit {
  model: string;
  latencyMs: number;
  rationale: string;
}

export interface RolePlayFeedback {
  score: number;
  confidence: Confidence;
  skills: { name: string; confidence: Confidence; score: number; evidence: string }[];
  worked: string[];
  improve: string[];
  /** Overall outcome paragraph for Final review. */
  outcome?: string;
  /** Structured “What worked” rows (label + evidence narrative). */
  workedHighlights?: FeedbackHighlight[];
  /** Structured “Practice next” rows. */
  practiceNext?: FeedbackHighlight[];
  /** Goals list with evidence status for Final review. */
  goalEvidence?: GoalEvidence[];
  /** Durable per-criterion review (L9). Falls back to skills mapping when omitted. */
  criterionReviews?: CriterionReview[];
}

export interface RolePlayScenario {
  scoringMode: ScoringMode;
  inputMode: InputMode;
  passThreshold: number;
  maxAttempts: number;
  attemptNumber: number;
  scenarioId: string;
  personaName: string;
  /** Short role label shown under the persona name (e.g. "HNW client"). */
  personaRole?: string;
  personaDescription: string;
  situation: string;
  /** One-line framing objective (does not repeat the goals checklist). */
  objective: string;
  /** Supporting sentence under the objective headline. */
  objectiveDetail?: string;
  /** Privacy / visibility copy on the intro persona rail. */
  visibilityNote?: string;
  /** Constraints shown in Rules of play. */
  constraints?: string;
  /** Safety boundary shown in Rules of play. */
  safetyBoundary?: string;
  scenarioTitle: string;
  /** Target and hard-stop time budget for the live session. */
  timeBudget?: { targetMinutes: number; maxMinutes: number };
  /** Focus areas mirrored from the blueprint (scores hidden during practice). */
  focusCriteria?: FocusCriterion[];
  /** Opening line spoken by the persona when the role-play starts. */
  openingLine: string;
  /** Stubbed transcription used when a voice response is submitted. */
  voiceSampleResponse: string;
  feedback: RolePlayFeedback;
}

/** Art. 50(2) provenance stored on completed roleplay runs. */
export type { AiProvenanceRecord as RolePlayRunProvenance };
