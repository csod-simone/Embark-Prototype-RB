import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Check, ChevronDown, ChevronRight, Clock, Hand, LayoutGrid, Lock, MapPin, X } from "lucide-react";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatTile } from "@/components/embark/StatTile";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { CompletionSummary } from "@/components/embark/CompletionSummary";
import { InlineExpandRow } from "@/components/embark/InlineExpandRow";
import { ModuleStatusIcon } from "@/components/embark/ModuleStatusIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useHelpDrawer } from "@/components/embark/HelpDrawerContext";
import { RaiseHandModal } from "@/components/embark/RaiseHandModal";
import { modules, helpRequests, type Module, type Session } from "@/data/mockData";
import { HistoryView } from "../history/HistoryView";
import { historyData } from "../History";
import {
  useModule3Progress,
  getNextStep,
  getModuleStates,
  type Mod3Progress,
} from "@/hooks/use-module3-progress";
import { useOrganisation } from "@/hooks/use-organisation";
import { applyAdaptation, useJourneyAdaptation } from "@/hooks/use-journey-adaptation";
import { useAssessmentAttempts } from "@/hooks/use-assessment-attempts";
import { RATHBONES_USERS } from "@/data/rathbonesTerms";

function dayPart() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function SessionRing({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((done / total) * 100));
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-[72px] w-[72px] rounded-full"
        style={{
          background: `conic-gradient(hsl(233 100% 39%) ${pct * 3.6}deg, hsl(233 100% 39% / 0.16) 0deg)`,
        }}
        role="img"
        aria-label={`${done} of ${total} sessions complete`}
      >
        <div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-accent">
          <span className="text-lg font-semibold leading-none text-foreground">{done}</span>
          <span className="mt-0.5 text-[10px] text-muted-foreground">of {total}</span>
        </div>
      </div>
    </div>
  );
}

const modalityLabel: Record<Session["modality"], string> = {
  video: "Video",
  article: "Article",
  audio: "Audio",
  role_play: "Role Play",
  exercise: "Exercise",
  assessment: "Assessment",
};

function sessionBadgeLabel(s: Session): string {
  if (s.id.startsWith("micro-")) return "Micro-learning";
  if (s.sessionKind === "content" || s.modality === "article") return "Article";
  if (s.sessionKind === "knowledge_check") return "Knowledge check";
  if (s.sessionKind === "module_assessment") return "Module assessment";
  if (s.sessionKind === "chapter_gate") return "Chapter gate";
  if (s.sessionKind === "roleplay" || s.modality === "role_play") return "Role play";
  return modalityLabel[s.modality];
}

function leftOffChip(s: Session): string {
  if (s.id.startsWith("micro-")) return "Micro-learning";
  if (s.sessionKind === "knowledge_check") return "Knowledge check";
  if (s.sessionKind === "module_assessment") return "Assessment";
  if (s.sessionKind === "chapter_gate") return "Chapter gate";
  if (s.sessionKind === "roleplay" || s.modality === "role_play") return "Role Play";
  if (s.modality === "video") return "Video";
  return "Article";
}

function getRemainingTimeLabel(p: Mod3Progress): string {
  if (p.rolePlayDone) return "35m";
  let remaining = 0;
  if (!p.articleDone) remaining += 8;
  if (!p.videoDone) remaining += 6;
  if (!p.assessmentPassed) remaining += 10;
  if (!p.rolePlayDone) remaining += 14;
  return `${remaining}m`;
}


