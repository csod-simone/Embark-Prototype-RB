import { useMemo, useState, type ReactNode } from "react";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  BLUEPRINT_EXPERIENCE_TYPES,
  stubBlueprintVersions,
  type BlueprintDraft,
  type BlueprintStageId,
  type CreationMethod,
  type ExperienceTypeId,
  experienceTypeLabel,
  isAssessed,
  unmappedRequiredCriteria,
  versionSourceLabel,
} from "./blueprintModel";

function PhaseTag({ phase }: { phase: 1 | 2 | "assurance" | "ai" | "form" }) {
  const label =
    phase === 1
      ? "Create"
      : phase === 2
        ? "Blueprint"
        : phase === "assurance"
          ? "Assurance"
          : phase === "ai"
            ? "Design with AI"
            : "Structured form";
  return (
    <span
      className={cn(
        "mb-2 inline-block rounded-full px-2.5 py-0.5 text-[0.64rem] font-bold uppercase tracking-wide",
        phase === 1 || phase === "form"
          ? "bg-status-success text-status-success-fg"
          : "bg-primary/10 text-primary",
      )}
    >
      {label}
    </span>
  );
}

function StageFooter({
  backLabel,
  onBack,
  nextLabel,
  onNext,
  nextDisabled,
}: {
  backLabel?: string;
  onBack?: () => void;
  nextLabel: string;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-7 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack}>
          ← {backLabel ?? "Back"}
        </Button>
      ) : (
        <span />
      )}
      <Button type="button" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
    </div>
  );
}

function OptionCard({
  selected,
  title,
  description,
  badge,
  onClick,
}: {
  selected: boolean;
  title: ReactNode;
  description?: string;
  badge?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-[18px] w-[18px] flex-none place-items-center rounded-full border-2",
          selected ? "border-primary" : "border-muted-foreground/40",
        )}
        aria-hidden
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-[0.92rem] font-semibold text-foreground">
          {title}
          {badge}
        </span>
        {description ? (
          <span className="mt-1 block text-[0.82rem] text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </button>
  );
}

function ConsequenceBadge({ emits }: { emits: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[0.64rem] font-bold",
        emits
          ? "bg-status-critical text-status-critical-fg"
          : "bg-status-success text-status-success-fg",
      )}
    >
      {emits ? "emits scored data" : "nothing scored"}
    </span>
  );
}

