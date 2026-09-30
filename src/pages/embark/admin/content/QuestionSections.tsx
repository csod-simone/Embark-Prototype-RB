/**
 * Sections are the author-facing representation of the assessment's question
 * blocks: an optional grouping of questions that can be named, re-ordered and
 * sequenced against assessment content in the Assessment Flow Configuration.
 */
import { Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { LibraryContentItem } from "@/pages/embark/admin/builder/browserData";
import { QuestionCard } from "./QuestionCard";
import { QuestionRichContentFields } from "./QuestionRichContentFields";
import type { Question, QuestionImage } from "./assessmentStubs";

export type QuestionSection = {
  id: string;
  title: string;
  scenario?: string;
  image?: QuestionImage;
};

let sectionCounter = 0;
export const newSectionId = () =>
  `sec-${++sectionCounter}-${Math.random().toString(36).slice(2, 7)}`;

export const UNGROUPED_FLOW_ID = "ungrouped";
export const CONTENT_FLOW_ID = "content";
export const sectionFlowId = (id: string) => `section:${id}`;

export type FlowItem = { id: string; title: string; subtitle: string };

/** The orderable components of an assessment: sections, loose questions, content. */
export function buildFlowItems(
  sections: QuestionSection[],
  questions: Question[],
  content: LibraryContentItem | null,
  hasContent: boolean,
): FlowItem[] {
  const items: FlowItem[] = [];
  const ungrouped = questions.filter((q) => !q.sectionId);
  if (ungrouped.length > 0 || sections.length === 0) {
    items.push({
      id: UNGROUPED_FLOW_ID,
      title: `Questions (${ungrouped.length})`,
      subtitle: sections.length > 0 ? "Ungrouped questions" : "Questions",
    });
  }
  sections.forEach((s) => {
    const count = questions.filter((q) => q.sectionId === s.id).length;
    items.push({
      id: sectionFlowId(s.id),
      title: s.title.trim() || "Untitled section",
      subtitle: `Section · ${count} question${count === 1 ? "" : "s"}`,
    });
  });
  if (hasContent) {
    items.push({
      id: CONTENT_FLOW_ID,
      title: content?.title ?? "Assessment content",
      subtitle: content?.type ?? "Assessment content",
    });
  }
  return items;
}

/** Keeps the saved order, dropping removed components and appending new ones. */
export function reconcileFlowOrder(order: string[], items: FlowItem[]): string[] {
  const ids = items.map((i) => i.id);
  const kept = order.filter((id) => ids.includes(id));
  const added = ids.filter((id) => !kept.includes(id));
  return [...kept, ...added];
}

export function orderedFlowItems(order: string[], items: FlowItem[]): FlowItem[] {
  return reconcileFlowOrder(order, items)
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is FlowItem => !!i);
}

/** Shared ordered list with the existing move-up / move-down controls. */
export function AssessmentFlowList({
  items,
  onMove,
  onPreview,
}: {
  items: FlowItem[];
  onMove: (index: number, delta: number) => void;
  /** Opens the learner preview starting at this flow component. */
  onPreview?: (flowId: string) => void;
}) {
  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li
          key={item.id}
          className="flex items-center gap-3 rounded-md border border-border p-4"
        >
          <span className="text-xs font-semibold text-muted-foreground w-5">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{item.title}</div>
            <div className="text-xs text-muted-foreground">{item.subtitle}</div>
          </div>
          <div className="flex items-center gap-1">
            {onPreview && (
              <Button
                variant="outline"
                size="sm"
                aria-label={`Preview ${item.title}`}
                onClick={() => onPreview(item.id)}
              >
                <Eye className="mr-1 h-4 w-4" /> Preview
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Move ${item.title} up`}
              disabled={i === 0}
              onClick={() => onMove(i, -1)}
            >
              ↑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Move ${item.title} down`}
              disabled={i === items.length - 1}
              onClick={() => onMove(i, 1)}
            >
              ↓
            </Button>
          </div>
        </li>
      ))}
    </ol>
  );
}

