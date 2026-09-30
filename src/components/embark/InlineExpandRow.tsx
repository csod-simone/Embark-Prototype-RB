import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function InlineExpandRow({
  trigger,
  content,
  defaultExpanded = false,
  isExpanded,
  onToggle,
}: {
  trigger: ReactNode;
  content: ReactNode;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}) {
  const [internal, setInternal] = useState(defaultExpanded);
  const controlled = isExpanded !== undefined;
  const expanded = controlled ? !!isExpanded : internal;

  const handleClick = () => {
    if (controlled) onToggle?.();
    else setInternal((v) => !v);
  };

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between gap-3 py-3 text-left hover:bg-muted/40 pl-5 pr-4 rounded"
      >
        <div className="flex-1 min-w-0">{trigger}</div>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
            expanded && "rotate-90",
          )}
        />
      </button>
      {expanded && <div className="pl-5 pr-4 pb-4">{content}</div>}
    </div>
  );
}