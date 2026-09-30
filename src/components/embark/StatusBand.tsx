import { cn } from "@/lib/utils";

export type StatusVariant = "at-risk" | "needs-attention" | "on-track" | "ready" | "fast-tracker";

const styles: Record<StatusVariant, string> = {
  "at-risk": "bg-destructive/10 text-destructive border-l-destructive",
  "needs-attention": "bg-warning/10 text-warning-foreground border-l-warning",
  "on-track": "bg-success-dark/10 text-success-foreground border-l-success",
  ready: "bg-secondary/40 text-secondary-foreground border-l-secondary",
  "fast-tracker": "bg-accent/20 text-accent-foreground border-l-accent",
};

const labels: Record<StatusVariant, string> = {
  "at-risk": "At Risk",
  "needs-attention": "Needs Attention",
  "on-track": "On Track",
  ready: "Ready",
  "fast-tracker": "★ Fast Tracker",
};

export function StatusBand({ variant, className }: { variant: StatusVariant; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-l-[3px] px-2 py-1 text-xs font-medium rounded-sm",
        styles[variant],
        className,
      )}
    >
      {labels[variant]}
    </span>
  );
}