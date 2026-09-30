import { useState } from "react";
import { toast } from "sonner";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Question,
  type QuestionType,
  type AnswerOption,
  QUESTION_TYPE_LABEL,
  blankQuestion,
  newAnswerId,
} from "./assessmentStubs";
import { cn } from "@/lib/utils";
import { RescoreDialog, type RescoreOption } from "./RescoreDialog";
import { RichText } from "@/components/embark/QuestionContent";
import { QuestionRichContentFields } from "./QuestionRichContentFields";

const MC_MIN = 2;
const MC_MAX = 6;
const MS_MIN = 2;
const MS_MAX = 8;

export function QuestionCard({
  question,
  index,
  sections = [],
  startInEdit = false,
  onChange,
  onDelete,
  onCancelNew,
  onMoveSection,
}: {
  question: Question;
  index: number;
  sections?: { id: string; title: string }[];
  startInEdit?: boolean;
  onChange: (next: Question) => void;
  onDelete: () => void;
  /** Called when Cancel is pressed on a brand-new blank card (discard it entirely). */
  onCancelNew?: () => void;
  onMoveSection?: (sectionId: string | null) => void;
}) {
  const [editing, setEditing] = useState(startInEdit);
  const [draft, setDraft] = useState<Question>(question);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [rescoreOpen, setRescoreOpen] = useState(false);
  // Snapshot of the correct-answer designation as it was when the editor was opened.
  const [baseline, setBaseline] = useState<Question>(question);
  // Brand-new questions never prompt for rescoring.
  const [isNew] = useState(startInEdit);

  const correctKey = (q: Question) =>
    q.options
      .filter((o) => o.correct)
      .map((o) => o.id)
      .sort()
      .join("|");

  if (!editing) {
    return (
      <div className="rounded-md border border-border bg-background p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
            <Badge variant="secondary">{QUESTION_TYPE_LABEL[question.type]}</Badge>
            {sections.length > 0 && (
              <Select
                value={question.sectionId ?? "ungrouped"}
                onValueChange={(value) => onMoveSection?.(value === "ungrouped" ? null : value)}
              >
                <SelectTrigger
                  className="h-8 w-64 text-xs"
                  aria-label={`Section for question ${index + 1}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ungrouped">No section</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.title.trim() || "Untitled section"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit question"
              onClick={() => {
                setDraft(question);
                setBaseline(question);
                setEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Popover open={confirmDelete} onOpenChange={setConfirmDelete}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Delete question">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end" className="w-64 p-3">
                <p className="text-sm text-foreground">Remove this question from the assessment?</p>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setConfirmDelete(false);
                      onDelete();
                      toast("Question removed.");
                    }}
                  >
                    Remove Question
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {question.scenario && (
          <div className="mt-2 rounded-md border-l-2 border-l-secondary-foreground bg-secondary/30 px-3 py-2">
            <div className="text-[11px] font-semibold tracking-wide text-muted-foreground mb-1">Scenario</div>
            <RichText text={question.scenario} className="text-sm text-foreground space-y-1" />
          </div>
        )}
        {question.image?.src && (
          <figure className="mt-2 space-y-1">
            {question.image.textBefore && <p className="text-sm text-foreground">{question.image.textBefore}</p>}
            <img src={question.image.src} alt={question.image.alt} loading="lazy" className="max-h-48 rounded-md border border-border object-contain" />
            {question.image.textAfter && <p className="text-sm text-foreground">{question.image.textAfter}</p>}
          </figure>
        )}
        <div className="mt-2 text-sm font-medium text-foreground">
          {question.text ? (
            <RichText text={question.text} className="space-y-1" />
          ) : (
            <span className="italic text-muted-foreground">Untitled question</span>
          )}
        </div>
        {question.type === "short_answer" ? (
          <p className="mt-3 text-xs text-muted-foreground italic">
            Learners will enter a free-text response. This question type is not auto-graded.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {question.options.map((o) => (
              <li key={o.id} className="flex items-start gap-2 text-sm">
                {o.correct ? (
                  <Check className="mt-0.5 h-4 w-4 text-success-dark shrink-0" />
                ) : (
                  <span className="mt-0.5 inline-block h-4 w-4 shrink-0" />
                )}
                <span className={cn(o.correct ? "text-success-dark font-medium" : "text-muted-foreground")}>
                  {o.text || <span className="italic">Empty option</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Edit mode
  const setType = (type: QuestionType) => {
    setDraft((d) => ({ ...blankQuestion(type), id: d.id, text: d.text }));
  };

  const updateOption = (id: string, patch: Partial<AnswerOption>) => {
    setDraft((d) => ({
      ...d,
      options: d.options.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  };

  const setSingleCorrect = (id: string) => {
    setDraft((d) => ({
      ...d,
      options: d.options.map((o) => ({ ...o, correct: o.id === id })),
    }));
  };

  const addOption = () => {
    setDraft((d) => ({
      ...d,
      options: [...d.options, { id: newAnswerId(), text: "", correct: false }],
    }));
  };

  const removeOption = (id: string) => {
    setDraft((d) => ({ ...d, options: d.options.filter((o) => o.id !== id) }));
  };

  const canAdd =
    (draft.type === "multiple_choice" && draft.options.length < MC_MAX) ||
    (draft.type === "multi_select" && draft.options.length < MS_MAX);
  const minCount = draft.type === "multi_select" ? MS_MIN : MC_MIN;

  const save = () => {
    if (!isNew && correctKey(draft) !== correctKey(baseline)) {
      setRescoreOpen(true);
      return;
    }
    commit();
  };

  const commit = () => {
    onChange(draft);
    setBaseline(draft);
    setEditing(false);
  };

  const confirmRescore = (option: RescoreOption) => {
    setRescoreOpen(false);
    commit();
    if (option === "affected") {
      toast("Question saved. Learners who selected the updated correct answer have been rescored.");
    } else if (option === "all") {
      toast("Question saved. All previous attempts have been rescored against the updated correct answer.");
    } else {
      toast("Question saved. Previous attempts have not been rescored.");
    }
  };

  const cancel = () => {
    if (onCancelNew && !question.text && question.options.every((o) => !o.text)) {
      onCancelNew();
      return;
    }
    setDraft(question);
    setEditing(false);
  };

  return (
    <div className="rounded-md border border-border bg-background p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
          {sections.length > 0 && (
            <Select
              value={draft.sectionId ?? "ungrouped"}
              onValueChange={(value) => {
                const sectionId = value === "ungrouped" ? undefined : value;
                setDraft((current) => ({ ...current, sectionId }));
              }}
            >
              <SelectTrigger
                className="h-8 w-64 text-xs"
                aria-label={`Section for question ${index + 1}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ungrouped">No section</SelectItem>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.title.trim() || "Untitled section"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Question type</Label>
        <Select value={draft.type} onValueChange={(v) => setType(v as QuestionType)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
            <SelectItem value="true_false">True / False</SelectItem>
            <SelectItem value="multi_select">Multi-Select</SelectItem>
            <SelectItem value="short_answer">Short Answer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`qtext-${draft.id}`} className="text-sm">Question text</Label>
        <Textarea
          id={`qtext-${draft.id}`}
          value={draft.text}
          onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
          placeholder="Enter the question…"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Formatting: **bold**, _italic_, blank line for a new paragraph, “- ” for bullets,
          “1. ” for numbering, and leading spaces for indentation.
        </p>
      </div>

      <QuestionRichContentFields
        id={draft.id}
        scenario={draft.scenario}
        image={draft.image}
        onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
      />

      {draft.type === "short_answer" ? (
        <p className="text-xs text-muted-foreground italic">
          Learners will enter a free-text response. This question type is not auto-graded.
        </p>
      ) : (
        <div className="space-y-2">
          <Label className="text-sm">Answer options</Label>
          <div className="space-y-2">
            {draft.type === "multiple_choice" && (
              <RadioGroup
                value={draft.options.find((o) => o.correct)?.id ?? ""}
                onValueChange={setSingleCorrect}
                className="space-y-2"
              >
                {draft.options.map((o) => (
                  <div key={o.id} className="flex items-center gap-2">
                    <RadioGroupItem id={`opt-${o.id}`} value={o.id} aria-label="Mark as correct" />
                    <Input
                      value={o.text}
                      onChange={(e) => updateOption(o.id, { text: e.target.value })}
                      placeholder="Answer text"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove option"
                      disabled={draft.options.length <= minCount}
                      onClick={() => removeOption(o.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
            )}

            {draft.type === "true_false" && (
              <RadioGroup
                value={draft.options.find((o) => o.correct)?.id ?? ""}
                onValueChange={setSingleCorrect}
                className="space-y-2"
              >
                {draft.options.map((o) => (
                  <div key={o.id} className="flex items-center gap-2">
                    <RadioGroupItem id={`opt-${o.id}`} value={o.id} />
                    <Label htmlFor={`opt-${o.id}`} className="text-sm font-normal">{o.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {draft.type === "multi_select" &&
              draft.options.map((o) => (
                <div key={o.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`opt-${o.id}`}
                    checked={o.correct}
                    onCheckedChange={(v) => updateOption(o.id, { correct: !!v })}
                  />
                  <Input
                    value={o.text}
                    onChange={(e) => updateOption(o.id, { text: e.target.value })}
                    placeholder="Answer text"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove option"
                    disabled={draft.options.length <= minCount}
                    onClick={() => removeOption(o.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
          {(draft.type === "multiple_choice" || draft.type === "multi_select") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addOption}
              disabled={!canAdd}
              className="text-primary"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add answer option
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
        <Button size="sm" onClick={save}>Save</Button>
      </div>

      <RescoreDialog open={rescoreOpen} onOpenChange={setRescoreOpen} onConfirm={confirmRescore} />
    </div>
  );
}
