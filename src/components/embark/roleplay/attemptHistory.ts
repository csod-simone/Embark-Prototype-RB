import type { AiProvenanceRecord } from "@/lib/ai-compliance";
import type {
  CompletionStatus,
  FeedbackHighlight,
  GoalEvidence,
  RolePlayScenario,
} from "./types";
import {
  NOT_DEMONSTRATED_EVIDENCE,
  completionBannerCopy,
  countByStatus,
  criteriaMetForOutcome,
  formatCompletedDate,
  resolveGoalEvidence,
  resolveHighlights,
} from "./feedbackResolve";
import type { GoalEvidenceStatus } from "./types";

export type RolePlayAttemptTurn =
  | { id: string; role: "persona"; text: string; modality?: string }
  | { id: string; role: "learner"; text: string; modality?: string };

/** One completed roleplay run the learner can reopen on Results. */
export type RolePlayAttempt = {
  id: string;
  attemptNumber: number;
  turns: RolePlayAttemptTurn[];
  durationSeconds: number;
  completedAt: number;
  completionStatus: CompletionStatus;
  aiProvenance: AiProvenanceRecord | null;
  /** Higher is better — used to mark (Best). */
  score: number;
  criteriaMet: boolean;
  goalEvidence: GoalEvidence[];
  outcome: string;
  workedHighlights: FeedbackHighlight[];
  practiceNext: FeedbackHighlight[];
};

export function attemptsStorageKey(scenarioId: string): string {
  return `rp-attempts:${scenarioId}`;
}

