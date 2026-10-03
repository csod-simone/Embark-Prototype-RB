import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown, Shield } from "lucide-react";
import { toast } from "sonner";
import { BreadcrumbBar } from "@/components/embark/BreadcrumbBar";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTENT } from "../../Content";
import { BlueprintStagePane } from "./BlueprintStages";
import {
  PLATFORM_GUARDRAILS,
  STAGE_ORDER,
  blueprintService,
  canSubmitForPublish,
  experienceTypeLabel,
  isAssessed,
  markStageComplete,
  nextStageId,
  prevStageId,
  seedRetentionDraft,
  type BlueprintDraft,
  type BlueprintEntryMode,
  type BlueprintStageId,
} from "./blueprintModel";

type ChatMsg = { role: "ai" | "me" | "infer"; text: string };

/** Scripted Design-with-AI demo conversation (unfolds automatically). */
const DEMO_AI_CONVERSATION: ChatMsg[] = [
  { role: "ai", text: "What should the learner walk away able to do?" },
  {
    role: "me",
    text: "Keep an at-risk client from moving their portfolio, without breaching suitability.",
  },
  {
    role: "ai",
    text: "How should we judge it — your own read, or fixed scored criteria?",
  },
  {
    role: "me",
    text: "Fixed scored criteria. It needs to count toward their record.",
  },
  { role: "ai", text: "And how should the session end?" },
  { role: "me", text: "Automatically — as a pass or fail." },
  {
    role: "infer",
    text: "Fixed scored criteria + an automatic pass/fail ending means this is an Assessed simulation — the only type that emits scored data. I've set it and turned on scoring, completion, review, and the publish approval.",
  },
];

const DEMO_BEAT_MS = 900;

