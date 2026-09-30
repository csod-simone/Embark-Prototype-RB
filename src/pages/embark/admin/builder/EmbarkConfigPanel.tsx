import { useMemo, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SageTag } from "@/components/embark/SageTag";
import { MODALITY_OPTIONS, type EmbarkAddition, type EmbarkCurriculumConfig } from "@/hooks/use-embark-curriculum-config";
import { defaultModules } from "./curriculumData";
import { ASSESSMENT_LIBRARY_ITEMS, CONTENT_LIBRARY_ITEMS } from "./browserData";
import { useEmbarkConfigContext, type InsertionPoint } from "./embarkConfigContext";

type PoolItem = { title: string; type: EmbarkAddition["type"] };

const POOL: PoolItem[] = [
  ...ASSESSMENT_LIBRARY_ITEMS.map((a) => ({
    title: a.title,
    type: (a.type === "Comprehension Check" ? "Comprehension Check" : "Assessment") as EmbarkAddition["type"],
  })),
  ...CONTENT_LIBRARY_ITEMS.filter((c) => c.type === "Role-Play").map((c) => ({
    title: c.title,
    type: "Role-Play" as const,
  })),
];

const AI_SUGGESTIONS: Omit<EmbarkAddition, "id">[] = [
  {
    type: "Comprehension Check",
    title: "Plan Type Comparison Check",
    moduleId: "m1",
    afterSessionId: "s1-1",
  },
  {
    type: "Role-Play",
    title: "Explaining Eligibility to a Member",
    moduleId: "m2",
    afterSessionId: "s2-2",
  },
  {
    type: "Assessment",
    title: "Coverage Determination Scenario Assessment",
    moduleId: "m3",
    afterSessionId: "s3-3",
  },
];

export function positionLabel(a: Pick<EmbarkAddition, "moduleId" | "afterSessionId">) {
  const mod = defaultModules.find((m) => m.id === a.moduleId);
  if (!mod) return "";
  if (!a.afterSessionId) return `At the end of ${mod.name}`;
  const s = mod.sessions.find((x) => x.id === a.afterSessionId);
  return s ? `After ${s.name} in ${mod.name}` : `In ${mod.name}`;
}

export function EmbarkConfigPanel() {
  const ctx = useEmbarkConfigContext();
  if (!ctx) return null;
  const { draft, update, save, cancel, hasError } = ctx;

  const modalityError = draft.modalities.length === 0;

  const toggleModality = (m: string, checked: boolean) =>
    update({ modalities: checked ? [...draft.modalities, m] : draft.modalities.filter((x) => x !== m) });

  const onSave = () => {
    if (hasError) return;
    save();
    toast("Embark configuration saved.");
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 mb-6">
      <h3 className="text-base font-semibold text-foreground">Embark Configuration</h3>
      <p className="text-sm text-muted-foreground mt-1">
        These settings are specific to how this path is delivered.
      </p>

      <Separator className="my-4" />

      {/* Modalities */}
      <section>
        <p className="text-sm font-medium text-foreground">Available Content Modalities</p>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which modalities learners can switch between when consuming content in this path. Learners can pick their preferred format from the modalities selected here, and only these modalities are surfaced by the Embark adaptive engine.
        </p>
        <div className="mt-3 space-y-2">
          {MODALITY_OPTIONS.map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={draft.modalities.includes(m)}
                onCheckedChange={(v) => toggleModality(m, v === true)}
                aria-label={m}
              />
              {m}
            </label>
          ))}
        </div>
        {modalityError && (
          <p className="text-xs text-destructive mt-2">At least one content modality must be selected.</p>
        )}
      </section>

      <Separator className="my-4" />

      {/* Consumption order */}
      <section>
        <p className="text-sm font-medium text-foreground">Content Consumption Order</p>
        <p className="text-sm text-muted-foreground mt-1">
          Choose whether learners must complete content in the order it is presented, or whether they can access content in any order.
        </p>
        <RadioGroup
          value={draft.order}
          onValueChange={(v) => update({ order: v as EmbarkCurriculumConfig["order"] })}
          className="mt-3 space-y-3"
        >
          <div className="flex items-start gap-2">
            <RadioGroupItem value="in-order" id="order-in" className="mt-1" />
            <div>
              <Label htmlFor="order-in" className="text-sm">In order</Label>
              <p className="text-sm text-muted-foreground">
                Learners must complete each content item in the sequence it is presented before accessing the next. The adaptive engine respects this sequence.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RadioGroupItem value="any-order" id="order-any" className="mt-1" />
            <div>
              <Label htmlFor="order-any" className="text-sm">Any order</Label>
              <p className="text-sm text-muted-foreground">
                Learners can access and complete content items in any sequence. The adaptive engine surfaces content based on readiness, regardless of position in the path.
              </p>
            </div>
          </div>
        </RadioGroup>
      </section>

      <Separator className="my-4" />

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={cancel}>Cancel</Button>
        <Button onClick={onSave} disabled={hasError}>Save</Button>
      </div>
    </div>
  );
}

