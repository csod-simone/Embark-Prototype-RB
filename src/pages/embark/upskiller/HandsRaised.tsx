import { Hand } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { cn } from "@/lib/utils";

type RaisedHand = {
  id: string;
  topic: string;
  module: string;
  date: string;
  note: string;
  status: "pending" | "resolved";
  response?: string;
};

const HANDS: RaisedHand[] = [
  {
    id: "h1",
    topic: "Handling repeated price objections",
    module: "Objection Handling Fundamentals",
    date: "30 Jul 2026 · 11:20",
    note: "Wanted a second example for when the customer repeats the same objection.",
    status: "resolved",
    response:
      "Shared two call recordings in our 1:1 — try the clarify-then-confirm step earlier next time.",
  },
  {
    id: "h2",
    topic: "Explaining plan option differences clearly",
    module: "Medicare Advantage — Product Deep Dive",
    date: "1 Aug 2026 · 15:05",
    note: "CSAT feedback said my plan comparisons were unclear — looking for a simpler structure.",
    status: "resolved",
    response:
      "Use the outcome-first structure from section 2 of the deep dive. Happy to review a live call next week.",
  },
  {
    id: "h3",
    topic: "Advice boundary on plan comparisons",
    module: "Compliance Essentials — Regulated Advice Boundaries",
    date: "4 Aug 2026 · 09:40",
    note: "Need confirmation on how far I can go when comparing two plans for a customer.",
    status: "pending",
  },
];

export default function UpskillerHandsRaised() {
  return (
    <div className="px-4 sm:px-6 py-6">
      <PageContainer as="div" className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Questions and requests you've raised during your upskilling journey
          </p>
          <Badge variant="secondary" className="text-xs shrink-0">
            {HANDS.length} raised
          </Badge>
        </div>

        {HANDS.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Hand className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-base font-semibold text-foreground">No hands raised</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You haven't raised any hands during your upskilling journey.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {HANDS.map((h) => (
              <Card key={h.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <Hand size={16} className="text-primary shrink-0" aria-hidden />
                    <span className="text-sm font-medium text-foreground truncate">{h.topic}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-[11px]">
                      {h.module}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-[11px]",
                        h.status === "resolved"
                          ? "bg-success text-success-foreground hover:bg-success"
                          : "bg-warning text-warning-foreground hover:bg-warning",
                      )}
                    >
                      {h.status === "resolved" ? "Resolved" : "Pending"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{h.date}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{h.note}</p>
                {h.response && (
                  <p className="text-sm text-foreground border-l-2 border-primary/40 pl-3">
                    <span className="font-medium">Trainer: </span>
                    {h.response}
                  </p>
                )}
                <div className="flex justify-end">
                  {h.status === "resolved" ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toast("Response from your trainer is shown above.")}
                    >
                      View response
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toast("Request marked as resolved.")}
                    >
                      Mark resolved
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
}