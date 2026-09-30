import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { useOrganisation } from "@/hooks/use-organisation";
import { applyAdaptation, useJourneyAdaptation } from "@/hooks/use-journey-adaptation";
import { buildMod3Flow, routeForSession } from "@/pages/embark/learner/home/JourneyTabs";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SessionShell } from "@/components/embark/SessionShell";
import { AnswerReviewList } from "@/components/embark/AnswerReviewList";
import { questionsForItem } from "@/data/learnerAssessmentQuestions";
import { ASSESSMENT_DEFAULTS } from "@/data/assessmentTypes";
import { buildMod3SessionSteps } from "@/components/embark/session/sessionSteps";
import { useLearnerJourneySteps } from "@/components/embark/session/learnerJourneySteps";
import { attemptAllowance, useAssessmentAttempts } from "@/hooks/use-assessment-attempts";

function isPassFrom(
  outcomeParam: string | null,
  scoreParam: string | null,
  totalParam: string | null,
  passThreshold: number,
) {
  const score = scoreParam != null ? Number(scoreParam) : null;
  const total = totalParam != null ? Number(totalParam) : null;
  const hasScore = score != null && total != null && !Number.isNaN(score) && !Number.isNaN(total) && total > 0;
  if (outcomeParam) return outcomeParam !== "fail";
  if (hasScore) return (score as number) / (total as number) >= passThreshold / 100;
  return true;
}