export default function RolePlayBlueprint({
  entryMode: entryModeProp,
}: {
  entryMode?: BlueprintEntryMode;
}) {
  const navigate = useNavigate();
  const { contentId } = useParams<{ contentId?: string }>();
  const entryMode: BlueprintEntryMode = entryModeProp ?? (contentId ? "edit" : "create");

  const libraryItem = useMemo(
    () => (contentId ? CONTENT.find((c) => c.id === contentId) : undefined),
    [contentId],
  );

  const [draft, setDraft] = useState<BlueprintDraft | null>(null);
  const [stage, setStage] = useState<BlueprintStageId>("method");
  const [loading, setLoading] = useState(true);
  const [guardrailsOpen, setGuardrailsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatDemoPlaying, setChatDemoPlaying] = useState(false);
  const [chatDemoComplete, setChatDemoComplete] = useState(false);
  const [aiTurn, setAiTurn] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const loaded = await blueprintService.load(contentId, libraryItem?.title);
      if (cancelled) return;
      if (entryMode === "edit") {
        const withPhase1 = {
          ...loaded,
          phase1Complete: true,
          completedStages: Array.from(
            new Set<BlueprintStageId>([...loaded.completedStages, "method", "generate"]),
          ),
        };
        setDraft(withPhase1);
        setStage("core");
      } else {
        setDraft(loaded);
        setStage("method");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [contentId, entryMode, libraryItem?.title]);

  const assessed = draft ? isAssessed(draft) : false;

  const phaseTrack = useMemo(() => {
    if (!draft) {
      return { create: "upcoming" as const, blueprint: "now" as const, assurance: "upcoming" as const };
    }
    const inAssurance =
      stage === "validate" || stage === "versions" || stage === "publish";
    const inCreate = stage === "method" || stage === "generate";
    if (entryMode === "edit" || draft.phase1Complete) {
      return {
        create: "done" as const,
        blueprint: inAssurance ? ("done" as const) : ("now" as const),
        assurance: inAssurance ? ("now" as const) : ("upcoming" as const),
      };
    }
    return {
      create: inCreate ? ("now" as const) : ("done" as const),
      blueprint: inCreate ? ("upcoming" as const) : inAssurance ? ("done" as const) : ("now" as const),
      assurance: inAssurance ? ("now" as const) : ("upcoming" as const),
    };
  }, [draft, stage, entryMode]);

  const showCreateSteps = entryMode === "create";
  /** On create, Blueprint + Assurance stay hidden until the draft is generated. */
  const showRefineSections = entryMode === "edit" || !!draft?.phase1Complete;
  const railStages = useMemo(() => {
    const assessedNow = draft ? isAssessed(draft) : false;
    return STAGE_ORDER.filter((s) => {
      if (!assessedNow && s.assessedOnly) return false;
      if (!showCreateSteps && s.group === "phase1") return false;
      if (!showRefineSections && (s.group === "phase2" || s.group === "assurance")) return false;
      return true;
    });
  }, [draft, showCreateSteps, showRefineSections]);

  const go = (next: BlueprintStageId) => {
    if (!draft) return;
    const meta = STAGE_ORDER.find((s) => s.id === next);
    if (!showCreateSteps && meta?.group === "phase1") {
      setStage("core");
      return;
    }
    if (!showRefineSections && (meta?.group === "phase2" || meta?.group === "assurance")) {
      return;
    }
    // Skip assessed-only stages when not assessed
    if (meta?.assessedOnly && !isAssessed(draft)) {
      const fallback = nextStageId("criteria", false) ?? "validate";
      setStage(fallback === next ? "validate" : fallback);
      return;
    }
    setStage(next);
  };

  // Demo: unfold Design-with-AI conversation when Generate draft opens
  useEffect(() => {
    if (stage !== "generate" || draft?.creationMethod !== "ai") return;
    if (chatDemoComplete || chatMessages.length > 0) return;

    let cancelled = false;
    const timers: number[] = [];
    setChatDemoPlaying(true);
    setChatMessages([]);

    DEMO_AI_CONVERSATION.forEach((beat, index) => {
      const id = window.setTimeout(() => {
        if (cancelled) return;
        setChatMessages((prev) => [...prev, beat]);
        if (index === DEMO_AI_CONVERSATION.length - 1) {
          setChatDemoPlaying(false);
          setChatDemoComplete(true);
          setDraft((prev) => (prev ? seedRetentionDraft({ ...prev, creationMethod: "ai" }) : prev));
        }
      }, DEMO_BEAT_MS * (index + 1));
      timers.push(id);
    });

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, draft?.creationMethod]);

  // Demo: pre-fill structured form with the same retention-call content
  useEffect(() => {
    if (stage !== "generate" || draft?.creationMethod !== "form") return;
    if (draft.practiceObjective.trim() && draft.experienceType) return;
    setDraft((prev) => {
      if (!prev) return prev;
      const seeded = seedRetentionDraft({ ...prev, creationMethod: "form" });
      return {
        ...seeded,
        experienceTypeConfirmed: true,
        governance: {
          ...seeded.governance,
          experienceTypeInferred: false,
          provenance: "author-authored",
          provenanceDetail: "source: structured form",
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, draft?.creationMethod]);

  const completeAndGo = (from: BlueprintStageId, to: BlueprintStageId | null) => {
    if (!draft || !to) return;
    let next = markStageComplete(draft, from);
    if (from === "generate") {
      next = {
        ...next,
        phase1Complete: true,
        completedStages: Array.from(new Set([...next.completedStages, "method", "generate"])),
      };
    }
    if (from === "type") {
      next = { ...next, experienceTypeConfirmed: true };
    }
    setDraft(next);
    void blueprintService.save(next);
    go(to);
  };

  const finishCreateAndOpenEdit = async () => {
    if (!draft) return;
    const method = draft.creationMethod ?? "form";
    let next = seedRetentionDraft({ ...draft, creationMethod: method });
    if (method === "form") {
      next = {
        ...next,
        experienceTypeConfirmed: true,
        governance: {
          ...next.governance,
          experienceTypeInferred: false,
          provenance: "author-authored",
          provenanceDetail: "source: structured form",
        },
      };
    }
    next = {
      ...next,
      phase1Complete: true,
      completedStages: Array.from(
        new Set<BlueprintStageId>([...next.completedStages, "method", "generate"]),
      ),
    };
    next = markStageComplete(next, "generate");
    await blueprintService.save(next);
    toast.success("Draft generated", {
      description: "Opening the blueprint editor…",
    });
    navigate(`/admin/content/roleplay/${next.id}/edit`);
  };

  const onContinue = () => {
    if (!draft) return;
    if (entryMode === "create" && stage === "generate") {
      void finishCreateAndOpenEdit();
      return;
    }
    if (stage === "method") {
      setChatMessages([]);
      setChatDemoComplete(false);
      setChatDemoPlaying(false);
      setAiTurn(0);
    }
    const nxt = nextStageId(stage, isAssessed(draft));
    if (!nxt) return;
    completeAndGo(stage, nxt);
  };

  const onBack = () => {
    if (!draft) return;
    const prev = prevStageId(stage, isAssessed(draft));
    if (!prev) return;
    const prevMeta = STAGE_ORDER.find((s) => s.id === prev);
    if (!showCreateSteps && prevMeta?.group === "phase1") return;
    if (prev === "method" || stage === "generate") {
      setChatMessages([]);
      setChatDemoComplete(false);
      setChatDemoPlaying(false);
      setAiTurn(0);
    }
    go(prev);
  };

  const onSendChat = () => {
    if (!draft || chatDemoPlaying) return;
    const text = chatInput.trim();
    if (!text) return;
    // Manual replies still supported after/instead of demo beats
    const replies = [
      "How should we judge it — your own read, or fixed scored criteria?",
      "And how should the session end?",
    ];
    const userMsg: ChatMsg = { role: "me", text };
    if (aiTurn >= 2 || chatDemoComplete) {
      const seeded = seedRetentionDraft({
        ...draft,
        creationMethod: "ai",
        practiceObjective: draft.practiceObjective || text,
      });
      setDraft(seeded);
      setChatDemoComplete(true);
      setChatMessages((prev) => [
        ...prev,
        userMsg,
        {
          role: "infer",
          text: "Fixed scored criteria + an automatic pass/fail ending means this is an Assessed simulation.",
        },
      ]);
      setChatInput("");
      return;
    }
    setChatMessages((prev) => [
      ...prev,
      userMsg,
      { role: "ai", text: replies[aiTurn] ?? "Thanks — anything else to refine?" },
    ]);
    setAiTurn((n) => n + 1);
    setChatInput("");
  };

  const onValidate = async () => {
    if (!draft) return;
    const next = await blueprintService.runValidation(draft);
    setDraft(next);
    toast.success("Validation updated", {
      description: next.governance.validationSummary,
    });
  };

  const onSubmitPublish = async () => {
    if (!draft) return;
    const gate = canSubmitForPublish(draft);
    if (!gate.ok) {
      toast.error("Cannot publish yet", { description: gate.blockers[0] });
      return;
    }
    if (isAssessed(draft)) {
      const next = await blueprintService.submitForApproval(draft);
      setDraft(next);
      toast.success("Submitted for approval", {
        description: "Routed to L&D Governance. Emission stays disabled until approved.",
      });
    } else {
      const next = await blueprintService.publish(draft);
      setDraft(next);
      toast.success("Published", { description: "Blueprint is available to journeys." });
      navigate("/admin/content");
    }
  };

  if (loading || !draft) {
    return (
      <PageContainer as="div" className="max-w-[1200px] py-6">
        <p className="text-sm text-muted-foreground">Loading blueprint…</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer as="div" className="max-w-[1200px] space-y-4 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          onClick={() => navigate("/admin/content")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Content
        </Button>
        <BreadcrumbBar
          items={[
            { label: "Content", href: "/admin/content" },
            { label: "Role-plays" },
            { label: draft.title },
          ]}
        />
      </div>

      <header>
        <p className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-primary">
          Role-play blueprint
        </p>
        <h1 className="mt-1.5 text-[1.55rem] font-semibold tracking-tight text-foreground">
          {draft.title}
        </h1>
        <p className="mt-1 max-w-[74ch] text-sm text-muted-foreground">
          {entryMode === "edit"
            ? "Refine each part of the blueprint, then take it through validation and the publish gate."
            : "Build the draft with the assistant or the structured form, then refine every part and take it through validation and the publish gate."}
        </p>
      </header>

      {/* Progress track — create flow only; edit uses the stage rail */}
      {showCreateSteps ? (
        <div className="flex flex-wrap items-center gap-2 text-[0.78rem] text-muted-foreground">
          <PhasePill state={phaseTrack.create} n="1" label="Create draft" />
          {showRefineSections ? (
            <>
              <span aria-hidden>→</span>
              <PhasePill state={phaseTrack.blueprint} n="2" label="Blueprint" />
              <span aria-hidden>→</span>
              <PhasePill state={phaseTrack.assurance} n="3" label="Assurance & publish" />
            </>
          ) : null}
        </div>
      ) : null}

      {/* Guardrails — collapsed by default; click to reveal */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => setGuardrailsOpen((o) => !o)}
          aria-expanded={guardrailsOpen}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left"
        >
          <span className="grid h-[18px] w-[18px] place-items-center rounded bg-zinc-950 text-background">
            <Shield className="h-3 w-3" aria-hidden />
          </span>
          <span className="text-[0.82rem] font-semibold text-zinc-950">
            Platform guardrails
          </span>
          <ChevronDown
            className={cn(
              "ml-auto h-4 w-4 text-zinc-950 transition-transform",
              guardrailsOpen && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        {guardrailsOpen ? (
          <ul className="list-disc space-y-1.5 border-t border-border px-4 py-2.5 pl-9">
            {PLATFORM_GUARDRAILS.map((g) => (
              <li key={g.title} className="text-[0.78rem] text-zinc-950">
                <b className="font-semibold text-zinc-950">{g.title}</b> · {g.detail}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Work area */}
      <div
        className={cn(
          "grid min-h-[640px] overflow-hidden rounded-2xl border border-border bg-card",
          showRefineSections && "lg:grid-cols-[280px_1fr]",
        )}
      >
        {showRefineSections ? (
          <aside className="border-b border-border bg-muted/20 p-4 lg:border-b-0 lg:border-r">
            <RailGroup title="Blueprint" subtitle="Refine each part" />
            {railStages
              .filter((s) => s.group === "phase2")
              .map((s, i) => {
                const flags: RailFlag[] = [];
                if (s.id === "type") {
                  if (assessed) flags.push({ label: "Assessed", tone: "scored" });
                  else if (draft.experienceType)
                    flags.push({
                      label: experienceTypeLabel(draft.experienceType),
                      tone: "infer",
                    });
                  if (
                    draft.governance.experienceTypeInferred &&
                    !draft.experienceTypeConfirmed
                  ) {
                    flags.push({ label: "inferred · confirmable", tone: "infer" });
                  }
                }
                return (
                  <RailStage
                    key={s.id}
                    meta={s}
                    index={i + 1}
                    active={stage === s.id}
                    done={draft.completedStages.includes(s.id)}
                    onClick={() => go(s.id)}
                    flags={flags}
                  />
                );
              })}
            <hr className="my-3.5 border-border" />
            <RailGroup title="Assurance" subtitle="Validate · versions · publish" />
            {railStages
              .filter((s) => s.group === "assurance")
              .map((s, i) => {
                const flags: RailFlag[] = [];
                if (s.id === "validate" && draft.governance.validationPendingCount > 0) {
                  flags.push({
                    label: `${draft.governance.validationPendingCount} checks pending`,
                    tone: "warn",
                  });
                }
                if (s.id === "versions") {
                  flags.push({
                    label: `Draft · ${draft.governance.version}`,
                    tone: "warn",
                  });
                }
                if (s.id === "publish" && assessed) {
                  flags.push({ label: "approval required", tone: "gate" });
                }
                return (
                  <RailStage
                    key={s.id}
                    meta={s}
                    index={i + 1 + railStages.filter((x) => x.group === "phase2").length}
                    active={stage === s.id}
                    done={draft.completedStages.includes(s.id)}
                    onClick={() => go(s.id)}
                    flags={flags}
                  />
                );
              })}
          </aside>
        ) : null}

        <section className="min-w-0 p-6 sm:p-7">
          <BlueprintStagePane
            draft={draft}
            stage={stage}
            showCreateSteps={showCreateSteps}
            onChange={setDraft}
            onGo={go}
            onContinue={onContinue}
            onBack={onBack}
            chatInput={chatInput}
            setChatInput={setChatInput}
            chatMessages={chatMessages}
            onSendChat={onSendChat}
            chatDemoPlaying={chatDemoPlaying}
            onValidate={() => void onValidate()}
            onSubmitPublish={() => void onSubmitPublish()}
          />
        </section>
      </div>
    </PageContainer>
  );
}

function PhasePill({
  state,
  n,
  label,
}: {
  state: "done" | "now" | "upcoming";
  n: string;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold",
        state === "done" && "border-status-success-outline bg-status-success text-status-success-fg",
        state === "now" && "border-primary/30 bg-primary/10 text-primary",
        state === "upcoming" && "border-border bg-card text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "grid h-[17px] w-[17px] place-items-center rounded-full text-[0.64rem] font-bold",
          state === "done" && "bg-status-success-fg text-status-success",
          state === "now" && "bg-primary text-primary-foreground",
          state === "upcoming" && "bg-muted text-muted-foreground",
        )}
      >
        {state === "done" ? <Check className="h-2.5 w-2.5" /> : n}
      </span>
      {label}
    </span>
  );
}

function RailGroup({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent?: boolean;
}) {
  return (
    <div className="mb-2 px-1.5">
      <h3
        className={cn(
          "text-[0.72rem] font-bold uppercase tracking-wide",
          accent ? "text-primary" : "text-muted-foreground",
        )}
      >
        {title}
      </h3>
      <p className="text-[0.78rem] text-muted-foreground">{subtitle}</p>
    </div>
  );
}

type RailFlag = {
  label: string;
  tone: "infer" | "gate" | "scored" | "warn";
};

function RailStage({
  meta,
  index,
  active,
  done,
  onClick,
  flags = [],
}: {
  meta: (typeof STAGE_ORDER)[number];
  index?: number;
  active: boolean;
  done: boolean;
  onClick: () => void;
  flags?: RailFlag[];
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-[10px] border border-transparent px-2.5 py-2 text-left transition-colors",
        active && "border-primary/20 bg-primary/5",
        !active && "hover:bg-muted/50",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full text-[0.7rem] font-bold",
          active && "bg-primary text-primary-foreground",
          !active && done && "bg-status-success text-status-success-fg",
          !active && !done && "bg-muted text-muted-foreground",
        )}
      >
        {done && !active ? <Check className="h-3 w-3" /> : index ?? (done ? "✓" : "·")}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.9rem] font-semibold leading-tight text-foreground">
          {meta.name}
        </span>
        <span className="mt-0.5 block text-[0.72rem] text-muted-foreground">{meta.meta}</span>
        {flags.length > 0 ? (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {flags.map((flag) => (
              <span
                key={flag.label}
                className={cn(
                  "inline-block rounded-lg px-1.5 py-0.5 text-[0.62rem] font-bold",
                  flag.tone === "gate" && "bg-status-critical text-status-critical-fg",
                  flag.tone === "infer" && "bg-primary/10 text-primary",
                  flag.tone === "scored" && "bg-status-critical text-status-critical-fg",
                  flag.tone === "warn" && "bg-status-warning text-status-warning-fg",
                )}
              >
                {flag.label}
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </button>
  );
}

