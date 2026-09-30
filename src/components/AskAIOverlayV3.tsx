import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, Sparkles, Compass } from "lucide-react";

type Group = { title: string; items: string[] };

const groups: Group[] = [
  {
    title: "Action center",
    items: [
      "Brief me on today",
      "What needs my decision?",
      "Recent activity across agents",
      "Who's at risk this week?",
    ],
  },
  {
    title: "Compensation agent",
    items: [
      "Build an offer for a new hire",
      "Open a new req with pay band and market info",
      "Look up a payband and market range for a role",
      "Pressure-test an offer",
      "Review off-cycle adjustments to consider",
      "Check my comp budget and recent activity",
    ],
  },
  {
    title: "Skills architect",
    items: [
      "Director, Data Operations succession bench",
      "Critical skills gaps in Data & Engineering",
      "Where are we strongest in skills?",
      "Aspirants for Sr Data Analyst",
    ],
  },
  {
    title: "Future of work",
    items: [
      "Where is AI augmenting roles?",
      "Mercury LLM adoption status",
      "Roles ready for redesign",
    ],
  },
];

const mockResponses: Record<string, string> = {
  "Brief me on today":
    "Here's your snapshot for today:\n\n• 3 open agenda items for your 1-1 with Mateo Lee\n• 1 mentor pairing pending your approval\n• Sophia Kim's leadership objective hit milestone 2 of 4\n• Comp budget is tracking 4% under plan for Q2",
  "What needs my decision?":
    "2 items are waiting on you:\n\n1. Approve the AI / ML Model Operations mentor pairing (92% match, requested 2d ago)\n2. Respond to Mateo Lee on the Director, Data Operations career interest (sent 28d ago)",
  "Recent activity across agents":
    "Last 24h across your agent packs:\n\n• Skills architect inferred 4 new proficiency lifts\n• Compensation agent flagged 2 off-cycle adjustments to review\n• Embark Navigator advanced 8 learners on the Q2 Data Analyst track\n• Team health surfaced 1 new burnout signal on the Engineering pod",
  "Who's at risk this week?":
    "3 team members are showing elevated risk signals:\n\n• Priya N. — workload spike + missed 1-1s (2 weeks)\n• Jordan W. — declining engagement, no recent goal updates\n• Alex T. — flagged in last pulse survey for growth concerns",
};

const defaultResponse =
  "Here's a quick view based on your live People Graph context. Want me to dig deeper into a specific team, role, or timeframe?";

type Message = { role: "user" | "assistant"; content: string };

export function AskAIOverlayV3({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendPrompt = (prompt: string) => {
    const reply = mockResponses[prompt] ?? defaultResponse;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: reply },
    ]);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendPrompt(text);
    setInput("");
  };

  const hasConversation = messages.length > 0;

  return (
    <div
      className="absolute inset-0 z-30 bg-background flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Ask Cornerstone AI"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(250, 83, 42, 0.12) 0%, rgba(250, 83, 42, 0.04) 40%, transparent 75%)",
      }}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Left starter panel */}
        <aside className="w-[320px] flex-shrink-0 flex flex-col" aria-label="Suggested prompts">
          <div className="h-14 flex items-center justify-between px-5 flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1 -ml-1"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
              style={{ color: "#FA532A" }}
            >
              <Compass size={14} aria-hidden="true" />
              Explore
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-6">
            {groups.map((g) => (
              <div key={g.title} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground">{g.title}</h3>
                <ul className="space-y-2">
                  {g.items.map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => sendPrompt(item)}
                        className="w-full text-left text-sm text-foreground rounded-xl border border-border bg-card px-3.5 py-2.5 hover:border-foreground/30 hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-snug"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <div className="w-px bg-border flex-shrink-0 my-6" aria-hidden="true" />

        {/* Main column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-14 flex items-center justify-end px-6 flex-shrink-0">
            {hasConversation && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
              >
                Clear conversation
              </button>
            )}
          </div>

          {hasConversation ? (
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6">
              <div className="max-w-[760px] mx-auto space-y-6">
                {messages.map((m, idx) =>
                  m.role === "user" ? (
                    <div key={idx} className="flex justify-end">
                      <div
                        className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
                        style={{ backgroundColor: "#FFE6DD", color: "#7A2A12" }}
                      >
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="flex items-start gap-3">
                      <span
                        className="h-8 w-8 rounded-lg inline-flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, #FF8A65 0%, #FA532A 100%)" }}
                        aria-hidden="true"
                      >
                        <Sparkles size={14} className="text-primary-foreground" />
                      </span>
                      <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed flex-1">
                        {m.content}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto flex items-center justify-center px-8">
              <div className="text-center max-w-[640px]">
                <div
                  className="mx-auto mb-6 h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: "linear-gradient(135deg, #FF8A65 0%, #FA532A 100%)" }}
                  aria-hidden="true"
                >
                  <Sparkles size={28} className="text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Hi David, where should we start?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tap a prompt card on the left, or type below to start a fresh thread.
                </p>
              </div>
            </div>
          )}

          <div className="p-6 flex-shrink-0">
            <div className="max-w-[760px] mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <label htmlFor="ask-ai-input-v3" className="sr-only">Ask AI anything</label>
                <input
                  id="ask-ai-input-v3"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything…"
                  className="w-full h-12 pl-5 pr-14 rounded-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-[0_4px_12px_0_rgba(0,0,0,0.04)]"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full inline-flex items-center justify-center text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  style={{ backgroundColor: "#FA532A" }}
                >
                  <ArrowUp size={16} aria-hidden="true" />
                </button>
              </form>
              <p className="mt-3 text-center text-xs text-muted-foreground inline-flex items-center gap-1.5 w-full justify-center">
                <Sparkles size={12} aria-hidden="true" />
                Grounded in your People Graph · 9 sources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