type ListHandlers = {
  newIds: Set<string>;
  onChange: (id: string, q: Question) => void;
  onDelete: (id: string) => void;
  onCancelNew: (id: string) => void;
  onMoveQuestion: (questionId: string, sectionId: string | null) => void;
};

function QuestionRows({
  questions,
  sections,
  offset,
  handlers,
}: {
  questions: Question[];
  sections: QuestionSection[];
  offset: number;
  handlers: ListHandlers;
}) {
  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={q.id} className="space-y-1">
          <QuestionCard
            question={q}
            index={offset + i}
            sections={sections}
            startInEdit={handlers.newIds.has(q.id)}
            onChange={(next) => handlers.onChange(q.id, next)}
            onDelete={() => handlers.onDelete(q.id)}
            onMoveSection={(sectionId) => handlers.onMoveQuestion(q.id, sectionId)}
            onCancelNew={
              handlers.newIds.has(q.id) ? () => handlers.onCancelNew(q.id) : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Questions grouped into optional sections. With no sections created this is
 * exactly the flat question list authors see today.
 */
export function SectionedQuestionList({
  questions,
  sections,
  newIds,
  onChange,
  onDelete,
  onCancelNew,
  onMoveQuestion,
  onAddQuestion,
  onChangeSection,
  onDeleteSection,
  onMoveSection,
}: {
  questions: Question[];
  sections: QuestionSection[];
  newIds: Set<string>;
  onChange: (id: string, q: Question) => void;
  onDelete: (id: string) => void;
  onCancelNew: (id: string) => void;
  onMoveQuestion: (questionId: string, sectionId: string | null) => void;
  onAddQuestion: (sectionId: string) => void;
  onChangeSection: (id: string, patch: Partial<Omit<QuestionSection, "id">>) => void;
  onDeleteSection: (id: string) => void;
  onMoveSection: (index: number, delta: number) => void;
}) {
  const handlers: ListHandlers = { newIds, onChange, onDelete, onCancelNew, onMoveQuestion };
  const ungrouped = questions.filter((q) => !q.sectionId);

  return (
    <div className="space-y-5">
      {ungrouped.length > 0 && (
        <QuestionRows
          questions={ungrouped}
          sections={sections}
          offset={0}
          handlers={handlers}
        />
      )}

      {sections.map((section, sIndex) => {
        const sectionQuestions = questions.filter((q) => q.sectionId === section.id);
        return (
          <div key={section.id} className="rounded-md border border-border p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Label htmlFor={`section-${section.id}`} className="sr-only">
                Section name
              </Label>
              <Input
                id={`section-${section.id}`}
                value={section.title}
                onChange={(e) => onChangeSection(section.id, { title: e.target.value })}
                placeholder="Section name"
                className="h-9 max-w-sm font-medium"
              />
              <Badge variant="secondary">
                {sectionQuestions.length} question{sectionQuestions.length === 1 ? "" : "s"}
              </Badge>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Move section ${section.title || sIndex + 1} up`}
                  disabled={sIndex === 0}
                  onClick={() => onMoveSection(sIndex, -1)}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Move section ${section.title || sIndex + 1} down`}
                  disabled={sIndex === sections.length - 1}
                  onClick={() => onMoveSection(sIndex, 1)}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Delete section ${section.title || sIndex + 1}`}
                  onClick={() => onDeleteSection(section.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <QuestionRichContentFields
              id={`section-${section.id}`}
              subject="section"
              scenario={section.scenario}
              image={section.image}
              onChange={(patch) => onChangeSection(section.id, patch)}
            />

            {sectionQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No questions in this section yet.
              </p>
            ) : (
              <QuestionRows
                questions={sectionQuestions}
                sections={sections}
                offset={0}
                handlers={handlers}
              />
            )}

            <Button variant="outline" size="sm" onClick={() => onAddQuestion(section.id)}>
              <Plus className="mr-1 h-4 w-4" /> Add question to section
            </Button>
          </div>
        );
      })}
    </div>
  );
}
