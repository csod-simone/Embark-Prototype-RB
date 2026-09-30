import { useEffect, useRef, type UIEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SessionShell } from "@/components/embark/SessionShell";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { TextPane } from "@/components/embark/session/ModalityPanes";
import { lessonForTopic } from "@/data/microLearningLessons";
import { useAssessmentAttempts } from "@/hooks/use-assessment-attempts";
import { applyAdaptation, useJourneyAdaptation } from "@/hooks/use-journey-adaptation";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { useOrganisation } from "@/hooks/use-organisation";
import { useScrollComplete } from "@/hooks/use-scroll-complete";
import { useLearnerJourneySteps } from "@/components/embark/session/learnerJourneySteps";
import { buildMod3Flow, routeForSession } from "@/pages/embark/learner/home/JourneyTabs";
import { Button } from "@/components/ui/button";

export default function MicroLearning() {
  const navigate = useNavigate();
  const { itemId = "" } = useParams();
  const { state: adaptation, added, finishMicro } = useJourneyAdaptation();
  const { progress } = useModule3Progress();
  const { paused } = useAssessmentAttempts();
  const { org } = useOrganisation();
  const journey = useLearnerJourneySteps(itemId || null);
  const item = added.find((entry) => entry.id === itemId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pct: scrollPct, reached, onScroll } = useScrollComplete();

  const source = item
    ? buildMod3Flow(progress, org).find((session) => session.id === item.afterId)
    : undefined;
  const returnsToCheck = source?.sessionKind === "knowledge_check";
  const laterMicros = item
    ? added.filter(
        (entry) =>
          entry.afterId === item.afterId &&
          entry.id !== item.id &&
          !adaptation.completed.includes(entry.id),
      )
    : [];
  const isLastInSet = laterMicros.length === 0;
  const continueLabel =
    returnsToCheck && isLastInSet ? "Retake knowledge check" : "Continue";

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    onScroll({ currentTarget: el } as UIEvent<HTMLElement>);
  }, [item?.id, onScroll]);

  const completeAndContinue = () => {
    if (!item) return;
    if (returnsToCheck && isLastInSet) {
      finishMicro(item.id, item.afterId);
      navigate(`/learner/assessment/mod3?item=${item.afterId}`);
      return;
    }
    const nextState = finishMicro(item.id);
    const next = applyAdaptation(buildMod3Flow(progress, org), nextState).find(
      (session) => session.status === "in_progress",
    );
    navigate(next ? routeForSession(next) : "/learner/home");
  };

  if (!item) {
    return (
      <PageContainer as="div" className="py-8 space-y-3">
        <h1 className="text-xl font-semibold text-foreground">Micro-learning</h1>
        <p className="text-sm text-muted-foreground">This item is not on your path.</p>
        <Button onClick={() => navigate("/learner/home")}>Back to my dashboard</Button>
      </PageContainer>
    );
  }

  const lesson = lessonForTopic(item.topic);

  return (
    <SessionShell
      title={`Micro-learning — ${item.topic}`}
      subtitle={
        journey?.positionLabel
          ? `IM Intake Pathway · ${journey.positionLabel}`
          : "IM Intake Pathway · Micro-learning · 8 min"
      }
      onBack={() => navigate("/learner/home")}
      steps={journey?.steps ?? []}
      stepsMeta={journey?.stepsMeta ?? "Managing Clients"}
      positionLabel={journey?.positionLabel ?? "Micro-learning"}
      prev={org === "rathbones" && paused.length > 0 ? null : undefined}
      next={{
        label: continueLabel,
        onClick: completeAndContinue,
        disabled: !reached,
        disabledReason: "Read to the end of the lesson to continue.",
      }}
    >
      <div className="h-1 w-full bg-muted flex-shrink-0">
        <div className="h-1 bg-primary transition-all" style={{ width: `${scrollPct}%` }} />
      </div>
      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
        <TextPane>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Micro-learning
          </p>
          <h1 className="text-2xl font-bold">Micro-learning — {item.topic}</h1>
          <p>{lesson.intro}</p>
          {item.points.length > 0 && (
            <LeftBorderCard borderVariant="muted" padding="sm">
              <p className="text-sm font-semibold text-foreground">Why this was assigned</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </LeftBorderCard>
          )}
          {lesson.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-lg font-bold">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="list-disc space-y-1 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <LeftBorderCard borderVariant="brand" padding="sm">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Remember. </span>
              {lesson.remember}
            </p>
          </LeftBorderCard>
          {returnsToCheck && isLastInSet && (
            <p className="text-sm text-muted-foreground">
              When you continue, you will retake the knowledge check.
            </p>
          )}
        </TextPane>
      </div>
    </SessionShell>
  );
}
