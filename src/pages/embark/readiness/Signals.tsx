import { useNavigate } from "react-router-dom";
import { Briefcase, CalendarDays, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";

export default function ReadinessSignals() {
  const navigate = useNavigate();
  const { user, project, org } = useReadinessProfile();

  const signals =
    org === "rathbones"
      ? [
          {
            label: "Intake profile",
            value: "IM Intake · Wealth Management · Investment Management · London",
            note: "Drives the qualifications and core competency activities in your journey.",
          },
          {
            label: "Role on the intake",
            value: `${project.role} — Managing Clients competency focus`,
            note: "Sets the skills and client role-play activities.",
          },
          {
            label: "Your current skill profile",
            value: "Strong on markets · newer to suitability conversations under pressure",
            note: "Adds Managing Clients role-play practice and extra shadowing with your line manager.",
          },
          {
            label: "Line manager assignment notes",
            value: project.assignmentNote,
            note: `From ${project.assignedBy}, ${project.assignedByRole}.`,
          },
        ]
      : [
          {
            label: "Project profile",
            value: "Platform migration · regulated client · 6-month delivery",
            note: "Drives the context and knowledge activities in your journey.",
          },
          {
            label: "Role on the project",
            value: `${project.role} — data migration workstream`,
            note: "Sets the skills and practical execution activities.",
          },
          {
            label: "Your current skill profile",
            value: "Strong on integration design · newer to regulated client delivery",
            note: "Adds client communication practice and extra shadowing.",
          },
          {
            label: "Manager assignment notes",
            value: project.assignmentNote,
            note: `From ${project.assignedBy}, ${project.assignedByRole}.`,
          },
        ];

  return (
    <PageContainer as="div" className="flex-1 flex flex-col gap-6 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Your assignment, {user.firstName}</h1>
        <p className="text-sm text-muted-foreground">
          These are the inputs Embark used to build your readiness journey.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground">
            <Briefcase size={13} aria-hidden="true" />{" "}
            {org === "rathbones" ? "INTAKE" : "PROJECT"}
          </div>
          <div className="mt-1 text-sm font-semibold">{project.name}</div>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground">
            <CalendarDays size={13} aria-hidden="true" /> START DATE
          </div>
          <div className="mt-1 text-sm font-semibold">{project.startDate}</div>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground">
            <UserCheck size={13} aria-hidden="true" /> ASSIGNED BY
          </div>
          <div className="mt-1 text-sm font-semibold">{project.assignedBy}</div>
        </div>
      </div>

      <div className="space-y-3">
        {signals.map((s) => (
          <LeftBorderCard key={s.label} borderVariant="brand">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              {s.label}
            </div>
            <div className="mt-1 text-sm font-medium text-foreground">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.note}</div>
          </LeftBorderCard>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button className="h-11 text-base px-6" onClick={() => navigate("/readiness/generating")}>
          Build My Readiness Journey
        </Button>
      </div>
    </PageContainer>
  );
}