function FieldBlock({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4 space-y-1.5">
      <Label className="text-[0.88rem] font-semibold">{label}</Label>
      {children}
      {hint ? <p className="text-[0.78rem] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function InfoCard({
  title,
  detail,
  trailing,
}: {
  title: ReactNode;
  detail?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="mb-3 rounded-2xl border border-border bg-card shadow-sm px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[0.9rem] font-semibold text-foreground">
        <span>{title}</span>
        {trailing}
      </div>
      {detail ? <div className="mt-1.5 text-[0.83rem] text-muted-foreground">{detail}</div> : null}
    </div>
  );
}

export type StagePaneProps = {
  draft: BlueprintDraft;
  stage: BlueprintStageId;
  /** False in edit mode — Phase 1 create steps are hidden. */
  showCreateSteps: boolean;
  onChange: (next: BlueprintDraft) => void;
  onGo: (stage: BlueprintStageId) => void;
  onContinue: () => void;
  onBack: () => void;
  chatInput: string;
  setChatInput: (v: string) => void;
  chatMessages: { role: "ai" | "me" | "infer"; text: string }[];
  onSendChat: () => void;
  chatDemoPlaying?: boolean;
  onValidate: () => void;
  onSubmitPublish: () => void;
};

export function BlueprintStagePane(props: StagePaneProps) {
  const { draft, stage } = props;
  switch (stage) {
    case "method":
      return <MethodStage {...props} />;
    case "generate":
      return draft.creationMethod === "form" ? (
        <GenerateFormStage {...props} />
      ) : (
        <GenerateAiStage {...props} />
      );
    case "type":
      return <TypeStage {...props} />;
    case "core":
      return <BriefStage {...props} />;
    case "knowledge":
      return <KnowledgeStage {...props} />;
    case "resources":
      return <ResourcesStage {...props} />;
    case "criteria":
      return <CriteriaStage {...props} />;
    case "completion":
      return <CompletionStage {...props} />;
    case "review":
      return <ReviewStage {...props} />;
    case "validate":
      return <ValidateStage {...props} />;
    case "versions":
      return <VersionsStage {...props} />;
    case "publish":
      return <PublishStage {...props} />;
    default:
      return null;
  }
}

function MethodStage({ draft, onChange, onContinue }: StagePaneProps) {
  const select = (method: CreationMethod) => {
    if (!method) return;
    onChange({ ...draft, creationMethod: method });
  };
  return (
    <div>
      <h2 className="text-[1.22rem] font-semibold text-foreground">How do you want to build it?</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        Both routes produce the same blueprint. They differ in how the experience type is set.
      </p>
      <div className="grid gap-2.5">
        <OptionCard
          selected={draft.creationMethod === "ai"}
          onClick={() => select("ai")}
          title={
            <>
              Design with AI <AskSageIcon size={14} className="inline text-primary" />
            </>
          }
          description="The assistant asks focused questions and drafts the blueprint. Experience type is inferred from your answers — you confirm it."
        />
        <OptionCard
          selected={draft.creationMethod === "form"}
          onClick={() => select("form")}
          title="Structured form"
          description="Fill the fields directly and choose the experience type yourself."
        />
      </div>
      <StageFooter
        nextLabel="Continue →"
        onNext={onContinue}
        nextDisabled={!draft.creationMethod}
      />
    </div>
  );
}

function GenerateAiStage({
  draft,
  onBack,
  onContinue,
  chatInput,
  setChatInput,
  chatMessages,
  onSendChat,
  chatDemoPlaying = false,
}: StagePaneProps) {
  const canReview = Boolean(draft.experienceType) && !chatDemoPlaying;
  return (
    <div>
      <PhaseTag phase="ai" />
      <h2 className="text-[1.22rem] font-semibold text-foreground">Generate draft</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        Answer one question at a time. Your evaluation and ending answers determine the experience
        type.
      </p>
      <div className="mb-2 flex min-h-[12rem] flex-col gap-2.5">
        {chatMessages.length === 0 && chatDemoPlaying ? (
          <p className="text-sm text-muted-foreground">Starting conversation…</p>
        ) : null}
        {chatMessages.map((m, i) =>
          m.role === "infer" ? (
            <div
              key={i}
              className="rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-3 text-[0.86rem] text-foreground"
            >
              <div className="flex items-center gap-2 font-semibold">
                <AskSageIcon size={14} className="text-primary" /> Inferred
              </div>
              <p className="mt-1.5 leading-relaxed">
                Fixed scored criteria + an automatic pass/fail ending means this is an{" "}
                <b>Assessed simulation</b> — the only type that emits scored data. I&apos;ve set it
                and turned on scoring, completion, review, and the publish approval.
              </p>
              <span className="mt-2 inline-flex items-center rounded-full bg-status-critical px-2.5 py-0.5 text-[0.66rem] font-bold text-status-critical-fg">
                inferred · Assessed simulation · confirm next
              </span>
            </div>
          ) : (
            <div
              key={i}
              className={cn(
                "max-w-[84%] rounded-[14px] px-3.5 py-2.5 text-[0.86rem] leading-snug",
                m.role === "ai"
                  ? "self-start rounded-bl-sm bg-muted text-foreground"
                  : "self-end rounded-br-sm bg-primary text-primary-foreground",
              )}
            >
              {m.text}
            </div>
          ),
        )}
      </div>
      <div className="mt-1.5 flex gap-2">
        <Input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={
            chatDemoPlaying
              ? "Conversation unfolding…"
              : "Reply, or correct the inference…"
          }
          disabled={chatDemoPlaying}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSendChat();
            }
          }}
        />
        <Button type="button" onClick={onSendChat} disabled={chatDemoPlaying}>
          Send
        </Button>
      </div>
      <StageFooter
        backLabel="Method"
        onBack={onBack}
        nextLabel="Review draft →"
        onNext={onContinue}
        nextDisabled={!canReview}
      />
    </div>
  );
}

