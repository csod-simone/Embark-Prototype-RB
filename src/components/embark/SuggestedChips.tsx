import { cn } from "@/lib/utils";

export function SuggestedChips({
  chips,
}: {
  chips: Array<{ label: string; variant: "default" | "action"; onClick: () => void }>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <button
          key={i}
          type="button"
          onClick={c.onClick}
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            c.variant === "action"
              ? "bg-warning/10 border-warning/50 text-warning-foreground dark:text-warning hover:bg-warning/20"
              : "bg-background border-border text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}