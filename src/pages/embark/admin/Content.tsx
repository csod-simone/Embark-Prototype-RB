import { ContentCategoryFields } from "@/components/embark/admin/ContentCategoryFields";
import { SageTag } from "@/components/embark/SageTag";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { AlertTriangle, ChevronDown, Info, Plus, Search, Trash2, X, Upload, FileText } from "lucide-react";
import { SkillPickerModal } from "./content/SkillPickerModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { ChipInput } from "@/components/embark/ChipInput";
import { Button } from "@/components/ui/button";
import { useCornerstoneIntegration } from "@/hooks/use-cornerstone-integration";
import { useLinesOfBusiness } from "@/hooks/use-lines-of-business";
import { AddAssessmentDialog } from "./content/AddAssessmentDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { VersionMarkers } from "@/components/embark/admin/ContentVersionDetails";
import { currentContentVersion, isVersionedContent } from "@/data/contentVersioning";
import {
  CONTENT_CATEGORIES,
  emptyContentCategories,
  type ContentCategorySelection,
} from "@/data/contentCategories";

export type ContentType = "article" | "assessment" | "resource" | "roleplay" | "video" | "url";
export type JourneyKey = "medicare" | "newhire" | "suitability";

export const JOURNEY_LABEL: Record<JourneyKey, string> = {
  medicare: "IM Intake Pathway",
  newhire: "New Hire Foundations",
  suitability: "Suitability File Standards",
};

const JOURNEY_ORDER: JourneyKey[] = ["medicare", "newhire", "suitability"];

const MODULES_BY_JOURNEY: Record<JourneyKey, string[]> = {
  medicare: ["Client relationships", "Suitability and advice", "Conduct", "Discretionary portfolios"],
  newhire: ["Workplace foundations", "Role orientation"],
  suitability: ["Suitability files"],
};

export type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  journey: JourneyKey;
  module: string;
  updated: string; // ISO
  lastUsed?: string; // ISO
  avgScore?: number;
  flagged?: boolean;
};

