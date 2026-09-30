import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ASSESSMENT_OPTIONS,
  CURRICULA_OPTIONS,
  EVENT_OPTIONS,
  ROLEPLAY_OPTIONS,
  type CurriculumOption,
} from "./data";

function curriculumStatusBadge(s: CurriculumOption["status"]) {
  if (s === "active") return <Badge variant="success">Active</Badge>;
  if (s === "draft") return <Badge variant="secondary">Draft</Badge>;
  return <Badge variant="warning">Inactive</Badge>;
}

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  alreadyAdded: string[];
  onAdd: (ids: string[]) => void;
};

type PickerRow = {
  id: string;
  name: string;
  status: CurriculumOption["status"];
  meta: string;
  tags?: string[];
};

type PickerProps = Props & {
  title: string;
  description: string;
  placeholder: string;
  emptyMessage: string;
  rows: PickerRow[];
};

function ContentPickerDialog({
  open,
  onOpenChange,
  alreadyAdded,
  onAdd,
  title,
  description,
  placeholder,
  emptyMessage,
  rows: allRows,
}: PickerProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setSelected(new Set());
      setQuery("");
    }
  }, [open]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRows.filter((c) => !q || c.name.toLowerCase().includes(q));
  }, [query, allRows]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    onAdd(Array.from(selected));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />

          <div className="max-h-[380px] overflow-y-auto rounded-md border border-border divide-y divide-border">
            {rows.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {allRows.length === 0 ? emptyMessage : "No results match your search."}
              </div>
            )}
            {rows.map((c) => {
              const disabled = alreadyAdded.includes(c.id);
              const checked = selected.has(c.id);
              return (
                <label
                  key={c.id}
                  className={`flex items-start gap-3 p-3 ${
                    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-muted/40"
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={() => !disabled && toggle(c.id)}
                    className="mt-0.5"
                    aria-label={`Select ${c.name}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                      {curriculumStatusBadge(c.status)}
                      {disabled && (
                        <span className="text-xs text-muted-foreground">Already added</span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {c.meta}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(c.tags ?? []).map((l) => (
                        <Badge key={l} variant="outline" className="text-[10px]">
                          {l}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={selected.size === 0} onClick={handleAdd}>Add Selected</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddCurriculumDialog(props: Props) {
  const rows = useMemo<PickerRow[]>(
    () =>
      CURRICULA_OPTIONS.map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        meta: `${c.contentCount} items`,
        tags: c.lineOfBusiness,
      })),
    [],
  );
  return (
    <ContentPickerDialog
      {...props}
      title="Add Path"
      description="Select one or more paths to add to this journey."
      placeholder="Search paths…"
      emptyMessage="No paths found. Create an path in the Content Library first."
      rows={rows}
    />
  );
}

export function AddRolePlayDialog(props: Props) {
  return (
    <ContentPickerDialog
      {...props}
      title="Add Role-Play"
      description="Select one or more role-plays to add to this journey."
      placeholder="Search role-plays…"
      emptyMessage="No role-plays found. Create a role-play in the Content Library first."
      rows={ROLEPLAY_OPTIONS}
    />
  );
}

export function AddAssessmentDialog(props: Props) {
  return (
    <ContentPickerDialog
      {...props}
      title="Add Assessment"
      description="Select one or more assessments to add to this journey."
      placeholder="Search assessments…"
      emptyMessage="No assessments found. Create an assessment in the Content Library first."
      rows={ASSESSMENT_OPTIONS}
    />
  );
}

export function AddEventDialog(props: Props) {
  return (
    <ContentPickerDialog
      {...props}
      title="Add Event"
      description="Select one or more events to add to this journey."
      placeholder="Search events…"
      emptyMessage="No events found. Create an event in the Content Library first."
      rows={EVENT_OPTIONS}
    />
  );
}
