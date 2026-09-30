import { useState } from "react";
import { AlertTriangle, ChevronRight, GripVertical, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEmbarkConfigContext } from "./embarkConfigContext";
import { attemptsLabel, defaultAttempts } from "@/components/embark/AttemptsAllowed";

export type TreeSession = {
  id: string;
  kind: "Video" | "Article" | "Assessment" | "Role Play";
  name: string;
  meta: string;
  lowConfidence?: boolean;
  label?: string;
};

export type TreeModule = {
  id: string;
  name: string;
  sessions: TreeSession[];
  summary?: string;
  expandedDefault?: boolean;
};

const badgeClass: Record<TreeSession["kind"], string> = {
  Video: "bg-secondary/40 text-secondary-foreground",
  Article: "bg-muted text-muted-foreground",
  Assessment: "bg-primary/10 text-primary",
  "Role Play": "bg-accent/20 text-accent-foreground",
};

export function CurriculumTree({
  modules,
  selectedId,
  onSelect,
  highlightSessionId,
  onReorderSessions,
  reviewedIds = new Set<string>(),
  viewOnly = false,
}: {
  modules: TreeModule[];
  selectedId?: string;
  onSelect?: (kind: "session" | "assessment" | "module", id: string) => void;
  highlightSessionId?: string;
  onReorderSessions?: (moduleId: string, fromIdx: number, toIdx: number) => void;
  reviewedIds?: Set<string>;
  viewOnly?: boolean;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    modules.forEach((m) => (init[m.id] = !!m.expandedDefault));
    return init;
  });
  const [dragMod, setDragMod] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const ctx = useEmbarkConfigContext();
  const embark = ctx;

  const additionsAt = (moduleId: string, afterSessionId: string | null) =>
    embark ? embark.draft.additions.filter((a) => a.moduleId === moduleId && a.afterSessionId === afterSessionId) : [];

  const attemptsFor = (id: string) => embark?.draft.attempts?.[id] ?? defaultAttempts;

  const AddedRows = ({ moduleId, after }: { moduleId: string; after: string | null }) => (
    <>
      {additionsAt(moduleId, after).map((a) => (
        <div key={a.id} className="flex items-center gap-2 py-2 px-2 rounded border-l-2 border-primary bg-primary/5 min-w-0">
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary">{a.type}</span>
          <span className="text-sm text-foreground truncate min-w-0" title={a.title}>{a.title}</span>
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">Embark</span>
          {a.type === "Assessment" && (
            <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
              {attemptsLabel(attemptsFor(a.id))}
            </span>
          )}
          {!!embark?.draft.mandatory[a.id] && (
            <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary">Mandatory</span>
          )}
          <button
            type="button"
            aria-label={`Remove ${a.title}`}
            className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); embark?.removeAddition(a.id); }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </>
  );

  const AddPoint = ({ moduleId, after }: { moduleId: string; after: string | null }) => (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); embark?.addAt({ moduleId, afterSessionId: after }); }}
      className="flex items-center gap-1 py-1 px-2 text-xs text-muted-foreground hover:text-foreground opacity-0 focus:opacity-100 group-hover/row:opacity-100 data-[persistent=true]:opacity-100"
      data-persistent={after === null}
    >
      <Plus className="h-3 w-3" />
      Add check or assessment
    </button>
  );

  return (
    <TooltipProvider>
    <div className="divide-y divide-border rounded-md border border-border bg-card">
      {modules.map((m) => {
        const open = expanded[m.id];
        return (
          <div key={m.id}>
            <div className="flex items-center gap-2 p-3 hover:bg-muted/30">
              <button
                type="button"
                onClick={() => setExpanded((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}
                className="flex flex-1 items-center gap-2 text-left min-w-0"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-90")} />
                <span className="text-sm truncate min-w-0" title={m.name}>📁 {m.name}</span>
                {!open && m.summary && (
                  <span className="ml-auto shrink-0 max-w-[40%] truncate text-xs text-muted-foreground" title={m.summary}>{m.summary}</span>
                )}
              </button>
              {embark && (
                <div className="shrink-0 text-right">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-muted-foreground" htmlFor={`pass-${m.id}`}>Advance:</Label>
                    <Input
                      id={`pass-${m.id}`}
                      type="number"
                      value={embark.draft.thresholds[m.id] ?? ""}
                      onChange={(e) =>
                        embark.update({ thresholds: { ...embark.draft.thresholds, [m.id]: e.target.value } })
                      }
                      aria-invalid={embark.thresholdInvalid(m.id)}
                      aria-label={`Advancement threshold for ${m.name}`}
                      className="h-7 w-16 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                  {embark.thresholdInvalid(m.id) && (
                    <p className="text-xs text-destructive mt-1">Enter a value between 0 and 100.</p>
                  )}
                </div>
              )}
            </div>
            {open && (
              <div className="pl-10 pb-2">
                {m.sessions.map((s, i) => {
                  const isHighlight = s.id === highlightSessionId;
                  const isSel = s.id === selectedId;
                  const isLowConf = s.lowConfidence && !reviewedIds.has(s.id);
                  return (
                    <div key={s.id} className="group/row">
                    <div
                      draggable={!viewOnly && s.kind !== "Assessment"}
                      onDragStart={viewOnly ? undefined : () => { setDragMod(m.id); setDragIdx(i); }}
                      onDragOver={viewOnly ? undefined : (e) => { if (dragMod === m.id) e.preventDefault(); }}
                      onDrop={viewOnly ? undefined : () => {
                        if (dragMod === m.id && dragIdx !== null && dragIdx !== i) {
                          onReorderSessions?.(m.id, dragIdx, i);
                        }
                        setDragMod(null); setDragIdx(null);
                      }}
                      onClick={() => onSelect?.(s.kind === "Assessment" ? "assessment" : "session", s.id)}
                      className={cn(
                        "flex items-center gap-2 py-2 px-2 rounded cursor-pointer border-l-2 border-transparent",
                        isSel && "border-primary bg-primary/5",
                        isHighlight && "bg-warning/15",
                        isLowConf && !isHighlight && "bg-warning/5",
                      )}
                    >
                      {!viewOnly && <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", badgeClass[s.kind])}>
                        {s.label ?? s.kind}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm text-foreground truncate min-w-0">{s.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>{s.name}</TooltipContent>
                      </Tooltip>
                      <span className="ml-auto shrink-0 max-w-[35%] truncate text-xs text-muted-foreground" title={s.meta}>{s.meta}</span>
                      {s.kind === "Assessment" && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground shrink-0">
                          {attemptsLabel(attemptsFor(s.id))}
                        </span>
                      )}
                      {!!embark?.draft.mandatory[s.id] && (
                        <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary">
                          Mandatory
                        </span>
                      )}
                      {isLowConf && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning-foreground dark:text-warning" />}
                    </div>
                      {embark && (
                        <>
                          <AddedRows moduleId={m.id} after={s.id} />
                          <AddPoint moduleId={m.id} after={s.id} />
                        </>
                      )}
                    </div>
                  );
                })}
                {embark && (
                  <>
                    <AddedRows moduleId={m.id} after={null} />
                    <AddPoint moduleId={m.id} after={null} />
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
    </TooltipProvider>
  );
}

export { defaultModules } from "./curriculumData";
