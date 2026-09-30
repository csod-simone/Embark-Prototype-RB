import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Lock, Mic, Send, X } from "lucide-react";
import { AiFlag } from "@/components/embark/AiFlag";
import { AiMarkedContent } from "@/components/embark/AiMarkedContent";
import { AIThinking } from "@/components/ui/ai-thinking";
import { TrainingSimulationBanner } from "@/components/embark/TrainingSimulationBanner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { FocusCriterion, RolePlayScenario, TurnState } from "./types";

export type TeleprompterTurn = {
  id: string;
  role: "persona" | "learner";
  text: string;
};

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function shortScenarioTitle(title: string): string {
  return title.replace(/^(Practice|Formative)\s*[—–-]\s*/i, "").trim() || title;
}

function personaShortName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

/** 0 = oldest turn, 1 = newest — subtle fade on AI text only. */
function turnRecency(index: number, total: number): number {
  if (total <= 1) return 1;
  return index / (total - 1);
}

function aiTextStyle(recency: number): CSSProperties {
  return { opacity: 0.55 + recency * 0.45 };
}

function ListeningOrb({ active }: { active: boolean }) {
  return (
    <div
      className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full shadow-[0_0_0_7px_hsl(var(--roleplay-accent)/0.10)]"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, hsl(var(--roleplay-accent-2)), hsl(var(--roleplay-accent)))",
      }}
      aria-hidden
    >
      <span className="inline-flex h-[22px] items-center gap-[3px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <i
            key={i}
            className={cn(
              "inline-block w-[3px] rounded-sm bg-white",
              active
                ? "animate-roleplay-eq motion-reduce:animate-none motion-reduce:h-[60%]"
                : "h-[40%]",
            )}
            style={active ? { animationDelay: `${i * 0.15}s`, height: "30%" } : undefined}
          />
        ))}
      </span>
    </div>
  );
}

export interface TeleprompterConversationProps {
  scenario: RolePlayScenario;
  turns: TeleprompterTurn[];
  turnState: TurnState;
  voiceRecording: boolean;
  wrapping: boolean;
  chosenInput: "text" | "voice";
  setChosenInput: (v: "text" | "voice") => void;
  draft: string;
  setDraft: (v: string) => void;
  onSendText: () => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  elapsedSeconds: number;
  maxSeconds: number;
  onFinish: () => void;
  /** Leave the live session (after confirmation). Progress is discarded. */
  onBack: () => void;
}