function ModuleRowTrigger({
  module,
  unlockedBadge,
  sessionsOverride,
  isRathbones,
}: {
  module: Module;
  unlockedBadge?: boolean;
  sessionsOverride?: { complete: number; total: number };
  isRathbones?: boolean;
}) {
  const contentTags =
    module.id === "mod3" && isRathbones
      ? "contents · knowledge checks · practice · formative · assessment · chapter gate"
      : module.id === "mod3"
      ? "reading · scenario · assessment"
      : module.id === "mod4"
      ? "reading · scenario · assessment"
      : module.status === "completed"
      ? "reading · assessment"
      : "reading · scenario";
  const hasRolePlay = module.id === "mod3";
  const displayName =
    module.id === "mod3" && isRathbones ? "IM Intake Pathway" : module.name;

  return (
    <div className="flex items-center gap-3 w-full">
      <ModuleStatusIcon status={module.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "text-sm font-medium truncate",
              module.status === "in_progress" && "text-primary",
              (module.status === "locked" || module.status === "skipped") && "text-muted-foreground",
              module.status === "skipped" && "line-through",
            )}
          >
            {module.number}. {displayName}
          </span>
          {module.status === "in_progress" && (
            <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground flex-shrink-0">
              {unlockedBadge ? "Unlocked" : "In progress"}
            </span>
          )}
          {hasRolePlay && module.status !== "locked" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold flex-shrink-0">
              <AskSageIcon size={10} />
              AI
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground truncate">{contentTags}</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {module.status === "completed" && module.score !== undefined && (
          <>
            <span className="text-xs font-semibold text-success-dark">{module.score}%</span>
            {module.completedDate && (
              <span className="text-xs text-muted-foreground">
                {new Date(module.completedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </>
        )}
        {module.status === "completed" && module.score === undefined && (
          <span className="inline-flex items-center rounded-full bg-success-dark/15 text-success-dark px-2 py-0.5 text-[10px] font-semibold">
            ✓ Complete
          </span>
        )}
        {module.status === "in_progress" && (
          (sessionsOverride || module.sessionsTotal) && (
            <span className="text-xs text-muted-foreground">
              {sessionsOverride
                ? `${sessionsOverride.complete}/${sessionsOverride.total} sessions`
                : `${module.sessionsComplete}/${module.sessionsTotal} sessions`}
            </span>
          )
        )}
        {module.status === "locked" && (
          <span className="text-xs text-muted-foreground">Locked</span>
        )}
        {module.status === "skipped" && (
          <span className="text-xs text-muted-foreground">Skipped</span>
        )}
      </div>
    </div>
  );
}

export function routeForSession(s: Session): string {
  if (s.id.startsWith("micro-")) return `/learner/micro-learning/${s.id}`;
  if (s.id === "s-article" || s.id === "mc-c1") return `/learner/session/s-article?item=${s.id}`;
  if (s.id === "s-video") return "/learner/session/s-video";
  if (s.id === "s-assessment" || s.id === "mc-ma") return `/learner/assessment/mod3?item=${s.id}`;
  if (s.id === "mod4-s1") return "/learner/session/mod4-s1";
  if (s.modality === "role_play" || s.sessionKind === "roleplay") {
    // Managing Clients practice/formative use session id as scenario key
    if (s.id.startsWith("mc-rp")) return `/learner/role-play/${s.id}`;
    return "/learner/role-play/s3";
  }
  if (s.modality === "assessment") return `/learner/assessment/mod3?item=${s.id}`;
  if (s.id.startsWith("mc-")) return `/learner/session/s-article?item=${s.id}`;
  return "/learner/session/s1";
}

function SessionRow({ s }: { s: Session }) {
  const navigate = useNavigate();
  const isLocked = s.status === "locked";
  const isCompleted = s.status === "completed";
  const isSkipped = s.status === "skipped";
  const isInProgress = s.status === "in_progress";

  const target = routeForSession(s);

  const handleClick = () => {
    if (isLocked) return;
    if (isCompleted) {
      const sep = target.includes("?") ? "&" : "?";
      navigate(`${target}${sep}review=true`);
      return;
    }
    navigate(target);
  };

  const tooltip = isLocked
    ? "Complete prior sessions to unlock"
    : isSkipped
    ? "Skipped from your path — optional to review"
    : isCompleted
    ? `Completed ${s.completedDate ? new Date(s.completedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""} — click to review`
    : isInProgress
    ? "In progress — click to continue"
    : "Click to start";

  const RowInner = (
    <div className="flex items-center gap-3 w-full py-2">
      {isLocked ? (
        <Lock className="h-5 w-5 text-muted-foreground" aria-label="Locked" />
      ) : (
        <ModuleStatusIcon status={isSkipped ? "skipped" : isCompleted ? "completed" : "in_progress"} />
      )}
      <div className="flex-1 min-w-0 text-left">
        <div className={cn("text-sm truncate", (isLocked || isSkipped) && "text-muted-foreground", isSkipped && "line-through")}>
          {s.name}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {isSkipped
            ? "Skipped · optional"
            : isLocked
            ? s.roleplayKind === "practice"
              ? "Within module · unlocks when prior sessions are complete"
              : s.roleplayKind === "formative"
                ? "Before module assessment · unlocks when prior sessions are complete"
                : "Unlocks when prior sessions are complete"
            : isCompleted && s.completedDate
            ? `Completed ${new Date(s.completedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
            : s.roleplayKind === "practice"
              ? `Within module · ${s.duration} min`
              : s.roleplayKind === "formative"
                ? `Before module assessment · ${s.duration} min`
                : `${s.duration} min`}
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {sessionBadgeLabel(s)}
        </span>
        {s.roleplayKind === "practice" && (
          <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Practice
          </span>
        )}
        {s.roleplayKind === "formative" && (
          <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
            Formative
          </span>
        )}
        {isInProgress && s.modality !== "assessment" && (
          <>
            <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              ▶ In progress
            </span>
            {s.modality === "role_play" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">
                <AskSageIcon size={10} />
                AI
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {isLocked ? (
          <div className="cursor-default px-1">{RowInner}</div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="w-full rounded-md px-1 hover:bg-muted/60 transition-colors cursor-pointer"
          >
            {RowInner}
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}


const CTA_CONFIG: Record<
  ReturnType<typeof getNextStep>,
  { title: string; chip: string; sub: string; to: string; button: string }
> = {
  article: {
    title: "Start — Coverage Determination",
    chip: "Article",
    sub: "Benefits Navigation · Session 1 of 4",
    to: "/learner/session/s-article",
    button: "Start →",
  },
  video: {
    title: "Continue — Medicare Plan Types",
    chip: "Video",
    sub: "Benefits Navigation · Session 2 of 4",
    to: "/learner/session/s-video",
    button: "Continue →",
  },
  assessment: {
    title: "Continue — Module Assessment",
    chip: "Assessment",
    sub: "Benefits Navigation · Session 3 of 4",
    to: "/learner/assessment/mod3",
    button: "Continue →",
  },
  roleplay: {
    title: "Continue — Benefits Lookup Practice",
    chip: "Role Play",
    sub: "Benefits Navigation · Session 4 of 4",
    to: "/learner/role-play/s3",
    button: "Continue →",
  },
  complete: {
    title: "Review — Benefits Navigation",
    chip: "Complete ✓",
    sub: "Benefits Navigation · All sessions complete",
    to: "/learner/home",
    button: "Review →",
  },
};


const LATER_PATHS: { id: string; name: string; sessions: Session[] }[] = [
  {
    id: "compliance",
    name: "Compliance Refresher Path",
    sessions: [
      { id: "cmp-1", moduleId: "mod3", number: 1, name: "FCA conduct essentials", status: "locked", modality: "article", duration: 20, sessionKind: "content" },
      { id: "cmp-2", moduleId: "mod3", number: 2, name: "Financial crime and market abuse", status: "locked", modality: "article", duration: 15, sessionKind: "content" },
      { id: "cmp-a", moduleId: "mod3", number: 3, name: "Conduct knowledge check", status: "locked", modality: "assessment", duration: 10, sessionKind: "knowledge_check" },
    ],
  },
  {
    id: "discretionary",
    name: "Discretionary Portfolio Management",
    sessions: [
      { id: "dpm-1", moduleId: "mod3", number: 1, name: "Discretionary mandate types", status: "locked", modality: "article", duration: 20, sessionKind: "content" },
      { id: "dpm-2", moduleId: "mod3", number: 2, name: "Reporting a portfolio valuation", status: "locked", modality: "article", duration: 15, sessionKind: "content" },
      { id: "dpm-a", moduleId: "mod3", number: 3, name: "Discretionary knowledge check", status: "locked", modality: "assessment", duration: 10, sessionKind: "knowledge_check" },
    ],
  },
];

export function buildMod3Flow(p: Mod3Progress, org: "nexus" | "cvs" | "rathbones" = "cvs"): Session[] {
  if (org === "rathbones") {
    // Managing Clients interleaved showcase — placement only; first item active.
    const items: Omit<Session, "status" | "completedDate">[] = [
      {
        id: "mc-c1",
        moduleId: "mod3",
        number: 1,
        name: "Client relationships foundations",
        modality: "article",
        duration: 20,
        sessionKind: "content",
      },
      {
        id: "mc-k1",
        moduleId: "mod3",
        number: 2,
        name: "Knowledge check 1",
        modality: "assessment",
        duration: 10,
        sessionKind: "knowledge_check",
      },
      {
        id: "mc-c2",
        moduleId: "mod3",
        number: 3,
        name: "Discovery and objectives",
        modality: "article",
        duration: 20,
        sessionKind: "content",
      },
      {
        id: "mc-rp1",
        moduleId: "mod3",
        number: 4,
        name: "Practice — Discovery with James Whitfield",
        modality: "role_play",
        duration: 20,
        sessionKind: "roleplay",
        roleplayKind: "practice",
      },
      {
        id: "mc-k2",
        moduleId: "mod3",
        number: 5,
        name: "Knowledge check 2",
        modality: "assessment",
        duration: 10,
        sessionKind: "knowledge_check",
      },
      {
        id: "mc-c3",
        moduleId: "mod3",
        number: 6,
        name: "Suitability under pressure",
        modality: "article",
        duration: 20,
        sessionKind: "content",
      },
      {
        id: "mc-rp2",
        moduleId: "mod3",
        number: 7,
        name: "Practice — Suitability under pressure",
        modality: "role_play",
        duration: 20,
        sessionKind: "roleplay",
        roleplayKind: "practice",
      },
      {
        id: "mc-c4",
        moduleId: "mod3",
        number: 8,
        name: "Advice documentation",
        modality: "article",
        duration: 15,
        sessionKind: "content",
      },
      {
        id: "mc-k3",
        moduleId: "mod3",
        number: 9,
        name: "Knowledge check 3",
        modality: "assessment",
        duration: 10,
        sessionKind: "knowledge_check",
      },
      {
        id: "mc-rp-f",
        moduleId: "mod3",
        number: 10,
        name: "Formative — Suitability with Marcus Ellison",
        modality: "role_play",
        duration: 30,
        sessionKind: "roleplay",
        roleplayKind: "formative",
      },
      {
        id: "mc-ma",
        moduleId: "mod3",
        number: 11,
        name: "Module assessment",
        modality: "assessment",
        duration: 25,
        sessionKind: "module_assessment",
      },
      {
        id: "mc-cg",
        moduleId: "mod3",
        number: 12,
        name: "Chapter gate",
        modality: "assessment",
        duration: 15,
        sessionKind: "chapter_gate",
      },
    ];
    return items.map((item, i) => ({
      ...item,
      status: i === 0 ? ("in_progress" as const) : ("locked" as const),
    }));
  }

  return [
    {
      id: "s-article",
      moduleId: "mod3",
      number: 1,
      name: "Coverage Determination",
      modality: "article",
      duration: 8,
      status: p.articleDone ? "completed" : "in_progress",
      completedDate: p.articleDone ? new Date().toISOString() : undefined,
    },
    {
      id: "s-video",
      moduleId: "mod3",
      number: 2,
      name: "Medicare Plan Types",
      modality: "video",
      duration: 6,
      status: !p.articleDone ? "locked" : p.videoDone ? "completed" : "in_progress",
      completedDate: p.videoDone ? new Date().toISOString() : undefined,
    },
    {
      id: "s-assessment",
      moduleId: "mod3",
      number: 3,
      name: "Module Assessment",
      modality: "assessment",
      duration: 12,
      status: !p.videoDone ? "locked" : p.assessmentPassed ? "completed" : "in_progress",
      completedDate: p.assessmentPassed ? new Date().toISOString() : undefined,
    },
    {
      id: "s3",
      moduleId: "mod3",
      number: 4,
      name: "Benefits Lookup Practice",
      modality: "role_play",
      duration: 10,
      status: !p.assessmentPassed ? "locked" : p.rolePlayDone ? "completed" : "in_progress",
      completedDate: p.rolePlayDone ? new Date().toISOString() : undefined,
    },
  ];
}

function buildMod4Flow(): Session[] {
  return [
    {
      id: "mod4-s1",
      moduleId: "mod4",
      number: 1,
      name: "Introduction to Claims Processing",
      modality: "article",
      duration: 7,
      status: "in_progress",
    },
    {
      id: "mod4-s2",
      moduleId: "mod4",
      number: 2,
      name: "Explanation of Benefits (EOB)",
      modality: "video",
      duration: 6,
      status: "locked",
    },
    {
      id: "mod4-s3",
      moduleId: "mod4",
      number: 3,
      name: "Claim Denials and Appeals",
      modality: "article",
      duration: 8,
      status: "locked",
    },
    {
      id: "mod4-s4",
      moduleId: "mod4",
      number: 4,
      name: "Billing Dispute Practice",
      modality: "role_play",
      duration: 10,
      status: "locked",
    },
  ];
}

export function applyModuleOverrides(list: Module[], p: Mod3Progress): Module[] {
  const s = getModuleStates(p);
  return list.map((m) => {
    if (m.id === "mod3") {
      return {
        ...m,
        status: s.mod3 === "completed" ? "completed" : m.status,
        sessionsComplete: s.mod3 === "completed" ? 4 : m.sessionsComplete,
        sessionsTotal: 4,
        completedDate: s.mod3 === "completed" ? new Date().toISOString() : m.completedDate,
      };
    }
    if (m.id === "mod4") {
      return {
        ...m,
        status: s.mod4 === "available" ? "in_progress" : "locked",
      };
    }
    return m;
  });
}

function CurrentTab({
  programHeader,
  onAskSage,
}: {
  programHeader?: { title: string; day: string; modulesDone: number; sessionsDone: number };
  onAskSage?: () => void;
}) {
  const navigate = useNavigate();
  const { org } = useOrganisation();
  const isRathbones = org === "rathbones";
  const { progress } = useModule3Progress();
  const { state: adaptation } = useJourneyAdaptation();
  const { paused: pausedAssessments } = useAssessmentAttempts();
  const mod4Unlocked = progress.rolePlayDone;
  const [expandedId, setExpandedId] = useState<string | null>(
    mod4Unlocked ? "mod4" : "mod3",
  );
  const [trackOpen, setTrackOpen] = useState(true);
  const [laterOpen, setLaterOpen] = useState<Record<string, boolean>>({});
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);
  const [justUnlockedSeen, setJustUnlockedSeen] = useState(false);

  const overridden = applyModuleOverrides(modules, progress);
  const trackModules = overridden.filter((m) => m.number >= 1 && m.number <= 8);
  const mod3Base = buildMod3Flow(progress, org);
  const mod3Sessions = isRathbones ? applyAdaptation(mod3Base, adaptation) : mod3Base;
  const mod4Sessions = buildMod4Flow();
  const mod3SessionTotal = isRathbones ? mod3Sessions.length : 4;

  const step = getNextStep(progress);
  const cta = CTA_CONFIG[step];
  const currentSession = isRathbones
    ? mod3Sessions.find((session) => session.status === "in_progress")
    : undefined;
  const currentIndex = currentSession
    ? mod3Sessions.findIndex((session) => session.id === currentSession.id)
    : -1;
  const journeyStarted = mod3Sessions.some(
    (session) => session.status === "completed" || session.status === "skipped",
  );
  const sessionsDone = isRathbones
    ? mod3Sessions.filter((session) => session.status === "completed" || session.status === "skipped").length
    : mod4Unlocked
      ? 10
      : 6;
  const sessionsTotal = isRathbones ? mod3Sessions.length : 24;

  const mod3Complete = progress.rolePlayDone;
  const moduleStats = {
    total: overridden.length,
    complete: overridden.filter((m) => m.status === "completed").length,
    inProgress: overridden.filter((m) => m.status === "in_progress").length,
    locked: overridden.filter((m) => m.status === "locked").length,
    skipped: overridden.filter((m) => m.status === "skipped").length,
  };
  const modulesSubLabel = [
    moduleStats.complete > 0 ? `${moduleStats.complete} complete` : null,
    moduleStats.inProgress > 0 ? `${moduleStats.inProgress} in progress` : null,
    moduleStats.locked > 0 ? `${moduleStats.locked} locked` : null,
    moduleStats.skipped > 0 ? `${moduleStats.skipped} skipped` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const inProgressModule = overridden.find((m) => m.status === "in_progress");
  const modulesSupporting = inProgressModule
    ? `${isRathbones && inProgressModule.id === "mod3" ? "IM Intake Pathway" : inProgressModule.name} in progress`
    : "All modules complete";
  const remainingTime = getRemainingTimeLabel(progress);


  return (

    <div className={cn("space-y-6", isRathbones && "mx-auto w-full max-w-[880px] space-y-8 pb-10")}>
      {isRathbones && pausedAssessments.length > 0 && (
        <LeftBorderCard borderVariant="danger">
          <div className="space-y-1">
            <div className="text-sm font-medium text-foreground-destructive">Journey paused — at risk</div>
            <p className="text-sm text-foreground">
              You've used the retakes on {pausedAssessments.map((item) => item.name ?? "this assessment").join(", ")}. An at-risk flag has been raised, and Sage has asked your line manager to check in. This journey continues only after they reopen the module.
            </p>
          </div>
        </LeftBorderCard>
      )}
      {/* Module completion celebration */}
      {mod4Unlocked && !celebrationDismissed && (
        <LeftBorderCard borderVariant="success">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <Check className="h-5 w-5 text-success-dark flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1 min-w-0">
                <div className="text-sm font-medium text-success-dark">
                  Benefits Navigation — complete
                </div>
                <div className="text-xs text-muted-foreground">
                  You've finished all 4 sessions in this module. Your readiness score has been
                  updated.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCelebrationDismissed(true)}
              aria-label="Dismiss"
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </LeftBorderCard>
      )}

      {isRathbones && (
        <div className="space-y-8 pt-8">
          <header className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Good {dayPart()}, {RATHBONES_USERS.learner.name.split(" ")[0]}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your onboarding
            </h1>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Personalized for you</h2>
              <Badge variant="ai" className="gap-1 border-transparent px-2.5 py-0.5 text-xs font-medium">
                <AskSageIcon size={14} />
                AI
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Investment Manager Full Onboarding Journey</p>
          </header>

          <div className="grid items-stretch gap-4 lg:grid-cols-2">
            <Card className="h-full rounded-2xl border-0 bg-accent p-6 shadow-none sm:p-7">
              <p className="text-sm text-muted-foreground">Where you are now</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                IM Intake Pathway
              </h2>
              <div className="mt-6 flex items-center gap-5">
                <SessionRing done={sessionsDone} total={sessionsTotal} />
                <ul className="min-w-0 flex-1 space-y-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                    {sessionsDone} sessions complete
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary/40" aria-hidden />
                    {currentSession ? `In progress · ${currentSession.name}` : "Nothing in progress"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50" aria-hidden />
                    {LATER_PATHS.length} paths still locked
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-foreground/30" aria-hidden />
                    {remainingTime} remaining
                  </li>
                </ul>
              </div>
            </Card>

            <div className="flex flex-col gap-4">
              <Card className="flex-1 rounded-2xl border-border p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  {currentSession ? (journeyStarted ? "Where you left off" : "Up next") : "This path"}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  {currentSession
                    ? currentSession.name
                    : "IM Intake Pathway is complete"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {currentSession
                    ? `Session ${currentIndex + 1} of ${mod3Sessions.length} · ${leftOffChip(currentSession)}`
                    : "All sessions in this path are complete."}
                </p>
                {currentSession && (
                  <Button className="mt-6 px-5" onClick={() => navigate(routeForSession(currentSession))}>
                    {journeyStarted ? "Continue" : "Start"}
                  </Button>
                )}
              </Card>

              <Card className="rounded-2xl border-0 bg-accent p-5 shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <AskSageIcon size={18} className="text-primary" />
                      Ask Sage
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Get guidance on your next step, anytime.
                    </p>
                  </div>
                  <Button className="px-5" onClick={onAskSage} disabled={!onAskSage}>
                    Start a conversation
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {!isRathbones && (
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Where you left off</h2>

        {/* Primary CTA card */}
        <LeftBorderCard borderVariant="brand" padding="sm">
          {isRathbones ? (
            currentSession ? (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                      {journeyStarted ? "Continue" : "Up next"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide">
                      {leftOffChip(currentSession)}
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {journeyStarted ? "Continue" : "Start"} — {currentSession.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    IM Intake Pathway · Session {currentIndex + 1} of {mod3Sessions.length}
                  </div>
                </div>
                <Button onClick={() => navigate(routeForSession(currentSession))}>
                  {journeyStarted ? "Continue →" : "Start →"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                      Complete
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide">
                      IM Intake Pathway
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    IM Intake Pathway — complete
                  </div>
                  <div className="text-xs text-muted-foreground">
                    IM Intake Pathway · All sessions complete
                  </div>
                </div>
              </div>
            )
          ) : mod4Unlocked ? (
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                    Continue
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide">
                    Article
                  </span>
                </div>
                <div className="text-lg font-semibold text-foreground">
                  Introduction to Claims Processing
                </div>
                <div className="text-xs text-muted-foreground">
                  Claims and Billing · Session 1 of 4 · Article · ~7 min
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Module 4 of 6</span>
                  {!justUnlockedSeen && (
                    <span className="inline-flex items-center rounded-full bg-success-dark/15 text-success-dark px-2 py-0.5 text-[10px] font-semibold">
                      Just unlocked
                    </span>
                  )}
                </div>
              </div>
              <Button
                onClick={() => {
                  setJustUnlockedSeen(true);
                  navigate("/learner/session/mod4-s1");
                }}
              >
                Start →
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                    Up next
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide">
                    {cta.chip}
                  </span>
                </div>
                <div className="text-lg font-semibold text-foreground">{cta.title}</div>
                <div className="text-xs text-muted-foreground">{cta.sub}</div>
              </div>
              <Button onClick={() => navigate(cta.to)}>{cta.button}</Button>
            </div>
          )}
        </LeftBorderCard>
      </div>
      )}

      {!isRathbones && (
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-primary">Personalized for you</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
            <AskSageIcon size={14} />
            AI
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {isRathbones ? "Investment Manager Full Onboarding Journey" : programHeader?.title ?? "Your journey"} ·{" "}
          <span className="font-semibold text-foreground">
            {isRathbones
              ? `${sessionsDone}/${sessionsTotal} sessions`
              : `${moduleStats.complete}/${moduleStats.total} paths complete`}
          </span>
          {!isRathbones && (
            <>
              {" "}
              ·{" "}
              <span className="font-semibold text-foreground">{sessionsDone}/{sessionsTotal} items done</span>
            </>
          )}
        </p>
      </div>
      )}

      {!isRathbones && (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile
          label="Journey"
          value={1}
          variant="brand"
          subLabel="1 active · 0 complete"
          supporting={isRathbones ? "Investment Manager" : "Medicare CSR"}
        />
        <StatTile
          label="Paths"
          value={isRathbones ? 3 : moduleStats.total}
          subLabel={isRathbones ? "IM Intake Pathway" : modulesSubLabel}
          supporting={isRathbones ? "Compliance Refresher Path · Discretionary Portfolio Management" : modulesSupporting}
        />
        <StatTile
          label="Items"
          value={sessionsTotal}
          subLabel={`${sessionsDone} done`}
          supporting={
            inProgressModule?.id === "mod3"
              ? `${mod3SessionTotal} in current path`
              : inProgressModule?.id === "mod4"
                ? "4 in current path"
                : "—"
          }
        />
        <StatTile
          label="Total time"
          value={remainingTime}
          subLabel="Estimated time remaining"
          supporting="Across the journey"
        />
      </div>
      )}

      {/* Pathway */}
      <div className="space-y-3">
        {programHeader && (
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              {isRathbones ? "Your pathway" : programHeader.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isRathbones
                ? `IM Intake Pathway · ${sessionsDone}/${sessionsTotal} sessions`
                : `${programHeader.day} · ${moduleStats.complete}/${moduleStats.total} paths · ${programHeader.sessionsDone}/${sessionsTotal} items`}
            </p>
          </div>
        )}

        <div className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card",
          !isRathbones && "rounded-xl border-l-4 border-l-warning",
        )}>
              <button
                type="button"
                onClick={() => setTrackOpen((v) => !v)}
                aria-expanded={trackOpen}
                aria-controls="beginner-track-list"
                className="w-full text-left bg-card"
              >
                <div className="flex items-center justify-between gap-3 pl-5 pr-2 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        isRathbones ? "bg-accent text-primary" : "bg-warning/15 text-warning-dark",
                      )}>
                        {isRathbones ? "Current path" : "Current track"}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-foreground mt-1.5">
                      {isRathbones ? "IM Intake Pathway" : "Beginner track — full path"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {isRathbones
                        ? `Article · knowledge check · role play · ${sessionsTotal} sessions`
                        : `Slides · reading · practice · ${trackModules.length} paths`}
                    </div>
                  </div>
                  <ChevronRight
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
                      trackOpen && "rotate-90",
                    )}
                  />
                </div>
              </button>

              {trackOpen && (
                <div id="beginner-track-list" className="divide-y divide-border">
                  {isRathbones
                    ? mod3Sessions.map((s) => (
                        <div key={s.id} className="pl-5 pr-4">
                          <SessionRow s={s} />
                        </div>
                      ))
                    : trackModules.map((m) => {
                    if (m.status === "skipped") {
                      return (
                        <Tooltip key={m.id}>
                          <TooltipTrigger asChild>
                            <div className="pl-5 pr-4 py-3 cursor-help">
                              <ModuleRowTrigger module={m} isRathbones={isRathbones} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            This module was skipped based on your experience profile. Your manager has been notified and can revert this within 7 days.
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    if (m.status === "locked") {
                      return (
                        <Tooltip key={m.id}>
                          <TooltipTrigger asChild>
                            <div className="pl-5 pr-4 py-3 cursor-default">
                              <ModuleRowTrigger module={m} isRathbones={isRathbones} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            Complete prior modules to unlock this one.
                          </TooltipContent>
                        </Tooltip>
                      );
                    }
                    const isMod4Unlocked = m.id === "mod4" && mod4Unlocked;
                    return (
                      <InlineExpandRow
                        key={m.id}
                        isExpanded={expandedId === m.id}
                        onToggle={() =>
                          setExpandedId((cur) => (cur === m.id ? null : m.id))
                        }
                        trigger={
                          <ModuleRowTrigger
                            module={m}
                            unlockedBadge={isMod4Unlocked}
                            isRathbones={isRathbones}
                            sessionsOverride={
                              isMod4Unlocked
                                ? { complete: 0, total: 4 }
                                : m.id === "mod3"
                                  ? { complete: 0, total: mod3SessionTotal }
                                  : undefined
                            }
                          />
                        }
                        content={
                          m.id === "mod3" ? (
                            <div className="mt-2 rounded-md bg-card pl-7 pr-4 py-3 space-y-1">
                              {mod3Sessions.map((s) => (
                                <SessionRow key={s.id} s={s} />
                              ))}
                            </div>
                          ) : m.id === "mod4" ? (
                            <div className="mt-2 rounded-md bg-card pl-7 pr-4 py-3 space-y-1">
                              {mod4Sessions.map((s) => (
                                <SessionRow key={s.id} s={s} />
                              ))}
                            </div>
                          ) : (
                            <div className="mt-2 rounded-md bg-card pl-7 pr-4 py-3 space-y-3">
                              <CompletionSummary
                                label="This module is complete — you can review it any time."
                                completedDate={m.completedDate}
                                score={m.score}
                              />
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    navigate(`/learner/session/${m.id}?review=true`)
                                  }
                                >
                                  Review content →
                                </Button>
                              </div>
                            </div>
                          )
                        }
                      />
                    );
                  })}
                </div>
              )}
        </div>
        {isRathbones &&
          LATER_PATHS.map((path) => {
            const open = !!laterOpen[path.id];
            return (
              <div key={path.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setLaterOpen((cur) => ({ ...cur, [path.id]: !cur[path.id] }))}
                  aria-expanded={open}
                  className="w-full text-left bg-card"
                >
                  <div className="flex items-center justify-between gap-3 pl-5 pr-2 py-4">
                    <div>
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                        Locked
                      </span>
                      <div className="text-sm font-semibold text-foreground mt-1.5">{path.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Unlocks when IM Intake Pathway is complete · {path.sessions.length} sessions
                      </div>
                    </div>
                    <ChevronRight
                      aria-hidden="true"
                      className={cn("h-4 w-4 text-muted-foreground transition-transform flex-shrink-0", open && "rotate-90")}
                    />
                  </div>
                </button>
                {open && (
                  <div className="divide-y divide-border">
                    {path.sessions.map((s) => (
                      <div key={s.id} className="pl-5 pr-4">
                        <SessionRow s={s} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function LiveEventsTab() {
  const [open, setOpen] = useState(false);
  const [registered, setRegistered] = useState(true);
  const [registering, setRegistering] = useState(false);

  const handleRegister = () => {
    setRegistering(true);
    setTimeout(() => {
      setRegistering(false);
      setRegistered(true);
    }, 600);
  };

  return (
    <div className="mx-auto w-full max-w-[880px] space-y-6 pb-10 pt-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Live events</h1>
        <p className="text-sm text-muted-foreground">Sessions scheduled as part of your onboarding.</p>
      </header>
      <Card className="rounded-2xl border-border p-6 shadow-sm">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-foreground">
            Investment Management intake workshop
          </div>
          <div className="text-xs text-muted-foreground">
            Jul 20, 2026 · 9:00 AM · In-person · Rathbones Institute, London
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-success-dark/15 text-success-dark px-2 py-0.5 text-xs font-semibold">
              {registered ? "Registered ✓" : "Not registered"}
            </span>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button className="text-sm text-primary hover:underline" type="button">
              Add to calendar
            </button>
            <button
              className="text-sm text-primary hover:underline"
              type="button"
              onClick={() => setOpen(true)}
            >
              View details
            </button>
          </div>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[560px] max-h-[85vh] overflow-y-auto gap-0 p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-base font-medium text-foreground">
              Investment Management intake workshop
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Monday, 20 July 2026
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                9:00 AM – 10:30 AM
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                In-person · Rathbones Institute, London
              </span>
            </div>

            <div className="border-t border-border" />

            <div>
              <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
                About this session
              </div>
              <p className="text-sm text-foreground">
                Phoebe Kapoor hosts this intake workshop for new Investment Managers. The session
                walks through IM Intake Pathway, how the later paths unlock, and what to prepare
                before client meetings. Attendance is optional but strongly recommended for learners
                on the Investment Manager Full Onboarding Journey.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
                Facilitator
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground text-xs font-medium inline-flex items-center justify-center">
                  PK
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Phoebe Kapoor</span>
                  <span className="text-xs text-muted-foreground">Manager, IM Intake Cohort A</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-2">
                What to bring
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                <li>Access to your Embark learner dashboard</li>
                <li>Any questions from your current module sessions</li>
                <li>A notebook for the intake discussion</li>
              </ul>
            </div>

            <div className="border-t border-border" />

            <div className="flex items-center justify-between gap-4">
              {registered ? (
                <span className="text-sm text-success-dark">✓ You're registered for this event.</span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  You haven't registered for this event.
                </span>
              )}
              {registered ? (
                <Button size="sm" variant="secondary" onClick={() => setRegistered(false)}>
                  Cancel registration
                </Button>
              ) : (
                <Button size="sm" onClick={handleRegister} disabled={registering}>
                  {registering ? "Registering…" : "Register now →"}
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4 flex-row justify-between sm:justify-between">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:underline"
            >
              Add to calendar
            </button>
            <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function JourneyTab() {
  const { progress } = useModule3Progress();
  const overridden = applyModuleOverrides(modules, progress);
  const mod4Unlocked = progress.rolePlayDone;
  return (
    <div className="mx-auto w-full max-w-[880px] pb-10 pt-8">
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {overridden.map((m) => {
        const isMod4Unlocked = m.id === "mod4" && mod4Unlocked;
        return (
          <div key={m.id} className="px-4 py-3">
            <ModuleRowTrigger
              module={m}
              unlockedBadge={isMod4Unlocked}
              sessionsOverride={isMod4Unlocked ? { complete: 0, total: 4 } : undefined}
            />
          </div>
        );
      })}
    </div>
    </div>
  );
}

type HandStatus = "open" | "in_progress" | "resolved";

interface LearnerHand {
  id: string;
  status: HandStatus;
  context: string;
  raisedRelative: string;
  raisedFull: string;
  resolvedRelative?: string;
  resolvedFull?: string;
  message: string;
  responder?: string;
  responseDate?: string;
  responseText?: string;
}

const learnerHands: LearnerHand[] = [
  {
    id: "lh1",
    status: "in_progress",
    context: "Coverage Determination — Session 1, Benefits Navigation Module 3",
    raisedRelative: "Today at 10:32 am",
    raisedFull: "3 August 2026 at 10:32 am",
    message:
      "I'm not sure I understand the difference between in-network and out-of-network providers…",
  },
  {
    id: "lh2",
    status: "open",
    context: "Benefits Navigation — General question",
    raisedRelative: "Yesterday",
    raisedFull: "2 August 2026 at 4:05 pm",
    message: "Could we schedule some time to go through the claims process in more detail?",
  },
  {
    id: "lh3",
    status: "resolved",
    context: "Claims Processing — Session 2",
    raisedRelative: "5 days ago",
    raisedFull: "29 July 2026 at 9:20 am",
    resolvedRelative: "Resolved 3 days ago",
    resolvedFull: "31 July 2026 at 11:10 am",
    message: "I wasn't sure how to handle a denied claim scenario in the assessment.",
    responder: "Taylor Reyes (Manager)",
    responseDate: "31 July 2026 at 11:10 am",
    responseText:
      "Good question — for a denied claim, always check the denial reason code first, then confirm eligibility before resubmitting. I've added a short walkthrough to your next session.",
  },
  {
    id: "lh4",
    status: "resolved",
    context: "Coverage Determination — Session 1",
    raisedRelative: "8 days ago",
    raisedFull: "26 July 2026 at 2:14 pm",
    resolvedRelative: "Resolved 6 days ago",
    resolvedFull: "28 July 2026 at 8:45 am",
    message: "The article on deductibles was a bit unclear — can someone explain it differently?",
    responder: "Sam Patel (Trainer)",
    responseDate: "28 July 2026 at 8:45 am",
    responseText:
      "Think of the deductible as the amount the member pays before the plan starts contributing. Once it's met, cost sharing kicks in. Let me know if you'd like to run through an example together.",
  },
];

export const activeHandsRaisedCount = learnerHands.filter(
  (h) => h.status === "open" || h.status === "in_progress",
).length;

const handStatusLabel: Record<HandStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

function HandStatusPill({ status }: { status: HandStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        status === "open" && "bg-warning/15 text-warning-foreground dark:text-warning",
        status === "in_progress" && "bg-primary/15 text-primary",
        status === "resolved" && "bg-muted text-muted-foreground",
      )}
    >
      {handStatusLabel[status]}
    </span>
  );
}

function HandRow({
  hand,
  muted,
  onViewDetails,
}: {
  hand: LearnerHand;
  muted?: boolean;
  onViewDetails: () => void;
}) {
  return (
    <div className="px-4 py-3 transition-colors hover:bg-muted/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <HandStatusPill status={hand.status} />
          <div
            className={cn(
              "text-sm font-semibold",
              muted ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {hand.context}
          </div>
          <div className="text-xs text-muted-foreground">
            Raised {hand.raisedRelative}
            {hand.resolvedRelative ? ` · ${hand.resolvedRelative}` : ""}
          </div>
          <p className="text-sm text-muted-foreground truncate">{hand.message}</p>
        </div>
        <Button variant="secondary" size="sm" className="flex-shrink-0" onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </div>
  );
}

function HandDetailDialog({
  hand,
  onClose,
}: {
  hand: LearnerHand | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!hand} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {hand && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Hand Raised
                <HandStatusPill status={hand.status} />
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground">Raised on</div>
                <p className="text-sm text-foreground">{hand.raisedFull}</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground">Context</div>
                <p className="text-sm text-foreground">{hand.context}</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground">Your message</div>
                <p className="text-sm text-foreground">
                  {hand.message || "No message provided."}
                </p>
              </div>
              <div className="border-t border-border pt-4 space-y-1">
                {hand.responseText ? (
                  <>
                    <div className="text-xs font-semibold text-muted-foreground">
                      Response from {hand.responder}
                    </div>
                    <p className="text-xs text-muted-foreground">{hand.responseDate}</p>
                    <p className="text-sm text-foreground pt-1">{hand.responseText}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {hand.status === "in_progress"
                      ? "Your trainer or manager is looking into this."
                      : "No response yet. Your trainer or manager will get back to you soon."}
                  </p>
                )}
                {hand.status === "resolved" && hand.resolvedFull && (
                  <p className="text-sm text-success pt-2">Resolved on {hand.resolvedFull}.</p>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function HandsRaisedTab() {
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [detail, setDetail] = useState<LearnerHand | null>(null);
  const [showAllResolved, setShowAllResolved] = useState(false);

  const active = learnerHands.filter((h) => h.status === "open" || h.status === "in_progress");
  const resolvedItems = learnerHands.filter((h) => h.status === "resolved");
  const visibleResolved = showAllResolved ? resolvedItems : resolvedItems.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-[880px] space-y-6 pb-10 pt-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Hands raised</h1>
        <p className="text-sm text-muted-foreground">
          Raise a hand to let your line manager know you need support.
        </p>
      </header>

      <Button className="w-full sm:w-auto" onClick={() => setRaiseOpen(true)}>
        <Hand className="h-4 w-4" />
        Raise a Hand
      </Button>

      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">Active Requests</h3>
          <p className="text-sm text-muted-foreground">
            Your hands raised that are currently open or being looked into.
          </p>
        </div>
        {active.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <Hand className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              You have no open or in-progress requests right now.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {active.map((hand) => (
              <HandRow key={hand.id} hand={hand} onViewDetails={() => setDetail(hand)} />
            ))}
          </div>
        )}
      </section>

      <div className="border-t border-border" />

      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">Resolved</h3>
          <p className="text-sm text-muted-foreground">
            Your previously raised hands that have been resolved.
          </p>
        </div>
        {resolvedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <Check className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              You haven't had any hands raised resolved yet.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {visibleResolved.map((hand) => (
                <HandRow key={hand.id} hand={hand} muted onViewDetails={() => setDetail(hand)} />
              ))}
            </div>
            {resolvedItems.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllResolved((v) => !v)}
              >
                {showAllResolved ? "Show less" : "Show all resolved"}
              </Button>
            )}
          </>
        )}
      </section>

      <RaiseHandModal open={raiseOpen} onClose={() => setRaiseOpen(false)} />
      <HandDetailDialog hand={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function MyHistoryTab() {
  return (
    <div className="mx-auto w-full max-w-[880px] pb-10">
      <HistoryView data={historyData} journeyName="Investment Manager Full Onboarding Journey" />
    </div>
  );
}

export function JourneyTabContent({
  activeTab,
  programHeader,
  onAskSage,
}: {
  activeTab: string;
  programHeader?: { title: string; day: string; modulesDone: number; sessionsDone: number };
  onAskSage?: () => void;
}) {
  switch (activeTab) {
    case "current":
      return <CurrentTab programHeader={programHeader} onAskSage={onAskSage} />;
    case "live_events":
      return <LiveEventsTab />;
    case "journey":
      return <JourneyTab />;
    case "hands_raised":
      return <HandsRaisedTab />;
    case "my_history":
      return <MyHistoryTab />;
    default:
      return null;
  }
}