import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Lock } from "lucide-react";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { useAskAI } from "@/components/embark/AskAIContext";
import { ModuleStatusIcon } from "@/components/embark/ModuleStatusIcon";
import { CompletionSummary } from "@/components/embark/CompletionSummary";
import { InlineExpandRow } from "@/components/embark/InlineExpandRow";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TutorBottomDrawer } from "../home/TutorBottomDrawer";
import { useTutorConversation, type TutorMsg } from "../home/useTutorConversation";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";

function dayPart() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function ModuleRing({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));
  return (
    <div
      className="relative h-[72px] w-[72px] shrink-0 rounded-full"
      style={{
        background: `conic-gradient(hsl(233 100% 39%) ${pct * 3.6}deg, hsl(233 100% 39% / 0.16) 0deg)`,
      }}
      role="img"
      aria-label={`${done} of ${total} modules complete`}
    >
      <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-accent">
        <span className="text-lg font-semibold leading-none text-foreground">{done}</span>
        <span className="mt-0.5 text-[10px] text-muted-foreground">of {total}</span>
      </div>
    </div>
  );
}

const seed: TutorMsg[] = [
  {
    id: "grad-t1",
    role: "tutor",
    timestamp: "Sage · just now",
    text:
      "You're so close, Alex! Just one article left — Dispute Resolution & Appeals — and then you're done. Once you've read it, the Module 4 assessment will unlock. You've got this. 🎓",
  },
];

type Item = {
  name: string;
  type: "Article" | "Assessment";
  status: "completed" | "in_progress" | "locked";
  hint?: string;
  /** Content id used to open the matching content view window. */
  contentId?: string;
};

const module4Items: Item[] = [
  { name: "Claims Submission & Billing Basics", type: "Article", status: "completed", contentId: "claims-submission-billing" },
  { name: "Dispute Resolution & Appeals", type: "Article", status: "in_progress", hint: "Outstanding — not yet read", contentId: "dispute-resolution" },
  { name: "Module 4 Assessment", type: "Assessment", status: "locked", hint: "Complete all articles first" },
];

