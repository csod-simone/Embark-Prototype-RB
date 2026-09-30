import { useEffect, useMemo, useState } from "react";
import { Check, Lock, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AiFlag } from "@/components/embark/AiFlag";
import { AiMarkedContent } from "@/components/embark/AiMarkedContent";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildRoleplaySharePayload,
  createRoleplayProvenance,
  type AiProvenanceRecord,
} from "@/lib/ai-compliance";
import { cn } from "@/lib/utils";
import {
  attemptSelectLabel,
  bestAttemptId,
  type RolePlayAttempt,
} from "./attemptHistory";
import {
  GOAL_STATUS_META,
  completionBannerCopy,
  countByStatus,
  criteriaMetForOutcome,
  evidenceDisplayForGoal,
  formatCompletedDate,
  formatPracticeDuration,
  reasoningForGoal,
  resolveGoalEvidence,
  resolveHighlights,
} from "./feedbackResolve";
import type {
  CompletionStatus,
  CriterionReview,
  GoalEvidence,
  GoalEvidenceStatus,
  RolePlayScenario,
} from "./types";

export type ReviewTurn =
  | { id: string; role: "persona"; text: string; modality?: string }
  | { id: string; role: "learner"; text: string; modality?: string };

type ReviewTab = "summary" | "transcript";

const CHIP_DOT: Record<GoalEvidenceStatus | "criteria-met" | "criteria-not-met", string> = {
  "criteria-met": "bg-status-success-fg",
  "criteria-not-met": "bg-status-warning-fg",
  achieved: "bg-status-success-fg",
  partial: "bg-status-warning-fg",
  "not-demonstrated": "bg-status-critical-fg",
  "not-observed": "border-[1.5px] border-dashed border-status-neutral-outline bg-transparent",
  "not-assessed": "bg-status-neutral-fg",
};

const STATUS_BADGE_VARIANT: Record<
  GoalEvidenceStatus | "criteria-met" | "criteria-not-met",
  NonNullable<BadgeProps["variant"]>
> = {
  "criteria-met": "success",
  "criteria-not-met": "warning",
  achieved: "success",
  partial: "warning",
  "not-demonstrated": "destructive",
  "not-observed": "neutral",
  "not-assessed": "neutral",
};

function StatusChip({
  status,
  label,
}: {
  status: GoalEvidenceStatus | "criteria-met" | "criteria-not-met";
  label: string;
}) {
  return (
    <Badge variant={STATUS_BADGE_VARIANT[status]} className="gap-1.5 py-1 text-[11px] font-semibold">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", CHIP_DOT[status])} aria-hidden />
      {label}
    </Badge>
  );
}

