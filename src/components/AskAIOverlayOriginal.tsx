import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Sparkles, MessageSquare, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartBarInline } from "@/components/smart-teaming/SmartBar";

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
      "Data pipeline automation impact",
    ],
  },
  {
    title: "Workforce value",
    items: [
      "Biggest cost lever right now",
      "Data Ops insourcing case",
      "Span of control opportunities",
      "Contractor consolidation plays",
    ],
  },
  {
    title: "Embark · Coach",
    items: [
      "Cohort health summary",
      "Hands raised pending",
      "New-hire readiness on Day 12",
      "Performance coaching status",
    ],
  },
  {
    title: "Mobility",
    items: [
      "Best internal candidates this week",
      "Arjun Mehta match details",
      "Open reqs closing soon",
      "Director, Data Operations candidates",
    ],
  },
  {
    title: "Goals",
    items: [
      "What did the Goal Aligner change today?",
      "Misaligned drafts pending review",
      "Q2 sign-offs needed",
      "Pillar progress this quarter",
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
  "Build an offer for a new hire":
    "I can draft an offer. To get started I'll need:\n\n• Role and level (e.g. Senior Data Analyst, L4)\n• Location\n• Target start date\n\nOnce shared, I'll pull the current pay band, market data, and recommended base + equity range.",
  "Open a new req with pay band and market info":
    "Ready to open a req. Confirm:\n\n• Role: Senior Data Analyst\n• Org: Data Operations · NY\n• Pay band P3: $128k–$162k base\n• Market 50th percentile: $141k\n\nShall I create the requisition and route to Mateo Lee for approval?",
  "Look up a payband and market range for a role":
    "Which role and location? For example:\n\n• Senior Data Analyst · NY → Band P3: $128k–$162k · Market 50p: $141k\n• Data Operations Manager · NY → Band M2: $158k–$198k · Market 50p: $176k",
  "Pressure-test an offer":
    "Share the offer details (role, base, bonus, equity, location) and I'll compare against:\n\n• Internal pay band position\n• Market 25/50/75 percentiles\n• Recent accepted offers for similar roles\n• Internal equity vs current team",
  "Review off-cycle adjustments to consider":
    "2 off-cycle adjustments worth reviewing:\n\n• Sophia Kim — 6% increase, sustained high performance + retention risk\n• Marcus T. — 4% increase, scope expansion after team reorg\n\nBoth fit within your remaining Q2 comp budget.",
  "Check my comp budget and recent activity":
    "Q2 comp budget:\n\n• Allocated: $480k\n• Spent: $312k (65%)\n• Remaining: $168k\n\nRecent activity: 4 merit increases, 1 promotion adjustment, 2 new hires offered.",
  "Director, Data Operations succession bench":
    "Top 3 internal candidates for Director, Data Operations:\n\n1. Sophia Kim — readiness 80%, 2 skill gaps\n2. Mateo Lee — readiness 72%, 3 skill gaps\n3. Priya N. — readiness 65%, 4 skill gaps + leadership exposure",
  "Critical skills gaps in Data & Engineering":
    "Top 3 critical gaps vs role demand:\n\n• AI / ML Model Operations — 38% coverage (target 70%)\n• Data Governance — 52% coverage (target 75%)\n• Cloud Cost Optimization — 44% coverage (target 65%)",
  "Where are we strongest in skills?":
    "Your strongest skill clusters relative to peer benchmarks:\n\n• SQL & Analytical Modeling — 92% coverage\n• Stakeholder Communication — 87% coverage\n• Experimentation & A/B Testing — 84% coverage",
  "Aspirants for Sr Data Analyst":
    "5 internal aspirants for Sr Data Analyst:\n\n• Jordan W. — 91% match, NY\n• Priya N. — 88% match, remote\n• Alex T. — 84% match, NY\n• Riya S. — 79% match, SF\n• Daniel O. — 76% match, remote",
  "Where is AI augmenting roles?":
    "Top 3 roles seeing meaningful AI augmentation in the last 90d:\n\n• Data Analyst — 28% of routine tasks now AI-assisted\n• Customer Support — 22% reduction in handle time\n• Recruiting Coordinator — 35% of scheduling automated",
  "Mercury LLM adoption status":
    "Mercury LLM rollout:\n\n• Active users: 412 / 540 (76%)\n• Weekly active: 318\n• Top use cases: drafting, summarization, code review\n• Sentiment: 4.2 / 5 in last pulse",
  "Roles ready for redesign":
    "3 roles where task mix has drifted enough to warrant a redesign:\n\n• Data Analyst — 31% task-mix change\n• Marketing Operations Specialist — 27% change\n• Recruiting Coordinator — 24% change",
};

const defaultResponse =
  "Here's a quick view based on your live People Graph context. Want me to dig deeper into a specific team, role, or timeframe?";

const starterCards: { category: string; prompt: string }[] = [
  { category: "Waiting on you", prompt: "What 4 workforce actions need my attention today?" },
  { category: "Hiring risk", prompt: "Why is hiring risk flagged and which reqs are affected?" },
  { category: "Team support", prompt: "Which 5 employees may need support and why?" },
  { category: "Goals", prompt: "Show me goals on track and any that are slipping" },
  { category: "Skills", prompt: "Where is skill readiness improving across my org?" },
  { category: "Stability", prompt: "What's keeping the workforce stable this week?" },
];

type Message = { role: "user" | "assistant"; content: string };

const chatHistory = [
  "Why is hiring risk flagged?",
  "Employees needing support",
  "Goals slipping this quarter",
  "Skill readiness trends",
];

const chatHistoryConversations: Record<string, Message[]> = {
  "Why is hiring risk flagged?": [
    { role: "user", content: "Why is hiring risk flagged this week?" },
    { role: "assistant", content: "Hiring risk is elevated because 4 priority reqs in Data & Engineering have been open for more than 45 days, and 2 finalists declined offers citing comp gaps." },
    { role: "user", content: "Which reqs are most at risk?" },
    { role: "assistant", content: "The top 3:\n\n• Sr Data Analyst · NY — 62 days open, 1 finalist\n• ML Engineer · Remote — 71 days open, no finalists\n• Data Ops Manager · NY — 48 days open, 2 in final round" },
    { role: "user", content: "What's driving the offer declines?" },
    { role: "assistant", content: "Both declines cited base pay 8–12% below their competing offers. Market 75p has shifted up 6% in the last quarter for these roles." },
    { role: "user", content: "Recommended next step?" },
    { role: "assistant", content: "Refresh pay bands for ML Engineer and Sr Data Analyst against current market 75p, and pre-approve a 5% flex range for finalists. I can draft the proposal for Mateo Lee." },
  ],
  "Employees needing support": [
    { role: "user", content: "Who on my team may need support right now?" },
    { role: "assistant", content: "5 employees are showing elevated signals:\n\n• Priya N. — workload spike, missed 1-1s\n• Jordan W. — declining engagement\n• Alex T. — flagged in last pulse\n• Marcus T. — scope expansion stress\n• Riya S. — no recent goal updates" },
    { role: "user", content: "Tell me more about Priya." },
    { role: "assistant", content: "Priya's calendar load is up 38% over 2 weeks, she's skipped her last 3 1-1s with Mateo, and her last pulse response dropped from 4.6 to 3.2 on workload sustainability." },
    { role: "user", content: "What action would you suggest?" },
    { role: "assistant", content: "A direct 1-1 this week to reset priorities, offload the Q2 dashboards migration to Daniel O., and consider a recovery week. Want me to draft the message to Mateo?" },
    { role: "user", content: "Yes, draft it." },
    { role: "assistant", content: "Draft ready in your inbox. It frames the concern, suggests reassigning the migration, and proposes a recovery week starting next Monday." },
  ],
  "Goals slipping this quarter": [
    { role: "user", content: "Which goals are slipping this quarter?" },
    { role: "assistant", content: "3 team-level goals are off pace:\n\n• Reduce data pipeline incidents 30% — currently at 12%\n• Launch unified metrics layer — 2 weeks behind\n• Improve analyst NPS to 70 — stuck at 58" },
    { role: "user", content: "What's blocking the metrics layer?" },
    { role: "assistant", content: "Dependency on the new warehouse migration, which slipped 3 weeks due to vendor delays. Two engineers are also split across the AI rollout." },
    { role: "user", content: "Can we recover by end of quarter?" },
    { role: "assistant", content: "Tight but possible if we pull Daniel O. fully onto the metrics layer and defer the AI rollout polish work to Q3. Net impact: low risk to AI launch readiness." },
    { role: "user", content: "Make that recommendation." },
    { role: "assistant", content: "Recommendation logged and routed to Mateo Lee for sign-off. I'll track the decision and update goal forecasts when confirmed." },
  ],
  "Skill readiness trends": [
    { role: "user", content: "How is skill readiness trending across my org?" },
    { role: "assistant", content: "Overall readiness is up 4 points QoQ to 71%. Strongest lift in SQL & Modeling (+7) and Stakeholder Comms (+5). Biggest drag remains AI / ML Model Ops at 38%." },
    { role: "user", content: "Where is the AI / ML gap concentrated?" },
    { role: "assistant", content: "78% of the gap sits in the Data Operations and Analytics pods. Only 4 of 22 analysts have completed the Mercury LLM ops track." },
    { role: "user", content: "What's the fastest way to close it?" },
    { role: "assistant", content: "Cohort-based learning: enroll 12 analysts in the next Mercury cohort, pair each with a mentor from Engineering, and tie completion to Q3 goal credit." },
    { role: "user", content: "Cost and timeline?" },
    { role: "assistant", content: "$28k in learning credits, 10 weeks end-to-end. Projects a readiness lift of +14 points on AI / ML Model Ops by Q4. Want me to open the cohort?" },
  ],
};

export function AskAIOverlayOriginal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { pathname } = useLocation();
  const isCombinedRoute = pathname === "/combined";

  const sendPrompt = (prompt: string) => {
    const reply = mockResponses[prompt] ?? defaultResponse;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: reply },
    ]);
  };

  const handleSendMessage = (text: string) => {
    sendPrompt(text);
  };

  const startNewChat = () => {
    setMessages([]);
    setShowLibrary(false);
    setSelectedChat(null);
  };

  const hasConversation = messages.length > 0;

  const navItem = (
    label: string,
    onClick: () => void,
    active = false,
    Icon?: React.ElementType,
  ) => (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm font-normal pt-2 pl-4 pb-2 pr-2 rounded-[100px] transition flex items-center gap-2 ${
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-foreground/5"
      }`}
    >
      {Icon && <Icon size={24} aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`absolute inset-0 z-30 flex flex-col ${isCombinedRoute ? "bg-background" : "bg-muted"}`}>
      <div className="flex-1 flex overflow-hidden">
        {/* Left starter panel */}
        <aside className="w-[300px] flex-shrink-0 border-r border-border overflow-y-auto px-6 pb-6 pt-[12px] space-y-4">
          <div>
            <Button variant="tertiary" size="sm" onClick={onClose}>
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          </div>

          <nav className="space-y-1">
            {navItem("New chat", startNewChat, false, MessageSquare)}
            {navItem(
              "Explore prompt library",
              () => {
                setShowLibrary(true);
                setSelectedChat(null);
              },
              showLibrary,
              Library,
            )}
          </nav>

          <div className="border-t border-border" />

          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground px-2 pt-3 pb-1">
              Chat history
            </h4>
            {chatHistory.map((title) =>
              navItem(
                title,
                () => {
                  setSelectedChat(title);
                  setShowLibrary(false);
                  setMessages(chatHistoryConversations[title] ?? [
                    { role: "user", content: title },
                    { role: "assistant", content: mockResponses[title] ?? defaultResponse },
                  ]);
                },
                selectedChat === title,
              ),
            )}
          </div>
        </aside>


        {/* Main column */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {showLibrary ? (
            <div className="flex-1 overflow-y-auto px-8 py-10 relative">

              <div className="max-w-[860px] mx-auto space-y-8 relative">
                {groups.map((g) => (
                  <div key={g.title} className="space-y-2">
                    <h3 className="text-base font-semibold text-foreground">{g.title}</h3>
                    <div className="grid grid-cols-2 gap-1">
                      {g.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setShowLibrary(false);
                            sendPrompt(item);
                          }}
                          className="w-full text-left text-sm font-normal py-2 px-4 rounded-[100px] text-muted-foreground bg-background border border-border hover:bg-foreground/5 transition"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : hasConversation ? (
            <div className="flex-1 overflow-y-auto px-8 py-6">
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
                    <div key={idx} className="flex items-start">
                      <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed flex-1">
                        {m.content}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-8 py-10 relative">

              <div className="max-w-[860px] mx-auto relative">
                <h2 className="text-2xl text-foreground mb-2 text-center font-semibold">
                  Hi <span className="text-primary">David</span>, let's chat through your priorities today
                </h2>
                <p className="text-sm text-muted-foreground mb-8 text-center">
                  or ask me anything about your team, cohorts, costs, or goals!
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {starterCards.map((card) => (
                    <button
                      key={card.prompt}
                      onClick={() => sendPrompt(card.prompt)}
                      className="text-left rounded-2xl border border-border bg-background px-4 pt-3 pb-4 ds-card-hover hover:border-foreground/20 transition"
                    >
                      <div className="mb-2">
                        <span className="text-sm font-normal text-muted-foreground tracking-wide">{card.category}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-snug">{card.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}


          <div className="p-6 flex-shrink-0 bg-gradient-to-b from-transparent via-background/60 to-background/80 backdrop-blur-sm">
            <div className="max-w-[760px] mx-auto">
              <SmartBarInline onSend={handleSendMessage} placeholder="Ask anything…" />
              <p className="mt-3 text-center text-xs text-muted-foreground inline-flex items-center gap-1.5 w-full justify-center">
                <Sparkles size={12} aria-hidden="true" />
                Workforce AI · grounded in your People Graph
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

