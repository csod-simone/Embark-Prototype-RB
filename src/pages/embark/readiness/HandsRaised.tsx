import { Hand } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/embark/layouts/PageContainer";

type RaisedHand = {
  id: string;
  topic: string;
  area: string;
  date: string;
  note: string;
  status: "pending" | "resolved";
  response?: string;
};

const HANDS: RaisedHand[] = [
  {
    id: "h1",
    topic: "Reconciliation approach for phased cutover",
    area: "Knowledge & Skills",
    date: "17 Sep 2026 · 10:05",
    note: "Wanted a worked example of reconciliation across two migration phases.",
    status: "resolved",
    response: "Walked through the phase-one reconciliation pack in our check-in.",
  },
  {
    id: "h2",
    topic: "How much detail to share with the client on delays",
    area: "Stakeholder Readiness",
    date: "19 Sep 2026 · 16:40",
    note: "Need guidance on framing slippage with a regulated client before my first working session.",
    status: "pending",
  },
];

export default function ReadinessHandsRaised() {
  return (
    <div className="px-4 sm:px-6 py-6">
      <PageContainer as="div" className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Hands Raised</h1>
          <p className="text-sm text-muted-foreground">
            Questions you've raised during your project readiness journey.
          </p>
        </header>

        {HANDS.map((h) => (
          <Card key={h.id} className="p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Hand size={15} className="text-muted-foreground" aria-hidden="true" />
                {h.topic}
              </span>
              <Badge variant={h.status === "resolved" ? "secondary" : "outline"}>
                {h.status === "resolved" ? "Resolved" : "Pending"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {h.area} · {h.date}
            </p>
            <p className="text-sm text-foreground">{h.note}</p>
            {h.response && (
              <p className="text-sm text-muted-foreground border-l-2 border-border pl-3">
                {h.response}
              </p>
            )}
          </Card>
        ))}
      </PageContainer>
    </div>
  );
}
