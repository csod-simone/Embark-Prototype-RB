import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollToTopOnChange } from "@/hooks/use-scroll-to-top-on-change";
import { toast } from "sonner";
import {
  FileText,
  Library,
  Loader2,
  MonitorPlay,
  Pencil,
  Plus,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { cn } from "@/lib/utils";
import { ASSESSMENT_TYPES, type AssessmentType } from "@/data/assessmentTypes";
import { useAssessmentTypeDefaults } from "@/hooks/use-assessment-type-defaults";
import type { AssessmentComponents } from "@/hooks/use-assessment-type-defaults";
import type { LibraryContentItem } from "@/pages/embark/admin/builder/browserData";
import { AssessmentContentPickerModal } from "./AssessmentContentPickerModal";
import { AssessmentFlowPreviewDialog } from "./AssessmentFlowPreviewDialog";
import {
  JOURNEY_OPTIONS,
  QUESTION_TYPE_LABEL,
  type Question,
  blankQuestion,
  makeStubQuestions,
} from "./assessmentStubs";
import {
  AssessmentFlowList,
  SectionedQuestionList,
  buildFlowItems,
  newSectionId,
  orderedFlowItems,
  reconcileFlowOrder,
  type QuestionSection,
} from "./QuestionSections";
import {
  AssessmentSettingsPanel,
  defaultAssessmentSettings,
  settingsForType,
  type AssessmentSettings,
} from "./AssessmentSettingsPanel";

type Method = "auto" | "manual" | "upload" | "scorm";
/** Ordered keys of the steps this assessment's components require. */
type StepKey = "setup" | "questions" | "content" | "flow" | "review";

const METHOD_OPTIONS: Record<
  Method,
  { title: string; description: string; icon: typeof Sparkles }
> = {
  auto: {
    title: "Auto-generate from Journey",
    description:
      "Sage will generate questions and answers based on the content in a selected journey.",
    icon: Sparkles,
  },
  manual: {
    title: "Add Questions Manually",
    description: "Build your assessment question by question.",
    icon: Pencil,
  },
  upload: {
    title: "Upload from File",
    description: "Import an assessment from a supported file format.",
    icon: Upload,
  },
  scorm: {
    title: "Use Assessment Content (SCORM)",
    description:
      "Comprehension Checks use an existing SCORM or Role-Play activity from the content library.",
    icon: MonitorPlay,
  },
};

/** Creation methods available for the configured components of a type. */
function methodsForComponents(components: { questions: boolean; content: boolean }): Method[] {
  if (components.questions) return ["auto", "manual", "upload"];
  if (components.content) return ["scorm"];
  return [];
}

/** The wizard steps required by the configured components. */
function stepKeysFor(
  components: { questions: boolean; content: boolean },
  needsFlow: boolean,
): StepKey[] {
  const keys: StepKey[] = ["setup"];
  if (components.questions) keys.push("questions");
  if (components.content) keys.push("content");
  if (needsFlow) keys.push("flow");
  keys.push("review");
  return keys;
}

export function AddAssessmentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [assessmentType, setAssessmentType] = useState<AssessmentType | "">("");
  const { defaultsFor } = useAssessmentTypeDefaults();
  const [components, setComponents] = useState<AssessmentComponents>({
    questions: false,
    content: false,
  });
  const [method, setMethod] = useState<Method | "">("");
  const [step, setStep] = useState(1);
  /** Order of the assessment's components: sections, loose questions and content. */
  const [flowOrder, setFlowOrder] = useState<string[]>([]);
  /** Optional author-facing sections (question blocks). */
  const [sections, setSections] = useState<QuestionSection[]>([]);
  /** Learner preview opened from the assessment flow list. */
  const [previewFlowId, setPreviewFlowId] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useScrollToTopOnChange(bodyRef, String(step));
  const [journey, setJourney] = useState("");
  const [scormItem, setScormItem] = useState<LibraryContentItem | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestionIds, setNewQuestionIds] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<AssessmentSettings>(defaultAssessmentSettings);
  const [regenOpen, setRegenOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Upload state
  const [uploadStage, setUploadStage] = useState<"empty" | "processing" | "done">("empty");
  const [uploadedName, setUploadedName] = useState("");

  useEffect(() => {
    if (!open) {
      // Reset on close
      setTitle("");
      setAssessmentType("");
      setComponents({ questions: false, content: false });
      setMethod("");
      setStep(1);
      setFlowOrder([]);
      setSections([]);
      setJourney("");
      setScormItem(null);
      setPickerOpen(false);
      setQuestions([]);
      setNewQuestionIds(new Set());
      setSettings(defaultAssessmentSettings);
      setRegenOpen(false);
      setGenerating(false);
      setUploadStage("empty");
      setUploadedName("");
    }
  }, [open]);

  const runGeneration = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setQuestions(makeStubQuestions());
      setNewQuestionIds(new Set());
      setGenerating(false);
    }, 2000);
  };

  const runUploadProcessing = (fileName: string) => {
    setUploadedName(fileName);
    setUploadStage("processing");
    window.setTimeout(() => {
      setQuestions(makeStubQuestions());
      setNewQuestionIds(new Set());
      setUploadStage("done");
    }, 1500);
  };

  const updateQuestion = (id: string, next: Question) => {
    setQuestions((qs) => qs.map((q) => (q.id === id ? next : q)));
    setNewQuestionIds((s) => {
      if (!s.has(id)) return s;
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
    setNewQuestionIds((s) => {
      if (!s.has(id)) return s;
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  const appendBlank = (sectionId?: string) => {
    const q = { ...blankQuestion(), ...(sectionId ? { sectionId } : {}) };
    setQuestions((qs) => [...qs, q]);
    setNewQuestionIds((s) => new Set(s).add(q.id));
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: newSectionId(), title: `Section ${prev.length + 1}` },
    ]);
  };

  const changeSection = (id: string, patch: Partial<Omit<QuestionSection, "id">>) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  /** Deleting a section keeps its questions by returning them to the ungrouped list. */
  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    setQuestions((qs) =>
      qs.map((q) => (q.sectionId === id ? { ...q, sectionId: undefined } : q)),
    );
  };

  const moveSection = (index: number, delta: number) =>
    setSections((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const moveQuestionToSection = (questionId: string, sectionId: string | null) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === questionId ? { ...q, sectionId: sectionId ?? undefined } : q,
      ),
    );

  const cancelNew = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
    setNewQuestionIds((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  const saveAssessment = () => {
    toast.success("Assessment created successfully.");
    onOpenChange(false);
  };

  const savedQuestionCount = questions.filter((q) => !newQuestionIds.has(q.id)).length;
  const availableMethods = methodsForComponents(components);
  const flowItems = useMemo(
    () =>
      buildFlowItems(
        components.questions ? sections : [],
        components.questions ? questions : [],
        scormItem,
        components.content,
      ).filter((i) => components.questions || i.id !== "ungrouped"),
    [components, sections, questions, scormItem],
  );
  const orderedFlow = useMemo(
    () => orderedFlowItems(flowOrder, flowItems),
    [flowOrder, flowItems],
  );
  const stepKeys = stepKeysFor(components, flowItems.length > 1);
  const stepKey: StepKey = stepKeys[step - 1] ?? "setup";

  const step1Complete =
    title.trim().length > 0 &&
    assessmentType !== "" &&
    (!components.questions ||
      (method !== "" && (method !== "auto" || journey !== "")));

  const questionsStepComplete = useMemo(() => {
    if (method === "upload") return uploadStage === "done";
    if (generating) return false;
    return savedQuestionCount > 0;
  }, [method, uploadStage, generating, savedQuestionCount]);

  const stepComplete =
    stepKey === "setup"
      ? step1Complete
      : stepKey === "questions"
        ? questionsStepComplete
        : stepKey === "content"
          ? scormItem !== null
          : true;

  const stepLabel = `Step ${step} of ${stepKeys.length}`;
  const STEP_TITLES: Record<StepKey, string> = {
    setup: "Assessment Setup",
    questions: "Configure Questions",
    content: "Select Assessment Content",
    flow: "Configure Assessment Flow",
    review: "Review & Save",
  };
  const STEP_DESCRIPTIONS: Record<StepKey, string> = {
    setup: "Name the assessment, choose its type, confirm its settings, and pick how it will be built.",
    questions: "Review and edit the questions for this assessment.",
    content: "Choose the assessment content learners will complete.",
    flow: "Set the order learners experience the components of this assessment.",
    review: "Check everything below, then save the assessment.",
  };
  const stepTitle = STEP_TITLES[stepKey];
  const stepDescription = STEP_DESCRIPTIONS[stepKey];

  const goNext = () => {
    const next = Math.min(stepKeys.length, step + 1);
    setStep(next);
    if (stepKeys[next - 1] === "questions" && method === "auto" && questions.length === 0) {
      runGeneration();
    }
  };

  const goBack = () => setStep((sp) => Math.max(1, sp - 1));

  const moveFlow = (index: number, delta: number) => {
    const ids = reconcileFlowOrder(flowOrder, flowItems);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    setFlowOrder(next);
  };

  const methodTitle = method ? METHOD_OPTIONS[method].title : "";

  const sectionListProps = {
    questions,
    sections,
    newIds: newQuestionIds,
    onChange: updateQuestion,
    onDelete: removeQuestion,
    onCancelNew: cancelNew,
    onMoveQuestion: moveQuestionToSection,
    onAddQuestion: appendBlank,
    onChangeSection: changeSection,
    onDeleteSection: deleteSection,
    onMoveSection: moveSection,
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <DialogTitle>Add assessment</DialogTitle>
              <span className="text-xs text-muted-foreground">
                {stepLabel} · {stepTitle}
              </span>
            </div>
            <DialogDescription>{stepDescription}</DialogDescription>
          </DialogHeader>

          <div
            ref={bodyRef}
            tabIndex={-1}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-6 focus:outline-none"
          >
            {/* ---------------- Step 1: Assessment Setup ---------------- */}
            {stepKey === "setup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="assessment-title" className="text-sm">
                    Assessment title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="assessment-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter assessment title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessment-type" className="text-sm">
                    Assessment Type <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Select the type of assessment. This determines how the assessment is categorised
                    and displayed to learners.
                  </p>
                  <Select
                    value={assessmentType}
                    onValueChange={(v) => {
                      const t = v as AssessmentType;
                      setAssessmentType(t);
                      setComponents(defaultsFor(t).components);
                      setSettings(settingsForType(t, defaultsFor(t).threshold));
                      // Creation methods depend on the type.
                      setMethod("");
                      setJourney("");
                      setScormItem(null);
                      setQuestions([]);
                      setNewQuestionIds(new Set());
                      setUploadStage("empty");
                      setUploadedName("");
                    }}
                  >
                    <SelectTrigger id="assessment-type">
                      <SelectValue placeholder="Select assessment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSESSMENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {assessmentType && (
                    <p className="text-xs text-muted-foreground">
                      {defaultsFor(assessmentType).description}
                    </p>
                  )}
                </div>

                {assessmentType && (
                  <AssessmentSettingsPanel
                    value={settings}
                    onChange={setSettings}
                    defaultOpen
                    assessmentType={assessmentType}
                    components={components}
                    onComponentsChange={(next) => {
                      setComponents(next);
                      setStep(1);
                      setFlowOrder(["questions", "content"]);
                      if (!next.questions) {
                        setMethod("");
                        setJourney("");
                      }
                    }}
                  />
                )}

                {assessmentType && components.questions && (
                  <div className="space-y-3">
                    <Label className="text-sm">
                      {components.content ? "Question Creation Method" : "Creation Method"}
                    </Label>
                    <RadioGroup
                      value={method}
                      onValueChange={(v) => {
                        setMethod(v as Method);
                        setJourney("");
                      }}
                      className="grid gap-3 sm:grid-cols-1"
                    >
                      {availableMethods.map((id) => {
                        const opt = METHOD_OPTIONS[id];
                        const Icon = opt.icon;
                        const selected = method === id;
                        return (
                          <label
                            key={id}
                            htmlFor={`method-${id}`}
                            className={cn(
                              "flex items-start gap-3 rounded-md border p-4 cursor-pointer transition-colors",
                              selected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-muted/40",
                            )}
                          >
                            <RadioGroupItem id={`method-${id}`} value={id} className="mt-1" />
                            <div className="flex items-start gap-3 flex-1">
                              <div className="rounded-md bg-muted p-2">
                                <Icon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-foreground">{opt.title}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {opt.description}
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </div>
                )}

                {method === "auto" && (
                  <div className="space-y-3 rounded-md border border-border p-4">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">Select a journey</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Sage will analyse the content included in the selected journey and generate
                        assessment questions and answers.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="journey-select" className="text-sm">
                        Journey
                      </Label>
                      <Select value={journey} onValueChange={setJourney}>
                        <SelectTrigger id="journey-select">
                          <SelectValue placeholder="Select a journey…" />
                        </SelectTrigger>
                        <SelectContent>
                          {JOURNEY_OPTIONS.map((j) => (
                            <SelectItem key={j} value={j}>
                              {j}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

              </>
            )}

            {/* ---------------- Step 2: Configure Questions / Content ---------------- */}
            {stepKey === "questions" && method === "auto" && (
              <div className="space-y-5">
                {generating ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Sage is generating your assessment questions…
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          Review generated questions
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Sage has generated the following questions based on the selected journey.
                          Review, edit, remove, or add questions before saving.
                        </p>
                      </div>
                      <Badge variant="secondary">{questions.length} Questions</Badge>
                    </div>

                    <SectionedQuestionList {...sectionListProps} />

                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => appendBlank()}>
                        <Plus className="mr-1 h-4 w-4" /> Add question
                      </Button>
                      <Button variant="outline" size="sm" onClick={addSection}>
                        <Plus className="mr-1 h-4 w-4" /> Add Section
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setRegenOpen(true)}>
                        Re-generate questions
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {stepKey === "questions" && method === "manual" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Add questions</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Build your assessment by adding questions and answer options below. At least one
                    question is required.
                  </p>
                </div>

                {questions.length === 0 && sections.length === 0 ? (
                  <div className="rounded-md border border-dashed border-border py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No questions yet. Click 'Add question' to get started.
                    </p>
                  </div>
                ) : (
                  <SectionedQuestionList {...sectionListProps} />
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => appendBlank()}>
                    <Plus className="mr-1 h-4 w-4" /> Add question
                  </Button>
                  <Button variant="outline" size="sm" onClick={addSection}>
                    <Plus className="mr-1 h-4 w-4" /> Add Section
                  </Button>
                </div>
              </div>
            )}

            {stepKey === "questions" && method === "upload" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Upload assessment file</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload a file containing your assessment questions and answers. Supported formats
                    are listed below.
                  </p>
                </div>

                {uploadStage === "empty" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="assessment-file"
                      className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border py-10 cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Drop file here or click to browse
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Accepted formats: QTI (.xml, .zip), CSV (.csv), Excel (.xlsx). Max file size:
                        50MB.
                      </span>
                      <input
                        id="assessment-file"
                        type="file"
                        className="hidden"
                        accept=".xml,.zip,.csv,.xlsx"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) runUploadProcessing(f.name);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                )}

                {uploadStage === "processing" && (
                  <div className="rounded-md border border-dashed border-border py-12 flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Processing file…</p>
                  </div>
                )}

                {uploadStage === "done" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {uploadedName}
                          </div>
                          <div className="text-xs text-muted-foreground">2.4 MB</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadStage("empty");
                          setUploadedName("");
                          setQuestions([]);
                          setNewQuestionIds(new Set());
                        }}
                      >
                        <X className="mr-1 h-4 w-4" /> Remove
                      </Button>
                    </div>
                    <p className="text-sm text-success-dark">
                      File uploaded successfully. {questions.length} questions detected.
                    </p>
                    <SectionedQuestionList {...sectionListProps} />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => appendBlank()}>
                        <Plus className="mr-1 h-4 w-4" /> Add question
                      </Button>
                      <Button variant="outline" size="sm" onClick={addSection}>
                        <Plus className="mr-1 h-4 w-4" /> Add Section
                      </Button>
                    </div>
                  </div>
                )}

                <LeftBorderCard borderVariant="brand">
                  <p className="text-sm text-foreground">
                    Need a template? Download a sample CSV or Excel template to ensure your file is
                    formatted correctly.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => toast("Template download started.")}
                    >
                      Download CSV template
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => toast("Template download started.")}
                    >
                      Download Excel template
                    </Button>
                  </div>
                </LeftBorderCard>
              </div>
            )}

            {stepKey === "content" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Selected content</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This is the assessment content learners will complete.
                  </p>
                </div>
                {scormItem ? (
                  <SelectedContentCard item={scormItem} detailed />
                ) : (
                  <div className="rounded-md border border-dashed border-border py-12 text-center">
                    <p className="text-sm text-muted-foreground">No content selected yet.</p>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                  <Library className="mr-1 h-4 w-4" />
                  {scormItem ? "Replace content" : "Browse Content Library"}
                </Button>
              </div>
            )}

            {/* ---------------- Configure Assessment Flow ---------------- */}
            {stepKey === "flow" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Assessment flow</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Learners complete these components in the order below. Use the arrows to
                    re-order them.
                  </p>
                </div>
                <AssessmentFlowList
                  items={orderedFlow}
                  onMove={moveFlow}
                  onPreview={setPreviewFlowId}
                />
              </div>
            )}

            {stepKey === "review" && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground">Assessment details</h3>
                  <dl className="grid gap-3 sm:grid-cols-3 rounded-md border border-border p-4">
                    <SummaryField label="Assessment title" value={title} />
                    <SummaryField label="Assessment type" value={assessmentType || "—"} />
                    {components.questions && (
                      <SummaryField
                        label={components.content ? "Question Creation Method" : "Creation Method"}
                        value={methodTitle || "—"}
                      />
                    )}
                    {method === "auto" && <SummaryField label="Journey" value={journey || "—"} />}
                    {method === "upload" && (
                      <SummaryField label="Uploaded file" value={uploadedName || "—"} />
                    )}
                  </dl>
                </section>

                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground">Assessment settings</h3>
                  <AssessmentSettingsPanel
                    value={settings}
                    onChange={setSettings}
                    defaultOpen={false}
                    assessmentType={assessmentType || null}
                    components={components}
                  />
                </section>

                <section className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground">Content summary</h3>
                  {orderedFlow.length > 1 && (
                    <div className="mb-4 space-y-2">
                      <div className="text-xs text-muted-foreground">Assessment flow</div>
                      <ol className="list-decimal pl-5 text-sm text-foreground space-y-1">
                        {orderedFlow.map((item) => (
                          <li key={item.id}>{item.title}</li>
                        ))}
                      </ol>
                      {scormItem && components.content && (
                        <SelectedContentCard item={scormItem} detailed />
                      )}
                    </div>
                  )}
                  {!components.questions ? (
                    scormItem ? (
                      <SelectedContentCard item={scormItem} detailed />
                    ) : (
                      <p className="text-sm text-muted-foreground">No content selected.</p>
                    )
                  ) : (
                    <div className="rounded-md border border-border p-4 space-y-2">
                      <Badge variant="secondary">{questions.length} Questions</Badge>
                      <ol className="space-y-2 pt-1">
                        {questions.map((q, i) => (
                          <li key={q.id} className="text-sm text-foreground">
                            <span className="text-muted-foreground">{i + 1}.</span> {q.text || "Untitled question"}
                            <span className="ml-2 text-xs text-muted-foreground">
                              {QUESTION_TYPE_LABEL[q.type]}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-background">
            <div className="flex w-full items-center justify-between gap-2">
              <Button variant="ghost" onClick={goBack} disabled={step === 1}>
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                {stepKey === "review" ? (
                  <Button onClick={saveAssessment}>Save assessment</Button>
                ) : (
                  <Button disabled={!stepComplete} onClick={goNext}>
                    {stepKeys[step] === "review" ? "Review" : "Next"}
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AssessmentContentPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        selectedId={scormItem?.id}
        onSelect={setScormItem}
      />

      <AssessmentFlowPreviewDialog
        open={previewFlowId !== null}
        onOpenChange={(o) => !o && setPreviewFlowId(null)}
        assessmentTitle={title}
        items={orderedFlow}
        sections={sections}
        questions={questions}
        content={scormItem}
        startFlowId={previewFlowId}
      />

      <AlertDialog open={regenOpen} onOpenChange={setRegenOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Re-generate questions?</AlertDialogTitle>
            <AlertDialogDescription>
              Re-generating will replace all current questions. Any edits you have made will be lost.
              Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRegenOpen(false);
                runGeneration();
              }}
            >
              Re-generate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

function SelectedContentCard({
  item,
  detailed = false,
}: {
  item: LibraryContentItem;
  detailed?: boolean;
}) {
  const Icon = item.type === "Role-Play" ? Users : MonitorPlay;
  return (
    <div className="flex items-start gap-3 rounded-md border border-border p-4">
      <span className="mt-0.5 shrink-0 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{item.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{item.type}</Badge>
          <span>{item.durationMin} min</span>
          <span>·</span>
          <span>{item.topic}</span>
          {detailed && (
            <>
              <span>·</span>
              <span>{item.status}</span>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
}

