import { useNavigate } from "react-router-dom";
import { Briefcase, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { BrandLogo } from "@/components/embark/BrandLogo";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";

export default function ReadinessIntro() {
  const navigate = useNavigate();
  const { user, project, org } = useReadinessProfile();
  const journeyLabel = org === "rathbones" ? "role readiness" : "project readiness";

  const features = [
    {
      icon: Briefcase,
      label: org === "rathbones" ? "Built for your intake" : "Built for one project",
      description: `Everything here prepares you for ${project.name} — nothing generic.`,
    },
    {
      icon: Sparkles,
      label: org === "rathbones" ? "Learning and role-play" : "More than learning",
      description:
        org === "rathbones"
          ? "Core competencies, line-manager coaching and three client role-plays sit alongside the content you study. CISI Level 4 is completed outside Embark."
          : "Stakeholder meetings, shadowing and real project tasks sit alongside the content you study.",
    },
    {
      icon: ShieldCheck,
      label: "Evidence-based readiness",
      description:
        "Your readiness score is built from completed activities and validated evidence, not guesswork.",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center">
        <BrandLogo className="h-10" />
        <div className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">
          Cornerstone Workforce AI
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-lg p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to your {journeyLabel} journey
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            {project.name} · starts {project.startDate}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-foreground">
            {org === "rathbones"
              ? "You've been enrolled on the Rathbones IM Intake. This pathway covers the full Investment Management competency curriculum, including Vulnerable Clients, Pitching Sales, and Suitability Meetings. Nothing is skipped at the start."
              : "You've been assigned to a new customer project. Project Readiness brings together everything you need before day one — the project context, the people you'll work with, the specific skills the role needs, time observing the work, and real tasks that show you're ready."}
          </p>
          <p className="text-sm text-foreground">
            Embark builds this journey from the{" "}
            {org === "rathbones" ? "intake profile" : "project profile"}, your current skills and the
            assignment notes from your{" "}
            {org === "rathbones" ? "line manager" : "manager"}. As you complete activities, your{" "}
            {journeyLabel} score updates and you'll always be able to see what it is based on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.label} className="rounded-lg bg-muted/60 p-4 flex flex-col gap-2">
              <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <div className="text-sm font-semibold text-foreground">{f.label}</div>
              <div className="text-xs text-muted-foreground">{f.description}</div>
            </div>
          ))}
        </div>

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
            Hi {user.firstName}, I'm Sage, your AI Tutor. I'll be with you through your readiness
            journey for {project.client} — explaining the context, preparing you for{" "}
            {org === "rathbones" ? "client conversations" : "stakeholder conversations"}, and
            helping you get ready with confidence.
          </p>
        </div>

        <Button className="w-full h-11 text-base" onClick={() => navigate("/readiness/signals")}>
          See My Assignment
        </Button>
      </div>
    </div>
  );
}
