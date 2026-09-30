import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { ReadinessDistributionStrip } from "@/components/embark/ReadinessDistributionStrip";
import { TabBar } from "@/components/embark/TabBar";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { ReadinessRing } from "@/components/embark/ReadinessRing";
import { BandPill } from "@/components/embark/BandPill";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { trainerEvents, type TrainerRosterEntry } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

type Filter = "all" | "incomplete" | "atRisk";

function bandOf(score: number) {
  if (score < 50) return "At Risk";
  if (score < 70) return "Needs Attention";
  if (score < 85) return "On Track";
  if (score < 100) return "Ready";
  return "Fast Tracker";
}

export default function EventRoster() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const event = trainerEvents.find((e) => e.id === eventId) ?? trainerEvents[0];
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<TrainerRosterEntry | null>(null);

  const total =
    event.readinessSummary.atRisk + event.readinessSummary.needsAttention +
    event.readinessSummary.onTrack + event.readinessSummary.ready + event.readinessSummary.fastTracker;

  const rows = useMemo(() => {
    if (filter === "incomplete") return event.roster.filter((r) => r.prerequisiteStatus === "incomplete");
    if (filter === "atRisk") return event.roster.filter((r) => bandOf(r.readinessScore) === "At Risk");
    return event.roster;
  }, [event.roster, filter]);

  const chip = (id: Filter, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setFilter(id)}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        filter === id
          ? "bg-secondary text-secondary-foreground border-transparent"
          : "bg-background text-muted-foreground border-border hover:bg-muted",
      )}
    >
      {label}
    </button>
  );

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground">{event.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">Jul 24, 2026 · 9:00 AM · In-person · {event.location}</p>
          <p className="text-sm text-muted-foreground">{event.registered} / {event.capacity} registered</p>
          <div className="mt-4">
            <ReadinessDistributionStrip counts={event.readinessSummary} total={total} />
          </div>
        </div>

        <TabBar
          tabs={[
            { id: "roster", label: "Roster" },
            { id: "attendance", label: "Attendance" },
          ]}
          activeTab="roster"
          onTabChange={(id) => id === "attendance" && navigate(`/trainer/events/${event.id}/attendance`)}
        />

        <LeftBorderCard borderVariant="warning">
          <div className="flex flex-col gap-1">
            <p className="text-sm">⚠ 2 learners have not completed all prerequisite modules. Consider reaching out before the event.</p>
            <button
              type="button"
              onClick={() => setFilter("incomplete")}
              className="text-sm text-secondary-foreground hover:underline self-start"
            >
              View incomplete learners ↗
            </button>
          </div>
        </LeftBorderCard>

        <div className="flex items-center justify-between gap-3 py-2 border-b border-border">
          <div className="flex gap-2 flex-wrap">
            {chip("incomplete", "Prerequisites incomplete")}
            {chip("atRisk", "At Risk")}
            {chip("all", "All learners")}
          </div>
          <span className="text-xs text-muted-foreground">Sort by: Name</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Prerequisites</th>
                <th className="text-left p-3">Readiness</th>
                <th className="text-left p-3">Last Active</th>
                <th className="text-left p-3 hidden md:table-cell">Last Checkpoint</th>
                <th className="text-left p-3 hidden md:table-cell">Role Play</th>
                <th className="text-left p-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const band = bandOf(r.readinessScore) as any;
                const preIcon = r.prerequisiteStatus === "complete"
                  ? <CheckCircle2 className="h-4 w-4 text-success-dark" />
                  : r.missingModules.length >= 2
                    ? <XCircle className="h-4 w-4 text-destructive" />
                    : <AlertTriangle className="h-4 w-4 text-warning-foreground dark:text-warning" />;
                const rolePlayColor =
                  r.rolePlayPerformance === "Below threshold" ? "text-destructive"
                  : r.rolePlayPerformance === "Exceeding threshold" ? "text-secondary-foreground"
                  : "text-success-dark";
                const roleIcon = r.rolePlayPerformance === "Below threshold" ? "↓"
                  : r.rolePlayPerformance === "Exceeding threshold" ? "★" : "✓";
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="border-t border-border hover:bg-muted/30 cursor-pointer"
                  >
                    <td className="p-3 font-medium text-foreground">{r.name}</td>
                    <td className="p-3">
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-2 text-sm">
                              {preIcon}
                              {r.prerequisiteStatus === "complete" ? "All complete" : `${r.missingModules.length} module${r.missingModules.length > 1 ? "s" : ""} incomplete`}
                            </span>
                          </TooltipTrigger>
                          {r.missingModules.length > 0 && (
                            <TooltipContent>Missing: {r.missingModules.join(", ")}</TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="p-3">
                      <div className="inline-flex items-center gap-2">
                        <ReadinessRing score={r.readinessScore} size="sm" />
                        <BandPill band={band} />
                      </div>
                    </td>
                    <td className={cn("p-3 text-sm", r.lastActive.includes("day") && "text-warning-foreground dark:text-warning")}>{r.lastActive}</td>
                    <td className="p-3 hidden md:table-cell text-sm">
                      {r.lastCheckpointScore ? (
                        <div>
                          <span className={r.lastCheckpointScore < 70 ? "text-destructive" : "text-warning-foreground dark:text-warning"}>{r.lastCheckpointScore}%</span>
                          <div className="text-xs text-muted-foreground">{r.lastCheckpointLabel}</div>
                        </div>
                      ) : "—"}
                    </td>
                    <td className={cn("p-3 text-sm hidden md:table-cell", rolePlayColor)}>
                      {r.rolePlayPerformance} {roleIcon}
                    </td>
                    <td className="p-3 text-muted-foreground">{r.attendanceStatus ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </PageContainer>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">Customer Service Representative · Medicare</p>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <ReadinessRing score={selected.readinessScore} size="md" showLabel />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Module Progress</p>
                <ul className="text-sm space-y-1">
                  <li>✅ Aetna Plan Basics — 88%</li>
                  <li>✅ Claims Processing — 74%</li>
                  <li>▶ Benefits Navigation — 2/4 sessions in progress</li>
                </ul>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 mt-4">At-Risk Indicators</p>
                <p className="text-sm text-muted-foreground">No active at-risk flags.</p>
              </div>
              <p className="text-xs italic text-muted-foreground mt-4">For full learner detail, contact {selected.name}'s manager.</p>
              <div className="flex justify-end mt-4">
                <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
