import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertTriangle,
  Target,
  Users,
  Calendar,
  Flag,
  ArrowRight,
} from "lucide-react";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { SageTag } from "@/components/embark/SageTag";

type SuggestedAction = {
  id: string;
  variant: "warning" | "brand";
  cohortId: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryAction: "coaching" | "message";
};

const suggestedActions: SuggestedAction[] = [
  {
    id: "sa-1",
    variant: "warning",
    cohortId: "cohort-a",
    title: "At-risk learners — IM Intake Cohort A",
    body:
      "5 learners in IM Intake Cohort A have not completed a session in over 7 days and are behind on Client relationships foundations. A check-in before the next knowledge check would help.",
    primaryLabel: "Assign coaching",
    primaryAction: "coaching",
  },
  {
    id: "sa-2",
    variant: "brand",
    cohortId: "cohort-b",
    title: "Discovery milestone — IM Intake Cohort B",
    body:
      "Learners in IM Intake Cohort B are ready to practise discovery. A short note on objectives and capacity for loss will keep the cohort moving into suitability.",
    primaryLabel: "Send message",
    primaryAction: "message",
  },
  {
    id: "sa-3",
    variant: "warning",
    cohortId: "cohort-a",
    title: "Low assessment scores — IM Intake Cohort A",
    body:
      "3 learners scored below 65% on Knowledge check 1 in IM Intake Cohort A. They need another pass at the mandate and the fee share before the discovery role-play.",
    primaryLabel: "Assign coaching",
    primaryAction: "coaching",
  },
];

type Cohort = {
  id: string;
  name: string;
  status: "active" | "starting";
  learners: number;
  startLabel: string;
  targetLabel: string;
  progress: number;
  onTrack?: number;
  atRisk?: number;
  critical?: number;
  coachingNote?: string;
  coachingNoteVariant?: "warning" | "muted";
  lastActivity: string;
  notStarted?: boolean;
};

export const cohorts: Cohort[] = [
  {
    id: "cohort-a",
    name: "Medicare CSR Cohort A",
    status: "active",
    learners: 6,
    startLabel: "Started 14 July 2026",
    targetLabel: "Target completion: 30 September 2026",
    progress: 38,
    onTrack: 14,
    atRisk: 5,
    critical: 3,
    coachingNote: "2 coaching sessions pending",
    coachingNoteVariant: "warning",
    lastActivity: "Last activity: today",
  },
  {
    id: "cohort-b",
    name: "Medicare CSR Cohort B",
    status: "active",
    learners: 5,
    startLabel: "Started 21 July 2026",
    targetLabel: "Target completion: 30 September 2026",
    progress: 52,
    onTrack: 14,
    atRisk: 3,
    critical: 1,
    coachingNote: "No pending coaching",
    coachingNoteVariant: "muted",
    lastActivity: "Last activity: today",
  },
  {
    id: "cohort-q3",
    name: "New Starter Cohort Q3",
    status: "starting",
    learners: 3,
    startLabel: "Starts 1 September 2026",
    targetLabel: "Target completion: 30 November 2026",
    progress: 0,
    notStarted: true,
    lastActivity: "Last activity: —",
  },
];

export default function Cohorts() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setFadingOut((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setDismissed((prev) => new Set(prev).add(id));
    }, 200);
  };

  const handlePrimary = (action: SuggestedAction) => {
    if (action.primaryAction === "coaching") {
      navigate("/manager/coaching");
    } else {
      toast("Message feature coming soon");
    }
  };

  const visibleActions = suggestedActions.filter((a) => !dismissed.has(a.id));

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Cohorts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You are managing {cohorts.length} active cohorts
          </p>
        </div>

        {/* Suggested Actions */}
        <section className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Suggested actions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                AI-generated based on cohort progress, risk signals, and upcoming milestones
              </p>
            </div>
            <SageTag label="Powered by Sage" className="shrink-0" />
          </div>

          <div className="space-y-3">
            {visibleActions.map((action) => {
              const isFading = fadingOut.has(action.id);
              const Icon = action.variant === "warning" ? AlertTriangle : Target;
              const iconColor = action.variant === "warning" ? "text-warning-foreground dark:text-warning" : "text-primary";
              return (
                <div
                  key={action.id}
                  id={action.id === "sa-1" ? "signal-cohort-foundations" : undefined}
                  className={`scroll-mt-4 rounded-md transition-opacity duration-200 ${isFading ? "opacity-0" : "opacity-100"}`}
                >
                  <LeftBorderCard borderVariant={action.variant}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden />
                        {action.title}
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/manager/cohorts/${action.cohortId}`)}
                        className="text-sm text-primary hover:underline shrink-0 inline-flex items-center gap-1"
                      >
                        View cohort <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{action.body}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePrimary(action)}
                      >
                        {action.primaryLabel}
                        <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDismiss(action.id)}
                        className="text-sm text-muted-foreground hover:text-foreground"
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

        {/* All Cohorts */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">All cohorts</h2>

          <div className="space-y-3">
            {cohorts.map((c) => (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/manager/cohorts/${c.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/manager/cohorts/${c.id}`);
                  }
                }}
                className="rounded-md border border-border bg-background p-4 cursor-pointer transition hover:shadow-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-foreground">{c.name}</h3>
                  <Badge variant={c.status === "active" ? "success" : "tertiary"}>
                    {c.status === "active" ? "Active" : "Starting soon"}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {c.learners} learners enrolled
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    {c.startLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Flag className="h-3.5 w-3.5" aria-hidden />
                    {c.targetLabel}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Overall completion</span>
                    <span>{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="mt-1 h-1.5" />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  {c.notStarted ? (
                    <span className="italic text-muted-foreground">Journey not yet started</span>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5 text-success-dark">
                        <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
                        {c.onTrack} on track
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-warning-foreground dark:text-warning">
                        <span className="h-2 w-2 rounded-full bg-warning" aria-hidden />
                        {c.atRisk} at risk
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-destructive">
                        <span className="h-2 w-2 rounded-full bg-destructive" aria-hidden />
                        {c.critical} critical
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span
                        className={
                          c.coachingNoteVariant === "warning"
                            ? "text-warning-foreground dark:text-warning"
                            : "text-muted-foreground"
                        }
                      >
                        {c.coachingNote}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{c.lastActivity}</span>
                  <span className="text-sm text-primary inline-flex items-center gap-1">
                    View cohort <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </PageContainer>
    </>
  );
}
