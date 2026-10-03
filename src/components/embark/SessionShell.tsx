import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LearnerTopHeader } from "./LearnerTopHeader";
import {
  SessionStepsSidebar,
  type SessionStep,
} from "./SessionStepsSidebar";
import { SessionAskSagePanel, type SagePrompt } from "./SessionAskSagePanel";
import { resolveSageContext } from "@/pages/embark/learner/home/sageContext";
import { buildSagePrompts } from "@/pages/embark/learner/home/sagePrompts";
import { useOrganisation } from "@/hooks/use-organisation";
import { cn } from "@/lib/utils";

const JOURNEY_KEY = "embark:chapter-journey-open";
const SAGE_KEY = "embark:chapter-sage-open";

function readFlag(key: string, fallback: boolean): boolean {
  try {
    const value = sessionStorage.getItem(key);
    if (value === "0") return false;
    if (value === "1") return true;
  } catch {
    /* keep the fallback */
  }
  return fallback;
}

function writeFlag(key: string, open: boolean) {
  try {
    sessionStorage.setItem(key, open ? "1" : "0");
  } catch {
    /* the choice still applies for this view */
  }
}

export type NavAction = {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Shown in a tooltip while the action is disabled. */
  disabledReason?: string;
};

export type SessionShellProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  steps: SessionStep[];
  stepsTitle?: string;
  stepsMeta?: string;
  sagePrompts?: SagePrompt[];
  sageDisclaimer?: ReactNode;
  /** Show EU AI Act AI flag on Ask Sage panel and responses. */
  sageAiFlag?: boolean;
  positionLabel?: string;
  prev?: NavAction | null;
  next?: NavAction | null;
  /** Custom footer. Pass `null` to hide the footer bar entirely. */
  footer?: ReactNode | null;
  topSlot?: ReactNode;
  /**
   * Persona top bar. Defaults to the learner top header; pass `null` when the
   * surrounding layout already renders a persona header.
   */
  topHeader?: ReactNode;
  /** Shows the learner home dashboard section tabs in the default top header. */
  headerNavTabs?: boolean;
  /** Where the session title bar renders. `content` keeps it in the main column beside journey steps. */
  titlePlacement?: "full" | "content";
  children: ReactNode;
};

