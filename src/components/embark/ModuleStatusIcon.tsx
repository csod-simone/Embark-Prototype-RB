import { CheckCircle2, PlayCircle, Lock, MinusCircle, ShieldCheck, RefreshCcw } from "lucide-react";
import type { ModuleStatus } from "@/data/mockData";

export function ModuleStatusIcon({ status }: { status: ModuleStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-success-dark" aria-label="Completed" />;
    case "in_progress":
      return <PlayCircle className="h-5 w-5 text-primary" aria-label="In progress" />;
    case "locked":
      return <Lock className="h-5 w-5 text-muted-foreground" aria-label="Locked" />;
    case "skipped":
      return <MinusCircle className="h-5 w-5 text-muted-foreground" aria-label="Skipped" />;
    case "exempt":
      return <ShieldCheck className="h-5 w-5 text-success-dark" aria-label="Exempt" />;
    case "remediation":
      return <RefreshCcw className="h-5 w-5 text-warning" aria-label="Remediation" />;
  }
}