import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/embark/StatTile";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { SageAvatar } from "@/components/embark/AskSageIcon";
import { SageTag } from "@/components/embark/SageTag";
import { ModuleStatusIcon } from "@/components/embark/ModuleStatusIcon";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { upskillerContent } from "@/data/upskillerContent";
import { getAvailableModalities, MODALITY_LABEL } from "@/lib/modality";
import {
  useUpskillerProgress,
  type UpskillerItemStatus,
} from "@/hooks/use-upskiller-progress";

function contentTypeLabel(id: string): string {
  if (id === "rp1") return "Role Play";
  const entry = upskillerContent[id];
  if (!entry) return "Multiple formats";
  const available = getAvailableModalities({
    id: entry.id,
    moduleId: entry.id,
    modality: entry.modality,
  });
  if (available.length > 1) return "Multiple formats";
  if (available.length === 1) {
    return available[0] === "text" ? "Article" : MODALITY_LABEL[available[0]];
  }
  return "Multiple formats";
}

type ModuleItem = {
  id: string;
  title: string;
  type: "Module" | "Role-Play";
  duration: string;
  description: string;
};

const MODULES: ModuleItem[] = [
  {
    id: "m1",
    title: "Objection Handling Fundamentals",
    type: "Module",
    duration: "45 min",
    description:
      "Core frameworks for handling customer objections with structure and confidence.",
  },
  {
    id: "m2",
    title: "Medicare Advantage — Product Deep Dive",
    type: "Module",
    duration: "30 min",
    description:
      "Comprehensive coverage of Medicare Advantage plan structures, costs, and key selling points.",
  },
  {
    id: "m3",
    title: "Compliance Essentials — Regulated Advice Boundaries",
    type: "Module",
    duration: "20 min",
    description:
      "Understanding where the compliance boundary sits and how to stay within it during customer interactions.",
  },
  {
    id: "rp1",
    title: "Objection Handling Role-Play — Skeptical Prospect",
    type: "Role-Play",
    duration: "15–20 min",
    description:
      "Practice handling objections in a simulated conversation with a skeptical Medicare prospect.",
  },
];

function SageEntry() {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-foreground">Where you left off</h2>
      <LeftBorderCard borderVariant="brand" padding="sm">
        <div className="flex items-start gap-3">
          <SageAvatar size="sm" />
          <div className="min-w-0 space-y-1">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              Sage
            </div>
            <p className="text-sm text-foreground">
              Hi Riley — your upskilling journey is ready. Ask me anything about your modules or
              how they were chosen.
            </p>
          </div>
        </div>
      </LeftBorderCard>
    </div>
  );
}

export default function UpskillerDashboard() {
  const [searchParams] = useSearchParams();
  const activeTab =
    searchParams.get("tab") === "ai_rationale" ? "ai_rationale" : "my_journey";
  const { statusOf } = useUpskillerProgress();
  const module1Complete = statusOf("m1") === "completed";

  return (
    <PageContainer as="div" className="flex-1 flex flex-col gap-6 py-6">
      {activeTab === "my_journey" && (
        <MyJourneyTab statusOf={statusOf} module1Complete={module1Complete} />
      )}

      {activeTab === "ai_rationale" && (
        <AiRationaleTab module1Complete={module1Complete} />
      )}
    </PageContainer>
  );
}

function ModuleRow({
  module,
  statusChip,
  isComplete,
  ctaLabel,
  locked,
}: {
  module: ModuleItem;
  statusChip: { label: string; variant: "neutral" | "success" };
  isComplete?: boolean;
  ctaLabel?: string;
  locked?: boolean;
}) {
  const navigate = useNavigate();
  const open = () =>
    navigate(module.id === "rp1" ? "/upskiller/roleplay" : `/upskiller/session/${module.id}`);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className="flex items-start gap-3 pl-5 pr-4 py-3 text-left w-full cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <div className="mt-0.5 flex-shrink-0">
        <ModuleStatusIcon status={isComplete ? "completed" : locked ? "locked" : "in_progress"} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{module.title}</span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
              statusChip.variant === "success"
                ? "bg-success-dark/15 text-success-dark"
                : "bg-muted text-muted-foreground",
            )}
          >
            {statusChip.label}
          </span>
          <SageTag label="AI Recommended" className="px-2 py-0.5 text-[10px]" />
        </div>
        <div className="text-xs text-muted-foreground">{module.duration}</div>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {contentTypeLabel(module.id)}
        </span>
        {isComplete ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            Review content →
          </Button>
        ) : locked ? null : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            {ctaLabel ?? "Start →"}
          </Button>
        )}
      </div>
    </div>
  );
}

