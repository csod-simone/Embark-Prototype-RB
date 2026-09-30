import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowUp, Mic, MessageSquarePlus, BookOpen, ArrowLeft } from "lucide-react";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { RaiseHandModal } from "@/components/embark/RaiseHandModal";
import { TutorBubble } from "@/components/embark/TutorBubble";
import { LearnerBubble } from "@/components/embark/LearnerBubble";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TutorConversation, TutorMsg } from "./useTutorConversation";
import { resolveSageContext } from "./sageContext";
import { buildSagePrompts } from "./sagePrompts";

type HistoryConversation = {
  id: string;
  title: string;
  timestamp: string;
  messages: TutorMsg[];
};

const CHAT_HISTORY: HistoryConversation[] = [
  {
    id: "h1",
    title: "How does this help me get a role?",
    timestamp: "Today",
    messages: [
      { id: "h1-1", role: "learner", timestamp: "Jordan · today", text: "How does this help me get a role?" },
      {
        id: "h1-2",
        role: "tutor",
        timestamp: "Sage · today",
        text: "The skills in this programme map directly to the requirements of the roles on your career path. Finishing the Benefits Navigation track covers three of the five skills listed for your next role.",
      },
    ],
  },
  {
    id: "h2",
    title: "I don't agree with my rating",
    timestamp: "Today",
    messages: [
      { id: "h2-1", role: "learner", timestamp: "Jordan · today", text: "I don't agree with my rating" },
      {
        id: "h2-2",
        role: "tutor",
        timestamp: "Sage · today",
        text: "Your rating comes from your assessment results and session activity. You can raise a hand to your instructor to have it reviewed, and I can show you the evidence behind each score.",
      },
    ],
  },
  {
    id: "h3",
    title: "Courses for Stakeholder Management",
    timestamp: "Yesterday",
    messages: [
      { id: "h3-1", role: "learner", timestamp: "Jordan · yesterday", text: "Courses for Stakeholder Management" },
      {
        id: "h3-2",
        role: "tutor",
        timestamp: "Sage · yesterday",
        text: "There are two short curricula that build Stakeholder Management: 'Influencing Without Authority' and 'Difficult Conversations'. Both are under two hours.",
      },
    ],
  },
  {
    id: "h4",
    title: "Should I go for Subsurface Team Lead?",
    timestamp: "Yesterday",
    messages: [
      { id: "h4-1", role: "learner", timestamp: "Jordan · yesterday", text: "Should I go for Subsurface Team Lead?" },
      {
        id: "h4-2",
        role: "tutor",
        timestamp: "Sage · yesterday",
        text: "You already meet four of the six core skills for that role. The main gaps are Team Coaching and Budget Planning — both are covered in your suggested next steps.",
      },
    ],
  },
  {
    id: "h5",
    title: "What's my best first step?",
    timestamp: "14 Jul",
    messages: [
      { id: "h5-1", role: "learner", timestamp: "Jordan · 14 Jul", text: "What's my best first step?" },
      {
        id: "h5-2",
        role: "tutor",
        timestamp: "Sage · 14 Jul",
        text: "Start with Session 3 of Benefits Navigation — it's short, it unlocks the next module, and it targets the concept you flagged as unclear.",
      },
    ],
  },
];

function TypingBubble() {
  return (
    <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
    </div>
  );
}

export function AskSagePanel({
  conversation,
  onClose,
  userName = "David",
}: {
  conversation: TutorConversation;
  onClose: () => void;
  userName?: string;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sagePrompts = useMemo(() => buildSagePrompts(resolveSageContext(pathname)), [pathname]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [raiseHandOpen, setRaiseHandOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<"prompts" | "history">("prompts");
  const [activeHistory, setActiveHistory] = useState<HistoryConversation | null>(null);

  const displayedMessages = activeHistory ? activeHistory.messages : conversation.messages;
  const hasLearnerMessage = displayedMessages.some((m) => m.role === "learner");
  const showEmpty = !hasLearnerMessage;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.messages]);

  const send = (text?: string, presetReply?: string) => {
    const v = (text ?? value).trim();
    if (!v) return;
    setActiveHistory(null);
    conversation.handleSend(v, presetReply);
    setValue("");
    inputRef.current?.focus();
  };

  const raiseHand = () => {
    setRaiseHandOpen(true);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex-1 flex min-h-0 bg-background">
      {/* Sidebar */}
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
          <SidebarItem
            icon={<MessageSquarePlus size={16} />}
            label="New chat"
            onClick={() => setActiveHistory(null)}
          />
          <SidebarItem icon={<BookOpen size={16} />} label="Explore prompt library" />
        </div>

        {sidebarView === "prompts" ? (
          <>
            <div className="px-4 pt-5 pb-2">
              <div className="text-sm text-muted-foreground">Try asking</div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-2">
              {sagePrompts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => (p.isRaiseHand ? raiseHand() : send(p.label, p.response))}
                  className="text-left text-sm text-foreground rounded-full border border-border bg-background hover:bg-muted px-4 py-2 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="px-4 pt-4 pb-4">
              <button
                type="button"
                onClick={() => setSidebarView("history")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Chat history
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="px-4 pt-5 pb-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSidebarView("prompts")}
                aria-label="Back to suggested prompts"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Chat History
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {CHAT_HISTORY.length === 0 ? (
                <p className="px-2 py-2 text-sm text-muted-foreground">
                  No previous conversations yet. Start chatting with Sage to build your history.
                </p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {CHAT_HISTORY.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setActiveHistory(item)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <span className="block text-sm text-foreground truncate">{item.title}</span>
                        <span className="block text-xs text-muted-foreground">{item.timestamp}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {showEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-2xl flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-3">
                <AskSageIcon size={28} className="text-primary" />
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                  Hi {userName}, I'm Sage.
                </h1>
              </div>
              <p className="mt-3 text-base text-muted-foreground">
                Ask me about your career, skills, or team.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {sagePrompts.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => send(p.label, p.response)}
                    className="text-sm text-foreground rounded-full border border-border bg-background hover:bg-muted px-4 py-2 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            <div className="max-w-3xl mx-auto space-y-3">
              {displayedMessages.map((m) => {
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
                        <Button size="sm" onClick={() => navigate(m.inlineCta!.route)}>
                          {m.inlineCta.label}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Smartbar */}
        <div className="flex-shrink-0 h-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto h-12">
            <div className="flex h-12 items-center gap-2 rounded-full border border-border bg-card px-4 focus-within:ring-2 focus-within:ring-ring">
              <AskSageIcon size={18} className="text-primary flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask anything…"
                className="flex-1 h-full bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                aria-label="Voice input"
                className="h-8 w-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition"
              >
                <Mic size={16} aria-hidden="true" />
              </button>
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
          </div>
        </div>

        <div className="flex-shrink-0 px-4 sm:px-6 pb-4 pt-1">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-xs text-muted-foreground">
              Generated by AI. Check for accuracy.
            </p>
          </div>
        </div>
      </div>
      <RaiseHandModal open={raiseHandOpen} onClose={() => setRaiseHandOpen(false)} />
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 h-10 px-3 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </button>
  );
}