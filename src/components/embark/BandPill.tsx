import type { BandLabel } from "@/data/mockData";
import { cn } from "@/lib/utils";

const bandStyles: Record<BandLabel, string> = {
  "At Risk": "bg-destructive/10 text-destructive",
  "Needs Attention": "bg-warning text-warning-foreground",
  "On Track": "bg-success-dark/10 text-success-dark",
  Ready: "bg-secondary/60 text-secondary-foreground",
  "Fast Tracker": "bg-accent/15 text-accent",
};

export function BandPill({
  band,
  size = "md",
}: {
  band: BandLabel;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-sm" : "px-2.5 py-1 text-sm",
        bandStyles[band],
      )}
    >
      {band === "Fast Tracker" ? `★ ${band}` : band}
    </span>
  );
}