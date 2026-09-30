import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface PrePublishChecklistItem {
  label: string;
  status: "pass" | "warn";
  detail?: string;
  acknowledged?: boolean;
  onAcknowledge?: () => void;
}

export function PrePublishChecklist({ items }: { items: PrePublishChecklistItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border rounded-md border border-border bg-background">
      {items.map((item, i) => (
        <li key={i} className="p-4 flex items-start gap-3">
          {item.status === "pass" ? (
            <CheckCircle2 className="h-5 w-5 text-success-dark flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-warning-foreground dark:text-warning flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">{item.label}</div>
            {item.detail && (
              <div className="mt-0.5 text-xs text-muted-foreground">{item.detail}</div>
            )}
            {item.status === "warn" && item.onAcknowledge && (
              <label className="mt-2 flex items-center gap-2 text-xs text-foreground cursor-pointer">
                <Checkbox
                  checked={!!item.acknowledged}
                  onCheckedChange={() => item.onAcknowledge?.()}
                />
                I acknowledge this and want to proceed
              </label>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}