export const CONTENT: ContentItem[] = [
  // Medicare CSR
  { id: "m1", title: "Client relationships foundations", type: "article", journey: "medicare", module: "Client relationships", updated: "2025-07-12", lastUsed: "2026-07-08" },
  { id: "m2", title: "Knowledge check 1", type: "assessment", journey: "medicare", module: "Client relationships", updated: "2025-07-12", lastUsed: "2026-07-05" },
  { id: "m3", title: "Discovery and objectives", type: "article", journey: "medicare", module: "Client relationships", updated: "2025-07-14", lastUsed: "2026-07-01" },
  { id: "rp1", title: "Practice — Discovery with James Whitfield", type: "roleplay", journey: "medicare", module: "Client relationships", updated: "2025-08-08", lastUsed: "2026-07-04" },
  { id: "m5", title: "Knowledge check 2", type: "assessment", journey: "medicare", module: "Suitability and advice", updated: "2025-07-18", lastUsed: "2026-06-20" },
  { id: "m6", title: "Suitability under pressure", type: "article", journey: "medicare", module: "Suitability and advice", updated: "2025-07-18", lastUsed: "2025-06-22", flagged: true },
  { id: "rp2", title: "Practice — Suitability under pressure", type: "roleplay", journey: "medicare", module: "Suitability and advice", updated: "2025-08-09", lastUsed: "2026-06-30" },
  { id: "m9", title: "Advice documentation", type: "article", journey: "medicare", module: "Suitability and advice", updated: "2025-07-22", lastUsed: "2026-04-15", flagged: true },
  { id: "m10", title: "Knowledge check 3", type: "assessment", journey: "medicare", module: "Suitability and advice", updated: "2025-07-22" },
  { id: "rp3", title: "Formative — Suitability with Daniel Ellison", type: "roleplay", journey: "medicare", module: "Suitability and advice", updated: "2025-08-08" },
  { id: "m12", title: "Module assessment", type: "assessment", journey: "medicare", module: "Suitability and advice", updated: "2025-07-24", lastUsed: "2026-06-22", avgScore: 66 },
  { id: "m15", title: "Chapter gate", type: "assessment", journey: "medicare", module: "Suitability and advice", updated: "2025-08-01", lastUsed: "2026-05-30" },
  { id: "cmp1", title: "FCA conduct essentials", type: "article", journey: "medicare", module: "Conduct", updated: "2025-08-12" },
  { id: "cmp2", title: "Financial crime and market abuse", type: "article", journey: "medicare", module: "Conduct", updated: "2025-08-12" },
  { id: "cmpa", title: "Conduct knowledge check", type: "assessment", journey: "medicare", module: "Conduct", updated: "2025-08-12" },
  { id: "dpm1", title: "Discretionary mandate types", type: "article", journey: "medicare", module: "Discretionary portfolios", updated: "2025-08-12" },
  { id: "dpm2", title: "Reporting a portfolio valuation", type: "article", journey: "medicare", module: "Discretionary portfolios", updated: "2025-08-12" },
  { id: "dpma", title: "Discretionary knowledge check", type: "assessment", journey: "medicare", module: "Discretionary portfolios", updated: "2025-08-12" },
  // New Hire
  { id: "n1", title: "Welcome to the Organisation", type: "article", journey: "newhire", module: "Workplace foundations", updated: "2025-08-05", lastUsed: "2026-07-02" },
  { id: "n2", title: "Policies, Culture & Conduct", type: "article", journey: "newhire", module: "Workplace foundations", updated: "2025-08-05", lastUsed: "2026-06-22" },
  { id: "n3", title: "Systems & Tools Overview", type: "article", journey: "newhire", module: "Workplace foundations", updated: "2025-08-06", lastUsed: "2026-06-15" },
  { id: "n4", title: "Module 1 Assessment", type: "assessment", journey: "newhire", module: "Workplace foundations", updated: "2025-08-06", lastUsed: "2026-05-10" },
  { id: "n5", title: "Your Role & Team", type: "article", journey: "newhire", module: "Role orientation", updated: "2025-08-06", lastUsed: "2026-06-28" },
  { id: "n6", title: "Goals, Performance & Feedback", type: "article", journey: "newhire", module: "Role orientation", updated: "2025-08-07", lastUsed: "2026-06-05" },
  { id: "n7", title: "Reward and wellbeing", type: "article", journey: "newhire", module: "Role orientation", updated: "2025-08-07", lastUsed: "2026-04-20" },
  { id: "n8", title: "Resource: New Hire Handbook", type: "resource", journey: "newhire", module: "Workplace foundations", updated: "2025-08-07" },
  { id: "n9", title: "Resource: IT Setup Guide", type: "resource", journey: "newhire", module: "Workplace foundations", updated: "2025-08-07" },
  { id: "sf-article", title: "Suitability file standards", type: "article", journey: "suitability", module: "Suitability files", updated: "2026-09-28", lastUsed: "2026-09-28" },
  { id: "sf-check", title: "Suitability file knowledge check", type: "assessment", journey: "suitability", module: "Suitability files", updated: "2026-08-04", lastUsed: "2026-09-22" },
];


function TypeBadge({ type }: { type: ContentType }) {
  if (type === "article") return <Badge variant="default">Article</Badge>;
  if (type === "assessment") return <Badge variant="success">Assessment</Badge>;
  if (type === "roleplay") return <Badge variant="warning">Role-Play</Badge>;
  if (type === "video") return <Badge variant="secondary">Video</Badge>;
  if (type === "url") return <Badge variant="secondary">URL</Badge>;
  return <Badge variant="secondary">Course</Badge>;
}

function ScoreCell({ score }: { score?: number }) {
  if (score === undefined) return <span className="text-muted-foreground">—</span>;
  const cls =
    score >= 80 ? "text-success-dark" : score >= 65 ? "text-warning-foreground dark:text-warning" : "text-destructive";
  return <span className={`font-medium ${cls}`}>{score}%</span>;
}

function StatBox({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number;
  sub: string;
  tone?: "primary" | "warning";
}) {
  const color =
    tone === "primary" ? "text-primary" : tone === "warning" ? "text-warning-foreground dark:text-warning" : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="text-xs tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function SignalCard({
  title,
  body,
  actions,
  onView,
}: {
  title: string;
  body: string;
  actions: string[];
  onView: () => void;
}) {
  return (
    <LeftBorderCard borderVariant="warning">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-warning-foreground dark:text-warning mt-0.5 shrink-0" />
          <div className="text-sm font-medium text-foreground">{title}</div>
        </div>
        <button
          type="button"
          onClick={onView}
          className="text-xs text-primary hover:underline whitespace-nowrap"
        >
          View content →
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toast(`${a} — action noted`)}
            className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-foreground hover:bg-muted"
          >
            {a}
          </button>
        ))}
      </div>
    </LeftBorderCard>
  );
}

