import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { useReadinessProgress } from "@/hooks/use-readiness-progress";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";
import { isReadinessLearningItem } from "@/data/readinessContent";
import { activityBadgeLabel } from "@/data/readinessJourney";

export default function ReadinessActivity() {
  const { activityId = "" } = useParams();
  const navigate = useNavigate();
  const { statusOf, markStarted, markCompleted } = useReadinessProgress();
  const { org, project, activities, sections, content, findActivity } = useReadinessProfile();
  const activity = findActivity(activityId) ?? activities[0];
  const status = statusOf(activity.id);
  const section = sections.find((s) => s.id === activity.section);

  const isRoleplay = activity.activityKind === "roleplay";
  const isAssessment =
    activity.activityKind === "knowledge_check" ||
    activity.activityKind === "module_assessment" ||
    activity.activityKind === "chapter_gate";

  const isStubbedShowcase =
    org === "rathbones" &&
    !isRoleplay &&
    !isAssessment &&
    activity.activityKind === "content" &&
    activity.moduleLabel === "Managing Clients";

  const isLearning = (!isStubbedShowcase && isReadinessLearningItem(activity.id)) || isRoleplay || isAssessment;
  const learning = isLearning && !isRoleplay ? content[activity.id] : undefined;
  const learningPath = isRoleplay
    ? `/readiness/roleplay?activity=${activity.id}`
    : isAssessment
      ? `/readiness/assessment/${activity.id}`
      : activity.id === "a10"
        ? "/readiness/roleplay"
        : `/readiness/session/${activity.id}`;
  const learningLabel =
    status === "completed" ? "Review" : status === "in_progress" ? "Continue" : "Start";

  useEffect(() => {
    if (isLearning) return;
    markStarted(activity.id);
  }, [activity.id, isLearning, markStarted]);

  const index = activities.findIndex((a) => a.id === activity.id);
  const next = activities[index + 1];

  const stubTitle =
    activity.activityKind === "module_assessment"
      ? "Module assessment (placement)"
      : activity.activityKind === "knowledge_check"
        ? "Knowledge check (placement)"
        : "Contents (placement)";

  const stubBody =
    activity.activityKind === "module_assessment"
      ? "This is the summative module assessment at the end of Managing Clients. The full assessment experience will be added later; for now you can mark placement complete."
      : "Stub content for journey placement. Mark complete to move through the Managing Clients sequence.";

  return (
    <div className="px-4 sm:px-6 py-6">
      <PageContainer as="div" className="space-y-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/readiness/dashboard")}
          className="gap-1.5"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to my journey
        </Button>

        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-semibold">
              {activityBadgeLabel(activity)}
            </Badge>
            {activity.roleplayKind === "practice" && (
              <Badge className="text-[10px] font-semibold bg-primary/15 text-primary hover:bg-primary/15">
                Practice
              </Badge>
            )}
            {activity.roleplayKind === "formative" && (
              <Badge className="text-[10px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-200 hover:bg-amber-500/15">
                Formative
              </Badge>
            )}
            {activity.moduleLabel && (
              <span className="text-xs text-muted-foreground">{activity.moduleLabel}</span>
            )}
            <span className="text-xs text-muted-foreground">
              {section?.title} · {activity.duration}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{activity.name}</h1>
          <p className="text-sm text-muted-foreground">{activity.description}</p>
          {activity.roleplayKind && (
            <p className="text-xs text-muted-foreground">
              {activity.roleplayKind === "practice"
                ? "Within module · practice"
                : "Before module assessment · formative"}
            </p>
          )}
        </header>

        <LeftBorderCard borderVariant="brand">
          <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
            COMPLETION CRITERIA
          </div>
          <div className="mt-1 text-sm text-foreground">{activity.criteria}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Evidence from this activity contributes to your {activity.domain} readiness for{" "}
            {project.name}.
          </div>
        </LeftBorderCard>

        {isStubbedShowcase && (
          <LeftBorderCard borderVariant="warning">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              {stubTitle}
            </div>
            <p className="mt-1 text-sm text-foreground">{stubBody}</p>
          </LeftBorderCard>
        )}

        {isLearning && (learning || isRoleplay || isAssessment) && (
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              {isRoleplay ? "ROLE-PLAY BRIEFING" : "LEARNING OBJECTIVE"}
            </div>
            <p className="text-sm text-foreground">
              {isRoleplay || isAssessment
                ? activity.description
                : learning?.intro}
            </p>
            <p className="text-xs text-muted-foreground">
              {isRoleplay
                ? `${activity.moduleLabel ?? "Managing Clients"} · Role play · ${activity.duration}`
                : isAssessment
                  ? `${activity.moduleLabel ?? "Managing Clients"} · ${
                      activity.activityKind === "chapter_gate"
                        ? "One attempt · pass mark 80%"
                        : "Up to 3 retakes · pass mark 80%"
                    }`
                  : `${learning?.moduleName} · ${
                      activity.id === "a10"
                        ? "Role play"
                        : learning?.modality === "video"
                          ? "Video"
                          : "Article"
                    } · ~${learning?.duration} min`}
            </p>
          </div>
        )}

        {isLearning ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                markStarted(activity.id);
                navigate(learningPath);
              }}
            >
              {learningLabel}
            </Button>
            {status === "completed" && (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success-dark" aria-hidden="true" />
                Completed — evidence recorded
              </span>
            )}
            <Button variant="outline" onClick={() => navigate("/readiness/dashboard")}>
              Back to my journey
            </Button>
          </div>
        ) : status === "completed" ? (
          <LeftBorderCard borderVariant="success">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success-dark" aria-hidden="true" />
                Completed — evidence recorded
              </span>
              {next && (
                <Button size="sm" onClick={() => navigate(`/readiness/activity/${next.id}`)}>
                  Next activity
                </Button>
              )}
            </div>
          </LeftBorderCard>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => markCompleted(activity.id)}>Mark as complete</Button>
            <Button variant="outline" onClick={() => navigate("/readiness/dashboard")}>
              Save and return
            </Button>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