export function loadAttempts(scenarioId: string): RolePlayAttempt[] {
  try {
    const raw =
      localStorage.getItem(attemptsStorageKey(scenarioId)) ??
      sessionStorage.getItem(attemptsStorageKey(scenarioId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RolePlayAttempt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttempts(scenarioId: string, attempts: RolePlayAttempt[]): void {
  try {
    const raw = JSON.stringify(attempts);
    localStorage.setItem(attemptsStorageKey(scenarioId), raw);
    sessionStorage.setItem(attemptsStorageKey(scenarioId), raw);
  } catch {
    /* ignore */
  }
}

export function upsertAttempt(
  scenarioId: string,
  attempt: RolePlayAttempt,
): RolePlayAttempt[] {
  const existing = loadAttempts(scenarioId);
  const idx = existing.findIndex((a) => a.id === attempt.id);
  const next =
    idx >= 0
      ? existing.map((a, i) => (i === idx ? attempt : a))
      : [...existing, attempt].sort((a, b) => a.attemptNumber - b.attemptNumber);
  saveAttempts(scenarioId, next);
  return next;
}

/** Rank attempts for “Best”: score, then criteria met, then achieved goals, then latest. */
export function compareAttemptsBestFirst(a: RolePlayAttempt, b: RolePlayAttempt): number {
  if (b.score !== a.score) return b.score - a.score;
  if (a.criteriaMet !== b.criteriaMet) return a.criteriaMet ? -1 : 1;
  const aAchieved = countByStatus(a.goalEvidence).achieved;
  const bAchieved = countByStatus(b.goalEvidence).achieved;
  if (bAchieved !== aAchieved) return bAchieved - aAchieved;
  return b.attemptNumber - a.attemptNumber;
}

export function bestAttemptId(attempts: RolePlayAttempt[]): string | null {
  if (attempts.length === 0) return null;
  return [...attempts].sort(compareAttemptsBestFirst)[0]?.id ?? null;
}

export function scoreAttemptFromSession(params: {
  baseScore: number;
  goals: GoalEvidence[];
  completionStatus: CompletionStatus | null;
  strongCount: number;
  turnCount: number;
}): number {
  const { baseScore, goals, completionStatus, strongCount, turnCount } = params;
  const counts = countByStatus(goals);
  const metBonus = criteriaMetForOutcome(goals) ? 8 : 0;
  const goalPoints = counts.achieved * 6 + counts.partial * 2;
  const statusPenalty =
    completionStatus === "criteria-not-met"
      ? -10
      : completionStatus === "ended-early"
        ? -4
        : completionStatus === "timeout"
          ? -6
          : 0;
  const engagement = Math.min(12, strongCount * 3 + Math.max(0, turnCount - 2));
  return Math.max(0, Math.min(100, Math.round(baseScore * 0.55 + goalPoints + metBonus + engagement + statusPenalty)));
}

/**
 * Keep scenario feedback as the ceiling for a strong completed run; degrade
 * weaker / incomplete runs so attempt history (and “Best”) can diverge.
 */
export function adjustGoalsForSession(
  base: GoalEvidence[],
  params: {
    strongCount: number;
    turnCount: number;
    completionStatus: CompletionStatus;
    touchedCriteria?: string[];
  },
): GoalEvidence[] {
  const { strongCount, turnCount, completionStatus, touchedCriteria } = params;
  const strength = strongCount + Math.max(0, turnCount - 4);
  const solidCompleted = completionStatus === "completed" && strength >= 3;

  return base.map((goal, index) => {
    if (goal.status === "not-assessed" || goal.status === "not-observed") return goal;

    if (
      touchedCriteria &&
      touchedCriteria.length > 0 &&
      goal.criterionId &&
      !touchedCriteria.includes(goal.criterionId)
    ) {
      return {
        ...goal,
        status: "not-demonstrated" as GoalEvidenceStatus,
        evidence: NOT_DEMONSTRATED_EVIDENCE,
      };
    }

    if (solidCompleted) return goal;

    const rank = index + 1;
    let status: GoalEvidenceStatus = goal.status;
    if (completionStatus === "criteria-not-met" || strength < 1) {
      status = rank === 1 ? "partial" : "not-demonstrated";
    } else if (completionStatus === "ended-early" || completionStatus === "timeout") {
      status = rank <= 1 ? (goal.status === "achieved" ? "partial" : goal.status) : "not-demonstrated";
    } else if (strength < 3) {
      status = rank <= strength ? goal.status : rank === strength + 1 ? "partial" : "not-demonstrated";
    }

    if (status === "not-demonstrated") {
      return { ...goal, status, evidence: NOT_DEMONSTRATED_EVIDENCE };
    }
    return { ...goal, status };
  });
}

export function buildAttemptRecord(params: {
  cfg: RolePlayScenario;
  attemptNumber: number;
  turns: RolePlayAttemptTurn[];
  durationSeconds: number;
  completedAt: number;
  completionStatus: CompletionStatus;
  aiProvenance: AiProvenanceRecord | null;
  strongCount: number;
  turnCount: number;
  touchedCriteria?: string[];
}): RolePlayAttempt {
  const {
    cfg,
    attemptNumber,
    turns,
    durationSeconds,
    completedAt,
    completionStatus,
    aiProvenance,
    strongCount,
    turnCount,
    touchedCriteria,
  } = params;
  const goalEvidence = adjustGoalsForSession(resolveGoalEvidence(cfg), {
    strongCount,
    turnCount,
    completionStatus,
    touchedCriteria,
  });
  const criteriaMet = criteriaMetForOutcome(goalEvidence);
  const score = scoreAttemptFromSession({
    baseScore: cfg.feedback.score,
    goals: goalEvidence,
    completionStatus,
    strongCount,
    turnCount,
  });

  return {
    id: aiProvenance?.runId ?? crypto.randomUUID(),
    attemptNumber,
    turns,
    durationSeconds,
    completedAt,
    completionStatus,
    aiProvenance,
    score,
    criteriaMet,
    goalEvidence,
    outcome: completionBannerCopy(cfg, goalEvidence),
    workedHighlights: resolveHighlights(cfg.feedback.workedHighlights, cfg.feedback.worked),
    practiceNext: resolveHighlights(cfg.feedback.practiceNext, cfg.feedback.improve),
  };
}

export function attemptSelectLabel(
  attempt: RolePlayAttempt,
  bestId: string | null,
): string {
  const best = bestId === attempt.id ? " (Best)" : "";
  const when = formatCompletedDate(attempt.completedAt);
  return `Attempt ${attempt.attemptNumber}${best} · ${when}`;
}