type ReviewReason = { summary: string; details: string[] };

function getReviewReason(id: string): ReviewReason {
  if (id === "m6") {
    return {
      summary: "This content hasn't been used in over 5 months and may be out of date.",
      details: [
        "Last used: 18 Feb 2025 — no learner activity has been recorded since.",
        "Content that goes unused for extended periods may contain outdated information, broken links, or misaligned messaging.",
        "Sage recommends reviewing for accuracy and relevance before reassigning to active cohorts.",
      ],
    };
  }
  if (id === "m9") {
    return {
      summary: "This content is linked to a high number of learner escalations.",
      details: [
        "7 escalations have been raised by learners who completed this content in the last 30 days.",
        "Common escalation themes include confusion around key concepts covered in this module.",
        "Sage recommends reviewing the content for clarity, adding worked examples, or introducing a supporting knowledge check.",
      ],
    };
  }
  return {
    summary: "Sage has flagged this content for review based on recent learner signals.",
    details: [
      "Learner engagement with this content has dropped compared to the previous 30-day period.",
      "Sage detected patterns that may indicate the content is unclear or misaligned with current learner needs.",
    ],
  };
}

function ReviewRecommendedChip({ itemId, onDismiss }: { itemId: string; onDismiss: () => void }) {
  const [open, setOpen] = useState(false);
  const reason = getReviewReason(itemId);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-sm -mx-1 px-1 text-xs text-warning-foreground dark:text-warning cursor-pointer hover:bg-warning/10 transition-colors"
          aria-label="Why Sage recommends review"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Review recommended</span>
          <Info className="h-3 w-3 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <SageTag />
            <span className="text-sm font-medium text-foreground">Sage recommends review</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">{reason.summary}</p>
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
          {reason.details.map((d) => (
            <li key={d} className="text-xs text-muted-foreground">{d}</li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDismiss();
              toast.success("Content marked as reviewed.");
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Mark as reviewed
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type SortKey = "title" | "type" | "updated" | "sage";

export default function Content() {
  const navigate = useNavigate();
  const { enabled: integrationEnabled } = useCornerstoneIntegration();
  const [lastUpdatedFilter, setLastUpdatedFilter] = useState<"all" | "7d" | "30d" | "90d">("all");
  const [sageSignalsFilter, setSageSignalsFilter] = useState<"all" | "flagged" | "not_flagged">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ContentType>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("title");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [highlightModule, setHighlightModule] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!highlightModule) return;
    const t = setTimeout(() => setHighlightModule(null), 2500);
    return () => clearTimeout(t);
  }, [highlightModule]);

  const scrollToModule = (moduleKeyword: string) => {
    setHighlightModule(moduleKeyword);
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();
    const cutoffDays =
      lastUpdatedFilter === "7d" ? 7 :
      lastUpdatedFilter === "30d" ? 30 :
      lastUpdatedFilter === "90d" ? 90 :
      null;
    let list = CONTENT.filter((c) => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (sageSignalsFilter !== "all") {
        const isFlagged = !!c.flagged;
        if (sageSignalsFilter === "flagged" && !isFlagged) return false;
        if (sageSignalsFilter === "not_flagged" && isFlagged) return false;
      }
      if (cutoffDays !== null) {
        const updated = new Date(c.updated);
        const diffMs = now.getTime() - updated.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays > cutoffDays) return false;
      }
      if (q && !c.title.toLowerCase().includes(q) && !c.module.toLowerCase().includes(q))
        return false;
      return true;
    });

    if (sortBy === "title") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "type") {
      list = [...list].sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortBy === "updated") {
      list = [...list].sort((a, b) => b.updated.localeCompare(a.updated));
    } else {
      list = [...list].sort((a, b) => {
        const af = a.flagged ? 0 : 1;
        const bf = b.flagged ? 0 : 1;
        if (af !== bf) return af - bf;
        return a.title.localeCompare(b.title);
      });
    }
    return list;
  }, [lastUpdatedFilter, sageSignalsFilter, typeFilter, search, sortBy]);

  const colCount = 7;

  const rowClass = (item: ContentItem) => {
    const parts = ["hover:bg-muted/40"];
    if (item.flagged) parts.push("bg-warning/5");
    if (highlightModule && item.module.startsWith(highlightModule))
      parts.push("ring-1 ring-inset ring-warning/50");
    return parts.join(" ");
  };

  const renderRow = (item: ContentItem) => (
    <TableRow key={item.id} className={rowClass(item)}>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-foreground">{item.title}</div>
          {isVersionedContent(item.id) && (
            <>
              <Badge variant="secondary">{currentContentVersion().id}</Badge>
              <VersionMarkers scope="content" />
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        <TypeBadge type={item.type} />
      </TableCell>
      
      <TableCell className="text-sm text-muted-foreground">
        {format(new Date(item.updated), "d MMM yyyy")}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {item.lastUsed ? (
          format(new Date(item.lastUsed), "d MMM yyyy")
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell>
        <ScoreCell score={item.avgScore} />
      </TableCell>
      <TableCell>
        {item.flagged && !dismissedIds.has(item.id) ? (
          <ReviewRecommendedChip
            itemId={item.id}
            onDismiss={() =>
              setDismissedIds((prev) => {
                const next = new Set(prev);
                next.add(item.id);
                return next;
              })
            }
          />
        ) : null}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() =>
              navigate(
                item.type === "assessment"
                  ? `/admin/content/${item.id}/assessment/edit`
                  : item.type === "roleplay"
                    ? `/admin/content/roleplay/${item.id}/edit`
                    : `/admin/content/${item.id}/edit`,
              )
            }
          >
            {integrationEnabled ? "View / Edit" : "Edit"}
          </button>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:underline"
            onClick={() => toast("Preview coming soon")}
          >
            Preview
          </button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Content</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage all content and assessments available in your Embark. Review Sage-flagged content gaps and quality signals.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-40">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger aria-label="Filter by content type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="resource">Course</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="roleplay">Role-Play</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-52">
              <Select value={lastUpdatedFilter} onValueChange={(v) => setLastUpdatedFilter(v as typeof lastUpdatedFilter)}>
                <SelectTrigger aria-label="Filter by last updated">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-44">
              <Select value={sageSignalsFilter} onValueChange={(v) => setSageSignalsFilter(v as typeof sageSignalsFilter)}>
                <SelectTrigger aria-label="Filter by Sage signals">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Signals</SelectItem>
                  <SelectItem value="flagged">Flagged by Sage</SelectItem>
                  <SelectItem value="not_flagged">Not flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!integrationEnabled && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Content
              </Button>
            )}
            <Button onClick={() => setAssessmentDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Assessment
            </Button>
            <Button onClick={() => navigate("/admin/content/roleplay/new")}>
              <Plus className="h-4 w-4 mr-1" />
              Add Role-Play
            </Button>
          </div>
        </div>

        {integrationEnabled && !bannerDismissed && (
          <LeftBorderCard borderVariant="brand">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-secondary-foreground" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">Content Library</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your configuration uses Cornerstone Learn to manage content. The Embark content library is available in read-only mode. To add or edit content, visit Cornerstone Learn. Embark-specific fields can still be updated here.
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => toast("Opening Cornerstone Learn...")}
                  className="text-xs text-secondary-foreground hover:underline"
                >
                  Open in Cornerstone Learn ↗
                </button>
                <button
                  type="button"
                  onClick={() => setBannerDismissed(true)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </LeftBorderCard>
        )}

        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <StatBox label="Total Content Items" value={27} sub="Across all journeys" />
          <StatBox label="Articles" value={14} sub="Published learning articles" tone="primary" />
          <StatBox label="Assessments" value={8} sub="Knowledge checks and gates" tone="primary" />
          <StatBox label="Courses" value={2} sub="Supplementary materials" tone="primary" />
          <StatBox label="Flagged by Sage" value={2} sub="Content quality signals" tone="warning" />
          <StatBox label="Role-Plays" value={3} sub="Practice scenarios" tone="primary" />
        </div>

        {/* Sage Content Signals */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Sage Content Signals</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sage has identified potential content quality issues based on learner escalation
                patterns and assessment performance
              </p>
            </div>
            <Badge variant="warning">2 signals</Badge>
          </div>

          <div className="space-y-3">
            <SignalCard
              title="Suitability under pressure — high escalation rate"
              body="4 out of 5 open learner escalations are about the file note, the mandate check, or suitability under pressure — all in Suitability and advice. The module assessment average is 66%, below the 70% threshold. Sage recommends reviewing the article and adding a worked example."
              actions={["Review article", "Add worked example", "Flag for content review"]}
              onView={() => scrollToModule("Suitability")}
            />
            <SignalCard
              title="Client relationships foundations — borderline knowledge check scores"
              body="Knowledge check 1 averages 79% and is slipping. 4 learners have scored below 65%, mostly on discovery and the mandate. Those questions have been escalated twice in the last 30 days. Sage recommends reviewing whether the article covers a pressured discovery well enough."
              actions={["Review article", "Add a discovery example", "Flag for content review"]}
              onView={() => scrollToModule("Client")}
            />
          </div>
        </section>

        {/* Content library */}
        <section className="space-y-3" ref={tableRef}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground">Content Library</h3>
            <div className="flex items-center gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content..."
                className="w-56"
              />
              <div className="w-48">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                  <SelectTrigger aria-label="Sort content">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title A–Z</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="updated">Last updated ↓</SelectItem>
                    <SelectItem value="sage">Sage Signal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Last Used</TableHead>

                  <TableHead>Avg Score</TableHead>
                  <TableHead>Sage Signal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={colCount} className="text-center text-sm text-muted-foreground py-6">
                      No content matches your filters.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map(renderRow)}
              </TableBody>
            </Table>
          </div>
        </section>
      </PageContainer>

      <AddContentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        integrationEnabled={integrationEnabled}
      />
      <AddAssessmentDialog
        open={assessmentDialogOpen}
        onOpenChange={setAssessmentDialogOpen}
      />
    </>
  );
}

type FormState = {
  type: ContentType;
  title: string;
  linesOfBusiness: string[];
  description: string;
  duration: string;
  tags: string[];
  categories: ContentCategorySelection;
  fileName: string;
  externalUrl: string;
};

export const LINES_OF_BUSINESS = [
  "Medicare Advantage",
  "Medicare Supplement",
  "Medicaid",
  "Commercial",
  "Individual & Family Plans",
  "Employer Group",
  "Dental & Vision",
  "Pharmacy & Part D",
  "Dual Eligible (D-SNP)",
  "Provider Relations",
  "Sales & Distribution",
  "Operations & Back Office",
];

const ADD_CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "article", label: "Article" },
  { value: "resource", label: "Course" },
  { value: "video", label: "Video" },
  { value: "url", label: "URL" },
];

