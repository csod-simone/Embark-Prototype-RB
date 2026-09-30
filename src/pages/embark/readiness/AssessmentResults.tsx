import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SessionShell } from "@/components/embark/SessionShell";
import { useReadinessProgress } from "@/hooks/use-readiness-progress";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";
import { buildReadinessSteps } from "./readinessSteps";

export default function ReadinessAssessmentResults() {
  const navigate = useNavigate();
  const { activityId = "a8" } = useParams();
  const { content: contentMap, questions: questionsMap, org } = useReadinessProfile();
  const id = activityId in questionsMap ? activityId : "a8";
  const content = contentMap[id];
  const [searchParams] = useSearchParams();

  const scoreParam = searchParams.get("score");
  const totalParam = searchParams.get("total");
  const score = scoreParam != null ? Number(scoreParam) : null;
  const total = totalParam != null ? Number(totalParam) : null;
  const hasScore =
    score != null && total != null && !Number.isNaN(score) && !Number.isNaN(total) && total > 0;
  const isGate = searchParams.get("gate") === "1";
  const outcomeParam = searchParams.get("outcome");
  const isPass = outcomeParam
    ? outcomeParam !== "fail"
    : hasScore
      ? (score as number) / (total as number) >= 0.8
      : true;

  const { statusOf, markCompleted, completedCount, totalCount } = useReadinessProgress();
  const alreadyComplete = statusOf(id) === "completed";
  const beforePct = Math.round(
    ((alreadyComplete ? completedCount - 1 : completedCount) / totalCount) * 100,
  );
  const afterPct = Math.round(
    ((alreadyComplete ? completedCount : completedCount + (isPass ? 1 : 0)) / totalCount) * 100,
  );

  const steps = useMemo(() => buildReadinessSteps(id, navigate, org), [id, navigate, org]);

  const finish = () => {
    if (isPass) markCompleted(id);
    navigate(`/readiness/activity/${id}`);
  };

  return (
    <SessionShell
      topHeader={null}
      title={`${content.title} — Knowledge Check Results`}
      subtitle={`${content.moduleName} · Assessment`}
      onBack={() => navigate("/readiness/dashboard")}
      steps={steps}
      stepsMeta={org === "rathbones" ? "Your role readiness journey" : "Your project readiness journey"}
      positionLabel={content.programName}
      prev={{ label: "Retake assessment", onClick: () => navigate(`/readiness/assessment/${id}`) }}
      next={
        isPass
          ? { label: "Complete activity", onClick: finish }
          : { label: "Review session content", onClick: () => navigate(`/readiness/session/${id}`) }
      }
      sagePrompts={[
        { label: "What topics did I miss?" },
        { label: "Explain the answer I got wrong" },
        { label: "How should I prepare for the retake?" },
        { label: "Raise a hand 🤚" },
      ]}
    >
      <div className="flex-1 overflow-y-auto">
        <PageContainer as="div" className="pt-6 sm:pt-8 pb-32 space-y-5">
          {isPass ? (
            <LeftBorderCard borderVariant="success">
              <div className="text-xl font-bold text-success-dark">
                You passed
                {hasScore
                  ? ` — ${Math.round(((score as number) / (total as number)) * 100)}%`
                  : ""}
              </div>
              {hasScore && (
                <div className="text-sm text-foreground mt-1">
                  You scored {score} out of {total}
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                Passing score: 80% · Great work
              </div>
            </LeftBorderCard>
          ) : (
            <LeftBorderCard borderVariant="danger">
              <div className="text-xl font-bold text-destructive-foreground">
                Did not pass this time
                {hasScore
                  ? ` — ${Math.round(((score as number) / (total as number)) * 100)}%`
                  : ""}
              </div>
              {hasScore && (
                <div className="text-sm text-foreground mt-1">
                  You scored {score} out of {total}
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-1">Passing score: 80%</div>
            </LeftBorderCard>
          )}

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-center gap-6">
              <ReadinessRing size="sm" score={beforePct} showLabel />
              <div className="flex flex-col items-center justify-center gap-1">
                <ArrowRight
                  className={`h-5 w-5 ${isPass ? "text-success-foreground" : "text-warning-foreground"}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-sm font-semibold ${
                    isPass ? "text-success-foreground" : "text-warning-foreground"
                  }`}
                >
                  {isPass ? `↑ +${Math.max(afterPct - beforePct, 0)} points` : "No change"}
                </span>
              </div>
              <ReadinessRing size="sm" score={afterPct} showLabel />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-3">
              {isPass
                ? `Passing this knowledge check completes the activity and updates your ${org === "rathbones" ? "role" : "project"} readiness score.`
                : `Your ${org === "rathbones" ? "role" : "project"} readiness score updates once this knowledge check is passed.`}
            </p>
          </div>

          {!isPass && (
            <div className="rounded-lg border border-border bg-card p-5 space-y-3">
              <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                What's next
              </h2>
              <div className="flex items-start gap-2 text-sm text-foreground">
                <AlertTriangle className="h-4 w-4 text-warning-foreground mt-0.5 flex-shrink-0" />
                <span>
                  {isGate
                    ? "This chapter gate allows one attempt. Your line manager has been flagged and progress stays paused until they check in."
                    : "Revisit the session before retaking. You have up to 3 retakes. After that the journey pauses until your line manager reopens it."}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="flex-1">Review: {content.title}</span>
                <span className="text-sm text-muted-foreground">{content.duration} min</span>
              </div>
              <Alert variant="info">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <AlertDescription>Your retake is available now.</AlertDescription>
              </Alert>
            </div>
          )}

          {isPass && (
            <p className="text-sm text-muted-foreground inline-flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success-foreground mt-0.5 flex-shrink-0" />
              Evidence from this knowledge check has been recorded against your readiness journey.
            </p>
          )}
        </PageContainer>
      </div>
    </SessionShell>
  );
}
