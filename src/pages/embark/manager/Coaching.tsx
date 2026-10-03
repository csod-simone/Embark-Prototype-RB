import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Target, ArrowRight } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SageTag } from "@/components/embark/SageTag";

type Prompt = {
  id: string;
  variant: "warning" | "brand";
  title: string;
  cohort: string;
  body: string;
  focus: string[];
};

export const prompts: Prompt[] = [
  {
    id: "p1",
    variant: "warning",
    title: "Coaching recommended — Jordan Kim",
    cohort: "Medicare CSR Cohort A",
    body:
      "Jordan has attempted the Module 3 assessment twice and scored below 65% on both attempts. Sage has identified consistent errors on COB rules and Coverage Determination questions. A targeted 1:1 coaching session is recommended before Jordan progresses to Module 4.",
    focus: ["Coordination of Benefits", "Coverage Determination", "Prior Authorisation"],
  },
  {
    id: "p2",
    variant: "warning",
    title: "Coaching recommended — Marcus Webb",
    cohort: "Medicare CSR Cohort A",
    body:
      "Marcus has not completed a session in 9 days and is approaching the Module 3 deadline. Sage has flagged a drop in engagement following the Coverage Determination article. A brief check-in coaching session may help identify any blockers before the deadline.",
    focus: ["Learner engagement", "Module 3 deadline", "Coverage Determination"],
  },
  {
    id: "p3",
    variant: "brand",
    title: "Stretch opportunity — Priya Nair",
    cohort: "Medicare CSR Cohort B",
    body:
      "Priya is the top-performing learner in Cohort B, scoring 91% on the Module 3 assessment. A coaching session focused on advanced Medicare scenarios or early preparation for Module 4 (Claims and Billing) could deepen her knowledge and maintain her engagement ahead of schedule.",
    focus: ["Advanced Medicare scenarios", "Claims and Billing preview", "Learner retention"],
  },
];

export default function Coaching() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setFadingOut((prev) => new Set(prev).add(id));
    setTimeout(() => setDismissed((prev) => new Set(prev).add(id)), 200);
  };

  const stub = () => toast("Coaching scheduling coming soon");

  const visible = prompts.filter((p) => !dismissed.has(p.id));

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        <section className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Coaching prompts</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                AI-generated coaching recommendations based on learner performance and risk signals
              </p>
            </div>
            <SageTag label="AI" className="shrink-0" />
          </div>

          <div className="space-y-3">
            {visible.map((p) => {
              const Icon = p.variant === "warning" ? AlertTriangle : Target;
              const iconColor = p.variant === "warning" ? "text-warning-foreground dark:text-warning" : "text-primary";
              const isFading = fadingOut.has(p.id);
              return (
                <div
                  key={p.id}
                  className={`transition-opacity duration-200 ${isFading ? "opacity-0" : "opacity-100"}`}
                >
                  <LeftBorderCard borderVariant={p.variant}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden />
                        {p.title}
                      </div>
                      <span className="text-sm text-muted-foreground shrink-0">{p.cohort}</span>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>

                    <div className="mt-3">
                      <div className="text-xs tracking-wide text-muted-foreground mb-2">
                        Suggested focus areas
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {p.focus.map((f) => (
                          <Badge key={f} variant="tertiary">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                      <Button size="sm" onClick={stub}>
                        Schedule coaching
                        <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={stub}>
                        Assign coaching
                        <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDismiss(p.id)}
                        className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                      >
                        Dismiss
                      </button>
                    </div>
                  </LeftBorderCard>
                </div>
              );
            })}
          </div>
        </section>
      </PageContainer>
    </>
  );
}
