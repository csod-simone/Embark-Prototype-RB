import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle, ChevronLeft, Library, Plus, Sparkles, Upload } from "lucide-react";
import { BreadcrumbBar } from "@/components/embark/BreadcrumbBar";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CONTENT } from "./Content";
import {
  blankQuestion,
  makeStubQuestions,
  type Question,
} from "./content/assessmentStubs";
import {
  AssessmentFlowList,
  SectionedQuestionList,
  buildFlowItems,
  newSectionId,
  orderedFlowItems,
  reconcileFlowOrder,
  type QuestionSection,
} from "./content/QuestionSections";
import { AssessmentContentPickerModal } from "./content/AssessmentContentPickerModal";
import { AssessmentFlowPreviewDialog } from "./content/AssessmentFlowPreviewDialog";
import { type LibraryContentItem } from "@/pages/embark/admin/builder/browserData";
import { AiGenerateQuestionsDialog } from "./content/AiGenerateQuestionsDialog";
import { UploadQuestionsDialog } from "./content/UploadQuestionsDialog";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import {
  AttemptsAllowedField,
  defaultAttempts,
  type AttemptsValue,
} from "@/components/embark/AttemptsAllowed";
import {
  ASSESSMENT_DEFAULTS,
  isAssessmentType,
  type AnswerReviewMode,
  type AssessmentType,
} from "@/data/assessmentTypes";
import {
  CONTENT_TYPE_LABELS,
  QUESTION_TYPE_LABELS,
  useAssessmentTypeDefaults,
  type AssessmentComponents,
} from "@/hooks/use-assessment-type-defaults";

const IN_USE = true;
const IN_USE_ITEMS = [
  "CSR Onboarding Journey",
  "New Hire Foundations Journey",
  "CSR Onboarding Week 1",
];
const IN_USE_LABEL = "In use in 2 journeys and 1 path";

type QuestionsShown = "all" | "specific";
type QuestionOrder = "fixed" | "random";

/**
 * Hydrates the editor from the same question bank the learner sees, so the
 * assessment being edited shows its own questions and correct answers.
 */
function questionsForAssessment(_contentId: string): Question[] | null {
  return null;
}


