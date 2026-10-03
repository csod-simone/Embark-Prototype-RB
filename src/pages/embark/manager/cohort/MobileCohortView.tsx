import { useNavigate, useParams } from "react-router-dom";
import { cohortLearners } from "@/data/mockData";
import { learnersForCohort } from "@/pages/embark/admin/cohorts/enrollmentData";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { BandPill } from "@/components/embark/BandPill";
import { ReadinessDistributionStrip } from "@/components/embark/ReadinessDistributionStrip";

export function MobileHealthStrip() {
  return (
    <div className="p-4 border-b border-border space-y-3">
      <div className="text-xs text-muted-foreground">
        2 At Risk · 3 On Track · 1 Ready · 1 Fast Tracker
      </div>
      <ReadinessDistributionStrip
        counts={{ atRisk: 2, needsAttention: 1, onTrack: 3, ready: 1, fastTracker: 1 }}
        total={8}
      />
    </div>
  );
}

export function MobileLearnerList() {
  const navigate = useNavigate();
  const { cohortId } = useParams();
  const ids = new Set(learnersForCohort(cohortId).map((learner) => learner.id));
  const roster = cohortLearners.filter((learner) => ids.has(learner.id));
  return (
    <div className="p-4 space-y-2">
      {roster.map((l) => (
        <button
          key={l.id}
          onClick={() => navigate(`/manager/learner/${l.id}`)}
          className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-sm hover:bg-muted/40"
        >
          <ReadinessRing score={l.readinessScore} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{l.name}</div>
            <div className="text-xs text-muted-foreground">{l.lastActive}</div>
          </div>
          <BandPill band={l.band} size="sm" />
        </button>
      ))}
    </div>
  );
}