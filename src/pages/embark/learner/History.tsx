import { GlobalHeader } from "@/components/embark/GlobalHeader";
import { HistoryView, type HistoryData } from "./history/HistoryView";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { LearnerSurface } from "@/components/embark/layouts/LearnerSurface";

export const historyData: HistoryData = {
  status: "in-progress",
  statusLabel: "In Progress",
  progressPct: 8,
  modules: [
    { name: "Client relationships foundations", status: "complete", date: "14 Jul 2026" },
    { name: "Knowledge check 1", status: "in-progress" },
    { name: "Discovery and objectives", status: "not-started" },
    { name: "Practice — Discovery with James Whitfield", status: "not-started" },
    { name: "Knowledge check 2", status: "not-started" },
    { name: "Suitability under pressure", status: "not-started" },
    { name: "Practice — Suitability under pressure", status: "not-started" },
    { name: "Advice documentation", status: "not-started" },
    { name: "Knowledge check 3", status: "not-started" },
    { name: "Formative — Suitability with Daniel Ellison", status: "not-started" },
    { name: "Module assessment", status: "not-started" },
    { name: "Chapter gate", status: "not-started" },
  ],
  assessments: [],
  assessmentFooter: "Knowledge checks, the module assessment, and the chapter gate will appear here once submitted.",
  completedContent: [
    { type: "Article", title: "Client relationships foundations", module: "IM Intake Pathway", date: "14 Jul 2026" },
  ],
  conversations: [
    { date: "14 Jul 2026", module: "IM Intake Pathway", question: "What should I confirm before I start a discovery conversation?", response: "Start with the client's objectives and the mandate you are allowed to advise on. Discovery is about what the client wants the portfolio to do, not about quoting a product yet." },
    { date: "15 Jul 2026", module: "IM Intake Pathway", question: "When do I record the suitability decision in the file note?", response: "After you have checked the mandate and agreed the recommendation. The file note should say what you considered, why it is suitable, and the fee share you explained." },
  ],
  totalConversations: 2,
  showMoreCount: 0,
  handsRaised: [
    {
      date: "15 Jul 2026",
      module: "IM Intake Pathway",
      topic: "Discovery — what to ask James Whitfield",
      note: "I want to check the discovery questions before the practice role-play.",
      status: "resolved",
      managerResponse: "We walked through objectives, time horizon, and the mandate on our 1:1. Use those three before you open the role-play.",
    },
    {
      date: "16 Jul 2026",
      module: "IM Intake Pathway",
      topic: "Knowledge check 1 — how retakes are logged",
      note: "Wanted to confirm how a retake is recorded before I submit again.",
      status: "pending",
    },
  ],
  milestones: [
    { label: "Client relationships foundations", subLabel: "Earned 14 Jul 2026", earned: true },
    { label: "Knowledge check 1", subLabel: "In progress", earned: false },
    { label: "IM Intake Pathway complete", subLabel: "Complete the remaining sessions to earn this", earned: false, journey: true },
  ],
};

export default function History() {
  return (
    <LearnerSurface header={<GlobalHeader title="My History" />}>
      <div className="flex-1 overflow-y-auto">
        <PageContainer as="div" className="py-6">
          <HistoryView data={historyData} journeyName="Investment Manager Full Onboarding Journey" />
        </PageContainer>
      </div>
    </LearnerSurface>
  );
}
