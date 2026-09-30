import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { ChevronLeft, FileText, Plus, Trash2, Upload } from "lucide-react";
import { BreadcrumbBar } from "@/components/embark/BreadcrumbBar";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { ChipInput } from "@/components/embark/ChipInput";
import { ContentCategoryFields } from "@/components/embark/admin/ContentCategoryFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCornerstoneIntegration } from "@/hooks/use-cornerstone-integration";
import { CONTENT, LineOfBusinessField, type ContentItem } from "./Content";
import { VersionMarkers } from "@/components/embark/admin/ContentVersionDetails";
import {
  VERSIONED_PATH_NAME,
  contentVersionsNewestFirst,
  currentContentVersion,
  formatVersionDate,
  isVersionedContent,
} from "@/data/contentVersioning";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { emptyContentCategories, type ContentCategorySelection } from "@/data/contentCategories";

const CONTENT_TYPE_OPTIONS = ["eLearning", "Assessment", "Video", "Document", "SCORM", "Role Play", "URL"];

type RubricSkill = { id: string; name: string; weight: number };

const DEFAULT_RUBRIC: RubricSkill[] = [
  { id: "s1", name: "Active Listening", weight: 25 },
  { id: "s2", name: "Objection Handling", weight: 25 },
  { id: "s3", name: "Product Knowledge", weight: 25 },
  { id: "s4", name: "Compliance Boundaries", weight: 25 },
];

type EnrichedItem = ContentItem & {
  status: "Active" | "Inactive";
  description: string;
  duration: string;
  linesOfBusiness: string[];
  tags: string[];
  fileName: string;
  fileSize: string;
  curriculaUsedIn: string[];
  completions: number;
  contentTypeLabel: string;
  // Cornerstone-specific
  csContentId: string;
  version: string;
  csLastUpdated: string;
};

const CURRICULA_BY_CONTENT: Record<string, string[]> = {
  m1: ["Medicare CSR Onboarding Curriculum"],
  m2: ["Medicare CSR Onboarding Curriculum"],
  m6: ["Medicare CSR Onboarding Curriculum", "Compliance Refresher Curriculum"],
  m9: [
    "Medicare CSR Onboarding Curriculum",
    "New Hire Foundations Curriculum",
    "Compliance Refresher Curriculum",
  ],
  m11: ["Medicare CSR Onboarding Curriculum"],
  n1: ["New Hire Foundations Curriculum"],
};

function typeToLabel(t: ContentItem["type"]): string {
  if (t === "article") return "eLearning";
  if (t === "assessment") return "Assessment";
  return "Document";
}

function enrich(item: ContentItem): EnrichedItem {
  if (isVersionedContent(item.id)) {
    const current = currentContentVersion();
    return {
      ...item,
      status: "Active",
      description: current.body,
      duration: "15",
      linesOfBusiness: ["Medicare Advantage"],
      tags: ["versioned"],
      fileName: `suitability-file-standards-${current.id}.pdf`,
      fileSize: "180 KB",
      curriculaUsedIn: [VERSIONED_PATH_NAME],
      completions: 2,
      contentTypeLabel: typeToLabel(item.type),
      csContentId: "CSL-SF-002",
      version: current.id,
      csLastUpdated: formatVersionDate(current.publishedAt),
    };
  }
  const curricula = CURRICULA_BY_CONTENT[item.id] ?? [];
  const completions =
    item.avgScore !== undefined ? 128 : item.lastUsed ? 42 : 0;
  return {
    ...item,
    status: "Active",
    description: `${item.title} — an overview module for CSR agents covering the key concepts, workflows, and edge cases they will encounter in this area.`,
    duration: item.type === "assessment" ? "20" : item.type === "resource" ? "10" : "30",
    linesOfBusiness: ["Medicare Advantage"],
    tags: item.flagged ? ["needs-review"] : [],
    fileName: item.type === "assessment" ? `${item.id}-assessment.zip` : item.type === "resource" ? `${item.id}-handbook.pdf` : `${item.id}-article.pdf`,
    fileSize: item.type === "assessment" ? "2.4 MB" : "480 KB",
    curriculaUsedIn: curricula,
    completions,
    contentTypeLabel: typeToLabel(item.type),
    csContentId: `CSL-0${400 + parseInt(item.id.replace(/\D/g, "") || "0", 10)}`,
    version: "v2.3",
    csLastUpdated: "12 Jun 2025",
  };
}

