import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "danger" | "warning" | "success" | "brand" | "muted" | "dashed-muted";

const variantMap: Record<Variant, string> = {
  danger: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  success: "border-l-success bg-success-dark/5",
  brand: "border-l-secondary-foreground bg-secondary/30",
  muted: "border-l-border bg-muted/40",
  "dashed-muted": "border-l-border bg-muted/40 border-l-dashed",
};

export function LeftBorderCard({
  borderVariant,
  children,
  padding = "md",
}: {
  borderVariant: Variant;
  children: ReactNode;
  padding?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-background border-l-4",
        variantMap[borderVariant],
        padding === "sm" ? "p-3" : "p-4",
      )}
    >
      {children}
    </div>
  );
}