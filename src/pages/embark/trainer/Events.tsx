import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { ReadinessDistributionStrip } from "@/components/embark/ReadinessDistributionStrip";
import { InlineExpandRow } from "@/components/embark/InlineExpandRow";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { trainerEvents } from "@/data/mockData";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

export default function Events() {
  const navigate = useNavigate();

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-6">
        {trainerEvents.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-muted-foreground">
            <Calendar className="h-10 w-10 mb-3" />
            <p className="text-sm max-w-md text-center">
              No events assigned to you yet. Events will appear here once you've been assigned to facilitate them.
            </p>
          </div>
        ) : (
          trainerEvents.map((ev) => {
            const total =
              ev.readinessSummary.atRisk +
              ev.readinessSummary.needsAttention +
              ev.readinessSummary.onTrack +
              ev.readinessSummary.ready +
              ev.readinessSummary.fastTracker;
            return (
              <div key={ev.id} className="rounded-lg border border-border bg-card shadow-sm p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-foreground">{ev.name}</h2>
                  <span className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-semibold tracking-wide">
                    {ev.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Jul 24, 2026 · 9:00 AM</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {ev.format} · {ev.location.split(' — ')[0]}</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {ev.registered} / {ev.capacity} registered</span>
                </div>
                <ReadinessDistributionStrip counts={ev.readinessSummary} total={total} />
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button onClick={() => navigate(`/trainer/events/${ev.id}/roster`)}>View roster</Button>
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button variant="secondary" disabled>Record attendance</Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Available from Jul 24, 9:00 AM</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })
        )}

        <div className="mt-8">
          <InlineExpandRow
            trigger={<span className="text-sm text-muted-foreground">Past events</span>}
            content={<p className="text-sm text-muted-foreground text-center py-2">No past events yet.</p>}
          />
        </div>
      </PageContainer>
    </>
  );
}
