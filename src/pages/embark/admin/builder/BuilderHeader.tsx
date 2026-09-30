import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Pencil } from "lucide-react";
import { PhaseProgressStepper } from "@/components/embark/PhaseProgressStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { curricula } from "@/data/mockData";

const PHASE_ORDER = ["ingest", "generate", "refine", "configure", "publish"] as const;
type Phase = typeof PHASE_ORDER[number];

const LABELS: Record<Phase, string> = {
  ingest: "Ingest", generate: "Generate", refine: "Refine",
  configure: "Configure", publish: "Publish",
};

export function BuilderHeader({ current, viewOnly = false }: { current: Phase; viewOnly?: boolean }) {
  const navigate = useNavigate();
  const { curriculumId = "cur2" } = useParams();
  const cur = curricula.find((c) => c.id === curriculumId) ?? curricula[1];
  const [name, setName] = useState(cur.name);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const idx = PHASE_ORDER.indexOf(current);

  const phases = PHASE_ORDER.map((p, i) => ({
    label: LABELS[p],
    status: i < idx ? ("complete" as const) : i === idx ? ("active" as const) : ("upcoming" as const),
  }));

  const save = () => { setName(draft || name); setEditing(false); };

  return (
    <div className="border-b border-border bg-background px-6 py-3 flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 min-w-0">
        {editing ? (
          <>
            <Input
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(name); setEditing(false); } }}
              className="w-[320px]"
            />
            <button onClick={save} className="text-success-dark"><Check className="h-4 w-4" /></button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => { setDraft(name); setEditing(true); }}
            className="inline-flex items-center gap-2 font-medium text-foreground hover:text-primary"
          >
            {name}
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
        <span className="rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-semibold">
          {cur.status === "draft" ? "Draft" : cur.status.replace("_", " ").replace(/^./, (c) => c.toUpperCase())}
        </span>
      </div>
      <div className="flex-1 min-w-[400px]">
        {!viewOnly && (
          <PhaseProgressStepper
            phases={phases}
            onPhaseClick={(i) => navigate(`/admin/builder/${curriculumId}/${PHASE_ORDER[i]}`)}
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        {viewOnly ? (
          <span className="text-xs text-muted-foreground">Last updated 1 Aug 2025</span>
        ) : (
          <>
            <span className="text-xs text-muted-foreground">Saved 2 min ago</span>
            <Button size="sm" variant="secondary">Save</Button>
            <button
              onClick={() => navigate("/admin/curricula")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Exit builder
            </button>
          </>
        )}
      </div>
    </div>
  );
}
