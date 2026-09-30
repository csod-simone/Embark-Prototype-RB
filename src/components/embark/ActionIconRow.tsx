import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface ActionIconRowAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

export function ActionIconRow({ actions }: { actions: ActionIconRowAction[] }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="inline-flex items-center gap-1">
        {actions.map((a, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={a.label}
                onClick={a.onClick}
                className={cn(
                  "inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors",
                  a.variant === "danger"
                    ? "text-destructive hover:bg-destructive/10"
                    : "text-muted-foreground hover:text-primary hover:bg-muted",
                )}
              >
                {a.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent>{a.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}