import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { CompletionSummary } from "@/components/embark/CompletionSummary";
import { TextPane } from "@/components/embark/session/ModalityPanes";

import { sessions } from "@/data/mockData";
import { useAssessmentAttempts } from "@/hooks/use-assessment-attempts";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { useOrganisation } from "@/hooks/use-organisation";
import { applyAdaptation, useJourneyAdaptation } from "@/hooks/use-journey-adaptation";
import { buildMod3Flow, routeForSession } from "@/pages/embark/learner/home/JourneyTabs";
import { SessionShell } from "@/components/embark/SessionShell";
import { useScrollComplete } from "@/hooks/use-scroll-complete";
import { buildMod3SessionSteps } from "@/components/embark/session/sessionSteps";
import { useLearnerJourneySteps } from "@/components/embark/session/learnerJourneySteps";

const options = [
  { id: "A", label: "100%" },
  { id: "B", label: "80%" },
  { id: "C", label: "60%" },
  { id: "D", label: "50%" },
];

const DEFAULT_OPTIONS = [
  { id: "A", label: "100%" },
  { id: "B", label: "80%" },
  { id: "C", label: "60%" },
  { id: "D", label: "50%" },
];

type ArticleBlock = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  ordered?: boolean;
};

type ArticleLesson = {
  blocks: ArticleBlock[];
  check: string;
  options: { id: string; label: string }[];
  correct: string;
  incorrect: string;
};

const CHECK_OPTIONS = [
  { id: "A", label: "Quote a cost from memory" },
  { id: "B", label: "Check the mandate and the risk budget first" },
  { id: "C", label: "Place the instruction on the call" },
  { id: "D", label: "Promise the value will not fall" },
];

const FOUNDATIONS: ArticleLesson = {
  blocks: [
    {
      heading: "How a client relationship starts",
      paragraphs: [
        "At the start of the relationship you explain how the portfolio will be constructed, and you keep that separate from the suitability conversation. Construction is the mandate. Suitability is whether a later request sits inside it.",
        "You also agree the annual risk budget and the fee share before you quote a cost.",
      ],
    },
    {
      heading: "Risk budget and fee share",
      paragraphs: ["Once the annual risk budget has been met, the standard fee share is:"],
      bullets: [
        "Investment Management pays 80%",
        "The client pays 20%",
        "Do not quote a cost until you have checked the mandate",
      ],
    },
    {
      heading: "Who is primary",
      paragraphs: [
        "A retired client who also has a former employer's arrangement is usually covered first by Investment Management. Confirm that before you describe how a request will be paid.",
      ],
    },
  ],
  check: "Once the annual risk budget has been met, what share does Investment Management pay?",
  options: DEFAULT_OPTIONS,
  correct: "Investment Management pays 80%. The client pays the remaining 20% fee share.",
  incorrect: "Once the annual risk budget is met, Investment Management pays 80% and the client pays 20%.",
};

const DISCOVERY: ArticleLesson = {
  blocks: [
    {
      heading: "Objectives before products",
      paragraphs: [
        "A discovery conversation names what the client needs the money to do, when they need it, and what loss would be unacceptable. You do not discuss a product until those three points are clear.",
      ],
    },
    {
      heading: "Capacity for loss",
      paragraphs: [
        "Capacity for loss is what the client can bear to lose without failing the objective. It comes before any recommendation so the portfolio matches the objective rather than a product the client saw elsewhere.",
      ],
      bullets: [
        "Ask what the goal is for",
        "Ask when the money is needed",
        "Ask what loss would be unacceptable",
      ],
    },
    {
      heading: "Close the conversation",
      paragraphs: [
        "Restate the objective in everyday words and agree one dated next step. If a risk term did not land, say the downside again and ask the client to say it back.",
      ],
    },
  ],
  check: "What must you confirm before you discuss a product?",
  options: [
    { id: "A", label: "The product they saw in the news" },
    { id: "B", label: "The objective and capacity for loss" },
    { id: "C", label: "How fast the trade can be placed" },
    { id: "D", label: "Which colleague spoke to them last" },
  ],
  correct: "Confirm the objective and the client's capacity for loss before any product conversation.",
  incorrect: "The objective and capacity for loss come first. A product name is not the next question.",
};