function GenerateFormStage({ draft, onChange, onBack, onContinue }: StagePaneProps) {
  const canReview = Boolean(draft.experienceType && draft.practiceObjective.trim());
  return (
    <div>
      <PhaseTag phase="form" />
      <h2 className="text-[1.22rem] font-semibold text-foreground">Generate draft</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        Fields are pre-filled from the demo scenario — edit anything before reviewing the draft.
      </p>
      <FieldBlock label="Practice objective">
        <Textarea
          value={draft.practiceObjective}
          onChange={(e) => onChange({ ...draft, practiceObjective: e.target.value })}
          rows={3}
        />
      </FieldBlock>
      <FieldBlock label="Experience type">
        <div className="grid gap-2.5">
          {BLUEPRINT_EXPERIENCE_TYPES.map((t) => (
            <OptionCard
              key={t.id}
              selected={draft.experienceType === t.id}
              onClick={() =>
                onChange({
                  ...draft,
                  experienceType: t.id,
                  experienceTypeConfirmed: true,
                  governance: {
                    ...draft.governance,
                    experienceTypeInferred: false,
                    provenance: "author-authored",
                    provenanceDetail: "source: structured form",
                  },
                })
              }
              title={
                <>
                  {t.label} <ConsequenceBadge emits={t.emitsScoredData} />
                </>
              }
            />
          ))}
        </div>
      </FieldBlock>
      <FieldBlock label="AI role & behaviour">
        <Textarea
          value={draft.aiRoleBehaviour}
          onChange={(e) => onChange({ ...draft, aiRoleBehaviour: e.target.value })}
          rows={3}
        />
      </FieldBlock>
      <FieldBlock label="Persona">
        <Input
          value={draft.persona}
          onChange={(e) => onChange({ ...draft, persona: e.target.value })}
        />
      </FieldBlock>
      <StageFooter
        backLabel="Method"
        onBack={onBack}
        nextLabel="Review draft →"
        onNext={onContinue}
        nextDisabled={!canReview}
      />
    </div>
  );
}

function TypeStage({ draft, onChange, onBack, onContinue, showCreateSteps }: StagePaneProps) {
  const setType = (id: ExperienceTypeId) => {
    onChange({
      ...draft,
      experienceType: id,
      experienceTypeConfirmed: true,
      governance: {
        ...draft.governance,
        experienceTypeInferred: false,
      },
    });
  };
  return (
    <div>
      <h2 className="text-[1.22rem] font-semibold text-foreground">Experience type</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        Only Assessed simulation produces pass/fail and emits scored data. You can change it any
        time before publish.
      </p>
      {draft.governance.experienceTypeInferred && draft.experienceType === "assessed" ? (
        <div className="mb-4 rounded-xl border border-primary/25 bg-primary/[0.04] px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-2 text-[0.9rem] font-semibold">
            <AskSageIcon size={14} className="text-primary" />
            Set to: Assessed simulation
            <Badge variant="ai" className="text-[0.66rem]">
              inferred · confirmable
            </Badge>
          </div>
          <p className="mt-1.5 text-[0.83rem] text-muted-foreground">
            Inferred from fixed scored criteria and an automatic pass/fail ending. Change it below
            and the inference is discarded.
          </p>
        </div>
      ) : null}
      <div className="grid gap-2.5">
        {BLUEPRINT_EXPERIENCE_TYPES.map((t) => (
          <OptionCard
            key={t.id}
            selected={draft.experienceType === t.id}
            onClick={() => setType(t.id)}
            title={
              <>
                {t.label} <ConsequenceBadge emits={t.emitsScoredData} />
              </>
            }
            description={t.description}
          />
        ))}
      </div>
      <StageFooter
        backLabel={showCreateSteps ? "Generate" : undefined}
        onBack={showCreateSteps ? onBack : undefined}
        nextLabel="Confirm & continue →"
        onNext={onContinue}
        nextDisabled={!draft.experienceType}
      />
    </div>
  );
}

function BriefStage({ draft, onChange, onBack, onContinue }: StagePaneProps) {
  return (
    <div>
      <h2 className="text-[1.22rem] font-semibold text-foreground">Brief</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        The fields that ground the runtime prompt.
      </p>
      <FieldBlock label="Practice objective">
        <Textarea
          value={draft.practiceObjective}
          onChange={(e) => onChange({ ...draft, practiceObjective: e.target.value })}
          rows={3}
        />
      </FieldBlock>
      <FieldBlock label="AI role & behaviour">
        <Textarea
          value={draft.aiRoleBehaviour}
          onChange={(e) => onChange({ ...draft, aiRoleBehaviour: e.target.value })}
          rows={3}
        />
      </FieldBlock>
      <FieldBlock label="Persona">
        <Input
          value={draft.persona}
          onChange={(e) => onChange({ ...draft, persona: e.target.value })}
        />
      </FieldBlock>
      <FieldBlock label="Time budget">
        <Input
          value={draft.timeBudget}
          onChange={(e) => onChange({ ...draft, timeBudget: e.target.value })}
        />
      </FieldBlock>
      <StageFooter
        backLabel="Experience type"
        onBack={onBack}
        nextLabel="Continue →"
        onNext={onContinue}
      />
    </div>
  );
}

