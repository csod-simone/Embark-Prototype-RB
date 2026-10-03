import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { TabBar } from "@/components/embark/TabBar";
import { LearnerHeader } from "./learner/LearnerHeader";
import { OverviewTab } from "./learner/OverviewTab";
import { AssessmentsTab } from "./learner/AssessmentsTab";
import { HelpRequestsTab } from "./learner/HelpRequestsTab";
import { AiActivityTab } from "./learner/AiActivityTab";
import { AiRationaleSheet } from "./cohort/AiRationaleSheet";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { useLearnerRecord } from "@/hooks/use-learner-record";

const PROFILE_TABS = ["overview", "assessments", "help_requests", "ai_activity"];

function tabForSignal(search: string, hash: string): string {
  const requested = new URLSearchParams(search).get("tab");
  if (requested && PROFILE_TABS.includes(requested)) return requested;
  if (hash.startsWith("#signal-hand")) return "help_requests";
  if (hash.startsWith("#signal-assessment")) return "assessments";
  return "overview";
}

export default function Learner() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { search, hash } = useLocation();
  const learner = useLearnerRecord(learnerId);

  const [activeTab, setActiveTab] = useState(() => tabForSignal(search, hash));

  useEffect(() => {
    setActiveTab(tabForSignal(search, hash));
  }, [search, hash, learnerId]);
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
        <Link to="/manager/learners" className="mt-4 inline-block text-sm text-secondary-foreground hover:underline">
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
          backTo="/manager/learners"
        />
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "overview" && (
          <OverviewTab learner={learner} forceAiRationale={forceAiRationale} promptCheckIn />
        )}
        {activeTab === "assessments" && (
          <AssessmentsTab
            learnerId={learner.recordsId}
            learnerName={learner.name}
            history={learner.assessments}
          />
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
