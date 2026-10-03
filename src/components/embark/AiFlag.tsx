import * as React from "react";
import { useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { cn } from "@/lib/utils";
import {
  logAiFlagRendered,
  type AiArticleRef,
  type AiContentKind,
} from "@/lib/ai-compliance";

export type AIFlagVariant = AiContentKind;
export type AIFlagSize = "lg" | "md" | "sm" | "xs";

export interface AiFlagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: AIFlagVariant;
  size?: AIFlagSize;
  /** Label text. Defaults to variant label; forced to "AI" at xs. */
  label?: string;
  /** Optional plain-language explanation — enables tooltip + keyboard focus. */
  tooltip?: string;
  sparkle?: "none" | "subtle" | "prominent";
  complianceContext?: "eu-ai-act";
  articleRef?: AiArticleRef;
  /** Telemetry surface id, e.g. roleplay_live. */
  surface?: string;
  fieldName?: string;
  /** Legacy: use AskSage icon instead of sparkle when true (non-compliance surfaces). */
  legacyIcon?: boolean;
}

const DEFAULT_LABELS: Record<AIFlagVariant, string> = {
  "ai-generated": "AI-generated",
  "ai-derived": "AI-derived",
  "ai-recommended": "AI-recommended",
};

const ARIA_LABELS: Record<AIFlagVariant, string> = {
  "ai-generated": "AI-generated content",
  "ai-derived": "AI-derived value",
  "ai-recommended": "AI-recommended",
};

const SIZE_STYLES: Record<AIFlagSize, string> = {
  lg: "px-4 py-2 text-base gap-1.5 min-h-8",
  md: "px-3 py-1.5 text-sm gap-1.5 min-h-7",
  sm: "px-2.5 py-1 text-xs gap-1 min-h-6",
  xs: "px-2 py-0.5 text-[11px] gap-1 min-h-[22px]",
};

/**
 * Canonical AI provenance badge — WAI V3 aligned.
 * Human-readable Art. 50(1) disclosure; pair with aiMarkProps for Art. 50(2).
 */
export const AiFlag = React.forwardRef<HTMLSpanElement, AiFlagProps>(function AiFlag(
  {
    variant = "ai-generated",
    size = "sm",
    label,
    tooltip,
    sparkle = "none",
    complianceContext,
    articleRef,
    surface,
    fieldName,
    legacyIcon = false,
    className,
    ...rest
  },
  ref,
) {
  const loggedRef = useRef(false);
  const resolvedLabel = size === "xs" ? "AI" : (label ?? DEFAULT_LABELS[variant]);

  useEffect(() => {
    if (complianceContext !== "eu-ai-act" || loggedRef.current) return;
    loggedRef.current = true;
    logAiFlagRendered({
      variant,
      surface: surface ?? "unknown",
      fieldName,
      articleRef,
    });
  }, [complianceContext, variant, surface, fieldName, articleRef]);

  const sparkleClass =
    sparkle === "prominent"
      ? "ai-flag-sparkle ai-flag-sparkle--prominent"
      : sparkle === "subtle"
        ? "ai-flag-sparkle ai-flag-sparkle--subtle"
        : undefined;

  const useLegacy = legacyIcon ?? complianceContext !== "eu-ai-act";
  const designSystemFlag = label === "AI" && complianceContext !== "eu-ai-act";

  const flag = (
    <span
      ref={ref}
      aria-label={ARIA_LABELS[variant]}
      className={cn(
        "inline-flex items-center align-middle font-semibold select-none whitespace-nowrap rounded-full border transition-colors",
        designSystemFlag
          ? "border-transparent bg-status-ai font-medium text-status-ai-fg"
          : useLegacy
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-accent-foreground/30 bg-accent text-accent-foreground",
        tooltip &&
          "cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        sparkleClass,
        SIZE_STYLES[size],
        className,
      )}
      tabIndex={tooltip ? 0 : undefined}
      role={tooltip ? "button" : undefined}
      {...rest}
    >
      {designSystemFlag || useLegacy ? (
        <AskSageIcon size={size === "xs" ? 12 : size === "lg" ? 16 : 14} />
      ) : (
        <span aria-hidden="true" className="ai-flag-icon leading-none">
          ✦
        </span>
      )}
      {resolvedLabel}
    </span>
  );

  if (!tooltip) return flag;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{flag}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-sm leading-snug">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

AiFlag.displayName = "AiFlag";
