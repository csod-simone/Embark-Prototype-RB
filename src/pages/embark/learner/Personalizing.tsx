import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { LearnerSurface } from "@/components/embark/layouts/LearnerSurface";
import { cn } from "@/lib/utils";

const STEPS = [
  "Analyzing your results",
  "Evaluating your current readiness and knowledge gaps",
  "Personalizing your learning journey",
  "Identifying content that should be skipped, added, or remain part of your plan",
  "Finalizing your next learning steps",
];

const DURATION = 4000;

function SageEntry() {
  return (
    <div className="rounded-2xl bg-muted/60 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div
          aria-hidden="true"
          className="h-7 w-7 rounded-full inline-flex items-center justify-center bg-primary/15 text-primary"
        >
          <AskSageIcon size={14} />
        </div>
        <span className="text-sm font-semibold text-foreground">Sage</span>
      </div>
      <p className="text-sm italic text-foreground">
        Nice work — I'm reviewing what you just completed and updating your journey so your next
        steps match where you are right now.
      </p>
    </div>
  );
}

export default function LearnerPersonalizing() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { next?: string; itemId?: string; source?: string } | null;
  const nextRoute = state?.next ?? "/learner/home";
  const itemId = state?.itemId;
  const source = state?.source;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(100, ((now - start) / DURATION) * 100);
      setProgress(next);
      if (next < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        navigate("/learner/path-summary", {
          replace: true,
          state: { next: nextRoute, itemId, source },
        });
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [navigate, nextRoute, itemId, source]);

  const activeStep = Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length));

  return (
    <LearnerSurface>
      <PageContainer as="div" className="flex flex-1 flex-col gap-6 overflow-y-auto py-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Updating your journey</h1>
        <p className="text-sm text-muted-foreground">
          Applying what your latest results tell us about your learning plan.
        </p>
      </header>

      <SageEntry />

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="flex justify-center">
          <Sparkles className="h-10 w-10 text-primary animate-pulse" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Your journey is being personalised
        </h2>
        <p className="text-sm text-muted-foreground max-w-[520px] mx-auto">
          Embark is reviewing your results and deciding which content to skip, add, or keep as part
          of your plan. This usually takes just a moment.
        </p>
        <Progress value={progress} className="w-full" />

        <ul className="text-left max-w-[520px] mx-auto space-y-2" aria-live="polite">
          {STEPS.map((label, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <li key={label} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 flex-shrink-0" aria-hidden="true">
                  {done ? (
                    <Check className="h-4 w-4 text-success-foreground" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  ) : (
                    <span className="block h-4 w-4 rounded-full border border-border" />
                  )}
                </span>
                <span
                  className={cn(
                    done || active ? "text-foreground" : "text-muted-foreground",
                    active && "font-medium",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </PageContainer>
    </LearnerSurface>
  );
}