const SUITABILITY: ArticleLesson = {
  blocks: [
    {
      heading: "Pressure is not a reason to proceed",
      paragraphs: [
        "If a client asks to move everything to cash on the call, acknowledge how anxious it feels and return to the objective and capacity for loss. Do not place the instruction to calm them down.",
      ],
    },
    {
      heading: "An unsuitable instruction",
      paragraphs: [
        "When the request sits outside the mandate, say that you are not carrying it out, explain why, and agree a dated follow-up. Do not promise that the value will not fall.",
      ],
    },
  ],
  check: "A client under pressure asks you to sell everything today. What do you do first?",
  options: CHECK_OPTIONS,
  correct: "Acknowledge the concern, then return to the objective and capacity for loss.",
  incorrect: "You do not execute the instruction on the call. Go back to the objective and what the client can bear to lose.",
};

const DOCUMENTATION: ArticleLesson = {
  blocks: [
    {
      heading: "The suitability file note",
      paragraphs: [
        "The file note is what makes the meeting auditable. It records the objective, capacity for loss, the instruction the client asked for, what was agreed, and the follow-up date.",
      ],
    },
    {
      heading: "What you tell the client",
      paragraphs: [
        "If you are not proceeding, say so plainly and give the dated next step. An open-ended offer to talk again is not a close.",
      ],
      bullets: [
        "Objective and capacity for loss",
        "The instruction asked for",
        "What was agreed, or that it was declined",
        "The follow-up date",
      ],
    },
  ],
  check: "What belongs in the suitability file note?",
  options: [
    { id: "A", label: "Only the product name" },
    { id: "B", label: "The objective, the decision, and the follow-up date" },
    { id: "C", label: "A promise that the value will not fall" },
    { id: "D", label: "Nothing, if the client sounded calm" },
  ],
  correct: "Objectives, capacity for loss, the instruction asked for, what was agreed, and the follow-up date.",
  incorrect: "A product name on its own is not a file note. Record the objective, the decision, and the dated next step.",
};

const ARTICLES: Record<string, ArticleLesson> = {
  "mc-c1": FOUNDATIONS,
  "mc-c2": DISCOVERY,
  "mc-c3": SUITABILITY,
  "mc-c4": DOCUMENTATION,
};

