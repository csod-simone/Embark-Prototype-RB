import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { LearnerTable } from "./LearnerTable";
import { AlertTriangle } from "lucide-react";

export function AtRiskTab({ onRespond }: { onRespond: (id: string) => void }) {
  return (
    <div className="p-4 space-y-4">
      <LeftBorderCard borderVariant="danger">
        <div className="flex items-start gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div>
            <span className="font-medium text-foreground">Marcus Webb</span> has been at risk for more than 24 hours without manager acknowledgment. Acknowledge to stop the escalation clock.
          </div>
        </div>
      </LeftBorderCard>
      <LearnerTable
        filterBands={["At Risk", "Needs Attention"]}
        onRespond={onRespond}
        defaultExpandedId="l3"
      />
    </div>
  );
}