export default function ContentEditor() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const { enabled: integrationEnabled } = useCornerstoneIntegration();

  const raw = useMemo(() => CONTENT.find((c) => c.id === contentId), [contentId]);

  if (!raw) {
    return (
      <>
        <PageContainer as="div" className="py-6 space-y-4">
          <p className="text-sm text-muted-foreground">Content not found.</p>
          <Button variant="ghost" onClick={() => navigate("/admin/content")}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Content Library
          </Button>
        </PageContainer>
      </>
    );
  }

  const item = enrich(raw);

  const subLabel = integrationEnabled
    ? "View content details from Cornerstone Learn and manage Embark-specific settings."
    : "Manage this content item — update details, upload a new version, or remove it from the library.";

  return (
    <>
      <PageContainer as="div" className="py-6 space-y-6">
        <BreadcrumbBar
          items={[
            { label: "Admin", href: "/admin/content" },
            { label: "Content Library", href: "/admin/content" },
            { label: item.title, href: "/admin/content" },
            { label: "Edit" },
          ]}
        />

        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2"
          onClick={() => navigate("/admin/content")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Content Library
        </Button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{subLabel}</p>
          </div>
          <Badge variant={item.status === "Active" ? "success" : "secondary"}>
            {item.status}
          </Badge>
        </div>

        {isVersionedContent(item.id) && (
          <section className="rounded-md border border-border bg-background p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">Version {item.version}</h3>
              <Badge variant="success">Current</Badge>
              <VersionMarkers scope="content" />
            </div>
            <p className="text-sm text-muted-foreground">
              Published {item.csLastUpdated} by {currentContentVersion().publishedBy}. {currentContentVersion().summary} {contentVersionsNewestFirst().length} versions are on record.
            </p>
            <p className="text-sm text-foreground">{item.description}</p>
          </section>
        )}

        {integrationEnabled ? (
          <HybridMode item={item} onCancel={() => navigate("/admin/content")} />
        ) : (
          <FullEditMode
            item={item}
            onCancel={() => navigate("/admin/content")}
            onDeleted={() => navigate("/admin/content")}
          />
        )}
      </PageContainer>
    </>
  );
}

function SectionHeader({ title, chip }: { title: string; chip?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {chip && <Badge variant="secondary">{chip}</Badge>}
    </div>
  );
}