export default function EditAssessment() {
  const navigate = useNavigate();
  const { contentId } = useParams();
  const item = useMemo(
    () => CONTENT.find((c) => c.id === contentId),
    [contentId],
  );
  const initialTitle = item?.title ?? "Assessment";
  const subtype = (item as { modality?: string } | undefined)?.modality;
  const assessmentType: AssessmentType | null =
    subtype && isAssessmentType(subtype) ? subtype : null;
  const typeDefaultsCtx = useAssessmentTypeDefaults();
  const framework = assessmentType ? ASSESSMENT_DEFAULTS[assessmentType] : null;
  /** Comprehension Checks reinforce learning: unlimited attempts, no passing score. */
  const isKnowledgeCheck = subtype === "Comprehension Check";
  const typeDefaults = assessmentType ? typeDefaultsCtx.defaultsFor(assessmentType) : null;
  /** Locked when Configuration disallows overriding the threshold for this type. */
  const thresholdLocked = !!typeDefaults && !typeDefaults.allowOverride;
  /** Configuration can mark a type as having no advancement score at all. */
  const noAdvancementScore = typeDefaults ? !typeDefaults.requiresScore : isKnowledgeCheck;
  const status: "Active" | "Inactive" = "Active";
  const isCsrItem = false;
  const seeded = useMemo(
    () => (contentId ? questionsForAssessment(contentId) : null),
    [contentId],
  );

  const [title, setTitle] = useState(initialTitle);
  const [passThreshold, setPassThreshold] = useState(
    framework?.passThreshold ?? typeDefaults?.threshold ?? 100,
  );
  const [answerReview, setAnswerReview] = useState<AnswerReviewMode>(framework?.answerReview ?? "on-pass");
  const [questionsShown, setQuestionsShown] = useState<QuestionsShown>("all");
  const [specificCount, setSpecificCount] = useState(10);
  const [questionOrder, setQuestionOrder] = useState<QuestionOrder>("fixed");
  const [attempts, setAttempts] = useState<AttemptsValue>(() => {
    if (isKnowledgeCheck || framework?.attempts == null) return { attempts: "", unlimited: true };
    if (framework) return { attempts: String(framework.attempts), unlimited: false };
    return defaultAttempts;
  });
  const [questions, setQuestions] = useState<Question[]>(
    () => seeded ?? (isCsrItem ? [] : makeStubQuestions()),
  );
  const [components, setComponents] = useState<AssessmentComponents>(
    () => typeDefaults?.components ?? { questions: true, content: false },
  );
  /** Content already attached to this assessment (e.g. an embedded simulation). */
  const attachedContent = null;
  const [contentItem, setContentItem] = useState<LibraryContentItem | null>(attachedContent);
  const [contentPickerOpen, setContentPickerOpen] = useState(false);
  const [flowOrder, setFlowOrder] = useState<string[]>([]);
  /** Optional author-facing sections (question blocks). */
  const [sections, setSections] = useState<QuestionSection[]>([]);
  /** Learner preview opened from the assessment flow list. */
  const [previewFlowId, setPreviewFlowId] = useState<string | null>(null);

  /** Persists framework settings so the learner runtime picks them up. */
  const persistSettings = () => {
    if (!assessmentType || !contentId) return;
  };

  const [newQuestionIds, setNewQuestionIds] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);

  const [aiOpen, setAiOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [scope, setScope] = useState<"all" | "new" | "">("");
  const [leaveOpen, setLeaveOpen] = useState(false);

  const markDirty = () => setDirty(true);

  const updateQuestion = (id: string, next: Question) => {
    setQuestions((qs) => qs.map((q) => (q.id === id ? next : q)));
    setNewQuestionIds((s) => {
      if (!s.has(id)) return s;
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    markDirty();
  };

  const removeQuestion = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
    setNewQuestionIds((s) => {
      if (!s.has(id)) return s;
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    markDirty();
  };

  const cancelNew = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
    setNewQuestionIds((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  const addManualQuestion = (sectionId?: string) => {
    const q = { ...blankQuestion("multiple_choice"), ...(sectionId ? { sectionId } : {}) };
    setQuestions((qs) => [...qs, q]);
    setNewQuestionIds((s) => new Set(s).add(q.id));
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: newSectionId(), title: `Section ${prev.length + 1}` },
    ]);
    markDirty();
  };

  const changeSection = (id: string, patch: Partial<Omit<QuestionSection, "id">>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    markDirty();
  };

  /** Deleting a section keeps its questions by returning them to the ungrouped list. */
  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    setQuestions((qs) =>
      qs.map((q) => (q.sectionId === id ? { ...q, sectionId: undefined } : q)),
    );
    markDirty();
  };

  const moveSection = (index: number, delta: number) => {
    setSections((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    markDirty();
  };

  const moveQuestionToSection = (questionId: string, sectionId: string | null) => {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === questionId ? { ...q, sectionId: sectionId ?? undefined } : q,
      ),
    );
    markDirty();
  };

  const flowItems = useMemo(
    () =>
      buildFlowItems(
        components.questions ? sections : [],
        components.questions ? questions : [],
        contentItem,
        components.content,
      ).filter((i) => components.questions || i.id !== "ungrouped"),
    [components, sections, questions, contentItem],
  );
  const orderedFlow = useMemo(
    () => orderedFlowItems(flowOrder, flowItems),
    [flowOrder, flowItems],
  );
  const moveFlow = (index: number, delta: number) => {
    const ids = reconcileFlowOrder(flowOrder, flowItems);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    setFlowOrder(next);
    markDirty();
  };

  const appendGenerated = (qs: Question[]) => {
    setQuestions((prev) => [...prev, ...qs]);
    markDirty();
  };

  const goBack = () => navigate("/admin/content");

  const handleCancel = () => {
    if (!dirty) {
      goBack();
      return;
    }
    setLeaveOpen(true);
  };

  const handleSaveClick = () => {
    if (IN_USE) {
      setScope("");
      setScopeOpen(true);
      return;
    }
    persistSettings();
    toast.success("Assessment saved successfully.");
    setDirty(false);
  };

  const confirmScopeSave = () => {
    if (!scope) return;
    setScopeOpen(false);
    persistSettings();
    if (scope === "all") {
      toast.success(
        "Assessment saved. Changes applied to all learners, including those in progress.",
      );
    } else {
      toast.success("Assessment saved. Changes will apply to new learner assignments only.");
    }
    setDirty(false);
  };

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-6 pb-24">
        {/* Header */}
        <div className="space-y-3">
          <BreadcrumbBar
            items={[
              { label: "Admin", href: "/admin/content" },
              { label: "Content Library", href: "/admin/content" },
              { label: initialTitle, href: "/admin/content" },
              { label: "Edit Assessment" },
            ]}
          />
          <Button variant="ghost" size="sm" onClick={goBack} className="-ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Content Library
          </Button>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">{initialTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Edit questions, adjust settings, or add new questions to this assessment.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {IN_USE ? IN_USE_LABEL : "Not currently used in any journey or path"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {subtype && <Badge variant="secondary">{subtype}</Badge>}
              
              <Badge variant={status === "Active" ? "success" : "secondary"}>{status}</Badge>
            </div>
          </div>

        </div>

        {/* Assessment Settings */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Assessment Settings</h3>
          {typeDefaults && (
            <p className="text-xs text-muted-foreground">{typeDefaults.description}</p>
          )}
          <div className="rounded-2xl border border-border bg-card shadow-sm p-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="a-title" className="text-sm">
                Assessment Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="a-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  markDirty();
                }}
              />
            </div>

            {noAdvancementScore ? (
              <div className="space-y-2">
                <Label className="text-sm">Advancement Threshold (%)</Label>
                <p className="text-sm text-foreground">No advancement score</p>
                <p className="text-xs text-muted-foreground">
                  {isKnowledgeCheck
                    ? "Comprehension Checks are embedded SCORM activities. Completion is recorded; learners are not scored and are never blocked from continuing."
                    : "This assessment type is set to No Advancement Score in Configuration. Completion is recorded; learners are not scored and are never blocked from continuing."}
                </p>
              </div>
            ) : thresholdLocked ? (
              <div className="space-y-2">
                <Label className="text-sm">Advancement Threshold (%)</Label>
                <p className="text-sm text-foreground">
                  {typeDefaults?.threshold ?? 0}%
                  {(typeDefaults?.threshold ?? 0) === 0 ? " — never blocks progression" : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  This threshold is set centrally in Configuration and cannot be changed here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="a-threshold" className="text-sm">
                  Advancement Threshold (%)
                </Label>
                <Input
                  id="a-threshold"
                  type="number"
                  min={0}
                  max={100}
                  value={passThreshold}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    setPassThreshold(Math.max(0, Math.min(100, n)));
                    markDirty();
                  }}
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground">
                  Learners must score at or above this percentage to advance.
                  {assessmentType && typeDefaults
                    ? ` Configured default for ${assessmentType}s is ${typeDefaults.threshold}%.`
                    : ""}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <Label className="text-sm">Assessment components</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Choose Questions, Assessment Content, or both.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="edit-component-questions"
                  checked={components.questions}
                  onCheckedChange={(value) => {
                    if (value !== true && !components.content) return;
                    setComponents((current) => ({ ...current, questions: value === true }));
                    markDirty();
                  }}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="edit-component-questions" className="text-sm font-normal">
                    Questions
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {QUESTION_TYPE_LABELS.join(" · ")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="edit-component-content"
                  checked={components.content}
                  onCheckedChange={(value) => {
                    if (value !== true && !components.questions) return;
                    setComponents((current) => ({ ...current, content: value === true }));
                    markDirty();
                  }}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="edit-component-content" className="text-sm font-normal">
                    Assessment Content
                  </Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {CONTENT_TYPE_LABELS.join(" · ")}
                  </p>
                </div>
              </div>
            </div>

            {components.questions && assessmentType && !isKnowledgeCheck && (
              <div className="space-y-2">
                <Label className="text-sm">Answer Review</Label>
                <RadioGroup
                  value={answerReview}
                  onValueChange={(v) => {
                    setAnswerReview(v as AnswerReviewMode);
                    markDirty();
                  }}
                  className="space-y-1"
                >
                  {(
                    [
                      ["final-attempt", "On the final attempt only (or on pass)"],
                      ["on-pass", "Only after passing"],
                      ["always", "After every attempt"],
                      ["none", "Never"],
                    ] as [AnswerReviewMode, string][]
                  ).map(([v, label]) => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem id={`ar-${v}`} value={v} />
                      <Label htmlFor={`ar-${v}`} className="text-sm font-normal">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Controls when learners can see which answers were right or wrong.
                </p>
              </div>
            )}



            {components.questions && <div className="space-y-2">
              <Label className="text-sm">Questions Shown to Learner</Label>
              <RadioGroup
                value={questionsShown}
                onValueChange={(v) => {
                  setQuestionsShown(v as QuestionsShown);
                  markDirty();
                }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="qs-all" value="all" />
                  <Label htmlFor="qs-all" className="text-sm font-normal">
                    All questions
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="qs-specific" value="specific" />
                  <Label htmlFor="qs-specific" className="text-sm font-normal">
                    A specific number
                  </Label>
                </div>
              </RadioGroup>
              {questionsShown === "specific" && (
                <div className="pl-6 space-y-1">
                  <Label htmlFor="qs-count" className="text-xs text-muted-foreground">
                    Number of questions
                  </Label>
                  <Input
                    id="qs-count"
                    type="number"
                    min={1}
                    value={specificCount}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isNaN(n)) return;
                      setSpecificCount(Math.max(1, n));
                      markDirty();
                    }}
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must not exceed the total number of questions in the assessment.
                  </p>
                </div>
              )}
            </div>}

            {components.questions && <div className="space-y-2">
              <Label className="text-sm">Question Order</Label>
              <RadioGroup
                value={questionOrder}
                onValueChange={(v) => {
                  setQuestionOrder(v as QuestionOrder);
                  markDirty();
                }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="qo-fixed" value="fixed" />
                  <Label htmlFor="qo-fixed" className="text-sm font-normal">
                    Fixed order
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="qo-random" value="random" />
                  <Label htmlFor="qo-random" className="text-sm font-normal">
                    Randomised
                  </Label>
                </div>
              </RadioGroup>
            </div>}

            <AttemptsAllowedField
              idPrefix="edit-assessment"
              value={attempts}
              onChange={(next) => {
                setAttempts(next);
                markDirty();
              }}
            />
          </div>
        </section>

        {/* Assessment content */}
        {components.content && (
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Assessment content</h3>
            <p className="text-sm text-muted-foreground">
              The SCORM, Role-Play or Simulation activity learners complete as part of this
              assessment.
            </p>
            {contentItem && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="text-sm font-medium text-foreground">{contentItem.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {contentItem.type} · {contentItem.durationMin} min
                </div>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setContentPickerOpen(true)}>
                <Library className="mr-1 h-4 w-4" />
                {contentItem ? "Replace content" : "Browse Content Library"}
              </Button>
              {contentItem && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setContentItem(null);
                    markDirty();
                  }}
                >
                  Remove content
                </Button>
              )}
            </div>
          </section>
        )}

        {/* Assessment flow */}
        {orderedFlow.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">Assessment flow</h3>
            <p className="text-sm text-muted-foreground">
              The order learners experience the components of this assessment.
            </p>
            <AssessmentFlowList
              items={orderedFlow}
              onMove={moveFlow}
              onPreview={setPreviewFlowId}
            />
          </section>
        )}

        {/* Questions */}
        {components.questions && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground">Questions</h3>
            <Badge variant="secondary">{questions.length} Questions</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Review and edit the questions that make up this assessment. Changes are not saved until
            you click 'Save Changes'.
          </p>

          <SectionedQuestionList
            questions={questions}
            sections={sections}
            newIds={newQuestionIds}
            onChange={updateQuestion}
            onDelete={removeQuestion}
            onCancelNew={cancelNew}
            onMoveQuestion={moveQuestionToSection}
            onAddQuestion={addManualQuestion}
            onChangeSection={changeSection}
            onDeleteSection={deleteSection}
            onMoveSection={moveSection}
          />

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => addManualQuestion()}>
              <Plus className="mr-1 h-4 w-4" /> Add Question Manually
            </Button>
            <Button variant="outline" size="sm" onClick={addSection}>
              <Plus className="mr-1 h-4 w-4" /> Add Section
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAiOpen(true)}>
              <Sparkles className="mr-1 h-4 w-4" /> AI Generate Questions
            </Button>
            <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
              <Upload className="mr-1 h-4 w-4" /> Upload Questions from File
            </Button>
          </div>
        </section>
        )}
      </PageContainer>

      <AssessmentContentPickerModal
        open={contentPickerOpen}
        onOpenChange={setContentPickerOpen}
        selectedId={contentItem?.id}
        onSelect={(item) => {
          setContentItem(item);
          markDirty();
        }}
      />

      <AssessmentFlowPreviewDialog
        open={previewFlowId !== null}
        onOpenChange={(o) => !o && setPreviewFlowId(null)}
        assessmentTitle={title}
        items={orderedFlow}
        sections={sections}
        questions={questions}
        content={contentItem}
        startFlowId={previewFlowId}
      />

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur px-6 py-3 flex justify-end gap-2">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveClick}>Save Changes</Button>
      </div>

      <AiGenerateQuestionsDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        isInUse={IN_USE}
        onAdd={appendGenerated}
      />
      <UploadQuestionsDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onAdd={appendGenerated}
      />

      {/* Unsaved changes */}
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={goBack}>Leave Without Saving</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change scope modal */}
      <Dialog open={scopeOpen} onOpenChange={setScopeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Who should these changes apply to?</DialogTitle>
            <DialogDescription>
              This assessment is currently in use in the following journeys and paths:
            </DialogDescription>
          </DialogHeader>
          <LeftBorderCard borderVariant="warning">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-foreground dark:text-warning mt-0.5 shrink-0" />
              <ul className="text-sm text-foreground list-disc pl-5 space-y-1">
                {IN_USE_ITEMS.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </LeftBorderCard>

          <div className="space-y-2">
            <Label className="text-sm">Apply these changes to:</Label>
            <RadioGroup
              value={scope}
              onValueChange={(v) => setScope(v as "all" | "new")}
              className="space-y-3"
            >
              <div className="flex items-start gap-2">
                <RadioGroupItem id="scope-all" value="all" className="mt-1" />
                <div>
                  <Label htmlFor="scope-all" className="text-sm font-normal">
                    All learners, including those already in progress
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Changes will take effect immediately for all learners, including those who have
                    already started this assessment. Learners in progress will see the updated
                    question set on their next attempt.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RadioGroupItem id="scope-new" value="new" className="mt-1" />
                <div>
                  <Label htmlFor="scope-new" className="text-sm font-normal">
                    Only learners assigned after these changes are saved
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Learners who are currently in progress or have already completed this
                    assessment will not be affected. Only new assignments made after saving will use
                    the updated version.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setScopeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmScopeSave} disabled={!scope}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
