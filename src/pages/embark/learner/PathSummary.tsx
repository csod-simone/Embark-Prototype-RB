import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleStatusIcon } from "@/components/embark/ModuleStatusIcon";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { useTutorName } from "@/hooks/use-branding";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { useOrganisation } from "@/hooks/use-organisation";
import { applyAdaptation, useJourneyAdaptation } from "@/hooks/use-journey-adaptation";
import { buildMod3Flow, routeForSession } from "@/pages/embark/learner/home/JourneyTabs";
import type { Session } from "@/data/mockData";

const NEXT_STEPS = [
  "Review your personalized learning path.",
  "Complete the assigned content in the recommended order.",
  "Finish any required knowledge checks, role-plays, and the module assessment.",
  "Continue progressing toward completion of your journey.",
];

function kindLabel(session: Session) {
  if (session.id.startsWith("micro-")) return "Micro-learning";
  if (session.sessionKind === "knowledge_check") return "Knowledge check";
  if (session.sessionKind === "roleplay") return "Role-play";
  if (session.sessionKind === "module_assessment") return "Assessment";
  if (session.sessionKind === "chapter_gate") return "Chapter gate";
  return "Article";
}

function ItemRow({ session }: { session: Session }) {
  const skipped = session.status === "skipped";
  const locked = session.status === "locked";
  const completed = session.status === "completed";
  return (
    <li className="flex items-start gap-3 py-2">
      <span className="mt-0.5 flex-shrink-0" aria-hidden="true">
        {skipped ? (
          <ModuleStatusIcon status="skipped" />
        ) : locked ? (
          <Lock className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ModuleStatusIcon status={completed ? "completed" : "in_progress"} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={skipped ? "text-sm text-muted-foreground line-through" : "text-sm text-foreground"}>
            {session.name}
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {kindLabel(session)}
          </span>
          {skipped && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Skipped
            </span>
          )}
          {(session.sessionKind === "knowledge_check" ||
            session.sessionKind === "roleplay" ||
            session.sessionKind === "module_assessment" ||
            session.sessionKind === "chapter_gate") &&
            !skipped && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Required
              </span>
            )}
        </div>
      </div>
    </li>
  );
}

export default function LearnerPathSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const tutorName = useTutorName();
  const { org } = useOrganisation();
  const { progress } = useModule3Progress();
  const { state: adaptation } = useJourneyAdaptation();
  const nav = location.state as { source?: "assessment" | "role-play" } | null;
  const sourceLabel = nav?.source === "role-play" ? "role-play" : "assessment";

  const ordered = useMemo(() => {
    const base = buildMod3Flow(progress, org === "rathbones" ? "rathbones" : org);
    return org === "rathbones" ? applyAdaptation(base, adaptation) : base;
  }, [adaptation, org, progress]);

  const skipped = ordered.filter((session) => session.status === "skipped");
  const required = ordered.filter(
    (session) =>
      session.status !== "skipped" &&
      session.status !== "completed" &&
      (session.sessionKind === "knowledge_check" ||
        session.sessionKind === "roleplay" ||
        session.sessionKind === "module_assessment"),
  );
  const assigned = ordered.filter(
    (session) =>
      session.status !== "skipped" &&
      session.status !== "completed" &&
      session.sessionKind === "content",
  );
  const next = ordered.find((session) => session.status === "in_progress");

  return (
    <PageContainer as="div" className="flex-1 flex flex-col gap-6 py-6">
      <header className="space-y-2">
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Personalized by {tutorName}
        </span>
        <h1 className="text-2xl font-bold text-foreground">
          Based on your {sourceLabel}, we've personalized your learning path.
        </h1>
        <p className="text-sm text-muted-foreground max-w-[640px]">
          We reviewed your {sourceLabel} result and personalized your learning path to focus your
          time where it will have the greatest impact. Some content may be skipped, while other
          content remains assigned to help build readiness for your role.
        </p>
      </header>

      {skipped.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5 space-y-2">
          <h2 className="text-base font-semibold text-foreground">
            Content {tutorName} has marked as optional
          </h2>
          <p className="text-sm text-muted-foreground">
            Based on your demonstrated knowledge, this content has been marked as optional and will
            not be required to complete this path.
          </p>
          <ul className="divide-y divide-border">
            {skipped.map((session) => (
              <ItemRow key={session.id} session={session} />
            ))}
          </ul>
        </section>
      )}

      {required.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5 space-y-2">
          <h2 className="text-base font-semibold text-foreground">Required content</h2>
          <p className="text-sm text-muted-foreground">
            This content is required and must be completed as part of your journey.
          </p>
          <ul className="divide-y divide-border">
            {required.map((session) => (
              <ItemRow key={session.id} session={session} />
            ))}
          </ul>
        </section>
      )}

      {assigned.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5 space-y-2">
          <h2 className="text-base font-semibold text-foreground">Content remaining in your path</h2>
          <p className="text-sm text-muted-foreground">
            This content remains part of your personalized learning experience.
          </p>
          <ul className="divide-y divide-border">
            {assigned.map((session) => (
              <ItemRow key={session.id} session={session} />
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-border bg-card p-5 space-y-2">
        <h2 className="text-base font-semibold text-foreground">What happens next</h2>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
          {NEXT_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {next && (
        <LeftBorderCard borderVariant="brand">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Next up
              </div>
              <div className="text-sm font-semibold text-foreground truncate">{next.name}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {kindLabel(next)}
                </span>
                <span className="text-xs text-muted-foreground">{next.duration} min</span>
              </div>
            </div>
          </div>
        </LeftBorderCard>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button variant="outline" className="h-11" onClick={() => navigate("/learner/home")}>
          Back to my dashboard
        </Button>
        <Button className="h-11" onClick={() => navigate(next ? routeForSession(next) : "/learner/home")}>
          Start my journey
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </PageContainer>
  );
}
