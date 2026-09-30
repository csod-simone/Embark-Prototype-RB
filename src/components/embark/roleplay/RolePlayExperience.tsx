import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Crosshair,
  Ear,
  Keyboard,
  ListChecks,
  Loader2,
  Lock,
  Mic,
  MicOff,
  PanelRight,
  RefreshCw,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { LearnerBubble } from "@/components/embark/LearnerBubble";
import { TutorBubble } from "@/components/embark/TutorBubble";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SessionShell } from "@/components/embark/SessionShell";
import { createRoleplayProvenance, type AiProvenanceRecord } from "@/lib/ai-compliance";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import { TeleprompterConversation } from "./TeleprompterConversation";
import { PracticeReviewScreen } from "./PracticeReviewScreen";
import {
  buildAttemptRecord,
  loadAttempts,
  upsertAttempt,
  type RolePlayAttempt,
} from "./attemptHistory";
import type {
  CompletionStatus,
  Confidence,
  CriterionOrdinal,
  CriterionReview,
  FocusCriterion,
  InputModality,
  RolePlayScenario,
  TurnAudit,
  TurnState,
} from "./types";

/* ─────────────────────────── Scoring helpers ─────────────────────────── */

const STRONG_KEYWORDS = ["because", "for example", "specifically", "next step", "follow up", "here's why"];
const CLOSING_KEYWORDS = ["summary", "next step", "follow up", "thank you"];
const ABUSIVE_KEYWORDS = ["shut up", "stupid", "idiot", "damn"];
const CONTRADICTION_KEYWORDS = ["guarantee", "definitely will", "always free"];

type Strength = "strong" | "vague" | "incorrect" | "escalation";

function scoreLearner(text: string): Strength {
  const lower = text.toLowerCase();
  if (ABUSIVE_KEYWORDS.some((k) => lower.includes(k))) return "escalation";
  if (CONTRADICTION_KEYWORDS.some((k) => lower.includes(k))) return "incorrect";
  const strongHits = STRONG_KEYWORDS.filter((k) => lower.includes(k)).length;
  if (strongHits > 0 || text.split(/\s+/).length >= 18) return "strong";
  return "vague";
}

function personaReplyFor(personaName: string, strength: Strength): { text: string; escalation?: boolean } {
  switch (strength) {
    case "strong":
      return {
        text: `${personaName} nods. "That makes sense — I hadn't considered it that way. What would the next step look like?"`,
      };
    case "vague":
      return {
        text: `${personaName} frowns. "I'm not sure I follow. Can you give me a specific example or walk me through the details?"`,
      };
    case "incorrect":
      return {
        text: `${personaName} pauses. "That doesn't quite match what I was told. Are you sure about that?"`,
      };
    case "escalation":
      return {
        text: `${personaName} raises their voice. "I want to speak to a supervisor immediately. This is unacceptable."`,
        escalation: true,
      };
  }
}

function stubAudit(strength: Strength): TurnAudit {
  const rationale =
    strength === "strong"
      ? "Learner response showed specificity; persona advances the agenda."
      : strength === "vague"
        ? "Learner response lacked detail; persona asks for clarification."
        : strength === "incorrect"
          ? "Learner response conflicted with scenario facts; persona challenges."
          : "Safety boundary triggered; persona escalates.";
  return {
    model: "embark-roleplay-stub",
    latencyMs: 420 + Math.floor(Math.random() * 380),
    rationale,
  };
}

function resolveFocusCriteria(cfg: RolePlayScenario): FocusCriterion[] {
  if (cfg.focusCriteria?.length) return cfg.focusCriteria;
  return cfg.feedback.skills.map((s, i) => ({
    id: `skill-${i}`,
    label: s.name,
  }));
}

function resolveCriterionReviews(cfg: RolePlayScenario, turns: Turn[]): CriterionReview[] {
  if (cfg.feedback.criterionReviews?.length) return cfg.feedback.criterionReviews;
  const criteria = resolveFocusCriteria(cfg);
  const learnerQuote =
    [...turns].reverse().find((t) => t.role === "learner")?.text.slice(0, 120) ??
    "No learner evidence captured.";
  const ordinalFromConfidence = (c: Confidence): CriterionOrdinal =>
    c === "High" ? "Strong" : c === "Medium" ? "Proficient" : "Developing";
  return criteria.map((c, i) => {
    const skill = cfg.feedback.skills[i];
    return {
      criterionId: c.id,
      ordinal: skill ? ordinalFromConfidence(skill.confidence) : "Proficient",
      narrative: skill?.evidence ?? `Coaching for ${c.label}.`,
      evidenceQuote: skill?.evidence?.slice(0, 80) ?? learnerQuote,
    };
  });
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─────────────────────────── Types ─────────────────────────── */

type Turn =
  | {
      id: string;
      role: "persona";
      text: string;
      escalation?: boolean;
      modality?: InputModality;
      audit?: TurnAudit;
    }
  | {
      id: string;
      role: "learner";
      text: string;
      strength: Strength;
      modality?: InputModality;
      audit?: TurnAudit;
    };

type Stage = "framing" | "conversation" | "wrapping" | "complete" | "feedback" | "failure";

interface PersistedState {
  stage: Stage;
  turns: Turn[];
  turnCount: number;
  consecutiveWeak: number;
  strongCount: number;
  escalated: boolean;
  postEscalationTurns: number;
  lastPersonaText: string | null;
  chosenInput: "text" | "voice";
  touchedCriteria: string[];
  elapsedSeconds: number;
  completionStatus: CompletionStatus | null;
  completedAt: number | null;
  aiProvenance: AiProvenanceRecord | null;
}

const confidenceChipClass = (c: Confidence) =>
  c === "High"
    ? "bg-success-dark/15 text-success-dark"
    : c === "Medium"
      ? "bg-warning/15 text-warning-foreground dark:text-warning"
      : "bg-destructive/15 text-destructive";

const ordinalChipClass = (o: CriterionOrdinal) =>
  o === "Strong"
    ? "bg-success-dark/15 text-success-dark"
    : o === "Proficient"
      ? "bg-primary/15 text-primary"
      : "bg-warning/15 text-warning-foreground dark:text-warning";

let uid = 0;
const nid = () => `tn-${++uid}`;

function wantsReviewFromUrl(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("review") === "true" ||
      params.get("share") === "1" ||
      params.get("view") === "1"
    );
  } catch {
    return false;
  }
}

type RoleplayBootMode = "framing" | "resume" | "review";

