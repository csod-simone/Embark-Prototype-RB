import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowUp, MessageSquarePlus } from "lucide-react";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { Badge } from "@/components/ui/badge";
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
}: {
  scope: StaffSageScope;
  userName: string;
  onClose: () => void;
}) {
  const prompts = staffPrompts(scope);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
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
    <div className={cn("flex min-h-0 flex-1", scope === "manager" || scope === "admin" ? "bg-[#f4f5f8]" : "bg-background")}>
      <aside className="hidden md:flex w-[280px] flex-shrink-0 flex-col border-r border-border bg-card">
        <div className="px-4 pt-4 pb-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </button>
        </div>
        <div className="px-2 pb-3">
          <button
            type="button"
            onClick={() => setMessages([])}
            className="w-full flex items-center gap-3 h-10 px-3 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
          >
            <MessageSquarePlus size={16} className="text-muted-foreground" />
            New chat
          </button>
        </div>
        <div className="px-4 pt-5 pb-2">
          <div className="text-sm text-muted-foreground">Try asking</div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => send(prompt.label)}
              className="text-left text-sm text-foreground rounded-full border border-border bg-background hover:bg-muted px-4 py-2 transition"
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {showEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-3">
                <AskSageIcon size={28} className="text-primary" />
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  Hi {firstName}, I'm Sage.
                </h1>
              </div>
              {(scope === "manager" || scope === "admin") && (
                <Badge variant="ai" className="mt-4 gap-1 border-transparent px-2.5 py-0.5 text-xs font-medium">
                  <AskSageIcon size={14} />
                  AI
                </Badge>
              )}
              <p className="mt-3 text-base text-muted-foreground max-w-xl">
                Ask for a status update, a readiness report, or who is behind — on a learner, cohort, track, assessment, or journey.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {prompts.slice(0, 3).map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => send(prompt.label)}
                    className="text-sm text-foreground rounded-full border border-border bg-background hover:bg-muted px-4 py-2 transition"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map((message) => {
                if (message.isTyping) {
                  return (
                    <div key={message.id} className="flex flex-col items-start max-w-[80%]">
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

        <div className="flex-shrink-0 px-4 sm:px-6 pb-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex h-12 items-center gap-2 rounded-full border border-border bg-card px-4 focus-within:ring-2 focus-within:ring-ring">
              <AskSageIcon size={18} className="text-primary flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask for a status update, a readiness report, or who is behind…"
                className="flex-1 h-full bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => send()}
                aria-label="Send"
                disabled={!value.trim()}
                className={cn(
                  "h-8 w-8 inline-flex items-center justify-center rounded-full transition",
                  value.trim()
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <ArrowUp size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="pt-2 text-center text-xs text-muted-foreground">
              Generated by AI. Check for accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
