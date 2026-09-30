import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, GraduationCap, Info, ArrowDown, ArrowUp, Clock } from "lucide-react";
import { BandPill } from "@/components/embark/BandPill";
import { ActionIconRow } from "@/components/embark/ActionIconRow";
import { ChevronRight } from "lucide-react";
import { cohortLearners, type BandLabel, type CohortLearner } from "@/data/mockData";
import { learnersForCohort } from "@/pages/embark/admin/cohorts/enrollmentData";
import { getExtras } from "./mockExtras";
import { AiRationaleSheet } from "./AiRationaleSheet";
import { cn } from "@/lib/utils";

const bandOrder: Record<BandLabel, number> = {
  "At Risk": 0,
  "Needs Attention": 1,
  "On Track": 2,
  Ready: 3,
  "Fast Tracker": 4,
};

const lastActiveOrder = [
  "1 hour ago",
  "2 hours ago",
  "3 hours ago",
  "6 hours ago",
  "1 day ago",
  "4 days ago",
];
function activeRank(s: string) {
  const i = lastActiveOrder.indexOf(s);
  return i === -1 ? 99 : -i; // older = smaller rank
}

function bandBorderColor(band: BandLabel) {
  switch (band) {
    case "At Risk": return "bg-destructive";
    case "Needs Attention": return "bg-warning";
    case "On Track": return "bg-success";
    case "Ready": return "bg-secondary-foreground";
    case "Fast Tracker": return "bg-accent";
  }
}

function isStale(s: string) {
  return /^\d+ days ago$/.test(s) && parseInt(s) >= 4;
}

function FlagChip({ label, variant }: { label: string; variant: "danger" | "warning" | "muted" }) {
  const styles = {
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning-foreground dark:text-warning",
    muted: "bg-muted text-muted-foreground",
  }[variant];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", styles)}>
      {label}
    </span>
  );
}

export function LearnerTable({
  filterBands,
  onRespond,
  defaultExpandedId = "l3",
  search = "",
}: {
  filterBands?: BandLabel[];
  onRespond?: (id: string) => void;
  defaultExpandedId?: string;
  search?: string;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [defaultExpandedId]: true,
  });
  const [rationaleFor, setRationaleFor] = useState<CohortLearner | null>(null);

  const { cohortId } = useParams();
  const roster = useMemo(() => {
    const ids = new Set(learnersForCohort(cohortId).map((learner) => learner.id));
    return cohortLearners.filter((learner) => ids.has(learner.id));
  }, [cohortId]);

  const rows = useMemo(() => {
    let r = [...roster];
    if (filterBands && filterBands.length) {
      r = r.filter((l) => filterBands.includes(l.band));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((l) => l.name.toLowerCase().includes(q));
    }
    r.sort((a, b) => {
      const bo = bandOrder[a.band] - bandOrder[b.band];
      if (bo !== 0) return bo;
      return activeRank(a.lastActive) - activeRank(b.lastActive);
    });
    return r;
  }, [filterBands, roster, search]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-[24px_2fr_1.4fr_1.2fr_1.1fr_1.2fr_0.9fr_1.4fr] gap-3 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-muted-foreground bg-muted/40 border-b border-border">
        <span />
        <span>Name</span>
        <span>Progress</span>
        <span>Readiness</span>
        <span>Last Active</span>
        <span>Status</span>
        <span>Open Items</span>
        <span className="text-right">Actions</span>
      </div>
      <div className="divide-y divide-border">
        {rows.map((l) => (
          <LearnerRow
            key={l.id}
            l={l}
            expanded={!!expanded[l.id]}
            onToggle={() => setExpanded((p) => ({ ...p, [l.id]: !p[l.id] }))}
            onNavigate={() => navigate(`/manager/learner/${l.id}`)}
            onRespond={() => onRespond?.(l.id)}
            onViewRationale={() => setRationaleFor(l)}
          />
        ))}
        {rows.length === 0 && (
          <div className="px-4 py-8 text-sm text-muted-foreground text-center">
            No learners match this filter.
          </div>
        )}
      </div>
      <AiRationaleSheet
        open={!!rationaleFor}
        onOpenChange={(o) => !o && setRationaleFor(null)}
        learnerName={rationaleFor?.name ?? ""}
      />
    </div>
  );
}

function LearnerRow({
  l,
  expanded,
  onToggle,
  onNavigate,
  onRespond,
  onViewRationale,
}: {
  l: CohortLearner;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  onRespond: () => void;
  onViewRationale: () => void;
}) {
  const extras = getExtras(l);
  const stale = isStale(l.lastActive);

  const row = (
    <div className="grid grid-cols-[24px_2fr_1.4fr_1.2fr_1.1fr_1.2fr_0.9fr_1.4fr] gap-3 items-center w-full px-4 py-3 hover:bg-muted/30 transition-colors">
      <button
        type="button"
        aria-label={expanded ? "Collapse" : "Expand"}
        aria-expanded={expanded}
        onClick={onToggle}
        className="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted"
      >
        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-90")} />
      </button>
      <button
        type="button"
        onClick={onNavigate}
        className="text-left text-sm font-medium text-secondary-foreground hover:underline truncate"
      >
        {l.name}
      </button>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${l.progress}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{l.progress}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("w-1 h-8 rounded-sm", bandBorderColor(l.band))} />
        <div>
          <div className="text-sm font-medium text-foreground">{l.readinessScore}</div>
          <div className="text-[11px] text-muted-foreground">{l.band}</div>
        </div>
      </div>
      <span className={cn("text-xs", stale ? "text-warning-foreground dark:text-warning" : "text-muted-foreground")}>{l.lastActive}</span>
      <div><BandPill band={l.band} size="sm" /></div>
      <div>
        {l.openItems > 0 && (
          <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-destructive text-destructive-foreground text-[11px] font-semibold px-1.5">
            {l.openItems}
          </span>
        )}
      </div>
      <div className="flex justify-end">
        <ActionIconRow
          actions={[
            { icon: <MessageSquare className="h-4 w-4" />, label: "Respond to hand raised", onClick: onRespond },
            { icon: <GraduationCap className="h-4 w-4" />, label: "Assign coaching", onClick: () => {} },
            { icon: <Info className="h-4 w-4" />, label: "View AI rationale", onClick: onViewRationale },
          ]}
        />
      </div>
    </div>
  );

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/40 rounded-md p-4">
      <div>
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-2">Top factors</div>
        {extras.topFactors.length ? (
          <ul className="space-y-1.5">
            {extras.topFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm">
                {f.direction === "down" ? (
                  <ArrowDown className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                ) : (
                  <ArrowUp className="h-3.5 w-3.5 text-success-dark mt-0.5 shrink-0" />
                )}
                <span className="text-foreground">{f.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted-foreground">No active concerns</div>
        )}
      </div>
      <div>
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-2">Last tutor interaction</div>
        <div className={cn("text-sm", extras.lastTutor.startsWith("No") ? "text-muted-foreground" : "text-foreground")}>
          {extras.lastTutor}
        </div>
      </div>
      <div>
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-2">Active flags</div>
        {extras.flags.length ? (
          <div className="flex flex-wrap gap-1.5">
            {extras.flags.map((f, i) => <FlagChip key={i} {...f} />)}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">—</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {row}
      {expanded && <div className="px-4 pb-4 pl-12">{content}</div>}
    </div>
  );
}

export function AtRiskCallout() {
  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-warning-foreground dark:text-warning pl-4">
      <Clock className="h-3.5 w-3.5" />
      <span>Flagged 2 days ago · Unacknowledged 28 hours</span>
    </div>
  );
}