function resolveRoleplayBoot(
  persisted: PersistedState | null,
  reviewIntent: boolean,
): { mode: RoleplayBootMode; stage: Stage; snapshot: PersistedState | null } {
  if (!persisted) {
    return { mode: "framing", stage: "framing", snapshot: null };
  }
  if (reviewIntent && persisted.stage === "complete") {
    return { mode: "review", stage: "complete", snapshot: persisted };
  }
  if (persisted.stage === "conversation") {
    return { mode: "resume", stage: "conversation", snapshot: persisted };
  }
  return { mode: "framing", stage: "framing", snapshot: null };
}

export interface RolePlayExperienceProps {
  scenario: RolePlayScenario;
  /** Steps for the session sidebar. */
  steps: SessionStep[];
  stepsMeta: string;
  positionLabel: string;
  /** Journey step name shown in the section header. */
  shellTitle?: string;
  /** Subtitle prefix, e.g. "Session 4 of 4 · Role play". */
  subtitleBase: string;
  framingSubtitle: string;
  onBack: () => void;
  /** Footer "previous" action shown on the framing screen. */
  framingPrev?: { label: string; onClick: () => void };
  /** Where "Back to journey" / "Continue journey" lead. */
  onExit: () => void;
  onContinue: () => void;
  /** Called once when the role-play is scored. */
  onComplete?: () => void;
  /** Pass null to suppress the shell's own top header. */
  topHeader?: ReactNode | null;
}

