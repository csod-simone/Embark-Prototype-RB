import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Clock, Lock, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
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
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { BrandBar } from "@/components/embark/BrandBar";

type Answers = Record<number, string>;

const STEP_LABELS: Record<number, string> = {
  1: "WELCOME",
  2: "BASELINE ASSESSMENT",
  3: "BASELINE ASSESSMENT",
  4: "BASELINE ASSESSMENT",
  5: "BASELINE ASSESSMENT",
  6: "BASELINE ASSESSMENT",
};

const TOTAL_STEPS = 6;

export default function BaselineAssessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [exitOpen, setExitOpen] = useState(false);

  const isQuestionStep = step >= 3 && step <= 5;
  const canAdvance = !isQuestionStep || !!answers[step];

  const handleNext = () => {
    if (step === TOTAL_STEPS) {
      try {
        localStorage.setItem("embark:baseline-complete", "1");
      } catch {}
      navigate("/learner/home");
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const primaryLabel =
    step === TOTAL_STEPS
      ? "Start my journey →"
      : step === 5
      ? "See my results →"
      : "Next →";

  return (
    <div className="min-h-screen w-full bg-muted/50 flex flex-col">
      <BrandBar />
      <div className="flex-1 w-full flex items-center justify-center p-4">
      <PageContainer as="div" noPadding className="max-w-[800px] bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border">
          <div className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
            Embark · {STEP_LABELS[step]}
          </div>
          <button
            type="button"
            onClick={() => setExitOpen(true)}
            aria-label="Exit assessment"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && (
            <QuestionStep
              sectionLabel="Medicare Basics"
              question="Which of the following describes the Medicare Part B annual deductible for 2026?"
              options={[
                { id: "A", label: "$185" },
                { id: "B", label: "$226" },
                { id: "C", label: "$240" },
                { id: "D", label: "$298" },
              ]}
              value={answers[3]}
              onChange={(v) => setAnswers((a) => ({ ...a, 3: v }))}
              showWhyBanner
            />
          )}
          {step === 4 && (
            <QuestionStep
              sectionLabel="Benefits and Coverage"
              question="A member has both Medicare and a current employer group plan. Their employer has 30 employees. Which plan is the primary payer?"
              options={[
                { id: "A", label: "Medicare is always primary" },
                { id: "B", label: "The employer group plan is primary" },
                { id: "C", label: "It depends on the member's age" },
                { id: "D", label: "Medicaid is primary" },
              ]}
              value={answers[4]}
              onChange={(v) => setAnswers((a) => ({ ...a, 4: v }))}
            />
          )}
          {step === 5 && (
            <QuestionStep
              sectionLabel="Claims and Billing"
              question="A member calls about an Explanation of Benefits (EOB) that shows a higher patient responsibility than expected. What is the first thing you should verify?"
              options={[
                { id: "A", label: "Whether the member has met their annual deductible" },
                { id: "B", label: "Whether the provider is in-network" },
                { id: "C", label: "Whether the claim has been processed correctly and COB has been applied" },
                { id: "D", label: "Whether the member is enrolled in a Medigap plan" },
              ]}
              value={answers[5]}
              onChange={(v) => setAnswers((a) => ({ ...a, 5: v }))}
            />
          )}
          {step === 6 && <Step6 />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <StepDots current={step} total={TOTAL_STEPS} />
          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canAdvance}>
              {primaryLabel}
            </Button>
          </div>
        </div>
      </PageContainer>
      </div>

      <AlertDialog open={exitOpen} onOpenChange={setExitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
            <AlertDialogDescription>
              You can retake this assessment later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue assessment</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/learner/home")}>
              Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const isCurrent = idx === current;
        const isDone = idx < current;
        return (
          <span
            key={idx}
            className={cn(
              "inline-flex items-center justify-center h-2 w-2 rounded-full transition-colors",
              isCurrent && "bg-primary w-6",
              isDone && "bg-primary",
              !isCurrent && !isDone && "bg-muted",
            )}
          />
        );
      })}
    </div>
  );
}

function InfoRow({ icon: Icon, title, sub }: { icon: typeof Clock; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-secondary-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-0.5">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Your baseline assessment is next
        </h2>
        <p className="text-sm text-muted-foreground">
          After this welcome, you'll take a short baseline assessment. It helps Embark understand
          what you already know — so your journey is right-sized from the start.
        </p>
      </div>
      <div className="border-t border-border" />
      <div className="space-y-4">
        <div className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
          Before you begin
        </div>
        <div className="space-y-4">
          <InfoRow
            icon={Clock}
            title="Takes about 8–10 minutes"
            sub="A focused diagnostic across all key knowledge areas."
          />
          <InfoRow
            icon={Lock}
            title="Can only be taken once"
            sub="Answer based on your current understanding — not what looks right."
          />
          <InfoRow
            icon={Route}
            title="Shapes your entire journey"
            sub="Results determine which modules to skip, prioritise, or deepen."
          />
        </div>
      </div>
    </div>
  );
}

function AreaCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-4 space-y-1">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}

function Step2() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          What areas does it cover?
        </h2>
        <p className="text-sm text-muted-foreground">
          The assessment covers the breadth of knowledge relevant to your role as a Customer Service
          Representative.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AreaCard
          title="Medicare Basics"
          sub="Part A, Part B, eligibility, enrollment, and plan types."
        />
        <AreaCard
          title="Benefits and Coverage"
          sub="Coverage determination, COB, prior authorisation, and cost-sharing."
        />
        <AreaCard
          title="Claims and Billing"
          sub="Claims processing, EOBs, member billing, and dispute handling."
        />
        <AreaCard
          title="Member Handling"
          sub="Call management, empathy, escalations, and compliance."
        />
      </div>
    </div>
  );
}

function QuestionStep({
  sectionLabel,
  question,
  options,
  value,
  onChange,
  showWhyBanner = false,
}: {
  sectionLabel: string;
  question: string;
  options: { id: string; label: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
  showWhyBanner?: boolean;
}) {
  return (
    <div className="space-y-4">
      {showWhyBanner && (
        <LeftBorderCard borderVariant="brand" padding="sm">
          <div className="text-sm text-muted-foreground">
            Ten questions across four knowledge areas. Your answers will shape your journey —
            modules you demonstrate mastery of will be skipped or set to review-only.
          </div>
        </LeftBorderCard>
      )}
      <div className="text-xs font-semibold tracking-[0.14em] text-muted-foreground">
        {sectionLabel}
      </div>
      <div className="text-base font-medium text-foreground">{question}</div>
      <div className="space-y-2">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "w-full text-left flex items-center gap-3 rounded-md border p-3 transition-colors",
                selected
                  ? "border-primary border-2 bg-secondary/40"
                  : "border-border hover:bg-muted/40",
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center h-4 w-4 rounded-full border-2 flex-shrink-0",
                  selected ? "border-primary" : "border-muted-foreground/40",
                )}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
              </span>
              <span className="text-sm text-foreground">
                <span className="font-medium mr-2">{opt.id}.</span>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultRow({
  area,
  chip,
  chipVariant,
  note,
}: {
  area: string;
  chip: string;
  chipVariant: "neutral" | "priority" | "success";
  note?: string;
}) {
  const chipClass =
    chipVariant === "priority"
      ? "bg-primary text-primary-foreground hover:bg-primary"
      : chipVariant === "success"
      ? "bg-success-dark/15 text-success-dark border border-success-dark/30 hover:bg-success-dark/15"
      : "bg-muted text-muted-foreground hover:bg-muted";
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-b-0">
      <div className="space-y-1">
        <div className="text-sm font-medium text-foreground">{area}</div>
        {note && <div className="text-xs text-muted-foreground">{note}</div>}
      </div>
      <Badge className={cn("flex-shrink-0", chipClass)}>{chip}</Badge>
    </div>
  );
}

function Step6() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Here's how your journey has been shaped
        </h2>
        <p className="text-sm text-muted-foreground">
          Based on your responses, Sage has personalised your learning path. Some modules have been
          adjusted to focus on the areas that matter most for you.
        </p>
      </div>

      <div className="rounded-md border border-border bg-background px-4">
        <ResultRow area="Medicare Basics" chip="Foundation module included" chipVariant="neutral" />
        <ResultRow
          area="Benefits and Coverage"
          chip="Priority area — deepened"
          chipVariant="priority"
          note="We'll spend more time here based on your responses."
        />
        <ResultRow
          area="Claims and Billing"
          chip="Assessment-only"
          chipVariant="success"
          note="You demonstrated strong familiarity — you'll go straight to a check rather than full sessions."
        />
        <ResultRow area="Member Handling" chip="Foundation module included" chipVariant="neutral" />
      </div>

      <LeftBorderCard borderVariant="brand">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="h-7 w-7 rounded-full inline-flex items-center justify-center bg-primary/15 text-primary"
            >
              <AskSageIcon size={14} />
            </div>
            <span className="text-sm font-medium text-foreground">Sage</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Hi Jordan — I've reviewed your baseline results. Your journey starts with Medicare
            Basics and Benefits Coverage. I'll be with you throughout, so ask me anything as you go.
          </p>
        </div>
      </LeftBorderCard>
    </div>
  );
}