function MyJourneyTab({
  statusOf,
  module1Complete,
}: {
  statusOf: (id: string) => UpskillerItemStatus;
  module1Complete: boolean;
}) {
  const chipFor = (status: UpskillerItemStatus) =>
    status === "completed"
      ? { label: "Completed", variant: "success" as const }
      : status === "in_progress"
        ? { label: "In progress", variant: "neutral" as const }
        : { label: "Not started", variant: "neutral" as const };

  return (
    <div className="space-y-6">
      <SageEntry />

      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-primary">
            Welcome back, Riley. Your personalised upskilling journey is ready.
          </h1>
          <SageTag />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            3 modules assigned
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            1 role-play practice available
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Journey adapts as you progress
          </span>
        </div>
      </div>

      <ProgressTab statusOf={statusOf} />

      <div className="rounded-xl border border-border bg-card overflow-hidden border-l-4 border-l-warning">
        <div className="pl-5 pr-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">Your upskilling journey</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                3 modules · 1 role-play practice
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning-dark">
              Current track
            </span>
          </div>
        </div>

        <div className="divide-y divide-border border-t border-border">
        {MODULES.slice(0, 3).map((m) => {
          const status = statusOf(m.id);
          return (
            <ModuleRow
              key={m.id}
              module={m}
              statusChip={chipFor(status)}
              isComplete={status === "completed"}
              ctaLabel={status === "in_progress" ? "Continue →" : undefined}
            />
          );
        })}
        <ModuleRow
          module={MODULES[3]}
          locked={!module1Complete}
          isComplete={statusOf("rp1") === "completed"}
          ctaLabel={statusOf("rp1") === "in_progress" ? "Continue →" : undefined}
          statusChip={
            statusOf("rp1") !== "not_started"
              ? chipFor(statusOf("rp1"))
              : module1Complete
                ? { label: "Available now", variant: "success" }
                : { label: "Unlocks after Module 1", variant: "neutral" }
          }
        />
        </div>
      </div>

      <LeftBorderCard borderVariant="brand">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-foreground">
            Your journey adapts as you progress. Completing modules and assessments may unlock
            new content or remove items that are no longer relevant to your development.
          </p>
        </div>
      </LeftBorderCard>
    </div>
  );
}

