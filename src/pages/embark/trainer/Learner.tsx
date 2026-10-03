import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TabBar } from "@/components/embark/TabBar";
import { LearnerHeader } from "../manager/learner/LearnerHeader";
import { OverviewTab } from "../manager/learner/OverviewTab";
import { AssessmentsTab } from "../manager/learner/AssessmentsTab";
import { HelpRequestsTab } from "../manager/learner/HelpRequestsTab";
import { AiActivityTab } from "../manager/learner/AiActivityTab";
import { AiRationaleSheet } from "../manager/cohort/AiRationaleSheet";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { useLearnerRecord } from "@/hooks/use-learner-record";

export default function TrainerLearner() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const learner = useLearnerRecord(learnerId);

  const [activeTab, setActiveTab] = useState("overview");
  const [forceAiRationale] = useState(false);
  const [rationaleOpen, setRationaleOpen] = useState(false);

  const openHands = learner?.handsRaised.filter((h) => h.status === "open").length ?? 0;

  if (!learner) {
    return (
      <PageContainer as="div" className="py-10">
        <h2 className="text-xl font-semibold text-foreground">Learner not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t find the learner you selected.
        </p>
        <Link to="/trainer/learners" className="mt-4 inline-block text-sm text-secondary-foreground hover:underline">
          Back to my learners
        </Link>
      </PageContainer>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "assessments", label: "Assessments" },
    { id: "help_requests", label: "Hands Raised", badge: openHands, badgeVariant: "warning" as const },
    { id: "ai_activity", label: "Sage Activity" },
  ];

  return (
    <>
      <PageContainer as="div" className="space-y-4 py-4">
        <LearnerHeader
          learner={learner}
          helpBadge={openHands}
          onRespondToHelp={() => setActiveTab("help_requests")}
          onViewAiRationale={() => setRationaleOpen(true)}
          backTo="/trainer/learners"
        />
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "overview" && (
          <OverviewTab learner={learner} forceAiRationale={forceAiRationale} />
        )}
        {activeTab === "assessments" && (
          <AssessmentsTab learnerId={learner.recordsId} learnerName={learner.name} history={learner.assessments} />
        )}
        {activeTab === "help_requests" && <HelpRequestsTab learner={learner} />}
        {activeTab === "ai_activity" && <AiActivityTab learner={learner} />}
      </PageContainer>
      <AiRationaleSheet
        open={rationaleOpen}
        onOpenChange={setRationaleOpen}
        learnerName={learner.name}
      />
    </>
  );
}
