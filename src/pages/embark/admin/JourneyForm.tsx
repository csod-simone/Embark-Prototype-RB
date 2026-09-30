import { SageTag } from "@/components/embark/SageTag";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AddAssessmentDialog,
  AddCurriculumDialog,
  AddEventDialog,
  AddRolePlayDialog,
} from "./journeys/AddCurriculumDialog";
import { AiGenerateJourneyDialog } from "./journeys/AiGenerateJourneyDialog";
import {
  DEFAULT_SETTINGS,
  findAssessment,
  findCurriculum,
  findEvent,
  findRoleplay,
  type JourneyItem,
  type Journey,
  type JourneySettings,
  type JourneyStatus,
  type LineOfBusiness,
} from "./journeys/data";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import {
  AttemptsOverridePopover,
  attemptsLabel,
  defaultAttempts,
  type AttemptsValue,
} from "@/components/embark/AttemptsAllowed";
import { useOrganisation } from "@/hooks/use-organisation";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  initial?: Journey;
  heading: string;
  subLabel: string;
  breadcrumbCurrent: string;
  showAiGenerate?: boolean;
};

type FormState = {
  name: string;
  description: string;
  lineOfBusiness: LineOfBusiness[];
  status: JourneyStatus;
  tags: string[];
  items: JourneyItem[];
  settings: JourneySettings;
};

function toItems(ids: string[]): JourneyItem[] {
  return ids.map((id) => ({ type: "curriculum" as const, id }));
}

function buildInitial(initial?: Journey): FormState {
  return {
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    lineOfBusiness: initial?.lineOfBusiness ?? [],
    status: initial?.status ?? "draft",
    tags: initial?.tags ?? [],
    items: toItems(initial?.curriculaIds ?? []),
    settings: initial?.settings ?? { ...DEFAULT_SETTINGS },
  };
}

const AI_STUB: FormState = {
  name: "Investment Manager New Hire Onboarding Journey",
  description:
    "A structured onboarding journey for a new Investment Manager. Covers client relationships, discovery, suitability, and the file note.",
  lineOfBusiness: ["Medicare"],
  status: "draft",
  tags: ["Investment Management", "Onboarding", "Investment Manager"],
  items: [
    { type: "curriculum", id: "cur-new-hire-foundations" },
    { type: "curriculum", id: "cur-csr-week-1" },
    { type: "curriculum", id: "cur-compliance-refresher" },
  ],
  settings: {
    completionRule: "all",
    progression: "sequential",
    durationDays: 30,
    allowRestart: false,
    awardCertificate: true,
    notifyAdmin: true,
  },
};

/** Nexus (technology company) equivalent of the generated draft. */
const AI_STUB_NEXUS: FormState = {
  name: "New Engineer Onboarding Journey",
  description:
    "A structured 90-day onboarding journey for new software engineers at Nexus. Covers the Nexus tech stack, engineering standards, security and compliance, and ways of working — designed to bring new hires to their first independent delivery.",
  lineOfBusiness: ["Aetna"],
  status: "draft",
  tags: ["Engineering", "Onboarding", "New Hire", "Software Engineer", "90-Day"],
  items: [
    { type: "curriculum", id: "cur-new-hire-foundations" },
    { type: "curriculum", id: "cur-csr-week-1" },
    { type: "curriculum", id: "cur-compliance-refresher" },
  ],
  settings: {
    completionRule: "all",
    progression: "sequential",
    durationDays: 90,
    allowRestart: false,
    awardCertificate: true,
    notifyAdmin: true,
  },
};

function EditedLabel() {
  return (
    <span className="ml-2 text-[10px] tracking-wide text-muted-foreground font-medium">
      Edited
    </span>
  );
}

function SageNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3">
      <SageTag className="shrink-0 mt-0.5" />
      <p className="text-sm text-foreground">{children}</p>
    </div>
  );
}