const EMPTY_FORM: FormState = {
  type: "article",
  title: "",
  linesOfBusiness: [],
  description: "",
  duration: "",
  tags: [],
  categories: emptyContentCategories(),
  fileName: "",
  externalUrl: "",
};

type CornerstoneStub = {
  id: string;
  title: string;
  type: string;
  duration: string;
};

const CORNERSTONE_STUBS: CornerstoneStub[] = [
  { id: "CSL-00421", title: "Medicare Part D — Formulary Basics", type: "eLearning", duration: "45 min" },
  { id: "CSL-00389", title: "Coordination of Benefits Overview", type: "eLearning", duration: "40 min" },
  { id: "CSL-00412", title: "Prior Authorisation Process", type: "eLearning", duration: "35 min" },
  { id: "CSL-00298", title: "Medicare Advantage Plan Types", type: "Video", duration: "20 min" },
  { id: "CSL-00501", title: "CMS Compliance Essentials", type: "Document", duration: "15 min" },
];

function AddContentDialog({
  open,
  onOpenChange,
  integrationEnabled,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  integrationEnabled: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Add Content</DialogTitle>
          <DialogDescription>
            {integrationEnabled
              ? "Select existing content from Cornerstone Learn or upload a new file directly to Embark."
              : "Upload a new content file and fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        {integrationEnabled ? (
          <Tabs defaultValue="cornerstone" className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cornerstone">Select from Cornerstone Learn</TabsTrigger>
                <TabsTrigger value="upload">Upload New Content</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="cornerstone" className="flex-1 flex flex-col min-h-0 mt-0">
              <CornerstoneSelectPanel onDone={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="upload" className="flex-1 flex flex-col min-h-0 mt-0">
              <UploadNewContentForm
                onDone={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                helperText="Upload a new content file directly to the Embark Content Library. This content will not be linked to Cornerstone Learn."
              />
            </TabsContent>
          </Tabs>
        ) : (
          <UploadNewContentForm
            onDone={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

const PROFICIENCY_LEVELS = ["Foundational", "Intermediate", "Advanced", "Expert"] as const;
type ProficiencyLevel = (typeof PROFICIENCY_LEVELS)[number];
type ProposedSkill = { name: string; level: ProficiencyLevel };

const PROPOSED_SKILLS: ProposedSkill[] = [
  { name: "Objection Handling", level: "Intermediate" },
  { name: "Active Listening", level: "Intermediate" },
  { name: "Product Knowledge", level: "Foundational" },
  { name: "Compliance Awareness", level: "Foundational" },
  { name: "Communication — Verbal", level: "Intermediate" },
  { name: "Customer Empathy", level: "Intermediate" },
  { name: "Questioning Techniques", level: "Foundational" },
  { name: "Call Structure", level: "Foundational" },
];

function UploadNewContentForm({
  onDone,
  onCancel,
  helperText,
}: {
  onDone: () => void;
  onCancel: () => void;
  helperText?: string;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showErrors, setShowErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [skills, setSkills] = useState<ProposedSkill[]>(PROPOSED_SKILLS);
  const [skillPickerOpen, setSkillPickerOpen] = useState(false);

  const removeSkill = (index: number) => {
    const removed = skills[index];
    setSkills((prev) => prev.filter((_, i) => i !== index));
    toast(`${removed.name} removed.`, {
      action: {
        label: "Undo",
        onClick: () =>
          setSkills((prev) => {
            const next = [...prev];
            next.splice(index, 0, removed);
            return next;
          }),
      },
    });
  };

  const addSkills = (picked: { name: string; level: string }[]) => {
    const existing = new Set(skills.map((s) => s.name.toLowerCase()));
    const toAdd = picked.filter((p) => !existing.has(p.name.toLowerCase()));
    if (toAdd.length === 0) return;
    setSkills((prev) => [
      ...prev,
      ...toAdd.map((p) => ({ name: p.name, level: p.level as ProficiencyLevel })),
    ]);
    toast.success(
      toAdd.length === 1 ? `${toAdd[0].name} added.` : `${toAdd.length} skills added.`,
    );
  };

  const errors = {
    title: form.title.trim() ? undefined : "A title is required.",
  };
  const invalid = !!errors.title;

  const handleNext = () => {
    if (invalid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep(2);
  };

  const handleSubmit = () => {
    toast.success("Content added successfully.");
    onDone();
  };

  return step === 1 ? (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
        <div>
          <Label className="text-sm font-medium text-foreground" htmlFor="add-content-type">
            Content Type
          </Label>
          <Select
            value={form.type}
            onValueChange={(v) => setForm({ ...form, type: v as ContentType })}
          >
            <SelectTrigger id="add-content-type" className="mt-2" aria-label="Content Type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ADD_CONTENT_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">Title</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter content title"
            className="mt-1"
            aria-invalid={showErrors && !!errors.title}
          />
          {showErrors && errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            maxLength={300}
            placeholder="Enter a brief description of this content item"
            className="mt-1"
          />
          <div className="mt-1 text-right text-xs text-muted-foreground">
            {form.description.length} / 300
          </div>
        </div>

        {form.type === "url" ? (
          <div>
            <Label className="text-sm font-medium text-foreground" htmlFor="add-content-url">
              External URL
            </Label>
            <Input
              id="add-content-url"
              type="url"
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              placeholder="https://"
              className="mt-1"
            />
          </div>
        ) : (
          <div>
            <Label className="text-sm font-medium text-foreground">Content File</Label>
            <div
              className="mt-1 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              {form.fileName ? (
                <div className="text-sm text-foreground">{form.fileName}</div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Drop file or <span className="text-primary underline">browse</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setForm({ ...form, fileName: e.target.files?.[0]?.name ?? "" })}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Accepted formats: SCORM (.zip), PDF, MP4, PNG, JPG. Max file size: 500MB.
            </p>
          </div>
        )}

        <div>
          <Label className="text-sm font-medium text-foreground">Duration (minutes)</Label>
          <Input
            type="number"
            min="0"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="e.g. 30"
            className="mt-1"
          />
        </div>

        <div>
          <LineOfBusinessField
            value={form.linesOfBusiness}
            onChange={(v) => setForm({ ...form, linesOfBusiness: v })}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Select all lines of business this content applies to.
          </p>
        </div>

        <ContentCategoryFields
          value={form.categories}
          onChange={(categories) => setForm({ ...form, categories })}
        />

        <div>
          <Label className="text-sm font-medium text-foreground">Tags</Label>
          <div className="mt-1">
            <ChipInput
              chips={form.tags}
              onAdd={(v) => setForm({ ...form, tags: [...form.tags, v] })}
              onRemove={(i) => setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) })}
              placeholder="Add tags…"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Tags help with search and filtering in the Content Library.
          </p>
        </div>
      </div>

      <DialogFooter className="border-t border-border px-6 py-4 sm:justify-between">
        <span className="text-xs text-muted-foreground self-center">Step 1 of 3</span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleNext}>Next →</Button>
        </div>
      </DialogFooter>
    </>
  ) : step === 2 ? (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Skills</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            We've analysed your content and proposed the skills it develops, along with suggested
            proficiency levels. Review the proposals, adjust proficiency levels, remove skills you
            don't need, and add any that are missing.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3">
          <SageTag className="mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Skills were auto-generated based on your content title, description, and uploaded
            material. Review and refine the proposals below before saving.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">Proposed Skills</h3>
          <p className="mt-1 text-xs text-muted-foreground">{skills.length} skills proposed</p>

          {skills.length === 0 ? (
            <div className="mt-3 rounded-md border border-dashed border-border px-4 py-6 text-center">
              <p className="text-sm font-medium text-foreground">No skills added</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use the field below to add skills to this content item.
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-md border border-border">
              <div className="grid grid-cols-[1fr_9rem_2rem] items-center gap-2 border-b border-border px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">Skill</span>
                <span className="text-xs font-medium text-muted-foreground">Proficiency Level</span>
                <span className="sr-only">Actions</span>
              </div>
              {skills.map((s, i) => (
                <div
                  key={s.name}
                  className="grid grid-cols-[1fr_9rem_2rem] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0"
                >
                  <span className="text-sm text-foreground">{s.name}</span>
                  <Select
                    value={s.level}
                    onValueChange={(v) =>
                      setSkills((prev) =>
                        prev.map((p, idx) => (idx === i ? { ...p, level: v as ProficiencyLevel } : p)),
                      )
                    }
                  >
                    <SelectTrigger className="h-8" aria-label={`Proficiency level for ${s.name}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Remove ${s.name}`}
                    onClick={() => removeSkill(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">Add a Skill</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Can't find a skill in the proposals? Browse the skill library to add more.
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-2">
            <Button variant="secondary" onClick={() => setSkillPickerOpen(true)}>
              <Search className="mr-1 h-4 w-4" />
              Browse Skills
            </Button>
          </div>
          <SkillPickerModal
            open={skillPickerOpen}
            onOpenChange={setSkillPickerOpen}
            addedSkillNames={skills.map((s) => s.name)}
            onSelect={addSkills}
          />
        </div>
      </div>

      <DialogFooter className="border-t border-border px-6 py-4 sm:justify-between">
        <span className="text-xs text-muted-foreground self-center">Step 2 of 3</span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
          <Button onClick={() => setStep(3)}>Next →</Button>
        </div>
      </DialogFooter>
    </>
  ) : (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div className="rounded-md border border-border bg-muted/30 p-4 space-y-3">
          <ReviewRow label="Content Type" value={<TypeBadge type={form.type} />} />
          <ReviewRow label="Title" value={form.title} />
          <ReviewRow label="Description" value={form.description.trim() || "—"} />
          {form.type === "url" ? (
            <ReviewRow label="URL" value={form.externalUrl.trim() || "—"} />
          ) : (
            <ReviewRow label="File" value={form.fileName || "—"} />
          )}
          <ReviewRow label="Duration" value={form.duration ? `${form.duration} min` : "—"} />
          <ReviewRow
            label="Line of Business"
            value={form.linesOfBusiness.length ? form.linesOfBusiness.join(", ") : "—"}
          />
          <div className="space-y-3" data-org-raw>
            {CONTENT_CATEGORIES.map((category) => (
              <ReviewRow
                key={category.id}
                label={category.label}
                value={
                  form.categories[category.id].length
                    ? form.categories[category.id].join(", ")
                    : "—"
                }
              />
            ))}
          </div>
          <ReviewRow label="Tags" value={form.tags.length ? form.tags.join(", ") : "—"} />
        </div>
      </div>

      <DialogFooter className="border-t border-border px-6 py-4 sm:justify-between">
        <span className="text-xs text-muted-foreground self-center">Step 3 of 3</span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
          <Button onClick={handleSubmit}>Add Content</Button>
        </div>
      </DialogFooter>
    </>
  );
}

function CornerstoneSelectPanel({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lob, setLob] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [showResults, setShowResults] = useState(false);

  const results = CORNERSTONE_STUBS.filter((r) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  });

  const selected = CORNERSTONE_STUBS.find((r) => r.id === selectedId);

  const handleAdd = () => {
    toast.success("Content added to the Embark Content Library successfully.");
    onDone();
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Select from Cornerstone Learn Content Library
          </h3>
        </div>
        <div>
          <Label className="text-sm font-medium text-foreground">Search Cornerstone Learn</Label>
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search by title, content ID, or type…"
            className="mt-1"
          />
          {showResults && (
            <ul className="mt-2 rounded-md border border-border divide-y divide-border max-h-64 overflow-y-auto">
              {results.length === 0 ? (
                <li className="px-3 py-3 text-sm text-muted-foreground text-center">No results found</li>
              ) : (
                results.map((r) => {
                  const isSel = r.id === selectedId;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(r.id)}
                        className={cn(
                          "flex w-full items-start gap-3 px-3 py-2 text-left transition-colors",
                          isSel ? "bg-muted" : "hover:bg-muted/50",
                        )}
                      >
                        <Badge variant="secondary" className="shrink-0 mt-0.5">{r.type}</Badge>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{r.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.id} · {r.type} · {r.duration}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>

        {selected && (
          <>
            <div className="rounded-md border border-border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selected.type}</Badge>
                <span className="text-sm font-medium text-foreground">{selected.title}</span>
              </div>
              <ReviewRow label="Content ID" value={selected.id} />
              <ReviewRow label="Duration" value={selected.duration} />
              <ReviewRow
                label="Description"
                value={`A comprehensive overview of ${selected.title} for CSR agents handling Medicare enquiries.`}
              />
              <ReviewRow label="Last Updated in Cornerstone" value="12 Jun 2025" />
            </div>

            <div className="space-y-4 pt-2 border-t border-border">
              <h4 className="text-sm font-medium text-foreground">Embark Settings</h4>
              <div>
                <LineOfBusinessField value={lob} onChange={setLob} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Select all lines of business this content applies to within Embark.
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Tags</Label>
                <div className="mt-1">
                  <ChipInput
                    chips={tags}
                    onAdd={(v) => setTags([...tags, v])}
                    onRemove={(i) => setTags(tags.filter((_, idx) => idx !== i))}
                    placeholder="Add tags…"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tags help with search and filtering in the Embark Content Library.
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Internal Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any internal notes about how this content should be used in Embark…"
                  className="mt-1"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <DialogFooter className="border-t border-border px-6 py-4 sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleAdd} disabled={!selected}>Add to Content Library</Button>
      </DialogFooter>
    </>
  );
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

export function LineOfBusinessField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerId = "line-of-business-trigger";

  const { lines } = useLinesOfBusiness();

  const filtered = lines.filter((o) =>
    o.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <>
      <Label htmlFor={triggerId} className="text-sm font-medium text-foreground">
        Line of Business{" "}
        <span className="text-xs font-normal text-muted-foreground">(optional)</span>
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={triggerId}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            className="mt-1 flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              {value.length === 0 ? (
                <span className="text-muted-foreground">Select line of business</span>
              ) : (
                value.map((v) => (
                  <Badge
                    key={v}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {v}
                    <span
                      role="button"
                      aria-label={`Remove ${v}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(value.filter((x) => x !== v));
                      }}
                      className="inline-flex items-center rounded-sm text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))
              )}
            </div>
            <div className="flex items-center gap-2">
              {value.length > 0 && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </span>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
              />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[--radix-popover-trigger-width] p-2"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lines of business"
            className="h-8 text-sm"
          />
          <ul
            role="listbox"
            aria-multiselectable="true"
            className="mt-2 max-h-64 overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <li className="px-2 py-3 text-sm text-muted-foreground text-center">
                No results found
              </li>
            ) : (
              filtered.map((opt) => {
                const selected = value.includes(opt);
                return (
                  <li key={opt}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => toggle(opt)}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none"
                    >
                      <Checkbox checked={selected} tabIndex={-1} className="pointer-events-none" />
                      <span>{opt}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </PopoverContent>
      </Popover>
    </>
  );
}

