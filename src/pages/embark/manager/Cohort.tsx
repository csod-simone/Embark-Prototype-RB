import { useState } from "react";
import { useParams } from "react-router-dom";
import { TabBar } from "@/components/embark/TabBar";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/embark/StatTile";
import { ReadinessDistributionStrip } from "@/components/embark/ReadinessDistributionStrip";
import { useIsMobile } from "@/hooks/use-mobile";
import { helpRequests, approvals } from "@/data/mockData";
import { useCohortFilters } from "./cohort/useCohortFilters";
import { OverviewTab } from "./cohort/OverviewTab";
import { AtRiskTab } from "./cohort/AtRiskTab";
import { HelpTab } from "./cohort/HelpTab";
import { ApprovalsTab } from "./cohort/ApprovalsTab";
import { MobileHealthStrip, MobileLearnerList } from "./cohort/MobileCohortView";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { learnersForCohort } from "@/pages/embark/admin/cohorts/enrollmentData";

export default function Cohort() {
  const { cohortId } = useParams();
  const enrolledCount = learnersForCohort(cohortId).length;
  const isMobile = useIsMobile();
  const filters = useCohortFilters();
  const [activeTab, setActiveTab] = useState("overview");
  const [focusHelpId, setFocusHelpId] = useState<string | null>(null);

  const [responded, setResponded] = useState<Set<string>>(new Set());
  const [decidedSkips, setDecidedSkips] = useState<Set<string>>(new Set());
  const [decidedRetakes, setDecidedRetakes] = useState<Set<string>>(new Set());

  const openHelp = helpRequests.filter((h) => !responded.has(h.id)).length;
  const openApprovals =
    approvals.moduleSkips.filter((s) => !decidedSkips.has(s.id)).length +
    approvals.retakes.filter((r) => !decidedRetakes.has(r.id)).length;
  const atRiskCount = 2;

  const tabs = [
    { id: "overview", label: "OVERVIEW" as const },
    { id: "at_risk", label: "AT RISK", badge: atRiskCount, badgeVariant: "danger" as const },
    ...(openHelp > 0 ? [{ id: "help", label: "HANDS RAISED", badge: openHelp, badgeVariant: "warning" as const }] : [{ id: "help", label: "HANDS RAISED" }]),
    ...(openApprovals > 0
      ? [{ id: "approvals", label: "APPROVALS", badge: openApprovals, badgeVariant: "default" as const }]
      : [{ id: "approvals", label: "APPROVALS" }]),
  ];


  const switchToHelp = (id?: string) => {
    setActiveTab("help");
    if (id) setFocusHelpId(id);
  };

  const desktopContent = (
    <PageContainer as="div">
      <div className="py-2 text-xs text-muted-foreground border-b border-border">
        July 14 – August 15, 2026 · {enrolledCount} enrolled · 2 at risk · 0 complete
      </div>
      <div className="pt-4 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatTile label="ENROLLED" value={String(enrolledCount)} className="rounded-2xl shadow-sm" />
          <button type="button" onClick={() => filters.setBand("At Risk")} className="text-left">
            <StatTile label="AT RISK" value="2" variant="danger" className="rounded-2xl shadow-sm" />
          </button>
          <StatTile label="ON TRACK" value="3" variant="success" className="rounded-2xl shadow-sm" />
          <StatTile label="COMPLETE" value="0" variant="muted" className="rounded-2xl shadow-sm" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <ReadinessDistributionStrip
            counts={{ atRisk: 2, needsAttention: 1, onTrack: 3, ready: 1, fastTracker: 1 }}
            total={8}
            onSegmentClick={filters.setBand}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Assign coaching</Button>
          <Button variant="secondary">Export cohort CSV</Button>
        </div>
      </div>
      <div className="pt-4">
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="flex-1">
        {activeTab === "overview" && (
          <OverviewTab
            bandFilter={filters.band}
            onClearFilter={filters.clear}
            onRespond={(id) => switchToHelp(id === "l1" ? "hr1" : id === "l3" ? "hr2" : undefined)}
          />
        )}
        {activeTab === "at_risk" && (
          <AtRiskTab onRespond={(id) => switchToHelp(id === "l1" ? "hr1" : id === "l3" ? "hr2" : undefined)} />
        )}
        {activeTab === "help" && (
          <HelpTab
            respondedIds={responded}
            focusId={focusHelpId}
            onSendResponse={(id) => setResponded((p) => new Set(p).add(id))}
          />
        )}
        {activeTab === "approvals" && (
          <ApprovalsTab
            decidedSkips={decidedSkips}
            onDecideSkip={(id) => setDecidedSkips((p) => new Set(p).add(id))}
            decidedRetakes={decidedRetakes}
            onDecideRetake={(id) => setDecidedRetakes((p) => new Set(p).add(id))}
            onSwitchToHelp={() => switchToHelp("hr1")}
          />
        )}
      </div>
    </PageContainer>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col">
        <MobileHealthStrip />
        <div className="px-2 pt-2 overflow-x-auto">
          <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        {activeTab === "overview" && <MobileLearnerList />}
        {activeTab === "at_risk" && (
          <AtRiskTab onRespond={(id) => switchToHelp(id === "l1" ? "hr1" : id === "l3" ? "hr2" : undefined)} />
        )}
        {activeTab === "help" && (
          <HelpTab
            respondedIds={responded}
            focusId={focusHelpId}
            onSendResponse={(id) => setResponded((p) => new Set(p).add(id))}
          />
        )}
        {activeTab === "approvals" && (
          <ApprovalsTab
            decidedSkips={decidedSkips}
            onDecideSkip={(id) => setDecidedSkips((p) => new Set(p).add(id))}
            decidedRetakes={decidedRetakes}
            onDecideRetake={(id) => setDecidedRetakes((p) => new Set(p).add(id))}
            onSwitchToHelp={() => switchToHelp("hr1")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-w-0 overflow-y-auto">{desktopContent}</div>
  );
}