function CurrentTab() {
  const navigate = useNavigate();
  const [trackOpen, setTrackOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>("mod4");

  const modules = [
    {
      id: "mod1",
      n: 1,
      name: "Client relationships foundations",
      status: "completed" as const,
      tags: "reading · assessment",
      completedDate: "2025-09-08",
      score: 92,
      contentId: "medicare-foundations",
    },
    {
      id: "mod2",
      n: 2,
      name: "Discovery and objectives",
      status: "completed" as const,
      tags: "reading · assessment",
      completedDate: "2025-09-15",
      score: 86,
      contentId: "eligibility-enrolment",
    },
    {
      id: "mod3",
      n: 3,
      name: "Suitability under pressure",
      status: "completed" as const,
      tags: "reading · assessment",
      completedDate: "2025-09-22",
      score: 88,
      contentId: "coverage-determination-cob",
    },
    {
      id: "mod4",
      n: 4,
      name: "Advice documentation",
      status: "in_progress" as const,
      tags: "reading · assessment",
      completedDate: undefined,
      score: undefined,
      contentId: "dispute-resolution",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Program modules */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">Your pathway</h3>
          <p className="text-sm text-muted-foreground">
            IM Intake Cohort A · Matteo Wu · Manager: Phoebe Kapoor
          </p>
        </div>

        <div className="space-y-3">
          {/* Current track section */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <button
              type="button"
              onClick={() => setTrackOpen((v) => !v)}
              aria-expanded={trackOpen}
              aria-controls="graduating-track-list"
              className="w-full text-left bg-card"
            >
              <div className="flex items-center justify-between gap-3 pl-5 pr-2 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-primary">
                      Current path
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-foreground mt-1.5">
                    IM Intake Pathway
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Reading · assessment · 4 modules
                  </div>
                </div>
                <ChevronRight
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
                    trackOpen && "rotate-90",
                  )}
                />
              </div>
            </button>

            {trackOpen && (
              <div id="graduating-track-list" className="divide-y divide-border">
                {modules.map((m) => (
                  <InlineExpandRow
                    key={m.id}
                    isExpanded={expandedId === m.id}
                    onToggle={() => setExpandedId((cur) => (cur === m.id ? null : m.id))}
                    trigger={
                      <div className="flex items-center gap-3 w-full">
                        <ModuleStatusIcon status={m.status} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={cn(
                                "text-sm font-medium truncate",
                                m.status === "in_progress" && "text-primary",
                              )}
                            >
                              {m.n}. {m.name}
                            </span>
                            {m.status === "in_progress" && (
                              <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground flex-shrink-0">
                                In progress
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{m.tags}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {m.status === "completed" && m.score !== undefined && (
                            <>
                              <span className="text-xs font-semibold text-success-dark">
                                {m.score}%
                              </span>
                              {m.completedDate && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(m.completedDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                            </>
                          )}
                          {m.status === "in_progress" && (
                            <span className="text-xs text-muted-foreground">1 outstanding</span>
                          )}
                        </div>
                      </div>
                    }
                    content={
                      m.status === "in_progress" ? (
                        <div className="mt-2 rounded-md bg-card pl-7 pr-4 py-3 space-y-1">
                          {module4Items.map((it) => (
                            <GraduatingItemRow key={it.name} item={it} />
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 rounded-md bg-card pl-7 pr-4 py-3 space-y-3">
                          <CompletionSummary
                            label="This module is complete — you can review it any time."
                            completedDate={m.completedDate}
                            score={m.score}
                          />
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                navigate(
                                  `/learner/graduating/article/${m.contentId}?review=true`,
                                )
                              }
                            >
                              Review content →
                            </Button>
                          </div>
                        </div>
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GraduatingItemRow({ item }: { item: Item }) {
  const navigate = useNavigate();
  const isLocked = item.status === "locked";
  const isCompleted = item.status === "completed";
  const isInProgress = item.status === "in_progress";
  const target = isCompleted
    ? `/learner/graduating/article/${item.contentId ?? "dispute-resolution"}?review=true`
    : `/learner/graduating/article/${item.contentId ?? "dispute-resolution"}`;

  const tooltip = isLocked
    ? "Complete prior sessions to unlock"
    : isCompleted
    ? "Completed — click to review"
    : "In progress — click to continue";

  const RowInner = (
    <div className="flex items-center gap-3 w-full py-2">
      {isLocked ? (
        <Lock className="h-5 w-5 text-muted-foreground" aria-label="Locked" />
      ) : (
        <ModuleStatusIcon status={isCompleted ? "completed" : "in_progress"} />
      )}
      <div className="flex-1 min-w-0 text-left">
        <div className={cn("text-sm truncate", isLocked && "text-muted-foreground")}>
          {item.name}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {isLocked ? "Unlocks when prior sessions are complete" : item.hint ?? item.type}
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {item.type}
        </span>
        {isInProgress && (
          <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            ▶ In progress
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {isLocked ? (
          <div className="cursor-default px-1">{RowInner}</div>
        ) : (
          <button
            type="button"
            onClick={() => navigate(target)}
            className="w-full rounded-md px-1 hover:bg-muted/60 transition-colors cursor-pointer"
          >
            {RowInner}
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export default function GraduatingHome() {
  const conversation = useTutorConversation(seed);
  const askAI = useAskAI();
  const firstName = RATHBONES_USERS.graduating.name.split(" ")[0];

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <PageContainer as="div" className="space-y-8 pb-10 pt-8">
          <header className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Good {dayPart()}, {firstName}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your onboarding
            </h1>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Personalized for you</h2>
              <Badge variant="ai" className="gap-1 border-transparent px-2.5 py-0.5 text-xs font-medium">
                <AskSageIcon size={14} />
                AI
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Investment Manager Full Onboarding Journey</p>
          </header>

          <div className="grid items-stretch gap-4 lg:grid-cols-2">
            <Card className="h-full rounded-2xl border-0 bg-accent p-6 shadow-none sm:p-7">
              <p className="text-sm text-muted-foreground">Where you are now</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Advice documentation
              </h2>
              <div className="mt-6 flex items-center gap-5">
                <ModuleRing done={3} total={4} />
                <ul className="min-w-0 flex-1 space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                    94% complete · Almost there
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary/40" aria-hidden />
                    In progress · Dispute Resolution &amp; Appeals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50" aria-hidden />
                    Average score 88%
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-foreground/30" aria-hidden />
                    4 days until 30 September
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">↑ +12% this week</p>
            </Card>

            <div className="flex flex-col gap-4">
              <Card className="flex-1 rounded-2xl border-border p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">Where you left off</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  Dispute Resolution &amp; Appeals
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Claims &amp; Billing · Outstanding — not yet read
                </p>
                <Button asChild className="mt-6 px-5">
                  <Link to="/learner/graduating/article/dispute-resolution">Continue</Link>
                </Button>
              </Card>

              <Card className="rounded-2xl border-0 bg-accent p-5 shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <AskSageIcon size={18} className="text-primary" />
                      Ask Sage
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Get guidance on your next step, anytime.
                    </p>
                  </div>
                  <Button className="px-5" onClick={askAI.toggleAskAI}>
                    Start a conversation
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <CurrentTab />
        </PageContainer>
      </div>
      <TutorBottomDrawer conversation={conversation} />
    </>
  );
}
