import { X, Send, Maximize2, Minimize2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AiFlag } from "@/components/embark/AiFlag";
import { AiMarkedContent } from "@/components/embark/AiMarkedContent";
import { AskSageIcon } from "./AskSageIcon";
import { SageTag } from "./SageTag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { matchSageResponse } from "@/pages/embark/learner/home/sageResponses";

export type SagePrompt = { label: string; response?: string };

export type SageTurn = {
  id: string;
  role: "user" | "sage";
  text: string;
};

export function SessionAskSagePanel({
  prompts,
  onClose,
  onExpand,
  wide = false,
  onWideChange,
  seed,
  className,
  disclaimer,
  aiFlag = false,
  aiFlagSurface = "sage_panel",
  chapter = false,
}: {
  prompts: SagePrompt[];
  onClose: () => void;
  onExpand?: () => void;
  /** Panel fills the session area. The host hides the lesson. */
  wide?: boolean;
  onWideChange?: (wide: boolean) => void;
  seed?: SageTurn[];
  className?: string;
  disclaimer?: ReactNode;
  /** Show the canonical AI chip in the panel header. */
  aiFlag?: boolean;
  /** Telemetry surface id when aiFlag is enabled. */
  aiFlagSurface?: string;
  /** Rathbones chapter rail: gradient band and tinted prompt chips. */
  chapter?: boolean;
}) {
  const [turns, setTurns] = useState<SageTurn[]>(seed ?? []);
  const [input, setInput] = useState("");
  const [promptsOpen, setPromptsOpen] = useState(false);

  const send = (text: string, presetReply?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!wide) setPromptsOpen(false);
    const id = crypto.randomUUID();
    const matched = matchSageResponse(trimmed);
    setTurns((prev) => [
      ...prev,
      { id: `u-${id}`, role: "user", text: trimmed },
      {
        id: `s-${id}`,
        role: "sage",
        text:
          presetReply ??
          matched ??
          "Here's a quick view based on this session's context. Want me to dig deeper into a specific concept or example?",
      },
    ]);
    setInput("");
  };

  const headerFlag =
    !aiFlag ? null : aiFlagSurface === "roleplay_sage" ? (
      <AiFlag
        variant="ai-generated"
        size="xs"
        complianceContext="eu-ai-act"
        articleRef="art-50-1"
        surface={aiFlagSurface}
        fieldName="sage_panel_header"
        tooltip="Sage responses are AI-generated from session context. Check for accuracy."
      />
    ) : (
      <SageTag />
    );

  return (
    <aside
      id="chapter-sage"
      className={cn(
        "flex flex-col w-[380px] flex-shrink-0 border-l border-border bg-card",
        chapter && "overflow-hidden rounded-2xl border border-border shadow-sm",
        wide && "w-full min-w-0 flex-1 shrink rounded-none border-0 shadow-none",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 h-12 flex-shrink-0">
        <div className="flex items-center gap-2">
          <AskSageIcon size={16} />
          <span className="text-sm font-semibold text-foreground">Ask Sage</span>
          {headerFlag}
        </div>
        <div className="flex items-center gap-1">
          {(onWideChange || onExpand) && (
            <button
              type="button"
              onClick={() => (onWideChange ? onWideChange(!wide) : onExpand?.())}
              aria-pressed={onWideChange ? wide : undefined}
              aria-label={wide ? "Return Sage to the side panel" : "Expand Sage to the full window"}
              title={wide ? "Side panel" : "Full window"}
              className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {wide ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {turns.length === 0 && (
          <div className="text-sm text-muted-foreground">
            I'm here to help you understand this content. Try one of the prompts below or ask
            anything.
          </div>
        )}
        {turns.map((t) =>
          t.role === "user" ? (
            <div key={t.id} className="flex justify-end">
              <div className="rounded-2xl bg-secondary text-secondary-foreground px-3 py-2 text-sm max-w-[85%]">
                {t.text}
              </div>
            </div>
          ) : (
            <div key={t.id} className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {aiFlag && aiFlagSurface === "roleplay_sage" && (
                <div className="mb-1.5 flex items-center gap-1.5">
                  <AiFlag
                    variant="ai-generated"
                    size="xs"
                    complianceContext="eu-ai-act"
                    articleRef="art-50-1"
                    surface={aiFlagSurface}
                    fieldName="sage_response"
                    tooltip="This response was generated by AI from session context."
                  />
                </div>
              )}
              {aiFlag && aiFlagSurface === "roleplay_sage" ? (
                <AiMarkedContent kind="ai-generated" as="span">
                  {t.text}
                </AiMarkedContent>
              ) : (
                t.text
              )}
            </div>
          ),
        )}
      </div>

      {prompts.length > 0 && (
        <div className="flex-shrink-0 px-4 pt-3 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {(wide || promptsOpen ? prompts : prompts.slice(0, 2)).map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => send(p.label, p.response)}
                className={cn(
                  "text-xs px-2.5 py-1.5 rounded-full border border-border bg-background hover:bg-muted text-foreground transition-colors",
                  chapter && "rb-chapter-chip border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
                )}
              >
                {p.label}
              </button>
            ))}
            {!wide && prompts.length > 2 && (
              <button
                type="button"
                aria-expanded={promptsOpen}
                onClick={() => setPromptsOpen((open) => !open)}
                className="rounded-full px-2 py-1 text-xs font-medium text-primary hover:bg-accent"
              >
                {promptsOpen ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>
      )}

      <div aria-hidden="true" className="flex-shrink-0 h-2" />
      <div className="flex-shrink-0 h-12 px-4 pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex h-12 w-full items-center gap-2 rounded-full border border-border bg-background pl-3 pr-1 scroll-mb-24 focus-within:ring-2 focus-within:ring-ring"
        >
          <AskSageIcon size={16} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={chapter ? "Ask about this chapter" : "Ask anything..."}
            className="flex-1 h-full bg-transparent text-sm outline-none placeholder:text-muted-foreground scroll-mb-24"
          />
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={!input.trim()}
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      {disclaimer && (
        <div className="flex-shrink-0 px-4 pb-3 pt-1">
          <p className="text-center text-xs text-muted-foreground">{disclaimer}</p>
        </div>
      )}
      <div aria-hidden="true" className="flex-shrink-0 h-4" />
    </aside>
  );
}
