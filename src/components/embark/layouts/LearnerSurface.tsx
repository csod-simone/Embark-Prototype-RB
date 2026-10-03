import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Light Rathbones working surface used around learner pages. */
export function LearnerSurface({
  header,
  children,
  aside,
  className,
  contentClassName,
  tone = "dashboard",
}: {
  header?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Open dashboard canvas, or the earlier framed chapter card. */
  tone?: "framed" | "dashboard";
}) {
  const dashboard = tone === "dashboard";
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", dashboard ? "bg-[#f4f5f8]" : "rb-chapter", className)}>
      {header}
      <div className={cn("flex min-h-0 flex-1", dashboard ? "gap-4 px-4 pb-4 lg:px-8" : "gap-3 p-3")}>
        <div className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          !dashboard && "rb-chapter-rise rounded-xl border border-border border-l-4 border-l-primary bg-card",
          contentClassName,
        )}>
          {children}
        </div>
        {aside}
      </div>
    </div>
  );
}
