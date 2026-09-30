import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { TabBar } from "@/components/embark/TabBar";
import { LearnerHeader } from "@/pages/embark/manager/learner/LearnerHeader";
import { OverviewTab } from "@/pages/embark/manager/learner/OverviewTab";
import { AssessmentsTab } from "@/pages/embark/manager/learner/AssessmentsTab";
import { HelpRequestsTab } from "@/pages/embark/manager/learner/HelpRequestsTab";
import { AiActivityTab } from "@/pages/embark/manager/learner/AiActivityTab";
import { AiRationaleSheet } from "@/pages/embark/manager/cohort/AiRationaleSheet";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { useLearnerRecord } from "@/hooks/use-learner-record";
import { Badge } from "@/components/ui/badge";
import { VersionMarkers } from "@/components/embark/admin/ContentVersionDetails";
import {
  VERSIONED_CONTENT_TITLE,
  VERSIONED_JOURNEY_NAME,
  assignmentForLearner,
  currentContentVersion,
  versionScopeForCohort,
} from "@/data/contentVersioning";
import { SEED_COHORTS } from "@/pages/embark/admin/cohorts/data";

/** Admin opens the same learner profile to view time on a module, without a check-in prompt. */
export default function AdminLearnerProfile() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { search } = useLocation();
  const learner = useLearnerRecord(learnerId);

  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(search).get("tab");
    const validTabs = ["overview", "assessments", "help_requests", "ai_activity"];
    return validTabs.includes(tab ?? "") ? (tab as string) : "overview";
  });
  const [rationaleOpen, setRationaleOpen] = useState(false);

  const openHands = learner?.handsRaised.filter((hand) => hand.status === "open").length ?? 0;
  const versioned = assignmentForLearner(learnerId);

  if (versioned) {
    const cohort = SEED_COHORTS.find((item) => item.id === versioned.cohortId);
    const scope = versionScopeForCohort(versioned.cohortId);
    return (
      <PageContainer as="div" className="py-6 space-y-6">
        <Link
          to={`/admin/cohorts/${versioned.cohortId}/enrollment`}
          className="text-sm text-secondary-foreground hover:underline"
        >
          Back to {cohort?.name ?? "cohort"}
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{versioned.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{versioned.email}</p>
        </div>
        <div className="rounded-md border border-border bg-background p-4 space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">{VERSIONED_CONTENT_TITLE}</h2>
            <Badge variant={versioned.versionId === currentContentVersion().id ? "success" : "secondary"}>{versioned.versionId}</Badge>
            {scope && <VersionMarkers scope={scope} />}
          </div>
          <p className="text-sm text-muted-foreground">{versioned.reason}</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Journey</dt>
              <dd className="text-foreground">{VERSIONED_JOURNEY_NAME}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Cohort</dt>
              <dd className="text-foreground">{cohort?.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Status on this content</dt>
              <dd className="text-foreground">
                {versioned.status === "completed"
                  ? `Completed ${versioned.versionId}`
                  : versioned.status === "in_progress"
                    ? `In progress on ${versioned.versionId}`
                    : `Not started · assigned ${versioned.versionId}`}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            This version is visible to admin only. The learner is not shown a version number.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!learner) {
    return (
      <PageContainer as="div" className="py-10">
        <h2 className="text-xl font-semibold text-foreground">Learner not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">We couldn&apos;t find the learner you selected.</p>
        <Link to="/admin/cohorts" className="mt-4 inline-block text-sm text-secondary-foreground hover:underline">
          Back to cohorts
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
      <LearnerHeader
        learner={learner}
        helpBadge={openHands}
        onRespondToHelp={() => setActiveTab("help_requests")}
        onViewAiRationale={() => setRationaleOpen(true)}
        readOnly
        backTo="/admin/cohorts"
        backLabel="Back to cohorts"
      />
      <div className="px-6 pt-4 bg-background">
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <PageContainer as="div" className="py-6">
        {activeTab === "overview" && (
          <OverviewTab learner={learner} forceAiRationale={false} readOnly />
        )}
        {activeTab === "assessments" && (
          <AssessmentsTab
            learnerId={learner.recordsId}
            learnerName={learner.name}
            history={learner.assessments}
            readOnly
          />
        )}
        {activeTab === "help_requests" && <HelpRequestsTab learner={learner} readOnly />}
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