export function RolePlayExperience({
  scenario: CONFIG,
  steps,
  stepsMeta,
  positionLabel,
  shellTitle,
  subtitleBase,
  framingSubtitle,
  onBack,
  framingPrev,
  onExit,
  onContinue,
  onComplete,
  topHeader,
}: RolePlayExperienceProps) {
  const sectionTitle = shellTitle ?? CONFIG.scenarioTitle;
  const STORAGE_KEY = `rp:${CONFIG.scenarioId}`;
  const focusCriteria = useMemo(() => resolveFocusCriteria(CONFIG), [CONFIG]);
  const targetMinutes = CONFIG.timeBudget?.targetMinutes ?? 12;
  const maxMinutes = CONFIG.timeBudget?.maxMinutes ?? 18;
  const maxSeconds = maxMinutes * 60;

  const persisted = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PersistedState) : null;
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY]);

  const reviewIntent = useMemo(() => wantsReviewFromUrl(), []);
  const boot = useMemo(
    () => resolveRoleplayBoot(persisted, reviewIntent),
    [persisted, reviewIntent],
  );
  const snapshot = boot.snapshot;

  const [stage, setStage] = useState<Stage>(boot.stage);
  const [chosenInput, setChosenInput] = useState<"text" | "voice">(
    snapshot?.chosenInput ?? (CONFIG.inputMode === "text" ? "text" : "voice"),
  );
  const [turns, setTurns] = useState<Turn[]>(snapshot?.turns ?? []);
  const [turnCount, setTurnCount] = useState(snapshot?.turnCount ?? 0);
  const [consecutiveWeak, setConsecutiveWeak] = useState(snapshot?.consecutiveWeak ?? 0);
  const [strongCount, setStrongCount] = useState(snapshot?.strongCount ?? 0);
  const [escalated, setEscalated] = useState(snapshot?.escalated ?? false);
  const [postEscalationTurns, setPostEscalationTurns] = useState(snapshot?.postEscalationTurns ?? 0);
  const [lastPersonaText, setLastPersonaText] = useState<string | null>(snapshot?.lastPersonaText ?? null);
  const [showCoachingNudge, setShowCoachingNudge] = useState(false);
  const [micUnavailable] = useState(false);
  const [draft, setDraft] = useState("");
  const [personaThinking, setPersonaThinking] = useState(false);
  const [personaSpeaking, setPersonaSpeaking] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [touchedCriteria, setTouchedCriteria] = useState<Set<string>>(
    () => new Set(snapshot?.touchedCriteria ?? []),
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(snapshot?.elapsedSeconds ?? 0);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(
    snapshot?.completionStatus ?? null,
  );
  const [completedAt, setCompletedAt] = useState<number | null>(snapshot?.completedAt ?? null);
  const [aiProvenance, setAiProvenance] = useState<AiProvenanceRecord | null>(
    snapshot?.aiProvenance ?? null,
  );
  const [attempts, setAttempts] = useState<RolePlayAttempt[]>(() => loadAttempts(CONFIG.scenarioId));
  const [attemptNumber, setAttemptNumber] = useState(() => {
    const prior = loadAttempts(CONFIG.scenarioId);
    if (snapshot?.stage === "complete") {
      return Math.max(CONFIG.attemptNumber, prior.at(-1)?.attemptNumber ?? CONFIG.attemptNumber);
    }
    return Math.max(CONFIG.attemptNumber, prior.length + 1);
  });
  const viewerMode = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("share") === "1" || params.get("view") === "1";
    } catch {
      return false;
    }
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endingRef = useRef(false);
  const thinkingTimerRef = useRef<number | null>(null);
  const speakingTimerRef = useRef<number | null>(null);
  const demoTimersRef = useRef<number[]>([]);

  const clearDemoTimers = () => {
    for (const id of demoTimersRef.current) window.clearTimeout(id);
    demoTimersRef.current = [];
  };

  const persistState = (next: PersistedState) => {
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(STORAGE_KEY, raw);
      sessionStorage.setItem(STORAGE_KEY, raw);
    } catch {
      /* ignore */
    }
  };

  const clearPersisted = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  // Fresh visits should not inherit a prior completed run — only resume live or open review explicitly.
  useEffect(() => {
    if (boot.mode === "framing") {
      clearPersisted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY, boot.mode]);

  const turnState: TurnState =
    stage === "wrapping" || stage === "complete"
      ? "closing"
      : personaThinking
        ? "thinking"
        : personaSpeaking || voiceRecording
          ? "speaking"
          : "listening";

  // Persist live progress and completed results so revisiting restores the screen
  useEffect(() => {
    if (stage === "conversation" || stage === "complete") {
      persistState({
        stage,
        turns,
        turnCount,
        consecutiveWeak,
        strongCount,
        escalated,
        postEscalationTurns,
        lastPersonaText,
        chosenInput,
        touchedCriteria: [...touchedCriteria],
        elapsedSeconds,
        completionStatus,
        completedAt,
        aiProvenance,
      });
    }
    if (stage === "failure") {
      clearPersisted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    STORAGE_KEY,
    stage,
    turns,
    turnCount,
    consecutiveWeak,
    strongCount,
    escalated,
    postEscalationTurns,
    lastPersonaText,
    chosenInput,
    touchedCriteria,
    elapsedSeconds,
    completionStatus,
    completedAt,
    aiProvenance,
  ]);

  // Persist completed attempts so learners can reopen prior results
  useEffect(() => {
    if (stage !== "complete" || !completedAt || !completionStatus) return;
    const record = buildAttemptRecord({
      cfg: CONFIG,
      attemptNumber,
      turns: turns.map((t) => ({
        id: t.id,
        role: t.role,
        text: t.text,
        modality: t.modality,
      })),
      durationSeconds: elapsedSeconds,
      completedAt,
      completionStatus,
      aiProvenance,
      strongCount,
      turnCount,
      touchedCriteria: [...touchedCriteria],
    });
    setAttempts(upsertAttempt(CONFIG.scenarioId, record));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, completedAt, completionStatus, aiProvenance?.runId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, personaThinking, personaSpeaking]);

  // Live timer
  useEffect(() => {
    if (stage !== "conversation") return;
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [stage]);

  // Timeout / safety-stop
  useEffect(() => {
    if (stage !== "conversation") return;
    if (elapsedSeconds >= maxSeconds && !endingRef.current) {
      finishSession("timeout");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedSeconds, stage, maxSeconds]);

  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) window.clearTimeout(thinkingTimerRef.current);
      if (speakingTimerRef.current) window.clearTimeout(speakingTimerRef.current);
      clearDemoTimers();
    };
  }, []);

  const markTouchedFromText = (text: string) => {
    const lower = text.toLowerCase();
    setTouchedCriteria((prev) => {
      const next = new Set(prev);
      for (const c of focusCriteria) {
        if (c.touchKeywords?.some((k) => lower.includes(k.toLowerCase()))) {
          next.add(c.id);
        }
      }
      return next;
    });
  };

  const finishSession = (status: CompletionStatus) => {
    if (endingRef.current) return;
    endingRef.current = true;
    clearDemoTimers();
    setCompletionStatus(status);
    setCompletedAt(Date.now());
    setAiProvenance(createRoleplayProvenance(CONFIG.scenarioId));
    setPersonaThinking(false);
    setPersonaSpeaking(false);
    setVoiceRecording(false);
    setStage("wrapping");
    window.setTimeout(() => {
      setStage("complete");
      onComplete?.();
    }, 1200);
  };

  const startRolePlay = () => {
    endingRef.current = false;
    clearDemoTimers();
    setTurns([]);
    setTurnCount(0);
    setStrongCount(0);
    setConsecutiveWeak(0);
    setEscalated(false);
    setPostEscalationTurns(0);
    setLastPersonaText(null);
    setTouchedCriteria(new Set());
    setCompletionStatus(null);
    setCompletedAt(null);
    setAiProvenance(null);
    setPersonaThinking(false);
    setPersonaSpeaking(false);
    setVoiceRecording(false);
    setElapsedSeconds(7 * 60 + 40);
    setStage("conversation");

    type DemoBeat =
      | { kind: "persona"; text: string; speakMs: number; afterMs: number }
      | { kind: "learner"; text: string; afterMs: number };

    const firstName = personaDisplayName(CONFIG.personaName);

    const suitabilityScript: DemoBeat[] = [
      {
        kind: "persona",
        text: CONFIG.openingLine,
        speakMs: 2800,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: `Thanks for making time, ${firstName}. Before we move anything, can I ask what's prompting the urgency?`,
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "I've been watching the news every night. The portfolio is down and I just want it stopped.",
        speakMs: 3200,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: "That's a completely understandable reaction. Markets have been noisy — can I check what you're most worried about losing?",
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "I'd rather not lose what I've got. Cash feels safer than waiting for a bounce that might not come.",
        speakMs: 3000,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: "I hear that. Before we change the mandate, I need to confirm your objectives and capacity for loss so any next step stays suitable.",
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "I don't care about the long-term story right now. I want everything in cash by Friday — can you just do that?",
        speakMs: 3400,
        afterMs: 500,
      },
      {
        kind: "learner",
        text: "I won't action that without a suitability review. Let's agree what we document today and a dated follow-up.",
        afterMs: 1100,
      },
      {
        kind: "persona",
        text: "Fine — as long as we move quickly. What do you need from me before Friday?",
        speakMs: 2800,
        afterMs: 600,
      },
    ];

    const formativeScript: DemoBeat[] = [
      {
        kind: "persona",
        text: CONFIG.openingLine,
        speakMs: 2800,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: `Thanks for making time, ${firstName}. Before we change anything, can I ask what's driving the urgency since you retired?`,
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "That stock drop hit hard. I spent thirty years there — watching it fall after I left is the last thing I needed.",
        speakMs: 3200,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: "That's a completely understandable reaction. Can I check what you're most worried about losing in retirement?",
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "Income certainty. Gilts feel safer than waiting for another drop that might not recover.",
        speakMs: 3000,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: "I hear that. Before we move everything into gilts, I need to confirm your objectives and capacity for loss so any next step stays suitable.",
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "I want short-dated gilts by month-end — can we just get that done?",
        speakMs: 3400,
        afterMs: 500,
      },
      {
        kind: "learner",
        text: "I won't action that without a suitability review. Let's agree what we document today and a dated follow-up.",
        afterMs: 1100,
      },
      {
        kind: "persona",
        text: "Fine — as long as we move quickly. What do you need from me before month-end?",
        speakMs: 2800,
        afterMs: 600,
      },
    ];

    const discoveryScript: DemoBeat[] = [
      {
        kind: "persona",
        text: CONFIG.openingLine,
        speakMs: 2800,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: `Thanks for meeting me, ${firstName}. Before we dig in, what would make today useful for you?`,
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "Honestly I'm not sure. I've inherited this portfolio and I don't know how much I should be deciding versus leaving to you.",
        speakMs: 3200,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: "That's a completely fair place to start. Can I ask what matters most to you over the next few years with this money?",
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "I'd like it to support my family, but I also don't want to feel locked into something I don't understand.",
        speakMs: 3000,
        afterMs: 900,
      },
      {
        kind: "learner",
        text: "Understood. Any concerns about how we've worked with clients like you before — or about sharing details today?",
        afterMs: 1200,
      },
      {
        kind: "persona",
        text: "I'm cautious about handing over everything in the first meeting. I'd rather go step by step.",
        speakMs: 3000,
        afterMs: 500,
      },
      {
        kind: "learner",
        text: "We can keep today's conversation light and agree a clear next step — including what I'll send you afterwards.",
        afterMs: 1100,
      },
      {
        kind: "persona",
        text: "That sounds better. What would you suggest we cover before we meet again?",
        speakMs: 2800,
        afterMs: 600,
      },
    ];

    const isDiscovery =
      CONFIG.scenarioId === "mc-rp1" ||
      CONFIG.scenarioId === "rr-mc4" ||
      CONFIG.scenarioId.includes("discovery");
    const isFormative =
      CONFIG.scoringMode === "assessment" ||
      CONFIG.scenarioId === "mc-rp-f" ||
      CONFIG.scenarioId === "rr-mc10";
    const script = isDiscovery ? discoveryScript : isFormative ? formativeScript : suitabilityScript;

    let delay = 0;
    let learnerTurns = 0;
    const personaThinkMs = 700;
    // Gaps where the UI shows "AI is listening" — keep short for demos.
    const listeningGapScale = 0.28;

    for (const beat of script) {
      if (beat.kind === "persona") {
        const { text, speakMs, afterMs } = beat;
        const thinkAt = delay;
        const speakAt = delay + personaThinkMs;
        const listenAfter = Math.round(afterMs * listeningGapScale);

        demoTimersRef.current.push(
          window.setTimeout(() => {
            if (endingRef.current) return;
            setPersonaSpeaking(false);
            setPersonaThinking(true);
          }, thinkAt),
        );
        demoTimersRef.current.push(
          window.setTimeout(() => {
            if (endingRef.current) return;
            setPersonaThinking(false);
            setPersonaSpeaking(true);
            setTurns((prev) => [
              ...prev,
              { id: nid(), role: "persona", text, modality: "voice" },
            ]);
            setLastPersonaText(text);
          }, speakAt),
        );
        demoTimersRef.current.push(
          window.setTimeout(() => {
            if (endingRef.current) return;
            setPersonaSpeaking(false);
          }, speakAt + speakMs),
        );
        delay = speakAt + speakMs + listenAfter;
      } else {
        const at = delay;
        const { text, afterMs } = beat;
        const listenAfter = Math.round(afterMs * listeningGapScale);
        demoTimersRef.current.push(
          window.setTimeout(() => {
            if (endingRef.current) return;
            setPersonaSpeaking(false);
            setPersonaThinking(false);
            learnerTurns += 1;
            setTurns((prev) => [
              ...prev,
              {
                id: nid(),
                role: "learner",
                text,
                strength: "strong",
                modality: "voice",
              },
            ]);
            setTurnCount(learnerTurns);
            setStrongCount(learnerTurns);
            markTouchedFromText(text);
          }, at),
        );
        delay = at + listenAfter;
      }
    }

    demoTimersRef.current.push(
      window.setTimeout(() => {
        if (endingRef.current) return;
        setPersonaSpeaking(false);
        setPersonaThinking(false);
        finishSession("completed");
      }, delay + 600),
    );
  };

  const appendLearnerAndReply = (text: string, modality: InputModality) => {
    if (endingRef.current || stage !== "conversation") return;

    const strength = scoreLearner(text);
    const learnerTurn: Turn = {
      id: nid(),
      role: "learner",
      text,
      strength,
      modality,
    };
    const newTurnCount = turnCount + 1;

    let newStrong = strongCount;
    let newWeak = consecutiveWeak;
    if (strength === "strong") {
      newStrong += 1;
      newWeak = 0;
    } else if (strength === "vague" || strength === "incorrect") {
      newWeak += 1;
    } else {
      newWeak = 0;
    }

    const newEscalated = escalated || strength === "escalation";
    const newPostEsc = escalated ? postEscalationTurns + 1 : escalated;

    setTurns((prev) => [...prev, learnerTurn]);
    setTurnCount(newTurnCount);
    setStrongCount(newStrong);
    setConsecutiveWeak(newWeak);
    setEscalated(newEscalated);
    setPostEscalationTurns(typeof newPostEsc === "number" ? newPostEsc : 0);
    markTouchedFromText(text);

    if (CONFIG.scoringMode === "practice") {
      setShowCoachingNudge(strength === "vague" || strength === "incorrect");
    }

    const lower = text.toLowerCase();
    const closing = CLOSING_KEYWORDS.some((k) => lower.includes(k));
    if (closing) {
      finishSession("completed");
      return;
    }

    if (newTurnCount >= 8) {
      finishSession("completed");
      return;
    }

    if (escalated && postEscalationTurns + 1 >= 2) {
      finishSession("criteria-not-met");
      return;
    }

    if (newTurnCount >= 12) {
      setStage("failure");
      return;
    }

    // Interrupt any prior thinking (barge-in feel)
    if (thinkingTimerRef.current) {
      window.clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }

    setPersonaThinking(true);
    thinkingTimerRef.current = window.setTimeout(() => {
      let reply = personaReplyFor(CONFIG.personaName, strength);
      const changeTactic = `${CONFIG.personaName} sighs. "Let me put it a different way…"`;

      if (newWeak >= 3) {
        reply = { text: changeTactic };
      }
      if (reply.text === lastPersonaText) {
        reply = { text: changeTactic };
      }
      if (newTurnCount >= 5 && strength === "strong") {
        reply = {
          text: `${CONFIG.personaName} smiles. "Okay, I think I've got what I need. What's the next step?"`,
        };
      }

      const personaTurn: Turn = {
        id: nid(),
        role: "persona",
        text: reply.text,
        escalation: reply.escalation,
        modality: "voice",
        audit: stubAudit(strength),
      };
      setTurns((prev) => [...prev, personaTurn]);
      setLastPersonaText(reply.text);
      setPersonaThinking(false);
      setPersonaSpeaking(true);
      speakingTimerRef.current = window.setTimeout(() => setPersonaSpeaking(false), 800);
    }, 900);
  };

  const handleSendText = () => {
    const v = draft.trim();
    if (!v) return;
    clearDemoTimers();
    setDraft("");
    appendLearnerAndReply(v, "text");
  };

  const handleVoiceStart = () => {
    if (micUnavailable || endingRef.current) return;
    clearDemoTimers();
    // Barge-in: cancel thinking
    if (thinkingTimerRef.current) {
      window.clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
      setPersonaThinking(false);
    }
    setPersonaSpeaking(false);
    setVoiceRecording(true);
  };

  const handleVoiceStop = () => {
    setVoiceRecording(false);
    setPersonaThinking(true);
    thinkingTimerRef.current = window.setTimeout(() => {
      setPersonaThinking(false);
      appendLearnerAndReply(CONFIG.voiceSampleResponse, "voice");
    }, 500);
  };

  const restart = () => {
    clearPersisted();
    endingRef.current = false;
    clearDemoTimers();
    setTurns([]);
    setTurnCount(0);
    setConsecutiveWeak(0);
    setStrongCount(0);
    setEscalated(false);
    setPostEscalationTurns(0);
    setLastPersonaText(null);
    setShowCoachingNudge(false);
    setTouchedCriteria(new Set());
    setElapsedSeconds(0);
    setCompletionStatus(null);
    setCompletedAt(null);
    setAiProvenance(null);
    setPersonaThinking(false);
    setPersonaSpeaking(false);
    setVoiceRecording(false);
    const prior = loadAttempts(CONFIG.scenarioId);
    setAttempts(prior);
    setAttemptNumber(prior.length + 1);
    setStage("framing");
  };

  /* ─────────────────────────── Render ─────────────────────────── */

  if (stage === "framing") {
    const isPracticeFraming = CONFIG.scoringMode === "practice";
    const target = CONFIG.timeBudget?.targetMinutes ?? 12;
    const max = CONFIG.timeBudget?.maxMinutes ?? 18;
    const showModalityChoice = CONFIG.inputMode === "choice";

    return (
      <SessionShell
        topHeader={topHeader}
        title={sectionTitle}
        subtitle={framingSubtitle}
        onBack={onBack}
        steps={steps}
        stepsMeta={stepsMeta}
        positionLabel={positionLabel}
        prev={null}
        next={null}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3 h-full min-h-10">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Clock className="h-3.5 w-3.5" />
                {target} min target · {max} max
              </span>
              {positionLabel && (
                <span className="text-xs text-muted-foreground hidden sm:inline">{positionLabel}</span>
              )}
              {showModalityChoice && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Respond by</span>
                  <div
                    className="inline-flex rounded-md border border-border bg-muted p-0.5"
                    role="group"
                    aria-label="Respond by"
                  >
                    <button
                      type="button"
                      onClick={() => setChosenInput("text")}
                      aria-pressed={chosenInput === "text"}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                        chosenInput === "text"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setChosenInput("voice")}
                      aria-pressed={chosenInput === "voice"}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                        chosenInput === "voice"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Voice
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Button onClick={startRolePlay}>
              {isPracticeFraming ? "Start practice" : "Start formative"}
            </Button>
          </div>
        }
        sagePrompts={[
          { label: "What's this scenario about?" },
          { label: "How am I scored?" },
          { label: "Tips before I start" },
          { label: "Raise a hand 🤚" },
        ]}
        sageDisclaimer="Generated by AI. Check for accuracy."
        sageAiFlag
      >
        <div className="flex-1 overflow-y-auto min-h-0">
          <FramingScreen cfg={CONFIG} />
        </div>
      </SessionShell>
    );
  }

  const isLive = stage === "conversation" || stage === "wrapping";

  // B1 Teleprompter focus mode — no LMS session chrome
  if (isLive) {
    return (
      <div className="flex flex-1 min-h-0 flex-col">
        <TeleprompterConversation
          scenario={CONFIG}
          turns={turns.map((t) => ({ id: t.id, role: t.role, text: t.text }))}
          turnState={turnState}
          voiceRecording={voiceRecording}
          wrapping={stage === "wrapping"}
          chosenInput={chosenInput}
          setChosenInput={setChosenInput}
          draft={draft}
          setDraft={setDraft}
          onSendText={handleSendText}
          onVoiceStart={handleVoiceStart}
          onVoiceStop={handleVoiceStop}
          elapsedSeconds={elapsedSeconds}
          maxSeconds={maxSeconds}
          onFinish={() => finishSession("ended-early")}
          onBack={() => {
            endingRef.current = true;
            clearDemoTimers();
            clearPersisted();
            onBack();
          }}
        />
      </div>
    );
  }

  if (stage === "complete") {
    return (
      <SessionShell
        topHeader={topHeader}
        title={sectionTitle}
        subtitle={`${subtitleBase} · Results`}
        onBack={onBack}
        steps={steps}
        stepsMeta={stepsMeta}
        positionLabel={positionLabel}
        prev={null}
        next={null}
        footer={
          <div className="flex w-full flex-wrap items-center gap-3 min-h-10">
            {positionLabel ? (
              <span className="text-xs text-muted-foreground">{positionLabel}</span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2 sm:ml-auto">
              {!viewerMode && (
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={restart}>
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                  Practice again
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={viewerMode ? onExit : onContinue}
              >
                {viewerMode ? "Done" : "Continue journey"}
                {!viewerMode && <ArrowRight className="h-3.5 w-3.5" aria-hidden />}
              </Button>
            </div>
          </div>
        }
        sagePrompts={[
          { label: "How did I do?" },
          { label: "What could I improve?" },
          { label: "Explain the scoring" },
          { label: "Raise a hand 🤚" },
        ]}
        sageDisclaimer="Generated by AI. Check for accuracy."
        sageAiFlag
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <PracticeReviewScreen
            cfg={CONFIG}
            turns={turns.map((t) => ({
              id: t.id,
              role: t.role,
              text: t.text,
              modality: t.modality,
            }))}
            durationSeconds={elapsedSeconds}
            completedAt={completedAt ?? Date.now()}
            completionStatus={completionStatus}
            aiProvenance={aiProvenance}
            attempts={attempts}
            viewerMode={viewerMode}
            onRestart={restart}
            onContinue={viewerMode ? undefined : onContinue}
            embedded
          />
        </div>
      </SessionShell>
    );
  }

  const subtitle =
    stage === "feedback" ? `${subtitleBase} · Results` : subtitleBase;

  const shellNext =
    stage === "feedback"
      ? { label: "Continue journey", onClick: onContinue }
      : { label: "Try again", onClick: restart };

  const shellPrev =
    stage === "feedback" || stage === "failure"
      ? { label: "Try again", onClick: restart }
      : { label: "Back to journey", onClick: onExit };

  return (
    <SessionShell
      topHeader={topHeader}
      title={sectionTitle}
      subtitle={subtitle}
      onBack={onBack}
      steps={steps}
      stepsMeta={stepsMeta}
      positionLabel={positionLabel}
      prev={shellPrev}
      next={shellNext}
      sagePrompts={[
        { label: "How did I do?" },
        { label: "What could I improve?" },
        { label: "Explain the scoring" },
        { label: "Raise a hand 🤚" },
      ]}
      sageDisclaimer="Generated by AI. Check for accuracy."
      sageAiFlag
    >
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {stage === "feedback" && (
          <FeedbackScreen
            cfg={CONFIG}
            escalated={escalated}
            turns={turns}
            focusCriteria={focusCriteria}
            completionStatus={completionStatus}
            durationSeconds={elapsedSeconds}
          />
        )}
        {stage === "failure" && <FailureScreen onRetry={restart} />}
      </div>
    </SessionShell>
  );
}

/* ─────────────────────────── Focus panel ─────────────────────────── */

function FocusPanel({
  criteria,
  touched,
}: {
  criteria: FocusCriterion[];
  touched: Set<string>;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-start gap-3 p-4">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
          aria-hidden
        >
          <Crosshair className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
        </div>
        <div className="min-w-0 pt-0.5">
          <div className="text-[11px] font-semibold tracking-wide text-primary uppercase">
            Your focus
          </div>
          <div className="text-base font-semibold text-foreground leading-tight">Goals to cover</div>
        </div>
      </div>

      <ul className="border-t border-border divide-y divide-border">
        {criteria.map((c, i) => {
          const done = touched.has(c.id);
          return (
            <li key={c.id} className="flex items-start gap-3 px-4 py-3">
              <span
                className={`mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums border ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/35 bg-background text-primary"
                }`}
                aria-hidden
              >
                {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={`text-sm leading-snug pt-0.5 ${
                  done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {c.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border bg-muted/50 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 space-y-1">
            <div className="text-sm font-semibold text-foreground leading-tight">
              Coaching stays private
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Goals guide the evaluator in the background. Evidence, feedback, and relevant
              learning appear only after the roleplay ends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Framing ─────────────────────────── */

function FramingScreen({ cfg }: { cfg: RolePlayScenario }) {
  const focus = cfg.focusCriteria ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      {/* Left — persona */}
      <aside className="w-full flex-shrink-0 border-b border-border lg:w-80 lg:border-b-0 lg:border-r xl:w-[20rem]">
        <div className="space-y-5 p-6 sm:px-7">
          <section className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
              Who you&apos;re meeting
            </p>
            <div
              className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"
              aria-hidden
            >
              <User className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <div className="space-y-1">
              <p className="text-[1.28rem] font-bold leading-tight text-foreground">
                {cfg.personaName}
              </p>
              {cfg.personaRole ? (
                <p className="text-sm text-muted-foreground">{cfg.personaRole}</p>
              ) : null}
            </div>
            {cfg.personaDescription ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {cfg.personaDescription}
              </p>
            ) : null}
          </section>
        </div>
      </aside>

      {/* Main — objective, goals, rules */}
      <div className="min-w-0 flex-1 bg-background">
        <div className="max-w-3xl space-y-8 px-6 py-6 sm:px-8">
          <section className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
              Your objective
            </p>
            <p className="max-w-[34ch] text-[1.42rem] font-bold leading-snug tracking-tight text-foreground sm:text-[1.5rem]">
              {cfg.objective}
            </p>
            {cfg.objectiveDetail ? (
              <p className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                {cfg.objectiveDetail}
              </p>
            ) : null}
          </section>

          {focus.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-foreground">Goals</h2>
              <ul className="flex flex-col gap-2.5">
                {focus.map((c, i) => (
                  <li key={c.id} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span
                      className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/10 text-[0.72rem] font-bold tabular-nums text-primary"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span className="leading-snug">{c.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(cfg.constraints || cfg.safetyBoundary) && (
            <section className="space-y-3">
              <h2 className="text-base font-bold text-foreground">Rules of play</h2>
              <div className="flex max-w-[74ch] flex-col gap-3.5">
                {cfg.constraints && (
                  <div className="flex gap-2.5">
                    <span className="mt-0.5 flex-none text-muted-foreground" aria-hidden>
                      <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-bold text-foreground">Constraints</span>
                      {" — "}
                      {cfg.constraints}
                    </p>
                  </div>
                )}
                {cfg.safetyBoundary && (
                  <div className="flex gap-2.5">
                    <span className="mt-0.5 flex-none text-amber-700 dark:text-amber-400" aria-hidden>
                      <Shield className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        Safety boundary
                      </span>
                      {" — "}
                      {cfg.safetyBoundary}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Conversation ─────────────────────────── */

function personaDisplayName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

function LiveWaveform({ active }: { active: boolean }) {
  return (
    <div className="flex-1 min-w-[6rem] h-2 rounded-full bg-primary/15 overflow-hidden relative">
      <div
        className={`absolute inset-y-0 left-0 rounded-full bg-primary/50 transition-all ${
          active ? "w-2/3 animate-pulse" : "w-1/5"
        }`}
      />
    </div>
  );
}

function ConversationScreen(props: {
  cfg: RolePlayScenario;
  turns: Turn[];
  personaThinking: boolean;
  personaSpeaking: boolean;
  wrapping: boolean;
  turnState: TurnState;
  chosenInput: "text" | "voice";
  setChosenInput: (v: "text" | "voice") => void;
  draft: string;
  setDraft: (v: string) => void;
  onSendText: () => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  voiceRecording: boolean;
  micUnavailable: boolean;
  showCoachingNudge: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  focusCriteria: FocusCriterion[];
  touchedCriteria: Set<string>;
  elapsedSeconds: number;
  maxSeconds: number;
  nearLimit: boolean;
  pastTarget: boolean;
  onOpenFocus: () => void;
}) {
  const {
    cfg,
    turns,
    personaThinking,
    wrapping,
    turnState,
    chosenInput,
    setChosenInput,
    draft,
    setDraft,
    onSendText,
    onVoiceStart,
    onVoiceStop,
    voiceRecording,
    micUnavailable,
    showCoachingNudge,
    scrollRef,
    focusCriteria,
    touchedCriteria,
    elapsedSeconds,
    maxSeconds,
    nearLimit,
    pastTarget,
    onOpenFocus,
  } = props;
  const [muted, setMuted] = useState(false);
  const isPractice = cfg.scoringMode === "practice";
  const showChoice = cfg.inputMode === "choice";
  const showText = cfg.inputMode === "text" || (showChoice && chosenInput === "text");
  const showVoice = cfg.inputMode === "voice" || (showChoice && chosenInput === "voice");
  const shortName = personaDisplayName(cfg.personaName);
  const listeningActive = showVoice && !wrapping && (turnState === "listening" || voiceRecording) && !muted;

  const turnHeadline =
    wrapping || turnState === "closing"
      ? "Closing"
      : turnState === "thinking"
        ? "AI thinking"
        : turnState === "speaking" && !voiceRecording
          ? "AI speaking"
          : voiceRecording
            ? "You're speaking"
            : "Your turn";
  const turnDetail =
    wrapping || turnState === "closing"
      ? "Wrapping up the session."
      : turnState === "thinking"
        ? `${shortName} is preparing a reply.`
        : turnState === "speaking" && !voiceRecording
          ? `${shortName} is speaking.`
          : voiceRecording
            ? "Recording your response."
            : showVoice
              ? "AI simulation is listening."
              : "Type your response when ready.";

  return (
    <div className="flex flex-col h-full min-h-0 flex-1 bg-background">
      {/* Live conversation header */}
      <div className="flex-shrink-0 border-b border-border px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-wide text-primary uppercase">
              Live conversation
            </div>
            <div className="text-sm sm:text-base font-medium text-foreground mt-0.5">
              You ↔ AI simulation · {shortName}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
            <span>Voice · Marin</span>
            <span>Language · English</span>
            <span
              className={`tabular-nums font-medium ${
                nearLimit ? "text-destructive" : pastTarget ? "text-amber-700 dark:text-amber-300" : "text-foreground"
              }`}
            >
              {formatDuration(elapsedSeconds)} / {formatDuration(maxSeconds)}
            </span>
            <div className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1.5 text-primary">
              <Ear className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
              <div className="leading-tight">
                <div className="text-xs font-semibold text-foreground">{turnHeadline}</div>
                <div className="text-[10px] text-muted-foreground">{turnDetail}</div>
              </div>
            </div>
            <button
              type="button"
              className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
              aria-label="Open focus panel"
              onClick={onOpenFocus}
            >
              <PanelRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Speak / Type modality */}
      {!wrapping && (
        <div className="flex-shrink-0 border-b border-border px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {(showChoice || showVoice) && (
              <button
                type="button"
                disabled={!showChoice && !showVoice}
                onClick={() => {
                  if (showChoice) setChosenInput("voice");
                }}
                aria-pressed={showVoice && chosenInput !== "text"}
                className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors min-w-[10.5rem] ${
                  showVoice && (!showChoice || chosenInput === "voice")
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Mic
                  className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                    showVoice && (!showChoice || chosenInput === "voice") ? "text-primary" : ""
                  }`}
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">Speak</span>
                  <span className="block text-[11px] text-muted-foreground">Use your microphone.</span>
                </span>
              </button>
            )}
            {(showChoice || showText) && (
              <button
                type="button"
                disabled={!showChoice && !showText}
                onClick={() => {
                  if (showChoice) setChosenInput("text");
                }}
                aria-pressed={showText && chosenInput === "text"}
                className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors min-w-[10.5rem] ${
                  showText && (!showChoice || chosenInput === "text")
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Keyboard
                  className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                    showText && (!showChoice || chosenInput === "text") ? "text-primary" : ""
                  }`}
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">Type</span>
                  <span className="block text-[11px] text-muted-foreground">Use a text response.</span>
                </span>
              </button>
            )}
            <p className="text-xs text-muted-foreground max-w-xs">
              Speak naturally. You may switch to typing between turns.
            </p>
          </div>
        </div>
      )}

      {/* Audio status strip */}
      {!wrapping && showVoice && (!showChoice || chosenInput === "voice") && (
        <div className="flex-shrink-0 border-b border-border px-4 sm:px-6 py-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                muted ? "text-muted-foreground" : "text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {muted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              {muted ? "Muted" : voiceRecording ? "Recording…" : "AI is listening."}
            </div>
            <LiveWaveform active={listeningActive && !muted} />
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              Noise suppression on · Room · Voice {voiceRecording && !muted ? "42%" : "0%"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
              {muted ? "Unmute" : "Mute"}
            </Button>
            {!voiceRecording ? (
              <Button
                type="button"
                size="sm"
                className="h-8"
                disabled={micUnavailable || muted || wrapping}
                onClick={onVoiceStart}
              >
                Start talking
              </Button>
            ) : (
              <Button type="button" size="sm" variant="secondary" className="h-8" onClick={onVoiceStop}>
                Stop and send
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 space-y-3 max-w-3xl">
              {turns.map((t) => {
                if (t.role === "learner") {
                  return (
                    <div key={t.id} className="rounded-lg border border-border bg-primary/5 border-l-4 border-l-primary p-3 space-y-1 ml-auto max-w-[92%]">
                      <div className="text-[10px] font-semibold tracking-wide text-primary uppercase">
                        You{t.modality ? ` · ${t.modality}` : ""}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{t.text}</p>
                    </div>
                  );
                }
                return (
                  <div
                    key={t.id}
                    className="rounded-lg border border-border bg-card border-l-4 border-l-secondary-foreground/70 p-3 space-y-1 max-w-[92%]"
                  >
                    <div className="text-[10px] font-semibold tracking-wide text-primary/80 uppercase">
                      AI simulation · {shortName}
                      {t.modality ? ` · ${t.modality}` : ""}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{t.text}</p>
                    {t.escalation && (
                      <p className="text-[11px] italic text-muted-foreground">
                        This interaction has been flagged for manager review.
                      </p>
                    )}
                  </div>
                );
              })}
              {personaThinking && (
                <div className="text-xs text-muted-foreground italic pl-1">
                  {wrapping ? "Wrapping up your role-play…" : `${cfg.personaName} is thinking…`}
                </div>
              )}
              {isPractice && showCoachingNudge && !wrapping && (
                <LeftBorderCard borderVariant="brand" padding="sm">
                  <p className="text-xs text-foreground">
                    Coaching tip — try to include a specific reason or next step in your response.
                  </p>
                </LeftBorderCard>
              )}
              {!wrapping && <AuditTrail turns={turns} collapsedDefault />}
            </div>
          </div>

          {!wrapping && showText && (!showChoice || chosenInput === "text") && (
            <div className="border-t border-border bg-card px-4 sm:px-6 py-3">
              <div className="flex items-end gap-2 max-w-3xl">
                <Textarea
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your response…"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSendText();
                    }
                  }}
                />
                <Button onClick={onSendText} disabled={!draft.trim()}>
                  Send
                </Button>
              </div>
            </div>
          )}
          {wrapping && (
            <div className="border-t border-border bg-card px-4 sm:px-6 py-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Wrapping up your role-play…
            </div>
          )}
        </div>

        <aside className="hidden md:flex w-80 flex-shrink-0 flex-col border-l border-border bg-muted/30 overflow-y-auto p-4">
          <FocusPanel criteria={focusCriteria} touched={touchedCriteria} />
        </aside>
      </div>
    </div>
  );
}

/* ─────────────────────────── Audit trail ─────────────────────────── */

function AuditTrail({ turns, collapsedDefault = true }: { turns: Turn[]; collapsedDefault?: boolean }) {
  const [open, setOpen] = useState(!collapsedDefault);
  const audited = turns.filter((t) => t.audit);
  if (!audited.length) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="pt-2">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40"
        >
          How the AI responded
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {audited.map((t, i) => (
          <div key={t.id} className="rounded-md border border-border bg-background p-3 text-xs space-y-1">
            <div className="flex items-center justify-between gap-2 text-muted-foreground">
              <span>
                Turn {i + 1} · {t.role === "persona" ? "AI" : "You"}
              </span>
              <span className="tabular-nums">{t.audit!.latencyMs} ms</span>
            </div>
            <div className="text-muted-foreground">
              Model: <span className="text-foreground">{t.audit!.model}</span>
            </div>
            <p className="text-foreground">{t.audit!.rationale}</p>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ─────────────────────────── Feedback / Final review ─────────────────────────── */

function FeedbackScreen({
  cfg,
  escalated,
  turns,
  focusCriteria,
  completionStatus,
  durationSeconds,
}: {
  cfg: RolePlayScenario;
  escalated: boolean;
  turns: Turn[];
  focusCriteria: FocusCriterion[];
  completionStatus: CompletionStatus | null;
  durationSeconds: number;
}) {
  const FEEDBACK = cfg.feedback;
  const isPractice = cfg.scoringMode === "practice";
  const passed = FEEDBACK.score >= cfg.passThreshold;
  const reviews = resolveCriterionReviews(cfg, turns);
  const labelFor = (id: string) => focusCriteria.find((c) => c.id === id)?.label ?? id;

  // Prototype durable history
  useEffect(() => {
    try {
      const key = `rp-history:${cfg.scenarioId}`;
      const prev = JSON.parse(sessionStorage.getItem(key) || "[]") as unknown[];
      const entry = {
        at: Date.now(),
        attempt: cfg.attemptNumber,
        status: completionStatus,
        durationSeconds,
        score: FEEDBACK.score,
      };
      sessionStorage.setItem(key, JSON.stringify([entry, ...prev].slice(0, 5)));
    } catch {
      /* ignore */
    }
  }, [cfg.scenarioId, cfg.attemptNumber, completionStatus, durationSeconds, FEEDBACK.score]);

  return (
    <PageContainer as="div" className="py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {isPractice ? "Practice review" : "Formative review"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {cfg.scenarioTitle} · Attempt {cfg.attemptNumber}
          {completionStatus ? ` · ${completionStatus.replace(/-/g, " ")}` : ""}
        </p>
      </div>

      <Tabs defaultValue="review">
        <TabsList>
          <TabsTrigger value="review">Criterion review</TabsTrigger>
          <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
          {!isPractice && <TabsTrigger value="score">Score summary</TabsTrigger>}
        </TabsList>

        <TabsContent value="review" className="space-y-6 pt-6">
          {isPractice ? (
            <LeftBorderCard borderVariant="brand">
              <p className="text-sm text-foreground">
                Practice Mode — this coaching does not gate your journey. Use it to prepare for the
                formative role-play.
              </p>
            </LeftBorderCard>
          ) : passed ? (
            <LeftBorderCard borderVariant="success">
              <p className="text-sm font-medium text-foreground">
                Formative threshold met — review coaching below before the module assessment.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Attempt {cfg.attemptNumber} of {cfg.maxAttempts} used.
              </p>
            </LeftBorderCard>
          ) : (
            <LeftBorderCard borderVariant="danger">
              <p className="text-sm font-medium text-foreground">
                Threshold not met — review the feedback below and try again.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Attempt {cfg.attemptNumber} of {cfg.maxAttempts} used.
              </p>
            </LeftBorderCard>
          )}

          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Per-criterion coaching</h3>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.criterionId} className="rounded-md border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-sm font-medium text-foreground">{labelFor(r.criterionId)}</div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${ordinalChipClass(r.ordinal)}`}
                    >
                      {r.ordinal}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{r.narrative}</p>
                  <blockquote className="border-l-2 border-primary/40 pl-3 text-xs italic text-muted-foreground">
                    “{r.evidenceQuote}”
                  </blockquote>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-border bg-card p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">What worked</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                {FEEDBACK.worked.map((w) => (
                  <li key={w} className="text-sm text-foreground">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">What to improve</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                {FEEDBACK.improve.map((w) => (
                  <li key={w} className="text-sm text-foreground">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <AuditTrail turns={turns} collapsedDefault />
        </TabsContent>

        <TabsContent value="transcript" className="space-y-4 pt-6">
          <p className="text-xs text-muted-foreground">
            This transcript is a complete record of your role-play interaction.
          </p>
          {escalated && (
            <LeftBorderCard borderVariant="warning">
              <p className="text-sm text-foreground">
                This interaction contained a serious escalation and has been flagged for manager
                review.
              </p>
            </LeftBorderCard>
          )}
          <div className="space-y-4">
            {turns.map((t, i) => (
              <div key={t.id} className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground">
                  <span>
                    Turn {i + 1} — {t.role === "learner" ? "You" : cfg.personaName}
                  </span>
                  {t.modality && (
                    <span className="font-normal uppercase text-muted-foreground/80">{t.modality}</span>
                  )}
                </div>
                {t.role === "learner" ? (
                  <LearnerBubble message={t.text} />
                ) : (
                  <TutorBubble message={t.text} />
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {!isPractice && (
          <TabsContent value="score" className="space-y-6 pt-6">
            <div className="rounded-lg border border-border bg-card p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  Overall score
                </div>
                <div className="text-4xl font-semibold text-foreground mt-1">
                  {FEEDBACK.score} <span className="text-lg text-muted-foreground">/ 100</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Pass threshold: {cfg.passThreshold}
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${confidenceChipClass(FEEDBACK.confidence)}`}
              >
                Confidence: {FEEDBACK.confidence}
              </span>
            </div>
            <section className="space-y-3">
              {FEEDBACK.skills.map((s) => (
                <div key={s.name} className="rounded-md border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-sm font-medium text-foreground">{s.name}</div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${confidenceChipClass(s.confidence)}`}
                      >
                        {s.confidence}
                      </span>
                      <span className="text-sm text-foreground">{s.score} / 100</span>
                    </div>
                  </div>
                  <Progress value={s.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">{s.evidence}</p>
                </div>
              ))}
            </section>
          </TabsContent>
        )}
      </Tabs>
    </PageContainer>
  );
}

/* ─────────────────────────── Failure ─────────────────────────── */

function FailureScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <PageContainer as="div" className="py-16 text-center space-y-4">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning-foreground dark:text-warning">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-semibold text-foreground">Role-Play Could Not Be Completed</h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong and your role-play session could not be scored. Your progress has not
        been affected. Please try again.
      </p>
      <div>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </PageContainer>
  );
}
