/**
 * Learner preview for the Assessment Flow Configuration screen.
 *
 * Authors step through the configured flow exactly as a learner would see it:
 * sections with several questions render as one scrollable page, single and
 * ungrouped questions render one per page, and assessment content renders as a
 * non-launching preview representation. Nothing here touches assessment
 * records — answers live in local state and are discarded when the dialog
 * closes.
 */
import { useEffect, useMemo, useState } from "react";
import { MonitorPlay, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RichText } from "@/components/embark/QuestionContent";
import { cn } from "@/lib/utils";
import type { LibraryContentItem } from "@/pages/embark/admin/builder/browserData";
import type { Question, QuestionImage } from "./assessmentStubs";
import { QUESTION_TYPE_LABEL } from "./assessmentStubs";
import {
  CONTENT_FLOW_ID,
  UNGROUPED_FLOW_ID,
  sectionFlowId,
  type FlowItem,
  type QuestionSection,
} from "./QuestionSections";

type PreviewPage =
  | {
      kind: "questions";
      flowId: string;
      heading: string;
      scenario?: string;
      image?: QuestionImage;
      questions: Question[];
    }
  | { kind: "content"; flowId: string; heading: string; item: LibraryContentItem | null };

/** Expands the ordered flow components into the pages a learner would see. */
function buildPreviewPages(
  items: FlowItem[],
  sections: QuestionSection[],
  questions: Question[],
  content: LibraryContentItem | null,
): PreviewPage[] {
  const pages: PreviewPage[] = [];
  items.forEach((item) => {
    if (item.id === CONTENT_FLOW_ID) {
      pages.push({ kind: "content", flowId: item.id, heading: item.title, item: content });
      return;
    }
    if (item.id === UNGROUPED_FLOW_ID) {
      questions
        .filter((q) => !q.sectionId)
        .forEach((q) =>
          pages.push({ kind: "questions", flowId: item.id, heading: "Question", questions: [q] }),
        );
      return;
    }
    const section = sections.find((s) => sectionFlowId(s.id) === item.id);
    if (!section) return;
    const sectionQuestions = questions.filter((q) => q.sectionId === section.id);
    const heading = section.title.trim() || "Untitled section";
    if (sectionQuestions.length > 1) {
      pages.push({
        kind: "questions",
        flowId: item.id,
        heading,
        scenario: section.scenario,
        image: section.image,
        questions: sectionQuestions,
      });
      return;
    }
    sectionQuestions.forEach((q) =>
      pages.push({
        kind: "questions",
        flowId: item.id,
        heading,
        scenario: section.scenario,
        image: section.image,
        questions: [q],
      }),
    );
  });
  return pages;
}

function ImageBlock({ image }: { image: QuestionImage }) {
  return (
    <figure className="space-y-2">
      {image.textBefore && <RichText text={image.textBefore} className="text-sm text-foreground" />}
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="max-h-72 w-auto rounded-md border border-border"
      />
      {image.textAfter && (
        <figcaption>
          <RichText text={image.textAfter} className="text-sm text-foreground" />
        </figcaption>
      )}
    </figure>
  );
}

type AnswerMap = Record<string, string[]>;

function QuestionBlock({
  question,
  index,
  answer,
  onAnswer,
  invalid,
}: {
  question: Question;
  index: number;
  answer: string[];
  onAnswer: (next: string[]) => void;
  invalid: boolean;
}) {
  const multi = question.type === "multi_select";
  return (
    <div
      className={cn(
        "rounded-lg border bg-card shadow-sm p-5 space-y-4",
        invalid ? "border-destructive" : "border-border",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Question {index + 1}</span>
        <Badge variant="secondary">{QUESTION_TYPE_LABEL[question.type]}</Badge>
      </div>

      {question.scenario && (
        <RichText text={question.scenario} className="text-sm text-foreground" />
      )}

      <RichText
        text={question.text || "Untitled question"}
        className="text-base font-semibold text-foreground"
      />

      {question.image && <ImageBlock image={question.image} />}

      {question.type === "short_answer" ? (
        <Textarea
          value={answer[0] ?? ""}
          onChange={(e) => onAnswer(e.target.value.trim() ? [e.target.value] : [])}
          placeholder="Type your response"
          rows={4}
        />
      ) : (
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSel = answer.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={isSel}
                onClick={() =>
                  onAnswer(
                    multi
                      ? isSel
                        ? answer.filter((a) => a !== opt.id)
                        : [...answer, opt.id]
                      : [opt.id],
                  )
                }
                className={cn(
                  "w-full text-left rounded-lg border bg-background px-4 py-3 min-h-[44px] transition-colors flex gap-3 items-start",
                  isSel
                    ? "border-primary border-2 bg-secondary/40"
                    : "border-border hover:bg-muted",
                )}
              >
                <span className="text-sm text-foreground">{opt.text || "Untitled option"}</span>
              </button>
            );
          })}
        </div>
      )}

      {invalid && (
        <p className="text-sm text-destructive">Answer this question to continue.</p>
      )}
    </div>
  );
}