function KnowledgeStage({ draft, onChange, onBack, onContinue }: StagePaneProps) {
  return (
    <div>
      <h2 className="text-[1.22rem] font-semibold text-foreground">Knowledge</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        Fact cards with a start-visibility gate. Reveal is deterministic across learners.
      </p>
      {draft.knowledge.length === 0 ? (
        <p className="mb-3 text-sm text-muted-foreground">No fact cards yet.</p>
      ) : (
        draft.knowledge.map((f) => (
          <InfoCard
            key={f.id}
            title={f.title}
            detail={f.detail}
            trailing={
              <Badge variant={f.reveal === "tell-user-first" ? "warning" : "ai"} className="text-[0.66rem]">
                {f.reveal === "tell-user-first" ? "tell user first" : "AI reveals when relevant"}
              </Badge>
            }
          />
        ))
      )}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center border-dashed"
        onClick={() =>
          onChange({
            ...draft,
            knowledge: [
              ...draft.knowledge,
              {
                id: `k-${draft.knowledge.length + 1}`,
                title: "New fact card",
                detail: "Describe when and how this fact should surface.",
                reveal: "ai-reveals",
              },
            ],
          })
        }
      >
        + Add fact card
        <span className="ml-1 text-primary">· suggest from source</span>
      </Button>
      <StageFooter backLabel="Brief" onBack={onBack} nextLabel="Continue →" onNext={onContinue} />
    </div>
  );
}

function ResourcesStage({ draft, onChange, onBack, onContinue }: StagePaneProps) {
  return (
    <div>
      <h2 className="text-[1.22rem] font-semibold text-foreground">Resources</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        Upload, inspect the extraction, and pin an exact version.
      </p>
      {draft.resources.map((r) => (
        <InfoCard
          key={r.id}
          title={r.name}
          detail={
            <>
              {r.detail}
              {r.pinnedVersion ? (
                <>
                  {" "}
                  · <button type="button" className="font-semibold text-primary hover:underline">inspect extraction</button>
                  {" · "}
                  <button type="button" className="font-semibold text-primary hover:underline">change pinned version</button>
                </>
              ) : null}
            </>
          }
          trailing={
            <Badge variant={r.pinnedVersion ? "success" : "neutral"} className="text-[0.66rem]">
              {r.pinnedVersion ? `pinned ${r.pinnedVersion}` : "not pinned"}
            </Badge>
          }
        />
      ))}
      <FieldBlock label="Why does this source exist?">
        <div className="grid gap-2.5">
          <OptionCard
            selected={draft.resourcePurpose === "character-accuracy"}
            onClick={() => onChange({ ...draft, resourcePurpose: "character-accuracy" })}
            title="Keep the AI character accurate"
            description="Live model may look up approved facts — it never receives the whole document."
          />
          <OptionCard
            selected={draft.resourcePurpose === "evaluator-only"}
            onClick={() => onChange({ ...draft, resourcePurpose: "evaluator-only" })}
            title="Check correctness & write feedback"
            description="Only the private evaluator may retrieve it, during evaluation or a knowledge check."
          />
        </div>
      </FieldBlock>
      <Button type="button" variant="outline" className="w-full justify-center border-dashed">
        ↑ Upload to resource library
      </Button>
      <p className="mt-2.5 text-[0.78rem] text-muted-foreground">
        🔒 No document body is kept in the permanent prompt. At most 3 passages / 4,500 characters
        per response; runs record when no lookup occurred.
      </p>
      <StageFooter
        backLabel="Knowledge"
        onBack={onBack}
        nextLabel="Continue →"
        onNext={onContinue}
      />
    </div>
  );
}

