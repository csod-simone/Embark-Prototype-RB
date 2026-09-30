import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface TabBarTab {
  id: string;
  label: string;
  badge?: number | string;
  badgeVariant?: "danger" | "warning" | "default";
  disabled?: boolean;
  disabledTooltip?: string;
}

const badgeStyles: Record<NonNullable<TabBarTab["badgeVariant"]>, string> = {
  danger: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning-foreground dark:text-warning",
  default: "bg-muted text-muted-foreground",
};

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: TabBarTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 border-b border-border" role="tablist">
        {tabs.map((t) => {
          const active = t.id === activeTab;
          const btn = (
            <button
              type="button"
              role="tab"
              aria-selected={active}
              disabled={t.disabled}
              onClick={() => !t.disabled && onTabChange(t.id)}
              className={cn(
                "relative inline-flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors",
                active
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                t.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
              )}
            >
              {t.label}
              {t.badge !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold min-w-[18px]",
                    badgeStyles[t.badgeVariant ?? "default"],
                  )}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
          if (t.disabled && t.disabledTooltip) {
            return (
              <Tooltip key={t.id}>
                <TooltipTrigger asChild>
                  <span className="inline-block">{btn}</span>
                </TooltipTrigger>
                <TooltipContent>{t.disabledTooltip}</TooltipContent>
              </Tooltip>
            );
          }
          return <span key={t.id}>{btn}</span>;
        })}
      </div>
    </TooltipProvider>
  );
}