function UsageSection({ item }: { item: EnrichedItem }) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">Usage</h3>
      <div className="rounded-md border border-border bg-background p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs tracking-wide text-muted-foreground">
            Used in curricula
          </span>
          <div className="text-sm text-right max-w-[70%]">
            {item.curriculaUsedIn.length === 0 ? (
              <span className="text-muted-foreground italic">
                Not currently used in any curriculum
              </span>
            ) : (
              <div className="flex flex-wrap gap-1 justify-end">
                {item.curriculaUsedIn.map((c) => (
                  <Badge key={c} variant="secondary">{c}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs tracking-wide text-muted-foreground">Last used</span>
          <span className="text-sm text-foreground">
            {item.lastUsed ? format(new Date(item.lastUsed), "d MMM yyyy") : "—"}
          </span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-xs tracking-wide text-muted-foreground">
            Total learner completions
          </span>
          <span className="text-sm text-foreground">{item.completions}</span>
        </div>
      </div>
    </section>
  );
}

function FullEditMode({
  item,
  onCancel,
  onDeleted,
}: {
  item: EnrichedItem;
  onCancel: () => void;
  onDeleted: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [type, setType] = useState(item.contentTypeLabel);
  const [lob, setLob] = useState<string[]>(item.linesOfBusiness);
  const [duration, setDuration] = useState(item.duration);
  const [tags, setTags] = useState<string[]>(item.tags);
  const [categories, setCategories] = useState<ContentCategorySelection>(emptyContentCategories);
  const [replacing, setReplacing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState(item.fileName);
  const [externalUrl, setExternalUrl] = useState("");

  // Role-play specific fields
  const [personaName, setPersonaName] = useState("");
  const [scenarioContext, setScenarioContext] = useState("");
  const [learnerObjective, setLearnerObjective] = useState("");
  const [rubric, setRubric] = useState<RubricSkill[]>(DEFAULT_RUBRIC);
  const isRolePlay = type === "Role Play";
  const totalWeight = rubric.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
  const weightValid = totalWeight === 100;
  let nextSkillId = rubric.length;
  const addSkill = () => {
    nextSkillId += 1;
    setRubric([...rubric, { id: `s-new-${nextSkillId}-${Date.now()}`, name: "", weight: 0 }]);
  };
  const removeSkill = (id: string) => setRubric(rubric.filter((r) => r.id !== id));
  const updateSkill = (id: string, patch: Partial<RubricSkill>) =>
    setRubric(rubric.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isUsed =
    !!item.lastUsed || item.completions > 0 || item.curriculaUsedIn.length > 0;
  const inCurricula = item.curriculaUsedIn.length > 0;

  const handleSave = () => {
    toast.success("Content updated successfully.");
  };

  const handleDeactivate = () => {
    setDeactivateOpen(false);
    if (inCurricula) {
      toast.warning(
        `${item.title} has been deactivated and removed from ${item.curriculaUsedIn.length} curricula.`,
      );
    } else {
      toast.success(`${item.title} has been deactivated.`);
    }
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    toast.error(`${item.title} has been permanently deleted.`);
    onDeleted();
  };

  return (
    <>
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Content Details</h3>
        <div className="space-y-4 rounded-md border border-border bg-background p-4">
          <div>
            <Label className="text-sm font-medium text-foreground">Content Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Content Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Enter a brief description of this content item"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Duration (minutes)</Label>
            <Input
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 30"
              className="mt-1"
            />
          </div>
          <div>
            <LineOfBusinessField value={lob} onChange={setLob} />
            <p className="mt-1 text-xs text-muted-foreground">
              Select all lines of business this content applies to.
            </p>
          </div>
          <ContentCategoryFields value={categories} onChange={setCategories} />
          <div>
            <Label className="text-sm font-medium text-foreground">Tags</Label>
            <div className="mt-1">
              <ChipInput
                chips={tags}
                onAdd={(v) => setTags([...tags, v])}
                onRemove={(i) => setTags(tags.filter((_, idx) => idx !== i))}
                placeholder="Add tags…"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tags help with search and filtering in the Content Library.
            </p>
          </div>
        </div>
      </section>

      {isRolePlay && (
        <>
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Scenario Details</h3>
            <div className="space-y-4 rounded-md border border-border bg-background p-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Persona Name</Label>
                <Input
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  placeholder="e.g. Margaret — skeptical Medicare prospect"
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  The name and one-line description of the character the learner will interact with.
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Scenario Context</Label>
                <Textarea
                  value={scenarioContext}
                  onChange={(e) => setScenarioContext(e.target.value)}
                  rows={3}
                  placeholder="e.g. Margaret is a 68-year-old retiree comparing Medicare Advantage plans. She is price-sensitive and has had negative experiences with insurance companies in the past."
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Describe the situation the learner is entering. This is shown to the learner on the framing screen before they begin.
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Learner Objective</Label>
                <Input
                  value={learnerObjective}
                  onChange={(e) => setLearnerObjective(e.target.value)}
                  placeholder="e.g. Address Margaret's cost concerns and guide her toward scheduling a follow-up consultation."
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  A single clear objective shown to the learner on the framing screen.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Assessment Rubric</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Define the skills that will be assessed during this role-play. Learners are scored against these skills after each interaction.
              </p>
            </div>
            <div className="space-y-3 rounded-md border border-border bg-background p-4">
              {rubric.map((s) => (
                <div key={s.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Skill Name</Label>
                    <Input
                      value={s.name}
                      onChange={(e) => updateSkill(s.id, { name: e.target.value })}
                      placeholder="e.g. Objection Handling"
                      className="mt-1"
                    />
                  </div>
                  <div className="w-28">
                    <Label className="text-xs text-muted-foreground">Weight (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={s.weight}
                      onChange={(e) => updateSkill(s.id, { weight: Number(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${s.name || "skill"}`}
                    onClick={() => removeSkill(s.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Weights across all skills must total 100%.
              </p>
              <div className="flex items-center justify-between gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-1" /> Add Skill
                </Button>
                <span
                  className={`text-xs font-medium ${weightValid ? "text-success-dark" : "text-destructive"}`}
                >
                  Total weight: {totalWeight}% {weightValid ? "" : "— must equal 100%"}
                </span>
              </div>
            </div>
          </section>
        </>
      )}


      {type === "URL" ? (
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">External URL</h3>
          <div className="rounded-md border border-border bg-background p-4">
            <Label className="text-sm font-medium text-foreground" htmlFor="edit-content-url">
              External URL
            </Label>
            <Input
              id="edit-content-url"
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://"
              className="mt-1"
            />
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Content File</h3>
          <div className="rounded-md border border-border bg-background p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{fileName}</div>
                  <div className="text-xs text-muted-foreground">{item.fileSize}</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setReplacing((r) => !r)}>
                Replace File
              </Button>
            </div>
            {replacing && (
              <div>
                <div
                  className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    Drop file or <span className="text-primary underline">browse</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setFileName(f.name);
                        setReplacing(false);
                      }
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accepted formats: SCORM (.zip), PDF, MP4, PNG, JPG. Max file size: 500MB.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <UsageSection item={item} />

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4 flex-wrap">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDeactivateOpen(true)}>
            Deactivate
          </Button>
          {isUsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button variant="destructive" disabled>
                      Delete
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  This content cannot be deleted because it has been used. Deactivate it instead.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate Content</DialogTitle>
            <DialogDescription>
              {inCurricula
                ? `Are you sure you want to deactivate ${item.title}?`
                : `Are you sure you want to deactivate ${item.title}? It will no longer be available for use in curricula or journeys.`}
            </DialogDescription>
          </DialogHeader>
          {inCurricula && (
            <div className="space-y-3">
              <LeftBorderCard borderVariant="warning">
                <p className="text-sm font-medium text-foreground">
                  This content is currently used in the following curricula. Deactivating it will remove it from all of them:
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {item.curriculaUsedIn.map((c) => (
                    <li key={c} className="text-sm text-foreground">{c}</li>
                  ))}
                </ul>
              </LeftBorderCard>
              <p className="text-sm text-muted-foreground">
                Learners currently assigned to these curricula will lose access to this content. This action cannot be undone.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeactivateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={inCurricula ? "destructive" : "default"}
              onClick={handleDeactivate}
            >
              {inCurricula ? "Deactivate Anyway" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {item.title}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HybridMode({
  item,
  onCancel,
}: {
  item: EnrichedItem;
  onCancel: () => void;
}) {
  const [lob, setLob] = useState<string[]>(item.linesOfBusiness);
  const [tags, setTags] = useState<string[]>(item.tags);
  const [categories, setCategories] = useState<ContentCategorySelection>(emptyContentCategories);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    toast.success("Embark settings updated successfully.");
  };

  const ReadOnlyRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground text-right max-w-[70%]">{value}</span>
    </div>
  );

  return (
    <>
      <section className="space-y-4">
        <SectionHeader title="Content Details" chip="Managed in Cornerstone Learn" />
        <div className="rounded-md border border-border bg-background p-4 space-y-3">
          <ReadOnlyRow label="Content Title" value={item.title} />
          <ReadOnlyRow label="Content Type" value={item.contentTypeLabel} />
          <ReadOnlyRow label="Duration" value={`${item.duration} min`} />
          <ReadOnlyRow label="Version" value={item.version} />
          <ReadOnlyRow label="Last Updated in Cornerstone" value={item.csLastUpdated} />
          <ReadOnlyRow label="Content ID" value={item.csContentId} />
          <ReadOnlyRow label="Description" value={item.description} />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Content File" chip="Managed in Cornerstone Learn" />
        <div className="rounded-md border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <div className="text-sm font-medium text-foreground">{item.fileName}</div>
              <div className="text-xs text-muted-foreground">{item.fileSize}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Embark Settings</h3>
        <p className="text-sm text-muted-foreground -mt-2">
          These settings are specific to the Embark platform and can be edited independently of Cornerstone Learn.
        </p>
        <div className="rounded-md border border-border bg-background p-4 space-y-4">
          <div>
            <LineOfBusinessField value={lob} onChange={setLob} />
            <p className="mt-1 text-xs text-muted-foreground">
              Select all lines of business this content applies to within Embark.
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground">Tags</Label>
            <div className="mt-1">
              <ChipInput
                chips={tags}
                onAdd={(v) => setTags([...tags, v])}
                onRemove={(i) => setTags(tags.filter((_, idx) => idx !== i))}
                placeholder="Add tags…"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tags help with search and filtering in the Embark Content Library.
            </p>
          </div>
          <ContentCategoryFields value={categories} onChange={setCategories} />
          <div>
            <Label className="text-sm font-medium text-foreground">Internal Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any internal notes about how this content should be used in Embark…"
              className="mt-1"
            />
          </div>
        </div>
      </section>

      <UsageSection item={item} />

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Embark Settings</Button>
      </div>
    </>
  );
}