function CriteriaStage({ draft, onBack, onContinue }: StagePaneProps) {
  const unmapped = unmappedRequiredCriteria(draft);
  return (
    <div>
      <h2 className="text-[1.22rem] font-semibold text-foreground">Evaluation</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        Each criterion maps to a learner focus, the review rubric, and a named competency.
      </p>
      {draft.criteria.map((c) => (
        <InfoCard
          key={c.id}
          title={c.label}
          detail={
            <>
              <div>{c.detail}</div>
              <div className="mt-1 font-mono text-[0.62rem] text-muted-foreground">
                → competency: {c.competency ?? "unmapped"}
              </div>
            </>
          }
          trailing={
            <Badge variant={c.required ? "warning" : "neutral"} className="text-[0.66rem]">
              {c.required ? "required" : "optional"}
            </Badge>
          }
        />
      ))}
      {unmapped.length > 0 ? (
        <p className="text-[0.78rem] font-medium text-warning-foreground">
          {unmapped.length} criterion {unmapped.length === 1 ? "is" : "are"} unmapped — required
          criteria must map to a competency before publish.
        </p>
      ) : null}
      {!isAssessed(draft) ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Scoring is off for {experienceTypeLabel(draft.experienceType)}. Criteria remain available
          for formative observation.
        </p>
      ) : null}
      <StageFooter
        backLabel="Resources"
        onBack={onBack}
        nextLabel="Continue →"
        onNext={onContinue}
      />
    </div>
  );
}

function CompletionStage({ draft, onChange, onBack, onContinue }: StagePaneProps) {
  return (
    <div>
      <PhaseTag phase={2} />
      <h2 className="text-[1.22rem] font-semibold text-foreground">Completion</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        What “completed” and “failed” mean.
      </p>
      <FieldBlock label="Target / maximum duration">
        <Input
          value={draft.targetDuration}
          onChange={(e) => onChange({ ...draft, targetDuration: e.target.value })}
        />
      </FieldBlock>
      <FieldBlock label="Safety stop">
        <Input
          value={draft.safetyStop}
          onChange={(e) => onChange({ ...draft, safetyStop: e.target.value })}
        />
      </FieldBlock>
      <FieldBlock label="Automatic ending">
        <Input
          value={draft.automaticEnding}
          onChange={(e) => onChange({ ...draft, automaticEnding: e.target.value })}
        />
      </FieldBlock>
      <StageFooter
        backLabel="Evaluation"
        onBack={onBack}
        nextLabel="Continue →"
        onNext={onContinue}
      />
    </div>
  );
}

function ReviewStage({ draft, onChange, onBack, onContinue }: StagePaneProps) {
  return (
    <div>
      <PhaseTag phase={2} />
      <h2 className="text-[1.22rem] font-semibold text-foreground">Review</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        You define the structure; the review model fills it with transcript-grounded feedback.
      </p>
      <FieldBlock label="Template structure">
        <Textarea
          value={draft.reviewTemplate}
          onChange={(e) => onChange({ ...draft, reviewTemplate: e.target.value })}
          className="min-h-[120px] font-mono text-[0.82rem]"
          rows={8}
        />
      </FieldBlock>
      <FieldBlock label="Final status scale">
        <Input
          value={draft.statusScale}
          onChange={(e) => onChange({ ...draft, statusScale: e.target.value })}
        />
      </FieldBlock>
      <StageFooter
        backLabel="Completion"
        onBack={onBack}
        nextLabel="Continue →"
        onNext={onContinue}
      />
    </div>
  );
}

