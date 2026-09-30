import { History as HistoryIcon } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { HistoryView, type HistoryData } from "@/pages/embark/learner/history/HistoryView";
import { useUpskillerProgress } from "@/hooks/use-upskiller-progress";

const ITEMS = [
  { id: "m1", name: "Objection Handling Fundamentals", date: "28 Jul 2026" },
  { id: "m2", name: "Medicare Advantage — Product Deep Dive", date: "31 Jul 2026" },
  { id: "m3", name: "Compliance Essentials — Regulated Advice Boundaries", date: "3 Aug 2026" },
  { id: "rp1", name: "Objection Handling Role-Play — Skeptical Prospect", date: "4 Aug 2026" },
] as const;

const ASSESSMENTS: Record<string, { score: number }> = {
  m1: { score: 88 },
  m2: { score: 81 },
  m3: { score: 76 },
};

export default function UpskillerHistory() {
  const { statusOf } = useUpskillerProgress();

  const completedIds = ITEMS.filter((i) => statusOf(i.id) === "completed").map((i) => i.id);
  const progressPct = Math.round((completedIds.length / ITEMS.length) * 100);

  const data: HistoryData = {
    status: progressPct === 100 ? "complete" : "in-progress",
    statusLabel: progressPct === 100 ? "Complete" : "In Progress",
    progressPct,
    modules: ITEMS.map((i) => {
      const s = statusOf(i.id);
      return {
        name: i.name,
        status: s === "completed" ? "complete" : s === "in_progress" ? "in-progress" : "not-started",
        date: s === "completed" ? i.date : undefined,
      } as HistoryData["modules"][number];
    }),
    assessments: ITEMS.filter((i) => ASSESSMENTS[i.id] && statusOf(i.id) === "completed").map((i) => ({
      name: `${i.name} Assessment`,
      module: i.name,
      date: i.date,
      score: ASSESSMENTS[i.id].score,
      passed: ASSESSMENTS[i.id].score >= 70,
    })),
    assessmentFooter:
      "Assessments appear here once the matching module has been completed and submitted.",
    completedContent: ITEMS.filter((i) => statusOf(i.id) === "completed").map((i) => ({
      type: i.id === "rp1" ? "Resource" : "Article",
      title: i.name,
      module: i.id === "rp1" ? "Role-play practice" : "Upskilling Journey",
      date: i.date,
    })),
    conversations: [
      {
        date: "28 Jul 2026",
        module: "Objection Handling Fundamentals",
        question: "How do I respond when a customer says the plan is too expensive?",
        response:
          "Reframe the conversation around total cost of care rather than premium alone — acknowledge the concern, clarify what part of the cost feels high, then respond with the specific benefit that addresses it...",
      },
      {
        date: "31 Jul 2026",
        module: "Medicare Advantage — Product Deep Dive",
        question: "What's the clearest way to explain plan option differences on a call?",
        response:
          "Start with the outcome the customer cares about, then map each plan option to that outcome in one sentence each. Avoid listing every feature — CSAT feedback shows clarity matters more than completeness...",
      },
      {
        date: "3 Aug 2026",
        module: "Compliance Essentials",
        question: "Where exactly does the regulated advice boundary sit?",
        response:
          "You can explain features, costs and eligibility factually. You cannot recommend which plan a specific customer should choose — that crosses into regulated advice...",
      },
    ],
    totalConversations: 7,
    showMoreCount: 4,
    handsRaised: [
      {
        date: "30 Jul 2026",
        module: "Objection Handling Fundamentals",
        topic: "Handling repeated price objections",
        note: "Wanted a second example for when the customer repeats the same objection.",
        status: "resolved",
        managerResponse:
          "Shared two call recordings in our 1:1 — try the clarify-then-confirm step earlier next time.",
      },
      {
        date: "4 Aug 2026",
        module: "Compliance Essentials",
        topic: "Advice boundary on plan comparisons",
        note: "Need confirmation on how far I can go when comparing two plans for a customer.",
        status: "pending",
      },
    ],
    milestones: ITEMS.map((i) => ({
      label: i.name,
      subLabel: statusOf(i.id) === "completed" ? `Earned ${i.date}` : "Not yet earned",
      earned: statusOf(i.id) === "completed",
    })).concat({
      label: "Journey Complete",
      subLabel:
        progressPct === 100 ? "Earned 4 Aug 2026" : "Complete all items to earn this",
      earned: progressPct === 100,
      journey: true,
    } as never),
  };

  return (
    <div className="px-4 sm:px-6 py-6">
      <PageContainer as="div">
        {completedIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <HistoryIcon className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">No history yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Once you complete content in your upskilling journey, it will appear here.
            </p>
          </div>
        ) : (
          <HistoryView data={data} journeyName="Upskilling Journey" />
        )}
      </PageContainer>
    </div>
  );
}