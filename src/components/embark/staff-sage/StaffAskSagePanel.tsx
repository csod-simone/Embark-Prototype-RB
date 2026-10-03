import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Maximize2, Minimize2, X } from "lucide-react";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearnerBubble } from "@/components/embark/LearnerBubble";
import { TutorBubble } from "@/components/embark/TutorBubble";
import { cn } from "@/lib/utils";
import { answerStaffSage, staffPrompts, type StaffSageScope } from "./answerStaffSage";

type Msg = {
  id: string;
  role: "tutor" | "learner";
  text: string;
  timestamp: string;
  isTyping?: boolean;
};

let nextId = 1;
const genId = () => `staff-sage-${nextId++}`;

function TypingBubble() {
  return (
    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
    </div>
  );
}

export function StaffAskSagePanel({
  scope,
  userName,
  onClose,
  wide = false,
  onWideChange,
}: {
  scope: StaffSageScope;
  userName: string;
  onClose: () => void;
  /** Panel fills the area under the header. The host hides the page. */
  wide?: boolean;
  onWideChange?: (wide: boolean) => void;
}) {
  const prompts = staffPrompts(scope);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
  const [promptsOpen, setPromptsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const firstName = userName.split(" ")[0];

  useEffect(() => () => {
    timers.current.forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (text?: string) => {
    const question = (text ?? value).trim();
    if (!question) return;
    if (!wide) setPromptsOpen(false);
    const reply = answerStaffSage(question, scope);
    const typingId = genId();
    setMessages((prev) => [
      ...prev,
      { id: genId(), role: "learner", text: question, timestamp: `${firstName} · just now` },
      { id: typingId, role: "tutor", text: "", timestamp: "", isTyping: true },
    ]);
    setValue("");
    const timer = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === typingId
            ? { id: typingId, role: "tutor", text: reply, timestamp: "Sage · just now" }
            : message,
        ),
      );
    }, 700);
    timers.current.push(timer);
    inputRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const showEmpty = !messages.some((message) => message.role === "learner");

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden border border-border bg-card",
        wide ? "min-w-0 flex-1 rounded-none border-0" : "rounded-xl lg:w-[400px] lg:shrink-0",
      )}
    >
      <div
        aria-hidden="true"
        className="h-1.5 flex-shrink-0 bg-[linear-gradient(45deg,hsl(233_100%_39%)_0%,hsl(233_100%_39%)_75%,hsl(222_88%_13%)_100%)]"
      />
      <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="text-sm font-semibold text-foreground">Ask Sage</div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => setMessages([])}>
            New chat
          </Button>
          {onWideChange && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={wide ? undefined : "hidden lg:inline-flex"}
              aria-pressed={wide}
              aria-label={wide ? "Return Sage to the side panel" : "Expand Sage to the full window"}
              title={wide ? "Side panel" : "Full window"}
              onClick={() => onWideChange(!wide)}
            >
              {wide ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={cn("flex min-h-0 flex-1 flex-col", wide && "mx-auto w-full max-w-3xl")}>
        {showEmpty ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 text-center">
            <AskSageIcon size={wide ? 28 : 22} className="text-primary" />
            <h2 className={cn("mt-3 font-semibold text-foreground", wide ? "text-3xl tracking-tight sm:text-4xl" : "text-lg")}>
              Hi {firstName}, I'm Sage.
            </h2>
            {(scope === "manager" || scope === "admin") && (
              <Badge variant="ai" className="mt-4 gap-1 border-transparent px-2.5 py-0.5 text-xs font-medium">
                <AskSageIcon size={14} />
                AI
              </Badge>
            )}
            <p className={cn("mt-3 text-muted-foreground", wide ? "max-w-xl text-base" : "text-sm")}>
              Ask for a status update, a readiness report, or who is behind — on a learner, cohort, track, assessment, or journey.
            </p>
          </div>
        ) : (
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {messages.map((message) => {
                if (message.isTyping) {
                  return (
                    <div key={message.id} className="flex max-w-[80%] flex-col items-start">
                      <TypingBubble />
                    </div>
                  );
                }
                if (message.role === "learner") {
                  return <LearnerBubble key={message.id} message={message.text} timestamp={message.timestamp} />;
                }
                return (
                  <TutorBubble
                    key={message.id}
                    message={message.text}
                    timestamp={message.timestamp}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-shrink-0 flex-wrap gap-1.5 px-4 pb-2">
          {(wide || promptsOpen ? prompts : prompts.slice(0, 2)).map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => send(prompt.label)}
              className="rounded-full border border-border bg-background px-2.5 py-1.5 text-left text-xs text-foreground hover:bg-muted"
            >
              {prompt.label}
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

        <div className="flex-shrink-0 px-4 pb-2">
          <div className="flex h-12 items-center gap-2 rounded-full border border-border bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <AskSageIcon size={16} className="flex-shrink-0 text-primary" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask for a status update, a readiness report, or who is behind…"
              className="h-full flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => send()}
              aria-label="Send"
              disabled={!value.trim()}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full transition",
                value.trim()
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
        <p className="flex-shrink-0 px-4 pb-3 text-center text-xs text-muted-foreground">
          Generated by AI. Check for accuracy.
        </p>
      </div>
    </div>
  );
}