function GoalEvidenceAccordion({
  goals,
  criterionReviews,
}: {
  goals: GoalEvidence[];
  criterionReviews?: CriterionReview[];
}) {
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={goals[0] ? [goals[0].criterionId] : []}
    >
      {goals.map((goal, index) => {
        const evidence = evidenceDisplayForGoal(goal);
        const reasoning = reasoningForGoal(goal, criterionReviews);
        return (
          <AccordionItem
            key={goal.criterionId}
            value={goal.criterionId}
            className="border-b border-border/70 last:border-b-0"
          >
            <AccordionTrigger className="gap-3 py-3.5 hover:no-underline [&>svg]:text-muted-foreground">
              <span className="flex flex-1 items-center justify-between gap-3 pr-1 text-left">
                <span className="text-sm font-semibold leading-snug text-foreground">
                  {index + 1} · {goal.label}
                </span>
                <StatusChip status={goal.status} label={GOAL_STATUS_META[goal.status].label} />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-1">
                {evidence.isQuote ? (
                  <div className="max-w-[66ch] rounded-r-lg border-l-[3px] border-l-primary bg-chat px-4 py-3 text-sm italic leading-relaxed text-muted-foreground">
                    {evidence.text}
                  </div>
                ) : (
                  <AiMarkedContent
                    kind="ai-derived"
                    className="max-w-[66ch] rounded-r-lg border-l-[3px] border-l-muted-foreground/40 bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {evidence.text}
                  </AiMarkedContent>
                )}
                <AiMarkedContent kind="ai-derived" className="max-w-[66ch] space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Why this status
                    </p>
                    <AiFlag
                      variant="ai-derived"
                      size="xs"
                      complianceContext="eu-ai-act"
                      articleRef="art-50-1"
                      surface="roleplay_review"
                      fieldName="goal_reasoning"
                    />
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{reasoning}</p>
                </AiMarkedContent>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function AiSectionHeading({
  title,
  fieldName: _fieldName,
  tone = "default",
}: {
  title: string;
  fieldName: string;
  tone?: "default" | "success" | "warning";
}) {
  return (
    <h2
      className={cn(
        "mb-3 text-base font-semibold",
        tone === "success" && "text-status-success-fg",
        tone === "warning" && "text-status-warning-fg",
        tone === "default" && "text-foreground",
      )}
    >
      {title}
    </h2>
  );
}

export function PracticeReviewScreen({
  cfg,
  turns: liveTurns,
  durationSeconds: liveDurationSeconds,
  completedAt: liveCompletedAt,
  completionStatus: liveCompletionStatus,
  viewerMode: _viewerMode = false,
  embedded = false,
  aiProvenance: liveAiProvenance,
  attempts: attemptsProp = [],
  onRestart: _onRestart,
  onContinue: _onContinue,
}: {
  cfg: RolePlayScenario;
  turns: ReviewTurn[];
  durationSeconds: number;
  completedAt: number;
  completionStatus: CompletionStatus | null;
  viewerMode?: boolean;
  embedded?: boolean;
  aiProvenance?: AiProvenanceRecord | null;
  /** Prior + current completed attempts for this scenario. */
  attempts?: RolePlayAttempt[];
  onRestart: () => void;
  onContinue?: () => void;
}) {
  const attempts = useMemo(() => {
    if (attemptsProp.length > 0) return attemptsProp;
    // Fallback single attempt from live props (e.g. first completion before persist settles)
    return [
      {
        id: liveAiProvenance?.runId ?? "current",
        attemptNumber: cfg.attemptNumber,
        turns: liveTurns,
        durationSeconds: liveDurationSeconds,
        completedAt: liveCompletedAt,
        completionStatus: liveCompletionStatus ?? "completed",
        aiProvenance: liveAiProvenance ?? null,
        score: cfg.feedback.score,
        criteriaMet: criteriaMetForOutcome(resolveGoalEvidence(cfg)),
        goalEvidence: resolveGoalEvidence(cfg),
        outcome: completionBannerCopy(cfg, resolveGoalEvidence(cfg)),
        workedHighlights: resolveHighlights(cfg.feedback.workedHighlights, cfg.feedback.worked),
        practiceNext: resolveHighlights(cfg.feedback.practiceNext, cfg.feedback.improve),
      } satisfies RolePlayAttempt,
    ];
  }, [
    attemptsProp,
    cfg,
    liveTurns,
    liveDurationSeconds,
    liveCompletedAt,
    liveCompletionStatus,
    liveAiProvenance,
  ]);

  const latestId = attempts.at(-1)?.id ?? attempts[0]?.id ?? "";
  const initialAttemptFromUrl = (() => {
    try {
      return new URLSearchParams(window.location.search).get("attempt");
    } catch {
      return null;
    }
  })();
  const [selectedAttemptId, setSelectedAttemptId] = useState(() => {
    if (initialAttemptFromUrl && attempts.some((a) => a.id === initialAttemptFromUrl)) {
      return initialAttemptFromUrl;
    }
    return latestId;
  });
  const [tab, setTab] = useState<ReviewTab>("summary");
  const [shareState, setShareState] = useState<"idle" | "created">("idle");

  useEffect(() => {
    if (!attempts.some((a) => a.id === selectedAttemptId)) {
      setSelectedAttemptId(latestId);
    }
  }, [attempts, latestId, selectedAttemptId]);

  useEffect(() => {
    setShareState("idle");
  }, [selectedAttemptId]);

  const bestId = bestAttemptId(attempts);
  const selected =
    attempts.find((a) => a.id === selectedAttemptId) ?? attempts.at(-1) ?? attempts[0];

  const turns = selected?.turns ?? liveTurns;
  const durationSeconds = selected?.durationSeconds ?? liveDurationSeconds;
  const completedAt = selected?.completedAt ?? liveCompletedAt;
  const goals = selected?.goalEvidence ?? resolveGoalEvidence(cfg);
  const counts = countByStatus(goals);
  const met = selected?.criteriaMet ?? criteriaMetForOutcome(goals);
  const worked = selected?.workedHighlights ?? resolveHighlights(cfg.feedback.workedHighlights, cfg.feedback.worked);
  const practiseNext =
    selected?.practiceNext ?? resolveHighlights(cfg.feedback.practiceNext, cfg.feedback.improve);
  const targetMinutes = cfg.timeBudget?.targetMinutes ?? 12;
  const isPractice = cfg.scoringMode === "practice";
  const verdict = selected?.outcome ?? completionBannerCopy(cfg, goals);
  const bannerTitle = met ? "Completed — criteria met." : "Completed — criteria not met.";

  const shareUrl = `${window.location.origin}${window.location.pathname}?share=1&attempt=${encodeURIComponent(selected?.id ?? "")}`;
  const provenance =
    selected?.aiProvenance ?? liveAiProvenance ?? createRoleplayProvenance(cfg.scenarioId);

  const handleShare = async () => {
    const payload = buildRoleplaySharePayload(shareUrl, provenance);
    try {
      await navigator.clipboard.writeText(payload);
      setShareState("created");
      toast.success("Link created", {
        description: `Share link for Attempt ${selected?.attemptNumber ?? 1} copied to clipboard`,
      });
    } catch {
      setShareState("created");
      toast.message("Link created", { description: payload.slice(0, 120) + "…" });
    }
  };

  const tabs: { id: ReviewTab; label: string }[] = [
    { id: "summary", label: "Summary & evidence" },
    { id: "transcript", label: "Transcript" },
  ];

  const attemptPicker =
    attempts.length > 0 ? (
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="roleplay-attempt-select" className="text-xs font-medium text-muted-foreground">
          Attempt
        </label>
        <Select
          value={selected?.id}
          onValueChange={(id) => {
            setSelectedAttemptId(id);
            setTab("summary");
          }}
        >
          <SelectTrigger
            id="roleplay-attempt-select"
            className="h-9 w-[min(100%,22rem)] border-border bg-background"
            aria-label="Select roleplay attempt"
          >
            <SelectValue placeholder="Select attempt" />
          </SelectTrigger>
          <SelectContent>
            {[...attempts].reverse().map((attempt) => (
              <SelectItem key={attempt.id} value={attempt.id}>
                {attemptSelectLabel(attempt, bestId)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ) : null;

  const metadataLine = (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 text-sm text-muted-foreground">
        <span>
          Client · <span className="font-semibold text-foreground">{cfg.personaName}</span>
        </span>
        <span>
          {formatPracticeDuration(durationSeconds)} / {targetMinutes} min target
        </span>
        <span>Completed {formatCompletedDate(completedAt)}</span>
      </div>
      {attemptPicker}
    </div>
  );

  const statusChips = (
    <div className="flex flex-wrap items-center gap-2">
      <StatusChip
        status={met ? "criteria-met" : "criteria-not-met"}
        label={met ? "Criteria met" : "Criteria not met"}
      />
      {counts.achieved > 0 && <StatusChip status="achieved" label={`${counts.achieved} Achieved`} />}
      {counts.partial > 0 && <StatusChip status="partial" label={`${counts.partial} Partial`} />}
      {counts["not-demonstrated"] > 0 && (
        <StatusChip
          status="not-demonstrated"
          label={`${counts["not-demonstrated"]} Not demonstrated`}
        />
      )}
      {counts["not-observed"] > 0 && (
        <StatusChip status="not-observed" label={`${counts["not-observed"]} Not observed`} />
      )}
      {counts["not-assessed"] > 0 && (
        <StatusChip status="not-assessed" label={`${counts["not-assessed"]} Not assessed`} />
      )}
    </div>
  );

  const tabList = (
    <div
      role="tablist"
      aria-label="Practice review sections"
      className="flex gap-1 overflow-x-auto border-b border-border"
    >
      {tabs.map((t) => {
        const selected = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`review-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`review-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            className={cn(
              "mr-6 shrink-0 border-b-2 px-0.5 py-2.5 text-sm font-semibold transition-colors last:mr-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none",
              selected
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => {
              const order: ReviewTab[] = ["summary", "transcript"];
              const i = order.indexOf(t.id);
              if (e.key === "ArrowRight") {
                e.preventDefault();
                const next = order[(i + 1) % order.length];
                setTab(next);
                document.getElementById(`review-tab-${next}`)?.focus();
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                const prev = order[(i - 1 + order.length) % order.length];
                setTab(prev);
                document.getElementById(`review-tab-${prev}`)?.focus();
              }
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );

  const summaryPanel = tab === "summary" && (
    <div className="space-y-6">
      <AiMarkedContent
        kind="ai-generated"
        className={cn(
          "rounded-xl border px-[17px] py-[15px] text-sm leading-relaxed",
          met
            ? "border-status-success-outline bg-status-success text-status-success-fg"
            : "border-status-warning-outline bg-status-warning text-status-warning-fg",
        )}
      >
        <p>
          <span className="font-semibold">{bannerTitle}</span> {verdict}
        </p>
      </AiMarkedContent>

      <div className="grid gap-8 md:grid-cols-2 md:gap-[34px]">
        <AiMarkedContent kind="ai-generated">
          <AiSectionHeading title="What worked" fieldName="what_worked" tone="success" />
          <ul className="space-y-3.5">
            {worked.map((item) => (
              <li key={`${item.label}-${item.detail}`} className="max-w-[52ch] text-sm leading-relaxed">
                {item.label ? (
                  <>
                    <span className="font-semibold text-foreground">{item.label}.</span>{" "}
                    <span className="text-muted-foreground">{item.detail}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">{item.detail}</span>
                )}
              </li>
            ))}
          </ul>
        </AiMarkedContent>
        <AiMarkedContent kind="ai-generated">
          <AiSectionHeading title="Practise next" fieldName="practise_next" tone="warning" />
          <ul className="space-y-3.5">
            {practiseNext.map((item) => (
              <li key={`${item.label}-${item.detail}`} className="max-w-[52ch] text-sm leading-relaxed">
                {item.label ? (
                  <>
                    <span className="font-semibold text-foreground">{item.label}.</span>{" "}
                    <span className="text-muted-foreground">{item.detail}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">{item.detail}</span>
                )}
              </li>
            ))}
          </ul>
        </AiMarkedContent>
      </div>

      <div className="border-t border-border/70 pt-5">
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">Goals</h2>
          <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[11px] text-muted-foreground">
            {(["achieved", "partial", "not-demonstrated"] as GoalEvidenceStatus[]).map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", CHIP_DOT[s])} aria-hidden />
                {GOAL_STATUS_META[s].label}
              </span>
            ))}
          </div>
        </div>
        <GoalEvidenceAccordion
          key={selected?.id ?? "goals"}
          goals={goals}
          criterionReviews={cfg.feedback.criterionReviews}
        />
      </div>
    </div>
  );

  const transcriptPanel = tab === "transcript" && (
    <div>
      {turns.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          No transcript was saved for this run. Incomplete or interrupted sessions may not retain
          conversation turns. Practise again to generate a full record.
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {turns.map((t) => {
            const isLearner = t.role === "learner";
            if (isLearner) {
              return (
                <div key={t.id} className="flex justify-end">
                  <div className="flex max-w-[78%] flex-col items-end gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      You
                    </p>
                    <div className="max-w-[80%] rounded-full bg-chat px-4 py-4 text-sm font-normal leading-relaxed text-chat-foreground">
                      {t.text}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={t.id} className="flex justify-start">
                <div className="flex max-w-[78%] flex-col items-start gap-1.5">
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>{cfg.personaName}</span>
                    <AiFlag
                      variant="ai-generated"
                      size="xs"
                      complianceContext="eu-ai-act"
                      articleRef="art-50-1"
                      surface="roleplay_review"
                      fieldName="transcript_persona"
                    />
                  </div>
                  <AiMarkedContent kind="ai-generated" as="p" className="text-sm leading-relaxed text-foreground">
                    {t.text}
                  </AiMarkedContent>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const shareControls = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={handleShare}
    >
      {shareState === "created" ? (
        <Check className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Share2 className="h-3.5 w-3.5" aria-hidden />
      )}
      {shareState === "created" ? "Link created" : "Create share link"}
    </Button>
  );

  if (embedded) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-border px-5 pt-5 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            {metadataLine}
            {shareControls}
          </div>

          <div className="mt-4">{statusChips}</div>

          <p className="mt-3 inline-flex max-w-3xl items-start gap-1.5 pb-1 text-[11px] leading-snug text-muted-foreground">
            <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
            Private to you. Nothing is shared unless you create a link.
          </p>

          <div className="mt-3">{tabList}</div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <div
            role="tabpanel"
            id="review-panel-summary"
            aria-labelledby="review-tab-summary"
            hidden={tab !== "summary"}
          >
            {summaryPanel}
          </div>
          <div
            role="tabpanel"
            id="review-panel-transcript"
            aria-labelledby="review-tab-transcript"
            hidden={tab !== "transcript"}
          >
            {transcriptPanel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-3 py-4 sm:px-6 sm:py-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <header className="shrink-0 border-b border-border px-5 pt-6 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  {isPractice ? "Practice review" : "Formative review"}
                </p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-[1.45rem]">
                  {cfg.scenarioTitle}
                </h1>
                <div className="mt-3">{metadataLine}</div>
              </div>
              {shareControls}
            </div>

            <div className="mt-4 pb-1">{statusChips}</div>

            <p className="mt-3 inline-flex max-w-3xl items-start gap-1.5 pb-3 text-[11px] leading-snug text-muted-foreground">
              <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
              Private to you. Nothing is shared unless you create a link.
            </p>

            <div className="mt-1">{tabList}</div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            <div
              role="tabpanel"
              id="review-panel-summary"
              aria-labelledby="review-tab-summary"
              hidden={tab !== "summary"}
            >
              {summaryPanel}
            </div>
            <div
              role="tabpanel"
              id="review-panel-transcript"
              aria-labelledby="review-tab-transcript"
              hidden={tab !== "transcript"}
            >
              {transcriptPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
