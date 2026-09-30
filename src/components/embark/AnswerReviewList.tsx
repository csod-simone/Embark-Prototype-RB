import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ReviewQuestion = {
  id: string;
  sectionLabel: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
};

/**
 * Renders the "Review your answers" question cards.
 * Used both before submission (editable, no correctness) and after
 * submission (read-only, correctness shown when the admin config allows it).
 */
export function AnswerReviewList({
  questions,
  answers,
  onEdit,
  showCorrectness = false,
}: {
  questions: ReviewQuestion[];
  answers: Record<string, string | null>;
  onEdit?: (index: number) => void;
  showCorrectness?: boolean;
}) {
  return (
    <>
      {questions.map((q, i) => {
        const answerId = answers[q.id] ?? null;
        const answer = q.options.find((o) => o.id === answerId);
        return (
          <div
            key={q.id}
            className="rounded-lg border border-border bg-card shadow-sm p-5 sm:p-6 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  Question {i + 1} · {q.sectionLabel}
                </div>
                <h3 className="text-base font-semibold text-foreground mt-1">{q.prompt}</h3>
              </div>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => onEdit(i)}
                >
                  Revisit
                </Button>
              )}
            </div>

            {showCorrectness ? (
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = opt.id === answerId;
                  const isCorrect = opt.id === q.correctId;
                  if (!isSelected && !isCorrect) {
                    return (
                      <div
                        key={opt.id}
                        className="w-full text-left rounded-lg border border-border bg-background px-4 py-3 flex gap-3 items-start"
                      >
                        <span className="text-sm font-semibold text-muted-foreground w-5 flex-shrink-0">
                          {opt.id}
                        </span>
                        <span className="text-sm text-foreground">{opt.text}</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={opt.id}
                      className={cn(
                        "w-full text-left rounded-lg px-4 py-3 flex gap-3 items-start",
                        isSelected && isCorrect && "border-2 border-primary bg-success/10",
                        isSelected && !isCorrect && "border-2 border-primary bg-destructive/10",
                        !isSelected && isCorrect && "border border-success bg-success/10",
                      )}
                    >
                      <span className="text-sm font-semibold text-muted-foreground w-5 flex-shrink-0">
                        {opt.id}
                      </span>
                      <span className="text-sm text-foreground flex-1">{opt.text}</span>
                      <span className="flex flex-shrink-0 items-center gap-2">
                        {!isSelected && isCorrect && (
                          <span className="text-xs font-medium text-foreground-success">
                            Correct answer
                          </span>
                        )}
                        {isCorrect ? (
                          <CheckCircle2
                            className="h-4 w-4 text-foreground-success"
                            aria-label="Correct answer"
                          />
                        ) : (
                          <XCircle
                            className="h-4 w-4 text-foreground-destructive"
                            aria-label="Incorrect answer"
                          />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : answer ? (
              <div className="w-full text-left rounded-lg border-2 border-primary bg-secondary/40 px-4 py-3 flex gap-3 items-start">
                <span className="text-sm font-semibold text-muted-foreground w-5 flex-shrink-0">
                  {answer.id}
                </span>
                <span className="text-sm text-foreground">{answer.text}</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No answer selected</p>
            )}
          </div>
        );
      })}
    </>
  );
}