export function TeleprompterConversation({
  scenario,
  turns,
  turnState,
  voiceRecording,
  wrapping,
  chosenInput,
  setChosenInput,
  draft,
  setDraft,
  onSendText,
  onVoiceStart,
  onVoiceStop,
  elapsedSeconds,
  maxSeconds,
  onFinish,
  onBack,
}: TeleprompterConversationProps) {
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goals: FocusCriterion[] = scenario.focusCriteria ?? [];
  const title = shortScenarioTitle(scenario.scenarioTitle);
  const clientName = personaShortName(scenario.personaName);
  const isPractice = scenario.scoringMode === "practice";
  const showChoice = scenario.inputMode === "choice";
  const isType = chosenInput === "text" || scenario.inputMode === "text";
  const isSpeak = !isType;
  const orbActive =
    !wrapping &&
    isSpeak &&
    (voiceRecording || turnState === "speaking" || turnState === "thinking" || turnState === "listening");

  const yourTurn =
    !wrapping && turnState === "listening" && isSpeak;
  const aiThinking = !wrapping && !voiceRecording && turnState === "thinking";
  const aiSpeaking =
    !wrapping && !voiceRecording && turnState === "speaking";
  const aiActive = aiThinking || aiSpeaking;

  // Learner speaking is still "AI is listening" — not a separate rotating status.
  const primaryLabel = aiThinking
    ? "AI is thinking"
    : aiSpeaking
      ? "AI is speaking"
      : "AI is listening";
  const primaryActionLabel = voiceRecording ? "Stop and send" : primaryLabel;

  const aiThinkingMessages = ["Thinking…", "Gathering response…", "Rendering…"];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [turns, turnState, aiThinking, aiSpeaking]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-card text-roleplay-ink">
      <TrainingSimulationBanner />
      {/* Thin top bar */}
      <header className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-roleplay-line px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setQuitOpen(true)}
            aria-label="Back"
            disabled={wrapping}
            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-roleplay-muted hover:bg-roleplay-line-soft hover:text-roleplay-ink disabled:pointer-events-none disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="truncate text-[0.98rem] font-semibold text-roleplay-ink">{title}</h1>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3 sm:gap-3.5">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-roleplay-muted">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  Private
                </span>
              </TooltipTrigger>
              <TooltipContent>Feedback appears only after you finish</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-auto rounded-[9px] border-roleplay-line px-[15px] py-[7px] text-[0.85rem] font-semibold text-roleplay-ink hover:bg-roleplay-line-soft"
            onClick={onFinish}
            disabled={wrapping}
          >
            {isPractice ? "Finish practice" : "End session"}
          </Button>
        </div>
      </header>

      <AlertDialog open={quitOpen} onOpenChange={setQuitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isPractice ? "Quit this practice?" : "Quit this session?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will not be saved. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isPractice ? "Keep practising" : "Keep going"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onBack}>Quit without saving</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
        <span className="pointer-events-none absolute left-4 top-4 z-[2] text-[0.85rem] font-semibold tabular-nums text-roleplay-ink-soft sm:left-5">
          {formatDuration(elapsedSeconds)} / {formatDuration(maxSeconds)}
        </span>

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col px-4 pb-0 pt-10 sm:px-8",
            goalsOpen ? "md:pr-[calc(70px+300px)] md:pl-6" : "md:px-10",
          )}
        >
          {(yourTurn || aiActive) && (
            <div className="mb-3 flex justify-center">
              {yourTurn && (
                <div className="inline-flex items-center gap-2 rounded-full bg-roleplay-accent-tint px-3.5 py-1.5 text-[0.78rem] font-semibold text-roleplay-accent">
                  <span
                    className="h-[7px] w-[7px] rounded-full bg-roleplay-accent animate-roleplay-dot motion-reduce:animate-none"
                    aria-hidden
                  />
                  Your turn — {clientName} is listening
                </div>
              )}
              {!yourTurn && aiActive && (
                <div className="inline-flex items-center gap-2 rounded-full bg-roleplay-accent-tint px-3.5 py-1.5 text-[0.78rem] font-semibold text-roleplay-accent">
                  <span
                    className="h-[7px] w-[7px] rounded-full bg-roleplay-accent animate-roleplay-dot motion-reduce:animate-none"
                    aria-hidden
                  />
                  {aiThinking ? `${clientName} is thinking` : `${clientName} speaking`}
                </div>
              )}
            </div>
          )}

          {/* Conversation — AI left, learner right */}
          <div
            ref={scrollRef}
            role="log"
            aria-label="Conversation transcript"
            className="roleplay-dialogue-scroll flex w-full max-w-3xl flex-1 flex-col justify-end gap-5 overflow-y-auto px-1 pb-2 pt-11 mx-auto"
          >
            {turns.map((t, index) => {
              const isYou = t.role === "learner";
              const recency = turnRecency(index, turns.length);

              if (isYou) {
                return (
                  <div key={t.id} className="flex w-full justify-end">
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
                <div key={t.id} className="flex w-full justify-start">
                  <div className="flex max-w-[78%] flex-col items-start gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>{scenario.personaName}</span>
                      <AiFlag
                        variant="ai-generated"
                        size="xs"
                        complianceContext="eu-ai-act"
                        articleRef="art-50-1"
                        surface="roleplay_live"
                        fieldName="transcript_persona"
                      />
                    </div>
                    <div style={aiTextStyle(recency)}>
                      <AiMarkedContent
                        kind="ai-generated"
                        as="p"
                        className="text-sm leading-relaxed text-foreground transition-opacity duration-300 motion-reduce:transition-none"
                      >
                        {t.text}
                      </AiMarkedContent>
                    </div>
                  </div>
                </div>
              );
            })}

            {aiThinking && (
              <div className="flex w-full justify-start">
                <div className="flex max-w-[78%] flex-col items-start gap-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {scenario.personaName}
                  </p>
                  <AIThinking messages={aiThinkingMessages} />
                </div>
              </div>
            )}
          </div>

          {/* Controls + disclaimer */}
          <div className="flex flex-shrink-0 flex-col items-center gap-4 px-2 pb-4 pt-5">
            <div className="flex flex-wrap items-center justify-center gap-3.5">
            {wrapping ? (
              <p className="text-sm text-roleplay-muted">Wrapping up…</p>
            ) : isSpeak ? (
              <>
                <ListeningOrb active={orbActive} />
                <button
                  type="button"
                  onClick={
                    voiceRecording ? onVoiceStop : aiActive ? undefined : onVoiceStart
                  }
                  disabled={aiActive}
                  aria-label={primaryActionLabel}
                  aria-live="polite"
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-full px-[26px] py-[13px] text-[0.95rem] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roleplay-accent focus-visible:ring-offset-2",
                    aiActive
                      ? "cursor-default bg-roleplay-accent/80"
                      : "bg-roleplay-accent hover:brightness-105",
                  )}
                >
                  {aiThinking ? (
                    <span aria-hidden className="ai-flag-icon text-[17px] leading-none">
                      ✦
                    </span>
                  ) : (
                    <Mic className="h-[17px] w-[17px]" aria-hidden />
                  )}
                  {primaryLabel}
                </button>
              </>
            ) : (
              <div className="flex w-full max-w-md items-end gap-2">
                <Textarea
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your response…"
                  className="min-h-[44px] flex-1 border-roleplay-line bg-card"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSendText();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-full bg-roleplay-accent text-white hover:bg-roleplay-accent-2"
                  onClick={onSendText}
                  disabled={!draft.trim()}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}

            {showChoice && (
              <div
                className="inline-flex rounded-[10px] bg-roleplay-line-soft p-[3px]"
                role="group"
                aria-label="Input mode"
              >
                <button
                  type="button"
                  aria-pressed={isSpeak}
                  onClick={() => setChosenInput("voice")}
                  className={cn(
                    "rounded-lg px-4 py-[7px] text-[0.78rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roleplay-accent",
                    isSpeak
                      ? "bg-card text-roleplay-ink shadow-sm"
                      : "text-roleplay-ink-soft hover:text-roleplay-ink",
                  )}
                >
                  Speak
                </button>
                <button
                  type="button"
                  aria-pressed={isType}
                  onClick={() => setChosenInput("text")}
                  className={cn(
                    "rounded-lg px-4 py-[7px] text-[0.78rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roleplay-accent",
                    isType
                      ? "bg-card text-roleplay-ink shadow-sm"
                      : "text-roleplay-ink-soft hover:text-roleplay-ink",
                  )}
                >
                  Type
                </button>
              </div>
            )}
            </div>
            <p className="text-center text-xs text-roleplay-muted">
              Generated by AI. Check for accuracy.
            </p>
          </div>
        </div>

        {/* Goals edge tab — slim only; no empty panel when collapsed */}
        <button
          type="button"
          aria-expanded={goalsOpen}
          aria-controls="roleplay-goals-panel"
          onClick={() => setGoalsOpen((o) => !o)}
          className={cn(
            "absolute right-0 top-0 z-[4] flex h-full w-[52px] flex-col items-center gap-2 border-l border-roleplay-line bg-card/90 pt-[22px] backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-roleplay-accent sm:w-[58px]",
            goalsOpen && "bg-card",
          )}
        >
          <span className="grid h-[21px] w-[21px] place-items-center rounded-full border-[1.5px] border-roleplay-accent text-[0.7rem] font-bold text-roleplay-accent">
            {goals.length}
          </span>
          <span className="origin-center rotate-180 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-roleplay-accent [writing-mode:vertical-rl]">
            Goals
          </span>
        </button>

        {goalsOpen ? (
          <aside
            id="roleplay-goals-panel"
            className="absolute bottom-0 right-[52px] top-0 z-[3] flex w-[min(100%,300px)] flex-col border-l border-roleplay-line bg-card p-5 shadow-[-8px_0_24px_rgba(28,35,51,0.06)] sm:right-[58px]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-roleplay-muted">
                Goals to cover
              </span>
              <button
                type="button"
                aria-label="Close goals"
                onClick={() => setGoalsOpen(false)}
                className="rounded-md p-1 text-roleplay-muted hover:bg-roleplay-line-soft hover:text-roleplay-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-roleplay-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-xs text-roleplay-muted">
              Guidance only — feedback appears after you finish.
            </p>
            <ul className="m-0 grid list-none gap-0.5 overflow-y-auto p-0">
              {goals.map((g, i) => (
                <li
                  key={g.id}
                  className="flex items-start gap-[11px] border-t border-roleplay-line-soft px-0.5 py-[9px] first:border-t-0"
                >
                  <span className="mt-px grid h-[21px] w-[21px] flex-none place-items-center rounded-full border-[1.5px] border-roleplay-line text-[0.7rem] font-bold text-roleplay-muted">
                    {i + 1}
                  </span>
                  <span className="text-[0.9rem] leading-snug text-roleplay-ink">{g.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
