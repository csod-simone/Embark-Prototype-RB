import type {
  CriterionOrdinal,
  FeedbackHighlight,
  GoalEvidence,
  GoalEvidenceStatus,
  RolePlayScenario,
} from "./types";

export const GOAL_STATUS_META: Record<
  GoalEvidenceStatus,
  { label: string; badgeClass: string }
> = {
  achieved: {
    label: "Achieved",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  partial: {
    label: "Partial",
    badgeClass: "bg-amber-50 text-amber-900 border-amber-200",
  },
  "not-demonstrated": {
    label: "Not demonstrated",
    badgeClass: "bg-red-50 text-red-800 border-red-200",
  },
  "not-observed": {
    label: "Not observed",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  "not-assessed": {
    label: "Not assessed",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
  },
};

export const GOAL_STATUS_ORDER: GoalEvidenceStatus[] = [
  "achieved",
  "partial",
  "not-demonstrated",
  "not-observed",
  "not-assessed",
];

export function ordinalToStatus(ordinal: CriterionOrdinal): GoalEvidenceStatus {
  if (ordinal === "Strong") return "achieved";
  if (ordinal === "Proficient") return "partial";
  return "not-demonstrated";
}

export function resolveHighlights(
  structured: FeedbackHighlight[] | undefined,
  fallback: string[],
): FeedbackHighlight[] {
  if (structured?.length) return structured;
  return fallback.map((detail) => {
    const idx = detail.indexOf(":");
    if (idx > 0 && idx < 48) {
      return { label: detail.slice(0, idx).trim(), detail: detail.slice(idx + 1).trim() };
    }
    return { label: "", detail };
  });
}

export function resolveGoalEvidence(cfg: RolePlayScenario): GoalEvidence[] {
  const fb = cfg.feedback;
  if (fb.goalEvidence?.length) return fb.goalEvidence;

  if (fb.criterionReviews?.length) {
    return fb.criterionReviews.map((r) => ({
      criterionId: r.criterionId,
      label:
        cfg.focusCriteria?.find((c) => c.id === r.criterionId)?.label ??
        fb.skills.find((_, i) => `skill-${i}` === r.criterionId)?.name ??
        r.criterionId,
      status: r.status ?? ordinalToStatus(r.ordinal),
      evidence: r.evidenceQuote.startsWith('"')
        ? r.evidenceQuote
        : `"${r.evidenceQuote}"`,
    }));
  }

  return fb.skills.map((s, i) => ({
    criterionId: `skill-${i}`,
    label: s.name,
    status:
      s.confidence === "High"
        ? ("achieved" as const)
        : s.confidence === "Medium"
          ? ("partial" as const)
          : ("not-demonstrated" as const),
    evidence: s.evidence,
  }));
}

export function resolveOutcome(cfg: RolePlayScenario): string {
  if (cfg.feedback.outcome) return cfg.feedback.outcome;
  const isPractice = cfg.scoringMode === "practice";
  return isPractice
    ? "Practice review based on the blueprint goals and transcript evidence from this session."
    : "Formative review based on the blueprint goals and transcript evidence from this session.";
}

export function criteriaFullyMet(goals: GoalEvidence[]): boolean {
  return (
    goals.length > 0 &&
    goals.every((g) => g.status === "achieved" || g.status === "not-assessed")
  );
}

/** True when every assessed goal is Achieved (ignores not-observed / not-assessed). */
export function criteriaMetForOutcome(goals: GoalEvidence[]): boolean {
  const assessed = goals.filter(
    (g) => g.status !== "not-observed" && g.status !== "not-assessed",
  );
  return assessed.length > 0 && assessed.every((g) => g.status === "achieved");
}

export function countByStatus(goals: GoalEvidence[]): Record<GoalEvidenceStatus, number> {
  const counts: Record<GoalEvidenceStatus, number> = {
    achieved: 0,
    partial: 0,
    "not-demonstrated": 0,
    "not-observed": 0,
    "not-assessed": 0,
  };
  for (const g of goals) counts[g.status] += 1;
  return counts;
}

export const NOT_DEMONSTRATED_EVIDENCE =
  "You had a relevant opportunity, but the required behaviour wasn't demonstrated.";

export function evidenceDisplayForGoal(goal: GoalEvidence): {
  text: string;
  isQuote: boolean;
} {
  if (
    goal.status === "not-demonstrated" ||
    goal.status === "not-observed" ||
    goal.status === "not-assessed"
  ) {
    const custom = goal.evidence?.trim();
    return {
      text:
        custom ||
        (goal.status === "not-demonstrated"
          ? NOT_DEMONSTRATED_EVIDENCE
          : goal.status === "not-observed"
            ? "This goal was not observed in the saved transcript."
            : "This goal was not assessed for this run."),
      isQuote: false,
    };
  }
  const text = goal.evidence.trim();
  const quoted =
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("“") && text.endsWith("”"));
  return { text: quoted ? text : `“${text}”`, isQuote: true };
}

const DEFAULT_GOAL_REASONING =
  "Rating derived from blueprint goal criteria and transcript evidence for this saved run.";

/** AI explainability for a goal status — shown under transcript evidence in the Goals accordion. */
export function reasoningForGoal(
  goal: GoalEvidence,
  reviews: RolePlayScenario["feedback"]["criterionReviews"] | undefined,
): string {
  const narrative = reviews?.find((r) => r.criterionId === goal.criterionId)?.narrative?.trim();
  return narrative || DEFAULT_GOAL_REASONING;
}

export function completionBannerCopy(cfg: RolePlayScenario, goals: GoalEvidence[]): string {
  if (cfg.feedback.outcome) {
    // Prefer the plain-language verdict; strip a leading “Completed — …” if present
    return cfg.feedback.outcome.replace(/^Completed\s*[—–-]\s*/i, "").trim();
  }
  if (criteriaMetForOutcome(goals)) {
    return cfg.scoringMode === "practice"
      ? "You demonstrated the required practice criteria across the blueprint goals."
      : "You met the formative criteria for this attempt.";
  }
  return "You ended the practice before every required assessment criterion was demonstrated. Review the goal results below, then practise again.";
}

export function formatPracticeDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function formatCompletedDate(ms: number): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleDateString();
  }
}
