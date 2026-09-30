import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Circle, PlayCircle, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { StatTile } from "@/components/embark/StatTile";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { SuggestedChips } from "@/components/embark/SuggestedChips";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAskAI } from "@/components/embark/AskAIContext";
import { useReadinessProgress } from "@/hooks/use-readiness-progress";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";
import {
  READINESS_DOMAINS,
  activityBadgeLabel,
  type ReadinessActivity,
} from "@/data/readinessJourney";
import { cn } from "@/lib/utils";

function StatusIcon({ status }: { status: string }) {
  if (status === "completed")
    return <CheckCircle2 className="h-5 w-5 text-success-dark" aria-label="Completed" />;
  if (status === "in_progress")
    return <PlayCircle className="h-5 w-5 text-primary" aria-label="In progress" />;
  return <Circle className="h-5 w-5 text-muted-foreground" aria-label="Not started" />;
}

export default function ReadinessDashboard() {
  const navigate = useNavigate();
  const askAI = useAskAI();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "ai_rationale" ? "ai_rationale" : "journey";
  const { statusOf, completedCount, totalCount } = useReadinessProgress();
  const { user, project, org, sections, activities, activitiesInSection } = useReadinessProfile();

  const journeyTitle =
    org === "rathbones" ? "Action Centre" : "Your Project Readiness Journey";
  const scoreLabel = org === "rathbones" ? "ROLE READINESS" : "PROJECT READINESS";

  const sageChips =
    org === "rathbones"
      ? [
          "Tell me about this intake",
          "What should I focus on first?",
          "Help me prepare for a client role-play",
          "What does Managing Clients cover?",
          "Why is this activity in my journey?",
        ]
      : [
          "Tell me about this project",
          "What should I focus on first?",
          "Who are the key stakeholders?",
          "Help me prepare for my stakeholder meeting",
          "What does readiness mean for this project?",
          "Why is this activity in my journey?",
        ];

  const personalisationTags =
    org === "rathbones"
      ? [
          "IM Intake · London",
          "Wealth Management",
          "Investment Manager role",
          "Investment Management competency",
          "Line manager priority: client role-play",
        ]
      : [
          "Platform migration project",
          "Regulated client",
          "Solutions Engineer role",
          "Second engineer on workstream",
          "Manager priority: context over content",
        ];

  const pct = Math.round((completedCount / totalCount) * 100);
  const domainPct = (domainId: (typeof READINESS_DOMAINS)[number]["id"]) => {
    const items = activities.filter((a) => a.domain === domainId);
    const done = items.filter((a) => statusOf(a.id) === "completed").length;
    return { done, total: items.length, pct: Math.round((done / items.length) * 100) };
  };

  const nextActivity: ReadinessActivity | undefined = activities.find(
    (a) => statusOf(a.id) !== "completed",
  );

  const openSage = () => askAI.openAskAI();

  if (tab === "ai_rationale") {
    return (
      <div className="px-4 sm:px-6 py-6">
        <PageContainer as="div" className="space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Why this journey</h1>
            <p className="text-sm text-muted-foreground">
              How Embark built your readiness plan for {project.name}.
            </p>
          </header>

          <LeftBorderCard borderVariant="brand">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-primary" aria-hidden="true" />
              <span className="text-sm font-semibold">Assignment rationale</span>
            </div>
            <p className="text-sm text-foreground">{project.assignmentNote}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {project.assignedBy} · {project.assignedByRole}
            </p>
          </LeftBorderCard>

          <div className="flex flex-wrap gap-2">
            {personalisationTags.map((t) => (
              <Badge key={t} variant="secondary" className="font-medium">
                {t}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            {sections.map((s) => (
              <div key={s.id} className="rounded-lg border border-border bg-card p-4">
                <div className="text-sm font-semibold text-foreground">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {activitiesInSection(s.id).length} activities ·{" "}
                  {activitiesInSection(s.id).filter((a) => statusOf(a.id) === "completed").length}{" "}
                  complete
                </p>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={() => setSearchParams({})}>
            Back to my journey
          </Button>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      <PageContainer as="div" className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Good morning, {user.firstName}</h1>
          <p className="text-sm text-muted-foreground">
            {project.name} · starts {project.startDate}
          </p>
        </header>

        <div className="rounded-2xl bg-muted/60 p-4 space-y-3">
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
            Hi {user.firstName} — you're preparing for {project.client}. Ask me anything about the{" "}
            {org === "rathbones" ? "intake" : "project"}, the people or the activities in your
            journey.
          </p>
          <SuggestedChips
            chips={sageChips.map((label) => ({
              label,
              variant: "default" as const,
              onClick: openSage,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
          <div className="rounded-lg border border-border bg-card p-4 flex flex-col items-center gap-2">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              {scoreLabel}
            </div>
            <ReadinessRing score={pct} size="lg" showLabel />
            <div className="text-xs text-muted-foreground text-center">
              {completedCount} of {totalCount} readiness activities complete
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {READINESS_DOMAINS.map((d) => {
                const s = domainPct(d.id);
                return (
                  <StatTile
                    key={d.id}
                    label={d.label}
                    value={`${s.pct}%`}
                    variant={s.pct === 100 ? "success" : s.pct > 0 ? "brand" : "muted"}
                    subLabel={`${s.done}/${s.total} complete`}
                    supporting={d.description}
                  />
                );
              })}
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">How your score is calculated</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchParams({ tab: "ai_rationale" })}
                >
                  Why this journey
                </Button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Each completed activity contributes to its readiness domain. Validation activities
                confirm the evidence before you're marked ready for the{" "}
                {org === "rathbones" ? "intake" : "project"}.
              </p>
              <Progress value={pct} className="mt-3" />
            </div>
          </div>
        </div>

        {nextActivity && (
          <LeftBorderCard borderVariant="warning">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  NEXT UP
                </div>
                <div className="mt-0.5 text-sm font-semibold text-foreground">
                  {nextActivity.name}
                </div>
                <div className="text-xs text-muted-foreground">{nextActivity.criteria}</div>
              </div>
              <Button size="sm" onClick={() => navigate(`/readiness/activity/${nextActivity.id}`)}>
                Continue
              </Button>
            </div>
          </LeftBorderCard>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{journeyTitle}</h2>
          {sections.map((section) => {
            const items = activitiesInSection(section.id);
            const done = items.filter((a) => statusOf(a.id) === "completed").length;
            return (
              <div key={section.id} className="rounded-lg border border-border bg-card">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {done}/{items.length} complete
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{section.description}</p>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((a) => {
                    const status = statusOf(a.id);
                    return (
                      <li key={a.id}>
                        <button
                          type="button"
                          onClick={() => navigate(`/readiness/activity/${a.id}`)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                        >
                          <StatusIcon status={status} />
                          <span className="flex-1 min-w-0">
                            <span className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-[10px] font-semibold">
                                {activityBadgeLabel(a)}
                              </Badge>
                              {a.roleplayKind === "practice" && (
                                <Badge className="text-[10px] font-semibold bg-primary/15 text-primary hover:bg-primary/15">
                                  Practice
                                </Badge>
                              )}
                              {a.roleplayKind === "formative" && (
                                <Badge className="text-[10px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-200 hover:bg-amber-500/15">
                                  Formative
                                </Badge>
                              )}
                              {a.moduleLabel && (
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  {a.moduleLabel}
                                </span>
                              )}
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  status === "completed"
                                    ? "text-muted-foreground line-through"
                                    : "text-foreground",
                                )}
                              >
                                {a.name}
                              </span>
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {a.roleplayKind === "practice"
                                ? "Within module"
                                : a.roleplayKind === "formative"
                                  ? "Before module assessment"
                                  : a.activityKind === "chapter_gate"
                                    ? "End of chapter · one attempt"
                                    : a.activityKind === "module_assessment"
                                    ? "End of module · 3 retakes · 80%"
                                    : a.criteria}{" "}
                              · {a.duration}
                            </span>
                          </span>
                          <ChevronRight size={16} className="text-muted-foreground" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>
      </PageContainer>
    </div>
  );
}