export function AssessmentFlowPreviewDialog({
  open,
  onOpenChange,
  assessmentTitle,
  items,
  sections,
  questions,
  content,
  startFlowId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentTitle: string;
  items: FlowItem[];
  sections: QuestionSection[];
  questions: Question[];
  content: LibraryContentItem | null;
  startFlowId: string | null;
}) {
  const pages = useMemo(
    () => buildPreviewPages(items, sections, questions, content),
    [items, sections, questions, content],
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (!open) return;
    const start = startFlowId ? pages.findIndex((p) => p.flowId === startFlowId) : 0;
    setPageIndex(start >= 0 ? start : 0);
    setAnswers({});
    setShowValidation(false);
  }, [open, startFlowId, pages]);

  const page = pages[pageIndex];
  const unanswered =
    page?.kind === "questions"
      ? page.questions.filter((q) => (answers[q.id] ?? []).length === 0)
      : [];
  const canContinue = unanswered.length === 0;
  const isLast = pageIndex >= pages.length - 1;

  const goNext = () => {
    if (!canContinue) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setPageIndex((i) => Math.min(pages.length - 1, i + 1));
  };

  const ContentIcon = content?.type === "Role-Play" ? Users : MonitorPlay;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Learner preview — {assessmentTitle || "Untitled assessment"}</DialogTitle>
          <DialogDescription>
            View only. Nothing is recorded: no attempt, score or progress is created.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {!page ? (
            <p className="text-sm text-muted-foreground">
              There is nothing to preview yet. Add questions or assessment content first.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">{page.heading}</h3>
                <span className="text-xs text-muted-foreground">
                  Page {pageIndex + 1} of {pages.length}
                </span>
              </div>

              {showValidation && !canContinue && (
                <Alert variant="destructive">
                  <AlertTitle>Answer all questions to continue</AlertTitle>
                  <AlertDescription>
                    {unanswered.length} question{unanswered.length === 1 ? " is" : "s are"} still
                    unanswered on this page.
                  </AlertDescription>
                </Alert>
              )}

              {page.kind === "content" ? (
                page.item ? (
                  <div className="rounded-lg border border-border bg-card shadow-sm p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 text-muted-foreground">
                        <ContentIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-foreground">
                          {page.item.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary">{page.item.type}</Badge>
                          <span>{page.item.durationMin} min</span>
                          <span>·</span>
                          <span>{page.item.topic}</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {page.item.description}
                        </p>
                      </div>
                    </div>
                    <Button disabled title="Preview only — content does not launch">
                      Launch {page.item.type}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Preview only — the content does not launch from here.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No content selected yet.</p>
                )
              ) : (
                <>
                  {page.scenario && (
                    <div className="rounded-lg border border-border bg-muted/40 p-4">
                      <RichText text={page.scenario} className="text-sm text-foreground" />
                    </div>
                  )}
                  {page.image && <ImageBlock image={page.image} />}
                  <div className="space-y-4">
                    {page.questions.map((q, i) => (
                      <QuestionBlock
                        key={q.id}
                        question={q}
                        index={i}
                        answer={answers[q.id] ?? []}
                        onAnswer={(next) => {
                          setAnswers((prev) => ({ ...prev, [q.id]: next }));
                          if (unanswered.length <= 1) setShowValidation(false);
                        }}
                        invalid={showValidation && (answers[q.id] ?? []).length === 0}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button
            variant="ghost"
            disabled={pageIndex === 0}
            onClick={() => {
              setShowValidation(false);
              setPageIndex((i) => Math.max(0, i - 1));
            }}
          >
            Back
          </Button>
          {isLast ? (
            <Button onClick={() => onOpenChange(false)}>Close preview</Button>
          ) : (
            <Button
              onClick={goNext}
              aria-disabled={!canContinue}
              variant={canContinue ? "default" : "secondary"}
            >
              Continue
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
