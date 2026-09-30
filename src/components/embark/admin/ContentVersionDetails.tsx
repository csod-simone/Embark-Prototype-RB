import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  VERSION_RULE,
  VERSIONED_CONTENT_TITLE,
  cohortIdForScope,
  contentVersionsNewestFirst,
  currentContentVersion,
  formatVersionDate,
  learnerCountForVersion,
  scopeSummary,
  usageForVersion,
  usageNames,
  versionsStillInUse,
  type ContentVersionRecord,
  type VersionScope,
} from "@/data/contentVersioning";

/** Full history. Each version stays one card, however many times the content is updated. */
export function VersionHistoryDialog({
  scope,
  open,
  onOpenChange,
}: {
  scope: VersionScope;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const versions = contentVersionsNewestFirst();
  const current = currentContentVersion();
  const previous = versions.find((version) => version.id !== current.id) ?? current;
  const [selectedId, setSelectedId] = useState(previous.id);
  const selected = versions.find((version) => version.id === selectedId) ?? previous;
  const scopeCohortId = cohortIdForScope(scope);

  useEffect(() => {
    if (open) setSelectedId(previous.id);
  }, [open, previous.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{VERSIONED_CONTENT_TITLE}</DialogTitle>
          <DialogDescription>
            {versions.length} versions. {VERSION_RULE} Learners are not shown a version number.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-foreground">{scopeSummary(scope)}</p>
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {versions.map((version) => (
            <VersionCard
              key={version.id}
              version={version}
              current={version.id === current.id}
              inThisCohort={
                scopeCohortId != null &&
                usageForVersion(version.id).some((group) => group.cohortId === scopeCohortId)
              }
              scopedToCohort={scopeCohortId != null}
              selected={version.id === selected.id}
              onReview={() => setSelectedId(version.id)}
            />
          ))}
        </div>
        <div className="rounded-md border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selected.id}</Badge>
            <span className="text-xs text-muted-foreground">
              {formatVersionDate(selected.publishedAt)} · {selected.publishedBy} · path {selected.pathVersion}
            </span>
          </div>
          <p className="mt-3 text-sm text-foreground">{selected.body}</p>
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VersionCard({
  version,
  current,
  inThisCohort,
  scopedToCohort,
  selected,
  onReview,
}: {
  version: ContentVersionRecord;
  current: boolean;
  inThisCohort: boolean;
  scopedToCohort: boolean;
  selected: boolean;
  onReview: () => void;
}) {
  const groups = usageForVersion(version.id);
  const assigned = learnerCountForVersion(version.id) > 0;
  return (
    <div className={`rounded-md border bg-background p-3 ${selected ? "border-primary" : "border-border"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{version.id}</span>
            {current && <Badge variant="success">Current</Badge>}
            {!current && assigned && <Badge variant="secondary">In use</Badge>}
            {!current && !assigned && <Badge variant="outline">Not assigned</Badge>}
            {scopedToCohort && inThisCohort && <Badge variant="outline">In this cohort</Badge>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatVersionDate(version.publishedAt)} · {version.publishedBy} · path {version.pathVersion}
          </p>
          <p className="mt-1 text-sm text-foreground">{version.summary}</p>
          {groups.length === 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">Not assigned to any learner.</p>
          ) : (
            groups.map((group) => (
              <p key={group.cohortId} className="mt-1 text-xs text-muted-foreground">
                {group.cohortName} · {usageNames(group.learners)}
              </p>
            ))
          )}
        </div>
        <button type="button" className="shrink-0 text-xs text-primary hover:underline" onClick={onReview}>
          Review
        </button>
      </div>
    </div>
  );
}

/** Short hover. The button opens the full history. */
export function VersionInfoButton({ scope }: { scope: VersionScope }) {
  const [open, setOpen] = useState(false);
  const current = currentContentVersion();
  const count = contentVersionsNewestFirst().length;
  return (
    <>
      <HoverCard openDelay={150}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            aria-label="How this content version is used"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setOpen(true);
            }}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-80 space-y-1 text-left">
          <div className="text-sm font-medium text-foreground">{VERSIONED_CONTENT_TITLE}</div>
          <p className="text-xs text-muted-foreground">
            {current.id} current · {formatVersionDate(current.publishedAt)} · {current.publishedBy}
          </p>
          <p className="text-xs text-muted-foreground">
            {count} versions. {versionsStillInUse()}
          </p>
          <p className="text-xs text-foreground">{scopeSummary(scope)}</p>
        </HoverCardContent>
      </HoverCard>
      <VersionHistoryDialog scope={scope} open={open} onOpenChange={setOpen} />
    </>
  );
}

export function VersionMarkers({ scope }: { scope: VersionScope }) {
  return <VersionInfoButton scope={scope} />;
}
