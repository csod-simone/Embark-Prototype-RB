import type { CitationType } from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const citationLabels: Record<CitationType, string> = {
  curriculum: "From your curriculum ↗",
  internal: "From internal resources ↗",
  policy: "From company policy ↗",
  general: "General knowledge",
};

export function TutorBubble({
  message,
  citation,
  isProactive,
  timestamp,
}: {
  message: string;
  citation?: CitationType;
  isProactive?: boolean;
  timestamp?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-1 max-w-[80%]">
      <div className="flex items-start gap-2">
        {isProactive && (
          <span aria-hidden="true" className="text-lg leading-none pt-1">
            💡
          </span>
        )}
        <div className="text-sm text-foreground whitespace-pre-line">
          {message}
          {citation && (
            <div className="mt-2">
              {citation === "general" ? (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-[11px] text-muted-foreground underline decoration-dotted cursor-help">
                        {citationLabels[citation]}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Not from your curriculum</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <a href="#" className="text-[11px] text-muted-foreground hover:text-primary hover:underline">
                  {citationLabels[citation]}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      {timestamp && <span className="text-[11px] text-muted-foreground pl-2">{timestamp}</span>}
    </div>
  );
}