/** Standalone section rendered beneath the path structure. */
export function EmbarkAdditionsSection() {
  const ctx = useEmbarkConfigContext();
  const [aiOpen, setAiOpen] = useState(false);
  if (!ctx) return null;
  const { draft, update, pendingInsertion, clearPendingInsertion, addItems, removeAddition } = ctx;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-base font-semibold text-foreground">Additional Checks &amp; Assessments</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Add Embark-specific knowledge checks, role-plays, and assessments directly into the path structure. Position each item where it should appear in the learner's journey. These are managed entirely within Embark.
      </p>

      <div className="mt-3">
        <Button variant="secondary" size="sm" onClick={() => setAiOpen(true)}>
          <Sparkles className="mr-1 h-4 w-4" />
          Suggest with AI
        </Button>
      </div>

      <div className="mt-4">
        {draft.additions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No additional checks or assessments added yet.</p>
        ) : (
          <div className="space-y-1.5">
            {draft.additions.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-2 rounded-md border border-border px-3 py-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{a.title}</span>
                    <Badge variant="secondary" className="text-[10px]">{a.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{positionLabel(a)}</p>
                </div>
                <Button size="icon" variant="ghost" aria-label={`Remove ${a.title}`} onClick={() => removeAddition(a.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <PickerDialog
        point={pendingInsertion}
        onClose={clearPendingInsertion}
        onAdd={(point, items) => {
          addItems(point, items);
          clearPendingInsertion();
        }}
      />

      <AiSuggestionDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        existing={draft.additions}
        onAccept={(items) => {
          update({
            additions: [
              ...draft.additions,
              ...items.map((it, i) => ({ ...it, id: `ai-${Date.now()}-${i}` })),
            ],
          });
          setAiOpen(false);
        }}
      />
    </div>
  );
}

function PickerDialog({
  point,
  onClose,
  onAdd,
}: {
  point: InsertionPoint | null;
  onClose: () => void;
  onAdd: (point: InsertionPoint, items: PoolItem[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(
    () => POOL.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const reset = () => {
    setSearch("");
    setSelected([]);
  };

  return (
    <Dialog
      open={point !== null}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add check or assessment</DialogTitle>
        </DialogHeader>
        {point && <p className="text-xs text-muted-foreground">{positionLabel(point)}</p>}
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
        <div className="max-h-72 overflow-y-auto divide-y divide-border rounded-md border border-border">
          {rows.length === 0 && <p className="p-3 text-sm text-muted-foreground">No matching items.</p>}
          {rows.map((t) => (
            <label key={t.title} className="flex items-center gap-2 p-3 text-sm">
              <Checkbox
                checked={selected.includes(t.title)}
                onCheckedChange={(v) =>
                  setSelected((prev) => (v === true ? [...prev, t.title] : prev.filter((x) => x !== t.title)))
                }
                aria-label={t.title}
              />
              <span className="text-foreground">{t.title}</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">{t.type}</Badge>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button
            disabled={selected.length === 0}
            onClick={() => {
              if (!point) return;
              onAdd(point, POOL.filter((p) => selected.includes(p.title)));
              reset();
            }}
          >
            Add {selected.length > 0 ? `(${selected.length})` : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AiSuggestionDialog({
  open,
  onOpenChange,
  existing,
  onAccept,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing: EmbarkAddition[];
  onAccept: (items: Omit<EmbarkAddition, "id">[]) => void;
}) {
  const suggestions = AI_SUGGESTIONS.filter((s) => !existing.some((e) => e.title === s.title));
  const [accepted, setAccepted] = useState<string[]>([]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setAccepted([]);
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SageTag />
            Suggested checks &amp; assessments
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Sage recommends the following additional items and where they should sit in the path. Review and accept the ones you want.
        </p>
        <div className="space-y-1.5">
          {suggestions.length === 0 && (
            <p className="text-sm text-muted-foreground">All suggested items have already been added.</p>
          )}
          {suggestions.map((s) => (
            <label key={s.title} className="flex items-start gap-2 rounded-md border border-border px-3 py-2">
              <Checkbox
                className="mt-1"
                checked={accepted.includes(s.title)}
                onCheckedChange={(v) =>
                  setAccepted((prev) => (v === true ? [...prev, s.title] : prev.filter((x) => x !== s.title)))
                }
                aria-label={s.title}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{s.title}</span>
                  <Badge variant="secondary" className="text-[10px]">{s.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{positionLabel(s)}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => { setAccepted([]); onOpenChange(false); }}>Dismiss</Button>
          <Button
            variant="secondary"
            disabled={accepted.length === 0}
            onClick={() => { onAccept(suggestions.filter((s) => accepted.includes(s.title))); setAccepted([]); }}
          >
            Accept selected
          </Button>
          <Button
            disabled={suggestions.length === 0}
            onClick={() => { onAccept(suggestions); setAccepted([]); }}
          >
            Accept all
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