export default function JourneyForm({
  mode,
  initial,
  heading,
  subLabel,
  breadcrumbCurrent,
  showAiGenerate = false,
}: Props) {
  const navigate = useNavigate();
  const originalRef = useMemo(() => JSON.stringify(buildInitial(initial)), [initial]);
  const [form, setForm] = useState<FormState>(() => buildInitial(initial));
  const [tagInput, setTagInput] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addRoleplayOpen, setAddRoleplayOpen] = useState(false);
  const [addAssessmentOpen, setAddAssessmentOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [attemptsByAssessment, setAttemptsByAssessment] = useState<Record<string, AttemptsValue>>({});
  const [leaveOpen, setLeaveOpen] = useState(false);

  // Role-play configuration (prototype-local; not persisted in Journey model)
  const [rpEnabled, setRpEnabled] = useState(true);
  const [rpInputMode, setRpInputMode] = useState<"voice" | "text" | "choice">("choice");
  const [rpScoringMode, setRpScoringMode] = useState<"practice" | "assessment">("practice");
  const [rpPassThreshold, setRpPassThreshold] = useState(70);
  const [rpMaxAttempts, setRpMaxAttempts] = useState(3);
  const [rpCooldownValue, setRpCooldownValue] = useState(24);
  const [rpCooldownUnit, setRpCooldownUnit] = useState<"hours" | "business_days">("hours");
  const [rpNotifyOnFailure, setRpNotifyOnFailure] = useState(true);
  const [rpNotifyOnEscalation, setRpNotifyOnEscalation] = useState(true);

  const [aiOpen, setAiOpen] = useState(false);
  const { org } = useOrganisation();
  const [generating, setGenerating] = useState(false);
  const [wasGenerated, setWasGenerated] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    setForm(buildInitial(initial));
  }, [initial]);

  const dirty = JSON.stringify(form) !== originalRef;

  const markEdited = (key: string) => {
    if (!wasGenerated) return;
    setEditedFields((prev) => {
      if (prev.has(key)) return prev;
      const n = new Set(prev);
      n.add(key);
      return n;
    });
  };

  const isEdited = (key: string) => wasGenerated && editedFields.has(key);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    markEdited(key as string);
  };

  const setSetting = <K extends keyof JourneySettings>(key: K, value: JourneySettings[K]) => {
    setForm((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
    markEdited(`settings.${String(key)}`);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || form.tags.includes(t)) {
      setTagInput("");
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    markEdited("tags");
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));
    markEdited("tags");
  };

  const addItems = (type: JourneyItem["type"], ids: string[]) => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        ...ids
          .filter((id) => !prev.items.some((i) => i.type === type && i.id === id))
          .map((id) => ({ type, id })),
      ],
    }));
    markEdited("items");
  };
  const removeItem = (type: JourneyItem["type"], id: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => !(i.type === type && i.id === id)),
    }));
    markEdited("items");
    toast(
      type === "curriculum"
        ? "Path removed from journey."
        : type === "roleplay"
          ? "Role-play removed from journey."
          : type === "event"
            ? "Event removed from journey."
            : "Assessment removed from journey.",
    );
  };
  const move = (idx: number, dir: -1 | 1) => {
    setForm((prev) => {
      const next = [...prev.items];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return prev;
      [next[idx], next[to]] = [next[to], next[idx]];
      return { ...prev, items: next };
    });
    markEdited("items");
  };

  const handleCancel = () => {
    if (dirty) setLeaveOpen(true);
    else navigate("/admin/journeys");
  };

  const handleSaveDraft = () => {
    toast.success("Journey saved as draft.");
    navigate("/admin/journeys");
  };

  const handleSubmit = () => {
    if (mode === "create") {
      toast.success("Journey created successfully.");
    } else {
      toast.success("Journey updated successfully.");
    }
    navigate("/admin/journeys");
  };

  const handleGenerate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      const stub = org === "nexus" ? AI_STUB_NEXUS : AI_STUB;
      setForm({
        ...stub,
        settings: { ...stub.settings },
        lineOfBusiness: [...stub.lineOfBusiness],
        tags: [...stub.tags],
        items: stub.items.map((i) => ({ ...i })),
      });
      setEditedFields(new Set());
      setWasGenerated(true);
      setBannerVisible(true);
      setGenerating(false);
    }, 2000);
  };

  const createDisabled =
    mode === "create" && (form.name.trim().length === 0 || form.items.length === 0);
  const showMinimum = form.settings.completionRule === "minimum";

  return (
    <>
      <PageContainer as="div" className="py-6 pb-32 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/admin/journeys">Admin</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/admin/journeys">Journeys</Link></BreadcrumbLink>
            </BreadcrumbItem>
            {mode === "edit" && initial && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/admin/journeys/${initial.id}`}>{initial.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumbCurrent}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/journeys")} className="w-fit">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Journeys
        </Button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-foreground">{heading}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subLabel}</p>
          </div>
          {showAiGenerate && (
            <Button
              variant="secondary"
              onClick={() => setAiOpen(true)}
              disabled={generating}
              className="shrink-0"
            >
              <Sparkles className="mr-1 h-4 w-4" />
              AI Generate Journey
            </Button>
          )}
        </div>

        <div className="relative">
          {generating && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-md bg-background/70 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">Sage is building your journey…</p>
              <p className="text-sm text-muted-foreground">This will only take a moment.</p>
            </div>
          )}

          <div className={generating ? "space-y-6 pointer-events-none select-none opacity-60" : "space-y-6"} aria-hidden={generating}>
            {bannerVisible && (
              <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3">
                <SageTag className="shrink-0 mt-0.5" />
                <p className="text-sm text-foreground flex-1">
                  Sage has generated your journey based on your description. Review all fields
                  below and make any edits before saving.
                </p>
                <button
                  type="button"
                  onClick={() => setBannerVisible(false)}
                  aria-label="Dismiss"
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Section 1: Journey Details */}
            <Card className="p-6 space-y-5">
              <h2 className="text-base font-semibold text-foreground">Journey Details</h2>

              <div className="space-y-1.5">
                <Label htmlFor="journey-name">
                  Journey Name<span className="text-destructive ml-0.5">*</span>
                  {isEdited("name") && <EditedLabel />}
                </Label>
                <Input
                  id="journey-name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Enter journey name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="journey-desc">
                  Description
                  {isEdited("description") && <EditedLabel />}
                </Label>
                <Textarea
                  id="journey-desc"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Describe the purpose and learning objectives of this journey…"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Status
                  {isEdited("status") && <EditedLabel />}
                </Label>
                <RadioGroup
                  value={form.status}
                  onValueChange={(v) => setField("status", v as JourneyStatus)}
                  className="flex gap-6"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="draft" id="status-draft" />
                    <span className="text-sm">Draft</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="active" id="status-active" />
                    <span className="text-sm">Active</span>
                  </label>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">Set to Active when the journey is ready to be assigned to cohorts.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="journey-tags">
                  Tags
                  {isEdited("tags") && <EditedLabel />}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="journey-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tags…"
                  />
                  <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="gap-1">
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          aria-label={`Remove ${t}`}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Tags help with search and filtering.</p>
              </div>
            </Card>

            {/* Section 2: Journey Structure */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-foreground">
                  Journey Structure
                  {isEdited("items") && <EditedLabel />}
                </h2>
                <Badge variant="secondary">
                  {form.items.length} {form.items.length === 1 ? "Item" : "Items"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Add paths, role-plays, assessments, and events to this journey. Reorder — the sequence defines the order learners will progress through the items.
              </p>

              {form.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-10 text-center">
                  <Layers className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-foreground">No items added yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Add at least one content item to build this journey.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Button variant="secondary" onClick={() => setAddOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Path
                    </Button>
                    <Button variant="secondary" onClick={() => setAddRoleplayOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Role-Play
                    </Button>
                    <Button variant="secondary" onClick={() => setAddAssessmentOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Assessment
                    </Button>
                    <Button variant="secondary" onClick={() => setAddEventOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {form.items.map((item, idx) => {
                      const c = item.type === "curriculum" ? findCurriculum(item.id) : undefined;
                      const simple =
                        item.type === "roleplay"
                          ? findRoleplay(item.id)
                          : item.type === "assessment"
                            ? findAssessment(item.id)
                            : item.type === "event"
                              ? findEvent(item.id)
                              : undefined;
                      const name = c?.name ?? simple?.name;
                      const status = c?.status ?? simple?.status;
                      const meta = c
                        ? `${c.contentCount} content items · ${c.estimatedDuration}`
                        : simple?.meta;
                      if (!name) return null;
                      const attempts =
                        item.type === "assessment"
                          ? attemptsByAssessment[item.id] ?? defaultAttempts
                          : null;
                      return (
                        <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                          <div className="flex flex-col">
                            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="Move up">
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => move(idx, 1)} disabled={idx === form.items.length - 1} aria-label="Move down">
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground w-6 text-center shrink-0">{idx + 1}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground truncate">{name}</span>
                              {item.type === "curriculum" ? (
                                <Badge variant="outline">Path</Badge>
                              ) : item.type === "roleplay" ? (
                                <Badge variant="warning">Role-Play</Badge>
                              ) : item.type === "event" ? (
                                <Badge variant="outline">Event</Badge>
                              ) : (
                                <Badge variant="success">Assessment</Badge>
                              )}
                              {status === "active" ? <Badge variant="success">Active</Badge> : status === "draft" ? <Badge variant="secondary">Draft</Badge> : <Badge variant="warning">Inactive</Badge>}
                              {attempts && <Badge variant="outline">{attemptsLabel(attempts)}</Badge>}
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {meta}
                            </div>
                          </div>
                          {attempts && (
                            <AttemptsOverridePopover
                              idPrefix={`journey-attempts-${item.id}`}
                              itemName={name}
                              value={attempts}
                              helperText="Overrides the assessment's default setting for this journey only."
                              onSave={(next) => {
                                setAttemptsByAssessment((prev) => ({ ...prev, [item.id]: next }));
                                markEdited("items");
                              }}
                            />
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(item.type, item.id)}
                            aria-label={`Remove ${name}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => setAddOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Path
                    </Button>
                    <Button variant="secondary" onClick={() => setAddRoleplayOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Role-Play
                    </Button>
                    <Button variant="secondary" onClick={() => setAddAssessmentOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Assessment
                    </Button>
                    <Button variant="secondary" onClick={() => setAddEventOpen(true)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                </>
              )}

              {wasGenerated && (
                <SageNote>
                  I've sequenced these paths to build client-relationship foundations first, then discretionary portfolio work, and close with conduct — the progression a new Investment Manager needs before advising.
                </SageNote>
              )}
            </Card>

            {/* Section 3: Journey Settings */}
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Journey Settings</h2>
                <p className="mt-1 text-xs text-muted-foreground">Configure how learners experience and progress through this journey.</p>
              </div>

              <div className="space-y-2">
                <Label>
                  Completion Rule
                  {isEdited("settings.completionRule") && <EditedLabel />}
                </Label>
                <RadioGroup
                  value={form.settings.completionRule}
                  onValueChange={(v) => setSetting("completionRule", v as "all" | "minimum")}
                  className="space-y-2"
                >
                  <label className="flex items-start gap-2 cursor-pointer">
                    <RadioGroupItem value="all" id="cr-all" className="mt-0.5" />
                    <div>
                      <div className="text-sm text-foreground">Complete all items</div>
                      <div className="text-xs text-muted-foreground">Learners must complete every content item in the journey to receive a completion.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <RadioGroupItem value="minimum" id="cr-min" className="mt-0.5" />
                    <div>
                      <div className="text-sm text-foreground">Complete a minimum number of items</div>
                      <div className="text-xs text-muted-foreground">Learners must complete a set number of content items to receive a completion.</div>
                    </div>
                  </label>
                </RadioGroup>
                {showMinimum && (
                  <div className="pl-6 pt-2 space-y-1.5 max-w-xs">
                    <Label htmlFor="min-count" className="text-xs text-muted-foreground">Minimum items to complete</Label>
                    <Input
                      id="min-count"
                      type="number"
                      min={1}
                      value={form.settings.minimumCurricula ?? ""}
                      onChange={(e) => setSetting("minimumCurricula", Number(e.target.value) || undefined)}
                    />
                    <p className="text-xs text-muted-foreground">Must not exceed the total number of items in the journey.</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Item Progression
                  {isEdited("settings.progression") && <EditedLabel />}
                </Label>
                <RadioGroup
                  value={form.settings.progression}
                  onValueChange={(v) => setSetting("progression", v as "sequential" | "open")}
                  className="space-y-2"
                >
                  <label className="flex items-start gap-2 cursor-pointer">
                    <RadioGroupItem value="sequential" id="prog-seq" className="mt-0.5" />
                    <div>
                      <div className="text-sm text-foreground">Sequential</div>
                      <div className="text-xs text-muted-foreground">Learners must complete each content item in order before accessing the next.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <RadioGroupItem value="open" id="prog-open" className="mt-0.5" />
                    <div>
                      <div className="text-sm text-foreground">Open</div>
                      <div className="text-xs text-muted-foreground">Learners can access and complete content items in any order.</div>
                    </div>
                  </label>
              </RadioGroup>
              </div>

              <ToggleRow

                label="Allow Learners to Restart Completed Items"
                helper="When enabled, learners can revisit and retake completed content items within the journey."
                checked={form.settings.allowRestart}
                onChange={(v) => setSetting("allowRestart", v)}
                edited={isEdited("settings.allowRestart")}
              />
              <ToggleRow
                label="Award Completion Certificate"
                helper="When enabled, learners receive a completion certificate when they finish the journey."
                checked={form.settings.awardCertificate}
                onChange={(v) => setSetting("awardCertificate", v)}
                edited={isEdited("settings.awardCertificate")}
              />
              <ToggleRow
                label="Send Completion Notification to Admin"
                helper="Admins will be notified when a learner completes this journey."
                checked={form.settings.notifyAdmin}
                onChange={(v) => setSetting("notifyAdmin", v)}
                edited={isEdited("settings.notifyAdmin")}
              />

              {wasGenerated && (
                <SageNote>
                  I've set sequential progression and a 30-day window based on your description.
                  The completion certificate is enabled — new hire onboarding journeys typically
                  benefit from a formal completion record. Adjust any of these to match your
                  organisation's policies.
                </SageNote>
              )}
            </Card>

            {/* Section 4: Role-Play Configuration */}
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">Role-Play Configuration</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Configure how role-play practice is delivered within this journey. Settings apply to all role-plays in this journey.
                </p>
              </div>

              <ToggleRow
                label="Enable Role-Play"
                helper="When enabled, learners will be offered role-play practice at the appropriate point in their journey."
                checked={rpEnabled}
                onChange={setRpEnabled}
              />

              <div className="space-y-2">
                <Label>Input Mode</Label>
                <RadioGroup
                  value={rpInputMode}
                  onValueChange={(v) => setRpInputMode(v as "voice" | "text" | "choice")}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="voice" id="rp-input-voice" />
                    <span className="text-sm">Voice only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="text" id="rp-input-text" />
                    <span className="text-sm">Text only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="choice" id="rp-input-choice" />
                    <span className="text-sm">Learner's choice</span>
                  </label>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Controls whether learners can use voice, text, or choose either when responding during role-play.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Scoring Mode</Label>
                <RadioGroup
                  value={rpScoringMode}
                  onValueChange={(v) => setRpScoringMode(v as "practice" | "assessment")}
                  className="space-y-2"
                >
                  <label className="flex items-start gap-2 cursor-pointer">
                    <RadioGroupItem value="practice" id="rp-sm-practice" className="mt-0.5" />
                    <div>
                      <div className="text-sm text-foreground">Practice (Formative)</div>
                      <div className="text-xs text-muted-foreground">
                        Score and feedback guide the learner but never block progression. Real-time signals and in-session coaching are available. Unlimited retries.
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <RadioGroupItem value="assessment" id="rp-sm-assessment" className="mt-0.5" />
                    <div>
                      <div className="text-sm text-foreground">Assessment (Gated)</div>
                      <div className="text-xs text-muted-foreground">
                        In-session coaching and real-time signals are disabled. Learner must meet the advancement threshold to advance. Attempts are limited.
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {rpScoringMode === "assessment" && (
                <div className="space-y-5 pl-6 border-l-2 border-border">
                  <div className="space-y-1.5 max-w-xs">
                    <Label htmlFor="rp-pass">Advancement Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="rp-pass"
                        type="number"
                        min={1}
                        max={100}
                        value={rpPassThreshold}
                        onChange={(e) => setRpPassThreshold(Number(e.target.value) || 0)}
                      />
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Learners must score at or above this threshold to advance past the role-play in assessment mode.
                    </p>
                  </div>

                  <div className="space-y-1.5 max-w-xs">
                    <Label htmlFor="rp-max">Maximum Attempts</Label>
                    <Input
                      id="rp-max"
                      type="number"
                      min={1}
                      max={10}
                      value={rpMaxAttempts}
                      onChange={(e) => setRpMaxAttempts(Number(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The number of attempts a learner may make before a cooldown period or manager review is triggered.
                    </p>
                  </div>

                  <div className="space-y-1.5 max-w-md">
                    <Label htmlFor="rp-cooldown">Cooldown Period Between Attempts</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="rp-cooldown"
                        type="number"
                        min={0}
                        value={rpCooldownValue}
                        onChange={(e) => setRpCooldownValue(Number(e.target.value) || 0)}
                        className="max-w-[120px]"
                      />
                      <Select
                        value={rpCooldownUnit}
                        onValueChange={(v) => setRpCooldownUnit(v as "hours" | "business_days")}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="business_days">Business Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The minimum wait time between role-play attempts in assessment mode. Set to 0 to allow immediate retries.
                    </p>
                  </div>
                </div>
              )}

              <ToggleRow
                label="Notify Manager When Learner Fails"
                helper="When enabled, the learner's manager will be notified if the learner does not advance past a gated role-play within the allowed attempts."
                checked={rpNotifyOnFailure}
                onChange={setRpNotifyOnFailure}
              />
              <ToggleRow
                label="Notify Manager on Serious Escalation"
                helper="When enabled, the learner's manager will be notified immediately if a serious escalation event is detected during a role-play interaction."
                checked={rpNotifyOnEscalation}
                onChange={setRpNotifyOnEscalation}
              />
            </Card>
          </div>
        </div>
      </PageContainer>

      {/* Sticky footer */}
      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur px-6 py-3">
        <div className="flex items-center justify-end gap-2">
          {mode === "create" && (
            <Button variant="secondary" onClick={handleSaveDraft} disabled={generating}>Save as Draft</Button>
          )}
          <Button variant="ghost" onClick={handleCancel} disabled={generating}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={createDisabled || generating}>
            {mode === "create" ? "Create Journey" : "Save Changes"}
          </Button>
        </div>
      </div>

      <AddRolePlayDialog
        open={addRoleplayOpen}
        onOpenChange={setAddRoleplayOpen}
        alreadyAdded={form.items.filter((i) => i.type === "roleplay").map((i) => i.id)}
        onAdd={(ids) => addItems("roleplay", ids)}
      />
      <AddEventDialog
        open={addEventOpen}
        onOpenChange={setAddEventOpen}
        alreadyAdded={form.items.filter((i) => i.type === "event").map((i) => i.id)}
        onAdd={(ids) => addItems("event", ids)}
      />
      <AddAssessmentDialog
        open={addAssessmentOpen}
        onOpenChange={setAddAssessmentOpen}
        alreadyAdded={form.items.filter((i) => i.type === "assessment").map((i) => i.id)}
        onAdd={(ids) => addItems("assessment", ids)}
      />
      <AddCurriculumDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        alreadyAdded={form.items.filter((i) => i.type === "curriculum").map((i) => i.id)}
        onAdd={(ids) => addItems("curriculum", ids)}
      />

      <AiGenerateJourneyDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        onGenerate={handleGenerate}
      />

      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
            <AlertDialogDescription>You have unsaved changes. Are you sure you want to leave?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/admin/journeys")}>Leave Without Saving</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ToggleRow({
  label,
  helper,
  checked,
  onChange,
  edited,
}: {
  label: string;
  helper: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  edited?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <Label className="text-sm text-foreground">
          {label}
          {edited && <EditedLabel />}
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
