import { History as HistoryIcon } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { HistoryView, type HistoryData } from "@/pages/embark/learner/history/HistoryView";
import { useReadinessProgress } from "@/hooks/use-readiness-progress";
import { useReadinessProfile } from "@/hooks/use-readiness-profile";

export default function ReadinessHistory() {
  const { statusOf, completedCount, totalCount } = useReadinessProgress();
  const { project, activities, sections, org } = useReadinessProfile();
  const journey =
    org === "rathbones"
      ? `Role Readiness — ${project.name}`
      : `Project Readiness — ${project.client}`;
  const completed = activities.filter((a) => statusOf(a.id) === "completed");
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const sectionTitle = (id: string) => sections.find((s) => s.id === id)?.title ?? journey;
  const dateLabel = org === "rathbones" ? "Feb 2026" : "Sep 2026";

  const data: HistoryData = {
    status: progressPct === 100 ? "complete" : "in-progress",
    statusLabel:
      progressPct === 100
        ? org === "rathbones"
          ? "Ready for client meetings"
          : "Ready for project"
        : "Readiness in progress",
    progressPct,
    modules: sections.map((s) => {
      const items = activities.filter((a) => a.section === s.id);
      const done = items.filter((a) => statusOf(a.id) === "completed").length;
      return {
        name: s.title,
        status: done === items.length ? "complete" : done > 0 ? "in-progress" : "not-started",
        date: done > 0 ? dateLabel : undefined,
      };
    }),
    assessments: completed
      .filter((a) => a.type === "LEARNING")
      .map((a) => ({
        name: a.name,
        module: sectionTitle(a.section),
        date: dateLabel,
        score: 86,
        passed: true,
      })),
    assessmentFooter:
      "Assessments appear here once the matching readiness activity has been completed.",
    completedContent: completed.map((a) => ({
      type: a.type === "LEARNING" ? "Article" : "Resource",
      title: a.name,
      module: sectionTitle(a.section),
      date: dateLabel,
    })),
    conversations:
      org === "rathbones"
        ? [
            {
              date: "3 Feb 2026",
              module: "Intake Context",
              question: "What should I prioritise in week one of IM Intake?",
              response:
                "Start with UK Regulation and Professional Integrity, then book your first Managing Clients role-play with Phoebe. Suitability conversations are where most associates need the most practice...",
            },
            {
              date: "5 Feb 2026",
              module: "Manager & Client Readiness",
              question: "How should I prepare for my first meeting with Phoebe Kapoor?",
              response:
                "Bring one suitability conversation you found difficult and one question about documenting advice. Line-manager coaching works best when you arrive with a real scenario...",
            },
          ]
        : [
            {
              date: "14 Sep 2026",
              module: "Project Context",
              question: "What is the biggest delivery risk on the Meridian migration?",
              response:
                "Cutover timing. The client runs regulated reporting at month end, so the reconciliation window is tight and rehearsals matter more than usual...",
            },
            {
              date: "16 Sep 2026",
              module: "Stakeholder Readiness",
              question: "How should I prepare for my first meeting with the sponsor?",
              response:
                "Come with two questions about success measures and one about escalation preferences. Sponsors value focus over coverage in a first conversation...",
            },
          ],
    totalConversations: 5,
    showMoreCount: 3,
    handsRaised:
      org === "rathbones"
        ? [
            {
              date: "6 Feb 2026",
              module: "Qualifications & Core Competencies",
              topic: "Documenting suitability after a nervous client meeting",
              note: "Wanted a worked example of a suitability file note after a cash-heavy request.",
              status: "resolved",
              managerResponse: "Walked through a model file note in our faculty check-in.",
            },
          ]
        : [
            {
              date: "17 Sep 2026",
              module: "Knowledge & Skills",
              topic: "Reconciliation approach for phased cutover",
              note: "Wanted a worked example of reconciliation across two phases.",
              status: "resolved",
              managerResponse: "Walked through the phase-one reconciliation pack in our check-in.",
            },
          ],
    milestones: sections
      .map((s) => {
        const items = activities.filter((a) => a.section === s.id);
        const earned = items.every((a) => statusOf(a.id) === "completed");
        return {
          label: s.title,
          subLabel: earned ? `Earned ${dateLabel}` : "Not yet earned",
          earned,
        };
      })
      .concat({
        label: org === "rathbones" ? "Client Meeting Ready" : "Project Ready",
        subLabel:
          progressPct === 100
            ? `Earned ${dateLabel}`
            : "Complete all activities to earn this",
        earned: progressPct === 100,
        journey: true,
      } as never),
  };

  return (
    <div className="px-4 sm:px-6 py-6">
      <PageContainer as="div">
        {completed.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <HistoryIcon className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">No history yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Once you complete activities in your readiness journey, they will appear here.
            </p>
          </div>
        ) : (
          <HistoryView data={data} journeyName={journey} />
        )}
      </PageContainer>
    </div>
  );
}