export default function ArticleSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isReview = searchParams.get("review") === "true";
  const completed = sessions.find((s) => s.id === "s2");
  const { progress, markArticleDone } = useModule3Progress();
  const { paused } = useAssessmentAttempts();
  const { org } = useOrganisation();
  const { state: adaptation, settleContent } = useJourneyAdaptation();
  const itemFromQuery = searchParams.get("item");
  const openContent =
    org === "rathbones"
      ? applyAdaptation(buildMod3Flow(progress, org), adaptation).find(
          (session) => session.status === "in_progress" && session.sessionKind === "content",
        )
      : undefined;
  const contentItemId = itemFromQuery ?? openContent?.id ?? null;
  const journey = useLearnerJourneySteps(org === "rathbones" ? contentItemId : null);
  const contentSession =
    org === "rathbones" && contentItemId
      ? applyAdaptation(buildMod3Flow(progress, org), adaptation).find((session) => session.id === contentItemId)
      : undefined;
  const lesson =
    org === "rathbones" ? ARTICLES[contentItemId ?? ""] ?? FOUNDATIONS : null;
  const checkOptions = lesson?.options ?? DEFAULT_OPTIONS;
  const journeyPaused = org === "rathbones" && paused.length > 0;
  const sectionTitle =
    org === "rathbones" && contentSession ? contentSession.name : "Coverage Determination";
  const sectionSubtitle =
    org === "rathbones" && journey?.positionLabel
      ? `IM Intake Pathway · ${journey.positionLabel}`
      : "Benefits Navigation · Session 1 of 4 · Article · ~8 min";
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pct: scrollPct, reached, onScroll } = useScrollComplete();

  const canContinue = reached;

  const [checkOpen, setCheckOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === "B";

  const steps = journey?.steps ?? buildMod3SessionSteps("s-article", progress, navigate);

  const resetCheck = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const openCheck = () => {
    resetCheck();
    setCheckOpen(true);
  };

  const completeAndGo = () => {
    markArticleDone();
    setCheckOpen(false);
    if (org === "rathbones" && contentItemId) {
      settleContent(contentItemId);
      const completed = adaptation.completed.includes(contentItemId)
        ? adaptation
        : { ...adaptation, completed: [...adaptation.completed, contentItemId] };
      const next = applyAdaptation(buildMod3Flow(progress, org), completed).find(
        (session) => session.status === "in_progress",
      );
      navigate(next ? routeForSession(next) : "/learner/home");
      return;
    }
    navigate("/learner/session/s-video");
  };

  return (
    <>
      <SessionShell
        title={sectionTitle}
        subtitle={sectionSubtitle}
        onBack={() => navigate("/learner/home")}
        steps={steps}
        stepsMeta={journey?.stepsMeta ?? "Benefits Navigation · Module 3"}
        positionLabel={journey?.positionLabel ?? "Session 1 of 4"}
        prev={journeyPaused ? null : undefined}
        headerNavTabs={isReview}
        next={
          isReview
            ? { label: "Completed", disabled: true }
            : {
                label: "Next",
                onClick: openCheck,
                disabled: !canContinue,
                disabledReason: "Read to the end of the article to continue.",
              }
        }
        sagePrompts={[
          { label: "Summarise this article" },
          { label: "Difference between Part A and Part B?" },
          { label: "Give me an example of COB" },
          { label: "What's tested?" },
          { label: "Raise a hand 🤚" },
        ]}
      >
        {isReview && (
          <div className="px-4 sm:px-6 pt-4 flex-shrink-0">
            <CompletionSummary completedDate={completed?.completedDate} />
          </div>
        )}
        {!isReview && (
          <div className="h-1 w-full bg-muted flex-shrink-0">
            <div className="h-1 bg-primary transition-all" style={{ width: `${scrollPct}%` }} />
          </div>
        )}

          <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
            <TextPane>
              <h1 className="text-2xl font-bold">
                {org === "rathbones" && contentSession
                  ? contentSession.name
                  : "Understanding Coverage Determination"}
              </h1>

              {lesson
                ? lesson.blocks.map((block) => (
                    <section key={block.heading} className="space-y-3">
                      <h2 className="text-lg font-bold">{block.heading}</h2>
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {block.bullets && (
                        <ul className="list-disc pl-5 space-y-1">
                          {block.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))
                : (
                <>
              <section className="space-y-3">
                <h2 className="text-lg font-bold">What is Coverage Determination?</h2>
                <p>
                  Coverage determination is the process Medicare uses to decide whether a specific
                  item or service is covered under a member's plan, and how much will be paid. For a
                  CSR, understanding coverage determination means you can accurately explain to a
                  member whether their treatment or prescription is covered before they receive it.
                </p>
                <p>
                  Every coverage decision follows a structured process: Medicare reviews whether the
                  service is medically necessary, whether it falls within the member's benefits, and
                  whether any prior authorisation is required.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold">Medicare Part B — The Basics</h2>
                <p>
                  Part B covers two categories of services: medically necessary services (doctor
                  visits, outpatient care, durable medical equipment) and preventive services
                  (screenings, vaccinations, counselling).
                </p>
                <p>For Part B services, the standard cost-sharing structure is:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Annual deductible: $240 (2026)</li>
                  <li>After deductible: Medicare pays 80% of the approved amount</li>
                  <li>Member responsibility: 20% of the approved amount (coinsurance)</li>
                </ul>
                <p>
                  If a member has a Medicare Supplement (Medigap) plan, the secondary plan may cover
                  all or part of the 20% coinsurance, depending on the plan type.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold">Coordination of Benefits (COB)</h2>
                <p>
                  When a member has both Medicare and a secondary insurance plan, the coordination
                  of benefits rules determine which plan pays first (the "primary" payer) and which
                  pays second (the "secondary" payer).
                </p>
                <p>
                  For most Medicare members, Medicare is always the primary payer. The secondary
                  plan steps in after Medicare has processed the claim and paid its portion.
                </p>
                <p>Key COB rules to remember:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Always verify whether the member has secondary coverage before quoting out-of-pocket costs.</li>
                  <li>If the member has employer-sponsored coverage through a current employer with 20+ employees, the employer plan is primary and Medicare is secondary.</li>
                  <li>If the member is retired or the employer has fewer than 20 employees, Medicare is primary.</li>
                  <li>Medicaid is always the payer of last resort — it pays after Medicare and all other insurance.</li>
                </ol>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold">Prior Authorisation</h2>
                <p>
                  Some services require prior authorisation (PA) before Medicare or the member's
                  plan will cover them. If a member receives a service that required PA and did not
                  get it, they may be responsible for the full cost.
                </p>
                <p>As a CSR, you are not responsible for obtaining PA — that is the provider's responsibility. However, you should:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Inform the member that certain services may require PA</li>
                  <li>Direct them to have their provider contact the plan before the service is rendered</li>
                  <li>Never guarantee coverage for a service that may require PA</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-bold">What to tell a member</h2>
                <p>When a member asks "Is this covered?", follow this structure:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Verify the member's plan and effective date</li>
                  <li>Check for active prior authorisation requirements</li>
                  <li>Confirm COB — is Medicare primary or secondary?</li>
                  <li>Quote the applicable cost-sharing: deductible status, coinsurance percentage</li>
                  <li>If uncertain: "I want to make sure I give you accurate information — let me check that for you."</li>
                </ol>
                <p>Never guess. If you are not certain, place the member on a courteous hold and verify.</p>
              </section>
                </>
                )}
            </TextPane>
          </div>
      </SessionShell>

      {/* Knowledge check modal */}
      <Dialog open={checkOpen} onOpenChange={setCheckOpen}>
        <DialogContent className="max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Quick check before you continue</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              {lesson
                ? lesson.check
                : "A Medicare member with a Medigap plan visits their doctor. After the Part B deductible, what percentage does Medicare pay?"}
            </p>

            {!submitted && (
              <div className="space-y-2">
                {checkOptions.map((opt) => {
                  const isSel = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelected(opt.id)}
                      className={cn(
                        "w-full text-left rounded-lg border bg-background px-4 py-3 min-h-[44px] transition-colors flex gap-3 items-start",
                        isSel
                          ? "border-primary border-2 bg-secondary/40"
                          : "border-border hover:bg-muted",
                      )}
                    >
                      <span className="text-sm font-semibold text-muted-foreground w-5 flex-shrink-0">
                        {opt.id}
                      </span>
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {submitted && isCorrect && (
              <LeftBorderCard borderVariant="success" padding="sm">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-success-dark">✓ Correct</span> — {lesson ? lesson.correct : "Medicare pays 80% of the approved amount after the deductible. Medigap may cover the remaining 20%."}
                </p>
              </LeftBorderCard>
            )}
            {submitted && !isCorrect && (
              <LeftBorderCard borderVariant="warning" padding="sm">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-warning-dark">✗ Not quite</span> — {lesson ? lesson.incorrect : "Medicare pays 80% of the approved amount after the deductible is met. The member is responsible for the remaining 20% unless they have a Medigap plan."}
                </p>
              </LeftBorderCard>
            )}

            {!submitted && (
              <Button
                className="w-full"
                disabled={!selected}
                onClick={() => setSubmitted(true)}
              >
                Submit answer
              </Button>
            )}

            {submitted && isCorrect && (
              <Button className="w-full" onClick={completeAndGo}>
                {org === "rathbones" ? "Continue" : "Continue to video →"}
              </Button>
            )}

            {submitted && !isCorrect && (
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={resetCheck}>
                  Try again
                </Button>
                <Button className="flex-1" onClick={completeAndGo}>
                  {org === "rathbones" ? "Continue" : "Continue anyway →"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
