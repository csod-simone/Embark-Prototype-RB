import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { QUESTION_TYPE_LABEL, type Question } from "./assessmentStubs";

export function QuestionPreviewList({
  questions,
  selectedIds,
  onToggle,
}: {
  questions: Question[];
  selectedIds: Set<string>;
  onToggle: (id: string, checked: boolean) => void;
}) {
  return (
    <ul className="space-y-3">
      {questions.map((q, i) => {
        const checked = selectedIds.has(q.id);
        return (
          <li
            key={q.id}
            className="rounded-2xl border border-border bg-card shadow-sm p-4 flex items-start gap-3"
          >
            <Checkbox
              id={`prev-${q.id}`}
              checked={checked}
              onCheckedChange={(v) => onToggle(q.id, !!v)}
              className="mt-1"
              aria-label={`Include question ${i + 1}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Q+{i + 1}</span>
                <Badge variant="secondary">{QUESTION_TYPE_LABEL[q.type]}</Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{q.text}</p>
              {q.type === "short_answer" ? (
                <p className="mt-2 text-xs text-muted-foreground italic">
                  Free-text response. Not auto-graded.
                </p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {q.options.map((o) => (
                    <li key={o.id} className="flex items-start gap-2 text-sm">
                      {o.correct ? (
                        <Check className="mt-0.5 h-4 w-4 text-success-dark shrink-0" />
                      ) : (
                        <span className="mt-0.5 inline-block h-4 w-4 shrink-0" />
                      )}
                      <span
                        className={cn(
                          o.correct ? "text-success-dark font-medium" : "text-muted-foreground",
                        )}
                      >
                        {o.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