export function SessionShell({
  title,
  subtitle,
  onBack,
  steps,
  stepsTitle,
  stepsMeta,
  sagePrompts,
  sageDisclaimer,
  sageAiFlag = false,
  positionLabel,
  prev,
  next,
  footer,
  topSlot,
  topHeader,
  headerNavTabs,
  titlePlacement = "full",
  children,
}: SessionShellProps) {
  const { org } = useOrganisation();
  const chapter = org === "rathbones";
  const [sageOpen, setSageOpen] = useState(() => (chapter ? readFlag(SAGE_KEY, true) : false));
  const [sageWide, setSageWide] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(() => readFlag(JOURNEY_KEY, true));
  const sagePanel = useRef<HTMLDivElement>(null);
  const focusSage = useRef(false);
  const { pathname } = useLocation();
  const contextPrompts: SagePrompt[] = useMemo(() => {
    const all = buildSagePrompts(resolveSageContext(pathname));
    if (chapter) {
      return all.map((prompt) => ({ label: prompt.label, response: prompt.response }));
    }
    const summarize = all.find((p) => /summar/i.test(p.label));
    const raise = all.find((p) => p.isRaiseHand);
    return [
      summarize
        ? { label: summarize.label, response: summarize.response }
        : { label: "Summarise this" },
      ...(raise ? [{ label: raise.label, response: raise.response }] : []),
    ];
  }, [pathname, chapter]);

  useEffect(() => {
    if (!focusSage.current || !sageOpen) return;
    focusSage.current = false;
    sagePanel.current?.querySelector("input")?.focus();
  }, [sageOpen]);

  const toggleSage = () => {
    setSageWide(false);
    setSageOpen((open) => {
      const next = !open;
      if (next) focusSage.current = true;
      if (chapter) writeFlag(SAGE_KEY, next);
      return next;
    });
  };

  const hideJourney = () => {
    setJourneyOpen(false);
    writeFlag(JOURNEY_KEY, false);
  };

  const showJourney = () => {
    setJourneyOpen(true);
    writeFlag(JOURNEY_KEY, true);
  };

  const nextDisabled = !next || !!next.disabled;
  const nextButton = (
    <Button className="gap-1.5" disabled={nextDisabled} onClick={next?.onClick}>
      {next?.label ?? "Next"}
      <ChevronRight className="h-4 w-4" />
    </Button>
  );

  const defaultFooter = (
    <div className="flex items-center justify-between gap-4 h-full">
      {prev === null ? (
        <span />
      ) : (
        <Button
          variant="ghost"
          className="gap-1.5"
          disabled={!prev || prev.disabled}
          onClick={prev?.onClick}
        >
          <ChevronLeft className="h-4 w-4" />
          {prev?.label ?? "Previous"}
        </Button>
      )}
      {positionLabel && (
        <div className="text-xs text-muted-foreground hidden sm:block">
          {positionLabel}
        </div>
      )}
      {nextDisabled && next?.disabledReason ? (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>{nextButton}</span>
            </TooltipTrigger>
            <TooltipContent>{next.disabledReason}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        nextButton
      )}
    </div>
  );

  const sessionTitleBar = (
    <div className={cn(
      "flex flex-shrink-0 items-center gap-3 px-4 py-3 sm:px-6",
      chapter ? "bg-transparent" : "border-b border-border bg-card",
    )}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-semibold text-foreground">{title}</div>
        {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {chapter && !journeyOpen && (
        <Button type="button" variant="ghost" size="sm" onClick={showJourney}>
          <PanelLeft className="h-4 w-4" />
          Show journey
        </Button>
      )}
      {topSlot}
    </div>
  );

  return (
    <div className={cn("flex-1 flex flex-col min-h-0 bg-background", chapter && "bg-[#f4f5f8]")}>
      {topHeader !== undefined ? (
        topHeader
      ) : (
        <LearnerTopHeader
          onAskSage={sagePrompts ? toggleSage : undefined}
          sageActive={sagePrompts ? sageOpen : undefined}
          showNavTabs={headerNavTabs}
        />
      )}

      {titlePlacement === "full" ? sessionTitleBar : null}

      <div className={cn("flex min-h-0 flex-1", chapter && !sageWide && "gap-4 p-4 lg:px-8")}>
        {(!chapter || journeyOpen) && !sageWide && (
          <SessionStepsSidebar
            title={stepsTitle ?? "Journey steps"}
            meta={stepsMeta}
            steps={steps}
            onHide={chapter ? hideJourney : undefined}
            className={chapter ? "rounded-2xl border border-border bg-card shadow-sm" : undefined}
          />
        )}

        <div className={cn(
          "flex min-h-0 flex-1 flex-col bg-card",
          chapter && "overflow-hidden rounded-2xl border border-border shadow-sm",
          sageWide && "hidden",
        )}>
          {titlePlacement === "content" ? sessionTitleBar : null}
          <div className="flex min-h-0 flex-1 flex-col [&_button]:scroll-mb-24 [&_input]:scroll-mb-24 [&_textarea]:scroll-mb-24">
            {children}
          </div>

          {/* Visible spacer so content never sits flush against the sticky footer */}
          {(footer !== null || footer === undefined) && (
            <div aria-hidden="true" className="flex-shrink-0 h-4 bg-card" />
          )}
          {footer === null ? null : (
            <div className="flex-shrink-0 bg-card border-t border-border min-h-14 px-4 sm:px-6 py-2">
              {footer ?? defaultFooter}
            </div>
          )}
        </div>

        {sageOpen && sagePrompts && (
          <div ref={sagePanel} className={cn("flex min-h-0", sageWide && "min-w-0 flex-1")}>
            <SessionAskSagePanel
              prompts={contextPrompts}
              wide={sageWide}
              onWideChange={setSageWide}
              onClose={() => {
                setSageWide(false);
                setSageOpen(false);
                if (chapter) writeFlag(SAGE_KEY, false);
              }}
              disclaimer={sageDisclaimer}
              aiFlag={sageAiFlag}
              aiFlagSurface="roleplay_sage"
              chapter={chapter}
            />
          </div>
        )}
      </div>
    </div>
  );
}