function TopicRow({
  icon,
  topic,
  pill,
  pillClass,
  note,
}: {
  icon: React.ReactNode;
  topic: string;
  pill: string;
  pillClass: string;
  note: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{topic}</div>
        <div className="text-sm text-muted-foreground mt-0.5">{note}</div>
      </div>
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0 ${pillClass}`}>
        {pill}
      </span>
    </div>
  );
}

export default function AssessmentResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navState = location.state as
    | { answers?: Record<string, string | null>; questionIds?: string[] }
    | null;
  const submittedAnswers = navState?.answers;
  const itemQuestions = questionsForItem(searchParams.get("item"));
  const activeQuestions = navState?.questionIds
    ? itemQuestions.filter((q) => navState.questionIds?.includes(q.id))
    : itemQuestions;
  const passThreshold = ASSESSMENT_DEFAULTS["Module Assessment"].passThreshold;
  const canReviewAnswers = !!submittedAnswers && isPassFrom(searchParams.get("outcome"), searchParams.get("score"), searchParams.get("total"), passThreshold);
  const scoreParam = searchParams.get("score");
  const totalParam = searchParams.get("total");
  const score = scoreParam != null ? Number(scoreParam) : null;
  const total = totalParam != null ? Number(totalParam) : null;
  const hasScore = score != null && total != null && !Number.isNaN(score) && !Number.isNaN(total) && total > 0;
  const outcomeParam = searchParams.get("outcome");
  const isPass = outcomeParam
    ? outcomeParam !== "fail"
    : hasScore
    ? (score as number) / (total as number) >= passThreshold / 100
    : true;
  const { progress, markAssessmentPassed } = useModule3Progress();
  const { org } = useOrganisation();
  const { state: adaptation, settleOutcome } = useJourneyAdaptation();
  const { forItem } = useAssessmentAttempts();
  const itemId = searchParams.get("item");
  const attemptSession = itemId ? buildMod3Flow(progress, org).find((session) => session.id === itemId) : undefined;
  const attemptAllowanceForItem = attemptAllowance(attemptSession?.sessionKind);
  const attempt = forItem(org === "rathbones" ? itemId : null);
  const attemptsRemaining = Math.max(0, attemptAllowanceForItem - attempt.used);
  const outOfAttempts = org === "rathbones" && !isPass && attempt.paused;
  const journey = useLearnerJourneySteps(itemId);
  const steps = journey?.steps ?? buildMod3SessionSteps("s-assessment", progress, navigate);
  const sectionTitle =
    org === "rathbones" && attemptSession ? attemptSession.name : "Benefits Navigation — Assessment Results";
  const sectionSubtitle =
    org === "rathbones" && journey?.positionLabel
      ? `IM Intake Pathway · ${journey.positionLabel}`
      : "Session 3 of 4 · Assessment";
  const journeySessions = org === "rathbones" ? applyAdaptation(buildMod3Flow(progress, org), adaptation) : [];
  const currentJourneyId =
    itemId ??
    journeySessions.find((session) => session.modality === "assessment" && session.status === "in_progress")?.id;
  const currentJourneyIndex = journeySessions.findIndex((session) => session.id === currentJourneyId);
  const nextActivity =
    currentJourneyIndex >= 0
      ? journeySessions
          .slice(currentJourneyIndex + 1)
          .find((session) => session.status !== "completed" && session.status !== "skipped")
      : undefined;
  const passJourney = (() => {
    if (org !== "rathbones" || !isPass) return [];
    const base = buildMod3Flow(progress, org);
    const id =
      itemId ??
      base.find((session) => session.modality === "assessment" && session.status === "in_progress")?.id;
    if (!id) return [];
    const completed = adaptation.completed.includes(id) ? adaptation.completed : [...adaptation.completed, id];
    const start = base.findIndex((session) => session.id === id);
    const articleId =
      id === "mc-k1" || start < 0
        ? undefined
        : base.slice(start + 1).find((session) => session.sessionKind === "content")?.id;
    const skipped =
      articleId && !completed.includes(articleId) && !adaptation.skipped.includes(articleId)
        ? [...adaptation.skipped, articleId]
        : adaptation.skipped;
    return applyAdaptation(base, { ...adaptation, completed, skipped });
  })();
  const passedIndex = itemId ? passJourney.findIndex((session) => session.id === itemId) : -1;
  const passNext =
    passedIndex >= 0
      ? passJourney
          .slice(passedIndex + 1)
          .find((session) => session.status !== "completed" && session.status !== "skipped")
      : undefined;
  const passNextIndex = passNext ? passJourney.findIndex((session) => session.id === passNext.id) : -1;

  const outcomeTopics = (() => {
    const missed = new Map<string, string[]>();
    if (!submittedAnswers) return [] as { topic: string; points: string[] }[];
    for (const question of activeQuestions) {
      const chosen = submittedAnswers[question.id];
      if (chosen == null || chosen === question.correctId) continue;
      const points = missed.get(question.sectionLabel) ?? [];
      points.push(question.prompt);
      missed.set(question.sectionLabel, points);
    }
    return [...missed.entries()].map(([topic, points]) => ({ topic, points }));
  })();
  const recordedMicros = adaptation.added.filter((entry) => entry.afterId === currentJourneyId);
  const gapRecords = recordedMicros.length > 0 ? recordedMicros.map((entry) => entry.topic) : outcomeTopics.map((entry) => entry.topic);

  const commitRathbonesOutcome = () => {
    const base = buildMod3Flow(progress, org);
    const id =
      itemId ??
      base.find((session) => session.modality === "assessment" && session.status === "in_progress")?.id ??
      "mc-k1";
    const nextState = settleOutcome(id, base, isPass, outcomeTopics);
    if (isPass) markAssessmentPassed();
    return { id, sessions: applyAdaptation(base, nextState) };
  };

  const continueAfterResult = () => {
    if (outOfAttempts) {
      navigate("/learner/home");
      return;
    }
    if (org !== "rathbones") {
      if (isPass) {
        markAssessmentPassed();
        navigate("/learner/role-play/s3");
      } else {
        navigate("/learner/session/s-article");
      }
      return;
    }
    const { id } = commitRathbonesOutcome();
    navigate("/learner/personalizing", { state: { itemId: id, source: "assessment" } });
  };

  const openGapInJourney = () => {
    const { sessions } = commitRathbonesOutcome();
    const next = sessions.find((session) => session.status === "in_progress");
    navigate(next ? routeForSession(next) : "/learner/home");
  };

  if (reviewOpen && submittedAnswers) {
    return (
      <SessionShell
        title={sectionTitle}
        subtitle={sectionSubtitle}
        onBack={() => setReviewOpen(false)}
        steps={steps}
        stepsMeta={journey?.stepsMeta ?? "Benefits Navigation · Module 3"}
        sagePrompts={[
          { label: "Why was question 3 correct?" },
          { label: "Explain coordination of benefits" },
          { label: "Raise a hand 🤚" },
        ]}
      >
        <div className="flex-1 overflow-y-auto">
          <PageContainer as="div" className="pt-6 pb-32 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Review your answers</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  See which answers were correct and which were incorrect.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setReviewOpen(false)}>
                Back to results
              </Button>
            </div>
            <AnswerReviewList questions={activeQuestions} answers={submittedAnswers} showCorrectness />
          </PageContainer>
        </div>
      </SessionShell>
    );
  }

  return (
    <SessionShell
      title={sectionTitle}
      subtitle={sectionSubtitle}
      onBack={() => navigate("/learner/home")}
      steps={steps}
      stepsMeta={journey?.stepsMeta ?? "Benefits Navigation · Module 3"}
      positionLabel={journey?.positionLabel ?? "Session 3 of 4"}
      prev={
        isPass
          ? {
              label: "Retake assessment",
              onClick: () =>
                navigate(itemId ? `/learner/assessment/mod3?item=${encodeURIComponent(itemId)}` : "/learner/assessment/mod3"),
            }
          : outOfAttempts
            ? null
            : undefined
      }
      next={
        outOfAttempts
          ? { label: "Back to my journey", onClick: () => navigate("/learner/home") }
          : !isPass && org === "rathbones"
            ? {
                label: "Retake Assessment",
                onClick: () =>
                  navigate(itemId ? `/learner/assessment/mod3?item=${encodeURIComponent(itemId)}` : "/learner/assessment/mod3"),
              }
            : org === "rathbones"
          ? { label: "Continue", onClick: continueAfterResult }
          : isPass
            ? {
                label: "Continue to role play",
                onClick: () => {
                  markAssessmentPassed();
                  navigate("/learner/role-play/s3");
                },
              }
            : { label: "Review gap content", onClick: () => navigate("/learner/session/s-article") }
      }
      sagePrompts={[
        { label: "Why was question 3 correct?" },
        { label: "Explain coordination of benefits" },
        { label: "How should I prepare for the retake?" },
        { label: "What topics did I miss?" },
        { label: "Raise a hand 🤚" },
      ]}
    >
      <div className="flex-1 overflow-y-auto">
        <PageContainer as="div" className="pt-6 sm:pt-8 pb-32 space-y-5">
            {/* 1. Outcome */}
            {isPass ? (
              <LeftBorderCard borderVariant="success">
                <div className="text-xl font-bold text-foreground-success">
                  You advanced{hasScore ? ` — ${Math.round(((score as number) / (total as number)) * 100)}%` : " — 82%"}
                </div>
                {hasScore && (
                  <div className="text-sm text-foreground mt-1">
                    You scored {score} out of {total}
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  Advancement score: {passThreshold}% · Great work
                </div>
              </LeftBorderCard>
            ) : (
              <LeftBorderCard borderVariant="danger">
                <div className="text-xl font-bold text-foreground-destructive">
                  Did not advance this time{hasScore ? ` — ${Math.round(((score as number) / (total as number)) * 100)}%` : " — 61%"}
                </div>
                {hasScore && (
                  <div className="text-sm text-foreground mt-1">
                    You scored {score} out of {total}
                  </div>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  Advancement score: {passThreshold}%
                  {org === "rathbones" ? ` · Attempts remaining: ${attemptsRemaining}` : ""}
                </div>
              </LeftBorderCard>
            )}

            {/* 2. Readiness update */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <ReadinessRing size="sm" score={62} showLabel />
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <ArrowRight
                    className={`h-5 w-5 ${isPass ? "text-foreground-success" : "text-status-warning-fg"}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-sm font-semibold ${
                      isPass ? "text-foreground-success" : "text-status-warning-fg"
                    }`}
                  >
                    {isPass ? "↑ +6 points" : "↓ -3 points"}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ReadinessRing size="sm" score={isPass ? 68 : 59} showLabel />
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-3">
                Your assessment result has updated your readiness score.
              </p>
            </div>

            {canReviewAnswers && (
              <Button variant="secondary" className="w-full" onClick={() => setReviewOpen(true)}>
                Review answers
              </Button>
            )}

            {/* 3. Performance breakdown */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2">
                Performance by topic
              </h2>
              {org === "rathbones"
                ? [...new Set(activeQuestions.map((question) => question.sectionLabel))].map((topic) => {
                    const inTopic = activeQuestions.filter((question) => question.sectionLabel === topic);
                    const missed = submittedAnswers
                      ? inTopic.filter((question) => submittedAnswers[question.id] !== question.correctId).length
                      : inTopic.length;
                    const strong = missed === 0;
                    return (
                      <TopicRow
                        key={topic}
                        icon={
                          strong ? (
                            <CheckCircle2 className="h-5 w-5 text-foreground-success" />
                          ) : (
                            <XCircle className="h-5 w-5 text-foreground-destructive" />
                          )
                        }
                        topic={topic}
                        pill={strong ? "Strong" : "Needs work"}
                        pillClass={
                          strong
                            ? "bg-status-success text-status-success-fg"
                            : "bg-status-critical text-status-critical-fg"
                        }
                        note={
                          strong
                            ? "Answered correctly"
                            : `${missed} of ${inTopic.length} to review`
                        }
                      />
                    );
                  })
                : (
                  <>
                    <TopicRow
                      icon={<CheckCircle2 className="h-5 w-5 text-foreground-success" />}
                      topic="Medicare Plan Types"
                      pill="Strong"
                      pillClass="bg-status-success text-status-success-fg"
                      note="Good understanding of plan structures"
                    />
                    <TopicRow
                      icon={
                        isPass ? (
                          <CheckCircle2 className="h-5 w-5 text-foreground-success" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-status-warning-fg" />
                        )
                      }
                      topic="Coverage Determination"
                      pill={isPass ? "Meeting" : "Partial"}
                      pillClass={isPass ? "bg-status-success text-status-success-fg" : "bg-status-warning text-status-warning-fg"}
                      note={
                        isPass
                          ? "Solid grasp of coordination of benefits"
                          : "Review required: coordination of benefits"
                      }
                    />
                    <TopicRow
                      icon={
                        isPass ? (
                          <CheckCircle2 className="h-5 w-5 text-foreground-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-foreground-destructive" />
                        )
                      }
                      topic="Deductibles and Coinsurance"
                      pill={isPass ? "Meeting" : "Needs work"}
                      pillClass={
                        isPass ? "bg-status-success text-status-success-fg" : "bg-status-critical text-status-critical-fg"
                      }
                      note={
                        isPass
                          ? "Handled the deductible scenarios correctly"
                          : "Incorrect on 3 of 4 questions in this area"
                      }
                    />
                  </>
                )}
            </div>

            {/* 4. Next path */}
            {isPass ? (
              <p className="text-sm text-muted-foreground">
                {org === "rathbones" ? (
                  passNext ? (
                    <>
                      Next in your journey is {passNext.name}. This is Session {passNextIndex + 1} of {passJourney.length} in the IM Intake Pathway.{" "}
                    </>
                  ) : (
                    <>You've completed the last step in the IM Intake Pathway. </>
                  )
                ) : (
                  <>
                    You've unlocked the role play — Benefits Lookup Practice. This is Session 4 of 4 for Benefits Navigation.{" "}
                  </>
                )}
                Want to let your manager know?{" "}
                <Link to="/learner/help" className="font-medium text-primary underline-offset-4 hover:underline">
                  Raise a hand to your manager
                </Link>{" "}
                — pre-populated with your results
              </p>
            ) : outOfAttempts ? (
              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  What's next
                </h2>
                <p className="text-sm text-foreground">
                  {attemptAllowanceForItem <= 1
                    ? "This assessment allows one attempt. A score below 80% pauses your journey and raises an at-risk flag straight away."
                    : `You've used all ${Math.max(0, attemptAllowanceForItem - 1)} retakes. A score below 80% on a sustained basis pauses your journey and raises an at-risk flag.`}
                </p>
                <p className="text-sm text-foreground">
                  Sage has asked your line manager to check in. {attemptSession?.name ?? "This module"} stays paused until they reopen it. You can continue only after that check-in.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  What's next
                </h2>
                <p className="text-sm text-foreground">
                  You didn't pass this time — that's okay. Here's what we recommend:
                </p>
                {org === "rathbones" && attempt.checkIn && (
                  <Alert variant="info">
                    <AlertDescription>
                      Your line manager has been asked to check in about this result. You can still review the gap content and retake the assessment.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  {(org === "rathbones" ? gapRecords.map((topic) => `Micro-learning — ${topic}`) : [
                    "Review: Coverage Determination — Primary vs Secondary",
                    "Review: Deductibles and Coinsurance — Part B Scenarios",
                  ]).map((label) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-foreground">
                      <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1">{label}</span>
                      <span className="text-sm text-muted-foreground">{org === "rathbones" ? "8 min" : "5 min"}</span>
                    </div>
                  ))}
                </div>
                {org === "rathbones" ? (
                  <Alert variant="info">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <AlertDescription>
                      Attempts remaining: {attemptsRemaining}. Choose Retake assessment to use the next one.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="info">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <AlertDescription>Your retake will be available in 23 hours 42 minutes</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2 pt-1">
                  <Button
                    className="w-full"
                    onClick={() => (org === "rathbones" ? openGapInJourney() : navigate("/learner/session/s-article"))}
                  >
                    Review gap content →
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    {org === "rathbones" &&
                    journeySessions.find((session) => session.id === currentJourneyId)?.sessionKind ===
                      "knowledge_check"
                      ? "Complete the suggested review, then retake this knowledge check."
                      : org === "rathbones" && nextActivity
                        ? `Complete the suggested review, then continue to ${nextActivity.name}.`
                        : org === "rathbones"
                          ? "Complete the suggested review, then retake the assessment."
                          : "Complete the suggested review, then retake the assessment to unlock the role play."}
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate("/learner/help")}
                  >
                    Raise a hand
                  </Button>
                </div>
              </div>
            )}
        </PageContainer>
      </div>
    </SessionShell>
  );
}