function AiRationaleTab({ module1Complete }: { module1Complete: boolean }) {
  const signals = [
    {
      label: "Skills Assessment",
      detail:
        "3 gaps identified: Objection Handling, Compliance Knowledge, Product Knowledge — Medicare Advantage",
      influence: "High influence",
    },
    {
      label: "Coaching Score",
      detail:
        "72% average over 4 weeks — below the 80% benchmark. Coach flagged objection handling and call structure.",
      influence: "High influence",
    },
    {
      label: "CSAT Score",
      detail:
        "3.4 / 5 average — below the 4.0 team target. Customer feedback indicated unclear responses on plan options.",
      influence: "Medium influence",
    },
  ];

  const selection = [
    "Objection Handling Fundamentals was selected as the highest-rated content item addressing your primary gap.",
    "Medicare Advantage — Product Deep Dive was selected to address the product knowledge gap flagged in both your skills assessment and CSAT feedback.",
    "Compliance Essentials was selected to close the compliance knowledge gap identified in your skills assessment.",
    "The Objection Handling Role-Play was included to provide applied practice following the completion of Module 1, reinforcing learning through simulation.",
  ];

  const rationales = [
    {
      title: "Objection Handling Fundamentals",
      reason:
        "Your skills assessment identified Objection Handling as a priority gap, and your coaching score feedback specifically noted a lack of structure and confidence when responding to objections. This module addresses both signals directly.",
      supporting: "Signals: Skills Assessment (high influence) · Coaching Score (high influence)",
    },
    {
      title: "Medicare Advantage — Product Deep Dive",
      reason:
        "Your skills assessment flagged a gap in Medicare Advantage product knowledge, and CSAT feedback indicated that customers found your responses on plan options unclear. This module closes both gaps simultaneously.",
      supporting: "Signals: Skills Assessment (high influence) · CSAT Score (medium influence)",
    },
    {
      title: "Compliance Essentials — Regulated Advice Boundaries",
      reason:
        "Your skills assessment identified a gap in compliance knowledge. This module has been included to ensure you are confident operating within regulated advice boundaries before engaging in further customer interactions.",
      supporting: "Signals: Skills Assessment (high influence)",
    },
    {
      title: "Objection Handling Role-Play — Skeptical Prospect",
      reason:
        "Role-play practice has been included to give you a safe, applied environment to practise the objection handling skills covered in Module 1. Completing assessed role-play also provides a further signal for your journey's adaptive logic.",
      supporting: "Signals: Skills Assessment (high influence) · Coaching Score (high influence)",
    },
  ];

  const adaptiveRules = [
    "If you score above 85% on a module assessment, Embark may remove the associated follow-on content as the gap has been closed.",
    "If you score below 70% on a module assessment, Embark will assign targeted microlearning to reinforce the topic before you progress.",
    "Strong role-play performance may unlock advanced content not currently shown in your journey.",
    "Weak role-play performance may trigger additional practice modules or coaching prompts.",
    "Your AI Rationale tab updates each time your journey adapts — so you always know what changed and why.",
  ];

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Here's a full explanation of how your upskilling journey was generated — which signals
        were used, how content was selected, and why each module was included.
      </p>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground tracking-wide">
            Signals Used to Generate Your Journey
          </h3>
          <SageTag />
        </div>
        <div className="space-y-2">
          {signals.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border bg-card p-4 flex flex-wrap items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-sm font-semibold text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.detail}</div>
              </div>
              <Badge variant="outline">{s.influence}</Badge>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground tracking-wide">
          How Content Was Selected
        </h3>
        <p className="text-sm text-foreground">
          Embark matched your identified skills gaps to content available in your organisation's
          library. Content was prioritised based on three factors: relevance to your specific gap
          areas, sequencing logic (foundational content before advanced), and content quality
          ratings within your tenant.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          {selection.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground tracking-wide">
            Why Each Module Was Included
          </h3>
          <SageTag />
        </div>

        {module1Complete && (
          <LeftBorderCard borderVariant="success">
            <div className="flex items-start gap-2">
              <CheckCircle2
                className="h-4 w-4 text-success-dark mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <p className="text-sm text-foreground">
                Journey updated — Module 1 completed. Role-play practice is now unlocked. Your
                rationale has been updated to reflect this change.
              </p>
            </div>
          </LeftBorderCard>
        )}

        <div className="space-y-3">
          {rationales.map((r) => (
            <div
              key={r.title}
              className="rounded-lg border border-border bg-card p-4 space-y-2"
            >
              <h4 className="text-sm font-semibold text-foreground">{r.title}</h4>
              <p className="text-sm text-foreground">{r.reason}</p>
              <p className="text-xs text-muted-foreground">{r.supporting}</p>
              <Badge
                variant="outline"
                className="border-success-dark/40 bg-success-dark/10 text-success-dark"
              >
                Highly rated in your tenant
              </Badge>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground tracking-wide">
          How Your Journey Adapts
        </h3>
        <p className="text-sm text-foreground">
          Your upskilling journey is not static. As you complete modules, submit assessments, and
          complete role-play sessions, Embark re-evaluates your development needs and updates
          your journey accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          {adaptiveRules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ProgressTab({ statusOf }: { statusOf: (id: string) => UpskillerItemStatus }) {
  const moduleIds = ["m1", "m2", "m3"];
  const modulesDone = moduleIds.filter((id) => statusOf(id) === "completed").length;
  const allIds = [...moduleIds, "rp1"];
  const overall = Math.round(
    (allIds.filter((id) => statusOf(id) === "completed").length / allIds.length) * 100,
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatTile label="Modules completed" value={`${modulesDone} / 3`} />
      <StatTile label="Role-play attempts" value={statusOf("rp1") === "not_started" ? 0 : 1} />
      <StatTile label="Overall journey progress" value={`${overall}%`} />
    </div>
  );
}
