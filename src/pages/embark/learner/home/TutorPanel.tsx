import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TutorBubble } from "@/components/embark/TutorBubble";
import { LearnerBubble } from "@/components/embark/LearnerBubble";
import { SuggestedChips } from "@/components/embark/SuggestedChips";
import { TutorInputBar } from "@/components/embark/TutorInputBar";
import { Button } from "@/components/ui/button";
import { SageAvatar } from "@/components/embark/AskSageIcon";
import type { TutorConversation } from "./useTutorConversation";

export type TutorChip = { label: string; variant: "default" | "action"; onClick: () => void };

const TutorAvatar = SageAvatar;

function TypingBubble() {
  return (
    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
    </div>
  );
}

export function TutorPanel({
  conversation,
  mode = "default",
  chips: chipsOverride,
  extraBelowConversation,
  seedInput,
  seedInputKey,
  inputPlaceholder = "Ask Sage anything...",
  hideBranding = false,
  title = "Sage",
  subBrand = "Cornerstone Embark",
  footerClassName,
}: {
  conversation: TutorConversation;
  mode?: "default" | "teaching";
  chips?: TutorChip[];
  extraBelowConversation?: React.ReactNode;
  seedInput?: string;
  seedInputKey?: string | number;
  inputPlaceholder?: string;
  hideBranding?: boolean;
  title?: string;
  subBrand?: string;
  footerClassName?: string;
}) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.messages]);

  const defaultChips: TutorChip[] = [
    { label: "What's next?", variant: "default" as const, onClick: conversation.handleWhatsNext },
    { label: "New patient prep", variant: "default" as const, onClick: () => {} },
    { label: "Simpler terms", variant: "default" as const, onClick: () => {} },
    { label: "Example", variant: "default" as const, onClick: () => {} },
    { label: "Raise a hand 🤚", variant: "action" as const, onClick: conversation.handleRaiseHand },
  ];
  const chips = chipsOverride ?? defaultChips;

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      {!hideBranding && (
        <div className="flex items-center gap-3 px-4 py-3">
          <TutorAvatar />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-foreground">{title}</div>
              {mode === "teaching" && (
                <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2 py-0.5 text-[10px] font-semibold">
                  Teaching
                </span>
              )}
            </div>
            <div className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
              {subBrand}
            </div>
          </div>
        </div>
      )}

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {conversation.messages.map((m) => {
          if (m.isTyping) {
            return (
              <div key={m.id} className="flex flex-col items-start max-w-[80%]">
                <TypingBubble />
              </div>
            );
          }
          if (m.role === "learner") {
            return <LearnerBubble key={m.id} message={m.text} timestamp={m.timestamp} />;
          }
          return (
            <div key={m.id} className="space-y-2">
              <TutorBubble
                message={m.text}
                citation={m.citation}
                isProactive={m.isProactive}
                timestamp={m.timestamp}
              />
              {m.inlineCta && (
                <div className="pl-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(m.inlineCta!.route)}
                  >
                    {m.inlineCta.label}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {extraBelowConversation}
      </div>

      {/* Prompts */}
      <div className="px-4 pt-3 pb-4">
        <SuggestedChips chips={chips} />
      </div>

      {/* Smartbar */}
      <div className={cn("flex-shrink-0 h-12 px-4", footerClassName)}>
        <TutorInputBar
          placeholder={inputPlaceholder}
          onSend={conversation.handleSend}
          seedValue={seedInput}
          seedKey={seedInputKey}
        />
      </div>
    </div>
  );
}