function ValidateStage({ draft, onBack, onContinue, onValidate }: StagePaneProps) {
  const statusChip = (status: string) => {
    if (status === "passed")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-status-success px-2.5 py-0.5 text-[0.74rem] font-semibold text-status-success-fg">
          <span className="h-2 w-2 rounded-full bg-status-success-fg" /> Passed
        </span>
      );
    if (status === "failed")
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-status-critical px-2.5 py-0.5 text-[0.74rem] font-semibold text-status-critical-fg">
          <span className="h-2 w-2 rounded-full bg-status-critical-fg" /> Failed
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-status-warning px-2.5 py-0.5 text-[0.74rem] font-semibold text-status-warning-fg">
        <span className="h-2 w-2 rounded-full bg-status-warning-fg" /> Not run
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-[1.22rem] font-semibold text-foreground">Validate</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        Contract tests run against the compiled flow.
      </p>
      {draft.contractTests.map((t) => (
        <InfoCard
          key={t.id}
          title={
            <span className="flex flex-wrap items-center gap-2">
              {t.label} {statusChip(t.status)}
            </span>
          }
          detail={
            t.status === "not-run" ? (
              <>
                <button type="button" className="font-semibold text-primary hover:underline" onClick={onValidate}>
                  Run test
                </button>
                {t.required ? " · required before publish" : null}
              </>
            ) : (
              t.detail
            )
          }
        />
      ))}
      <div className="mt-1.5 flex flex-wrap gap-2.5">
        <Button type="button" onClick={onValidate}>
          Validate again
        </Button>
        <Button type="button" variant="outline" onClick={onValidate}>
          <AskSageIcon size={14} className="mr-1" /> Validate & improve
        </Button>
        <Button type="button" variant="outline">
          Quality-run history
        </Button>
      </div>
      {draft.qualityRunNote ? (
        <div className="mt-3 rounded-xl border border-border bg-muted/30 px-4 py-3.5">
          <div className="text-[0.82rem] font-semibold">Latest quality run · Auto Improve</div>
          <p className="mt-1 text-[0.83rem] text-muted-foreground">{draft.qualityRunNote}</p>
        </div>
      ) : null}
      <StageFooter
        backLabel={isAssessed(draft) ? "Review" : "Evaluation"}
        onBack={onBack}
        nextLabel="Continue →"
        onNext={onContinue}
      />
    </div>
  );
}

function formatVersionTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function VersionsStage({ draft, onBack, onContinue }: StagePaneProps) {
  const versions = useMemo(() => stubBlueprintVersions(draft.title), [draft.title]);
  const [selectedId, setSelectedId] = useState(versions[0]?.id ?? "");
  const selected = versions.find((v) => v.id === selectedId) ?? versions[0];
  const comparison = selected?.comparison;
  const prevNumber = selected ? selected.number - 1 : 0;

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-primary">
            Immutable blueprint snapshots
          </p>
          <h2 className="mt-1 text-[1.22rem] font-semibold text-foreground">Version history</h2>
          <p className="mt-1 max-w-[64ch] text-muted-foreground">
            Publishing and archiving change lifecycle status without creating a content version.
            Runs remain linked to the exact version they used.
          </p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[0.72rem] font-semibold text-muted-foreground">
          {versions.length} versions
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        {/* Version list */}
        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
          {versions.map((v) => {
            const active = v.id === selected?.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedId(v.id)}
                className={cn(
                  "w-full rounded-xl border px-3.5 py-3 text-left transition-colors",
                  active
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card hover:bg-muted/40",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Version {v.number}</span>
                  {v.isCurrent ? (
                    <span className="rounded-full bg-status-success px-2 py-0.5 text-[0.66rem] font-bold text-status-success-fg">
                      Current
                    </span>
                  ) : null}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[0.66rem] font-semibold text-muted-foreground">
                    {versionSourceLabel(v.source)}
                  </span>
                </div>
                <p className="mt-1 text-[0.72rem] text-muted-foreground">
                  {formatVersionTimestamp(v.createdAt)}
                </p>
                <p className="mt-1.5 text-[0.82rem] leading-snug text-muted-foreground">{v.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Change comparison */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-primary">
                Change comparison
              </p>
              <h3 className="mt-1 text-base font-semibold text-foreground">
                {selected && prevNumber >= 1
                  ? `Version ${selected.number} vs ${prevNumber}`
                  : selected
                    ? `Version ${selected.number}`
                    : "Select a version"}
              </h3>
              {comparison ? (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem]">
                  <span className="font-semibold text-status-success-fg">
                    +{comparison.wordsAdded} words
                  </span>
                  <span className="font-semibold text-status-critical-fg">
                    −{comparison.wordsRemoved} words
                  </span>
                  <span className="text-muted-foreground">
                    {comparison.fieldsChanged} field
                    {comparison.fieldsChanged === 1 ? "" : "s"} changed
                  </span>
                </div>
              ) : (
                <p className="mt-1.5 text-[0.78rem] text-muted-foreground">
                  Initial snapshot — no prior version to compare.
                </p>
              )}
              {comparison ? (
                <div className="mt-2 flex items-center gap-3 text-[0.72rem] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-status-success-fg/80" /> Added
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-status-critical-fg/80" /> Removed
                  </span>
                </div>
              ) : null}
            </div>
            {comparison ? (
              <span className="rounded-full bg-muted px-2.5 py-1 text-[0.72rem] font-semibold text-muted-foreground">
                {comparison.fieldsChanged} changed field
                {comparison.fieldsChanged === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>

          {comparison ? (
            <div className="space-y-3">
              {comparison.fields.map((field) => (
                <div
                  key={field.fieldPath}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-3.5 py-2.5">
                    <span className="text-sm font-semibold text-foreground">{field.fieldLabel}</span>
                    <span className="flex flex-wrap items-center gap-2 text-[0.72rem] text-muted-foreground">
                      <span>
                        <span className="font-semibold text-status-success-fg">
                          +{field.wordsAdded}
                        </span>{" "}
                        <span className="font-semibold text-status-critical-fg">
                          −{field.wordsRemoved}
                        </span>
                      </span>
                      <span className="font-mono text-[0.7rem]">{field.fieldPath}</span>
                    </span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words p-3.5 font-mono text-[0.78rem] leading-relaxed text-foreground">
                    {field.parts.map((part, i) => {
                      if (part.kind === "add") {
                        return (
                          <mark
                            key={i}
                            className="rounded-sm bg-status-success px-0.5 text-status-success-fg"
                          >
                            {part.text}
                          </mark>
                        );
                      }
                      if (part.kind === "remove") {
                        return (
                          <mark
                            key={i}
                            className="rounded-sm bg-status-critical px-0.5 text-status-critical-fg line-through"
                          >
                            {part.text}
                          </mark>
                        );
                      }
                      return <span key={i}>{part.text}</span>;
                    })}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
              No field-level diff for the first version.
            </div>
          )}
        </div>
      </div>

      <StageFooter
        backLabel="Validate"
        onBack={onBack}
        nextLabel="Continue →"
        onNext={onContinue}
      />
    </div>
  );
}

function PublishStage({ draft, onBack, onSubmitPublish }: StagePaneProps) {
  const assessed = isAssessed(draft);
  const pending = draft.contractTests.filter((t) => t.status !== "passed");
  const unmapped = unmappedRequiredCriteria(draft);

  return (
    <div>
      <h2 className="text-[1.22rem] font-semibold text-foreground">Publish</h2>
      <p className="mb-5 mt-1 max-w-[64ch] text-muted-foreground">
        {assessed
          ? "Publishing an Assessed blueprint enables scored emission, so it routes through an approval gate. The compiled flow is read-only."
          : "Non-assessed blueprints publish without an approval gate. Emission of scored data stays off."}
      </p>
      <InfoCard
        title="Pre-publish checklist"
        detail={
          <ul className="mt-2 space-y-1">
            <li>
              {draft.practiceObjective.trim() ? "✅" : "⚠️"} Structural check{" "}
              {draft.practiceObjective.trim() ? "passed" : "incomplete"}
            </li>
            <li>
              {unmapped.length === 0 ? "✅" : "⚠️"} All required criteria mapped to competencies
            </li>
            <li>
              {pending.length === 0 ? "✅" : "⚠️"}{" "}
              {pending.length === 0
                ? "All contract tests passed"
                : `${pending.length} contract test${pending.length === 1 ? "" : "s"} not yet passed`}
            </li>
            <li>
              ✅ {draft.governance.version} will be frozen as v1.0 on publish
            </li>
          </ul>
        }
      />
      <InfoCard
        title="Compiled flow · read-only"
        detail={
          assessed
            ? "Intro → Practice loop → Auto-end (success/fail) → Review generation → Status emit."
            : "Intro → Practice loop → Soft close → Formative recap."
        }
      />
      {assessed ? (
        <InfoCard
          title="Approver"
          detail={
            <>
              Route to <b>L&D Governance</b> for sign-off. Emission stays disabled until approved.
            </>
          }
        />
      ) : (
        <InfoCard
          title="Publish"
          detail="No approval gate for this experience type. Publishing makes the blueprint available to journeys."
        />
      )}
      <StageFooter
        backLabel="Version history"
        onBack={onBack}
        nextLabel={assessed ? "Submit for approval" : "Publish"}
        onNext={onSubmitPublish}
      />
    </div>
  );
}
