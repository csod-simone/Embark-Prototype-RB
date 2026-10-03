import { HistoryView, type HistoryData } from "../history/HistoryView";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

const data: HistoryData = {
  status: "complete",
  statusLabel: "Complete",
  progressPct: 100,
  modules: [
    { name: "Client relationships foundations", status: "complete", date: "14 Jul 2026" },
    { name: "Knowledge check 1", status: "complete", date: "15 Jul 2026" },
    { name: "Discovery and objectives", status: "complete", date: "16 Jul 2026" },
    { name: "Practice — Discovery with James Whitfield", status: "complete", date: "17 Jul 2026" },
    { name: "Knowledge check 2", status: "complete", date: "18 Jul 2026" },
    { name: "Suitability under pressure", status: "complete", date: "20 Jul 2026" },
    { name: "Practice — Suitability under pressure", status: "complete", date: "21 Jul 2026" },
    { name: "Advice documentation", status: "complete", date: "22 Jul 2026" },
    { name: "Knowledge check 3", status: "complete", date: "23 Jul 2026" },
    { name: "Formative — Suitability with Daniel Ellison", status: "complete", date: "24 Jul 2026" },
    { name: "Module assessment", status: "complete", date: "28 Jul 2026" },
    { name: "Chapter gate", status: "complete", date: "29 Jul 2026" },
    { name: "FCA conduct essentials", status: "complete", date: "30 Jul 2026" },
    { name: "Financial crime and market abuse", status: "complete", date: "31 Jul 2026" },
    { name: "Conduct knowledge check", status: "complete", date: "1 Aug 2026" },
    { name: "Discretionary mandate types", status: "complete", date: "4 Aug 2026" },
    { name: "Reporting a portfolio valuation", status: "complete", date: "5 Aug 2026" },
    { name: "Discretionary knowledge check", status: "complete", date: "6 Aug 2026" },
  ],
  assessments: [
    { name: "Knowledge check 1", module: "IM Intake Pathway", date: "15 Jul 2026", score: 91, passed: true },
    { name: "Knowledge check 2", module: "IM Intake Pathway", date: "18 Jul 2026", score: 88, passed: true },
    { name: "Knowledge check 3", module: "IM Intake Pathway", date: "23 Jul 2026", score: 84, passed: true },
    { name: "Module assessment", module: "IM Intake Pathway", date: "28 Jul 2026", score: 86, passed: true },
    { name: "Chapter gate", module: "IM Intake Pathway", date: "29 Jul 2026", score: 90, passed: true },
    { name: "Conduct knowledge check", module: "Compliance Refresher Path", date: "1 Aug 2026", score: 92, passed: true },
    { name: "Discretionary knowledge check", module: "Discretionary Portfolio Management", date: "6 Aug 2026", score: 88, passed: true },
  ],
  completedContent: [
    { type: "Article", title: "Client relationships foundations", module: "IM Intake Pathway", date: "14 Jul 2026" },
    { type: "Article", title: "Discovery and objectives", module: "IM Intake Pathway", date: "16 Jul 2026" },
    { type: "Article", title: "Suitability under pressure", module: "IM Intake Pathway", date: "20 Jul 2026" },
    { type: "Article", title: "Advice documentation", module: "IM Intake Pathway", date: "22 Jul 2026" },
    { type: "Article", title: "FCA conduct essentials", module: "Compliance Refresher Path", date: "30 Jul 2026" },
    { type: "Article", title: "Financial crime and market abuse", module: "Compliance Refresher Path", date: "31 Jul 2026" },
    { type: "Article", title: "Discretionary mandate types", module: "Discretionary Portfolio Management", date: "4 Aug 2026" },
    { type: "Article", title: "Reporting a portfolio valuation", module: "Discretionary Portfolio Management", date: "5 Aug 2026" },
  ],
  conversations: [
    { date: "16 Jul 2026", module: "IM Intake Pathway", question: "What should I confirm before a discovery conversation?", response: "Start with the client's objectives, time horizon, and the mandate you are allowed to advise on. Discovery is about what the client wants the portfolio to do." },
    { date: "22 Jul 2026", module: "IM Intake Pathway", question: "When do I record the suitability decision in the file note?", response: "After you have checked the mandate and agreed the recommendation. The file note should say what you considered, why it is suitable, and the fee share you explained." },
    { date: "30 Jul 2026", module: "Compliance Refresher Path", question: "What counts as market abuse in a client conversation?", response: "Using or sharing information that is not yet public, or encouraging a trade that would mislead the market. If you are unsure, stop and check with compliance before you continue." },
    { date: "5 Aug 2026", module: "Discretionary Portfolio Management", question: "What has to be in a portfolio valuation report?", response: "The mandate, the period covered, performance against the objective, and the main changes you made. The client should be able to see why the portfolio looks the way it does." },
  ],
  totalConversations: 4,
  showMoreCount: 0,
  handsRaised: [
    {
      date: "17 Jul 2026",
      module: "IM Intake Pathway",
      topic: "Discovery — what to ask James Whitfield",
      note: "Wanted a plain walkthrough before the practice role-play.",
      status: "resolved",
      managerResponse: "We covered objectives, time horizon, and the mandate on our 1:1. You handled the role-play well after that.",
    },
    {
      date: "22 Jul 2026",
      module: "IM Intake Pathway",
      topic: "File note after a suitability conversation",
      note: "Needed a real example of what has to be recorded.",
      status: "resolved",
      managerResponse: "Shared a sample file note from a discretionary review. The structure locked it in.",
    },
  ],
  milestones: [
    { label: "IM Intake Pathway complete", subLabel: "Earned 29 Jul 2026", earned: true },
    { label: "Compliance Refresher Path complete", subLabel: "Earned 1 Aug 2026", earned: true },
    { label: "Discretionary Portfolio Management complete", subLabel: "Earned 6 Aug 2026", earned: true },
    { label: "Journey complete", subLabel: "Earned 6 Aug 2026", earned: true, journey: true },
  ],
};

export default function GraduatingHistory() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageContainer as="div" className="max-w-[880px] py-6">
        <HistoryView data={data} journeyName="Investment Manager Full Onboarding Journey" />
      </PageContainer>
    </div>
  );
}
