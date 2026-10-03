import { cn } from "@/lib/utils";

const variantMap = {
  default: "text-foreground",
  brand: "text-primary",
  danger: "text-destructive",
  success: "text-success-dark",
  warning: "text-warning-foreground dark:text-warning",
  muted: "text-muted-foreground",
};

export function StatTile({
  label,
  value,
  variant = "default",
  subLabel,
  supporting,
  className,
}: {
  label: string;
  value: string | number;
  variant?: "default" | "brand" | "danger" | "success" | "warning" | "muted";
  subLabel?: string;
  supporting?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-card px-4 py-3", className)}>
      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-1 text-2xl font-bold leading-tight", variantMap[variant])}>
        {value}
      </div>
      {subLabel && (
        <div className="mt-0.5 text-xs text-muted-foreground">{subLabel}</div>
      )}
      {supporting && (
        <div className="mt-0.5 text-[11px] text-muted-foreground">{supporting}</div>
      )}
    </div>
  );
}
