import { SageTag } from "@/components/embark/SageTag";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  X,
  Loader2,
  Sparkles,
  FolderOpen,
  ClipboardCheck,
  Plus,
  ChevronUp,
  ChevronDown,
  Trash2,
  MoveRight,
} from "lucide-react";
import { toast } from "sonner";
import { BuilderHeader } from "./builder/BuilderHeader";
import { AiGenerateCurriculumDialog } from "./builder/AiGenerateCurriculumDialog";
import { ContentLibraryBrowserModal } from "./builder/ContentLibraryBrowserModal";
import { AssessmentBrowserModal } from "./builder/AssessmentBrowserModal";
import { NEW_SECTION_VALUE } from "./builder/BrowserModalShell";
import { csrWeekSections } from "./builder/curriculumData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { PageContainer } from "@/components/embark/layouts/PageContainer";

type ProposedItem = {
  id: string;
  title: string;
  /** Activity type label, e.g. eLearning, Knowledge Check, Zenerate Simulation. */
  type: string;
  duration: string;
};

type Section = {
  id: string;
  name: string;
  items: ProposedItem[];
  threshold: string;
};

const DEFAULT_THRESHOLD = "80";

const AI_STUB_ITEMS: ProposedItem[] = [
  { id: "ai-1", title: "Plan Benefits Overview: Medical, Dental & Pharmacy", type: "eLearning", duration: "25 min" },
  { id: "ai-2", title: "Understanding Deductibles & Coinsurance", type: "eLearning", duration: "20 min" },
  { id: "ai-3", title: "Claims & Explanation of Benefits Basics", type: "eLearning", duration: "20 min" },
  { id: "ai-4", title: "Coverage Termination & COBRA Essentials", type: "eLearning", duration: "20 min" },
  { id: "ai-5", title: "Escalation & Quality Standards", type: "eLearning", duration: "20 min" },
  { id: "ai-6", title: "Aetna Plan Benefits Reference Guide", type: "Document", duration: "15 min" },
  { id: "ai-7", title: "Plan Benefits Foundations Knowledge Check", type: "Assessment", duration: "30 min" },
];

export default function BuilderIngest() {
  const navigate = useNavigate();
  const { curriculumId = "cur2" } = useParams();
  const [searchParams] = useSearchParams();
  const isDuplicate = searchParams.get("duplicate") === "1";
  const isCreateMode = curriculumId === "new";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [assessmentsOpen, setAssessmentsOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [wasGenerated, setWasGenerated] = useState(false);
  const [proposedItems, setProposedItems] = useState<ProposedItem[]>([]);
  const [sections, setSections] = useState<Section[]>(() => {
    const seeded = csrWeekSections(curriculumId);
    if (!seeded) return [];
    return seeded.map((s) => ({
      ...s,
      name: isDuplicate ? `${s.name} (Copy)` : s.name,
      items: s.items.map((i) => ({ ...i })),
    }));
  });
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Section | null>(null);
  const [contentEdited, setContentEdited] = useState(false);

  const totalItems =
    proposedItems.length + sections.reduce((sum, s) => sum + s.items.length, 0);

  const handleGenerate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setProposedItems(AI_STUB_ITEMS.map((i) => ({ ...i })));
      setContentEdited(false);
      setWasGenerated(true);
      setBannerVisible(true);
      setGenerating(false);
    }, 2000);
  };

  const removeProposed = (id: string) => {
    setProposedItems((prev) => prev.filter((i) => i.id !== id));
    setContentEdited(true);
  };

  const moveProposed = (idx: number, dir: -1 | 1) => {
    setProposedItems((prev) => {
      const next = [...prev];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return prev;
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
    setContentEdited(true);
  };

  const addItems = (
    incoming: { id: string; title: string; type: ProposedItem["type"]; duration: string }[],
    targetSectionId: string,
    noun: "item" | "assessment",
  ) => {
    const existing = new Set(
      sections.flatMap((s) => s.items.map((i) => i.title)).concat(proposedItems.map((i) => i.title)),
    );
    const additions = incoming.filter((i) => !existing.has(i.title));
    if (targetSectionId === NEW_SECTION_VALUE) {
      const id = `sec-${Date.now()}`;
      setSections((prev) => [
        ...prev,
        { id, name: "New Section", items: additions, threshold: DEFAULT_THRESHOLD },
      ]);
      setEditingSectionId(id);
      setDraftName("New Section");
      setNameError(null);
    } else {
      setSections((prev) =>
        prev.map((s) =>
          s.id === targetSectionId ? { ...s, items: [...s.items, ...additions] } : s,
        ),
      );
    }
    setContentEdited(true);
    toast.success(`${incoming.length} ${noun}(s) added to path.`);
  };

  const addSection = () => {
    const id = `sec-${Date.now()}`;
    setSections((prev) => [
      ...prev,
      { id, name: "New Section", items: [], threshold: DEFAULT_THRESHOLD },
    ]);
    setEditingSectionId(id);
    setDraftName("New Section");
    setNameError(null);
  };

  const createSectionInline = (name: string) => {
    const id = `sec-${Date.now()}`;
    setSections((prev) => [...prev, { id, name, items: [], threshold: DEFAULT_THRESHOLD }]);
    setContentEdited(true);
    return id;
  };

  const saveSectionName = (id: string) => {
    const name = draftName.trim();
    if (!name) {
      setNameError("Please enter a section name.");
      return;
    }
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
    setEditingSectionId(null);
    setNameError(null);
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const to = idx + dir;
      if (to < 0 || to >= next.length) return prev;
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
  };

  const deleteSection = (section: Section) => {
    if (section.items.length === 0) {
      setSections((prev) => prev.filter((s) => s.id !== section.id));
      toast.success("Section removed.");
      return;
    }
    setPendingDelete(section);
  };

  const confirmDeleteSection = () => {
    if (!pendingDelete) return;
    const count = pendingDelete.items.length;
    setSections((prev) => prev.filter((s) => s.id !== pendingDelete.id));
    setPendingDelete(null);
    setContentEdited(true);
    toast.success(`Section and ${count} item(s) removed.`);
  };

  const moveSectionItem = (sectionId: string, idx: number, dir: -1 | 1) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const items = [...s.items];
        const to = idx + dir;
        if (to < 0 || to >= items.length) return s;
        [items[idx], items[to]] = [items[to], items[idx]];
        return { ...s, items };
      }),
    );
    setContentEdited(true);
  };

  const removeSectionItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s,
      ),
    );
    setContentEdited(true);
  };

  const moveItemToSection = (fromId: string, itemId: string, toId: string) => {
    const item = sections.find((s) => s.id === fromId)?.items.find((i) => i.id === itemId);
    const target = sections.find((s) => s.id === toId);
    if (!item || !target) return;
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === fromId) return { ...s, items: s.items.filter((i) => i.id !== itemId) };
        if (s.id === toId) return { ...s, items: [...s.items, item] };
        return s;
      }),
    );
    setContentEdited(true);
    toast.success(`'${item.title}' moved to '${target.name}'.`);
  };

  const generate = (
    <Button
      onClick={() => navigate(`/admin/builder/${curriculumId}/generate`)}
      disabled={generating}
    >
      Generate Path →
    </Button>
  );

  const addedTitles = [
    ...proposedItems.map((i) => i.title),
    ...sections.flatMap((s) => s.items.map((i) => i.title)),
  ];

  const ASSESSMENT_TYPES = ["Pre-Check", "Benchmark Check", "Readiness Check", "Comprehension Check", "Proficiency Check"];
  const typeBadgeVariant = (t: ProposedItem["type"]): "default" | "secondary" | "success" =>
    ASSESSMENT_TYPES.includes(t) ? "success" : t === "Document" ? "secondary" : "default";

  return (
    <>
      <BuilderHeader current="ingest" />
      <div className="flex justify-end px-6 pt-4">
        <Button variant="secondary" onClick={() => setAiOpen(true)} disabled={generating}>
          <Sparkles className="mr-1 h-4 w-4" />
          AI Generate Path
        </Button>
      </div>
      <PageContainer as="div" className="relative grid grid-cols-1 lg:grid-cols-[2fr_3fr] min-h-[calc(100vh-14rem)]">
        {generating && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">Sage is building your path…</p>
            <p className="text-sm text-muted-foreground">This will only take a moment.</p>
          </div>
        )}
        {/* LEFT — sourcing controls */}
        <div className="p-6 border-r border-border lg:sticky lg:top-0 lg:self-start">
          <div className="rounded-md border border-border p-4 space-y-4">
            <div>
              <h3 className="font-medium">Add to Path</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Browse the content library or assessments to add items to your path. You'll
                choose which section each item is added to.
              </p>
            </div>
            <div className="space-y-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setLibraryOpen(true)}
                className="w-full"
              >
                <FolderOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                Browse Content Library
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAssessmentsOpen(true)}
                className="w-full"
              >
                <ClipboardCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                Browse Assessments
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT — path structure */}
        <div className="p-6 overflow-y-auto space-y-4">
          {bannerVisible && (
            <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3">
              <SageTag className="shrink-0 mt-0.5" />
              <p className="text-sm text-foreground flex-1">
                Sage has generated your path based on your description. Review all fields
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

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">
                {isCreateMode ? "Proposed Path Structure" : "Path Structure"}
              </h3>
              {contentEdited && <span className="text-xs text-muted-foreground">Edited</span>}
            </div>
            <Badge variant="secondary">
              {totalItems} Content {totalItems === 1 ? "Item" : "Items"}
            </Badge>
          </div>

          {sections.length === 0 && proposedItems.length > 0 && (
            <div className="space-y-2">
              {proposedItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border border-border rounded-md p-3"
                >
                  <span className="text-xs text-muted-foreground w-5 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Badge variant={typeBadgeVariant(item.type)}>{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">{item.duration}</span>
                    </div>
                  </div>
                  <div className="flex flex-col shrink-0">
                    <button
                      type="button"
                      onClick={() => moveProposed(idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                      className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveProposed(idx, 1)}
                      disabled={idx === proposedItems.length - 1}
                      aria-label="Move down"
                      className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProposed(item.id)}
                    aria-label={`Remove ${item.title}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {sections.map((section, sIdx) => (
            <div key={section.id} className="rounded-md border border-border">
              <div className="flex items-center gap-3 border-b border-border p-3">
                <div className="min-w-0 flex-1">
                  {editingSectionId === section.id ? (
                    <>
                      <Input
                        autoFocus
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onBlur={() => saveSectionName(section.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveSectionName(section.id);
                          }
                        }}
                        aria-label="Section name"
                        className="h-8"
                      />
                      {nameError && (
                        <p className="mt-1 text-xs text-destructive">{nameError}</p>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSectionId(section.id);
                        setDraftName(section.name);
                        setNameError(null);
                      }}
                      className="text-left text-sm font-medium text-foreground hover:underline"
                    >
                      {section.name}
                    </button>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Move ${section.name} up`}
                    disabled={sIdx === 0}
                    onClick={() => moveSection(sIdx, -1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Move ${section.name} down`}
                    disabled={sIdx === sections.length - 1}
                    onClick={() => moveSection(sIdx, 1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Remove ${section.name}`}
                    onClick={() => deleteSection(section)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 p-3">
                {section.items.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No items in this section yet.
                  </p>
                ) : (
                  section.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border border-border rounded-md p-3"
                    >
                      <span className="text-xs text-muted-foreground w-5 text-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Badge variant={typeBadgeVariant(item.type)}>{item.type}</Badge>
                          <span className="text-xs text-muted-foreground">{item.duration}</span>
                        </div>
                      </div>
                      <div className="flex flex-col shrink-0">
                        <button
                          type="button"
                          onClick={() => moveSectionItem(section.id, idx, -1)}
                          disabled={idx === 0}
                          aria-label="Move up"
                          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSectionItem(section.id, idx, 1)}
                          disabled={idx === section.items.length - 1}
                          aria-label="Move down"
                          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            aria-label={`Move ${item.title} to another section`}
                            disabled={sections.length < 2}
                          >
                            <MoveRight className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {sections
                            .filter((s) => s.id !== section.id)
                            .map((s) => (
                              <DropdownMenuItem
                                key={s.id}
                                onSelect={() => moveItemToSection(section.id, item.id, s.id)}
                              >
                                {s.name}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <button
                        type="button"
                        onClick={() => removeSectionItem(section.id, item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}

          <Button type="button" variant="secondary" onClick={addSection}>
            <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
            Add Section
          </Button>

          {wasGenerated && (
            <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3">
              <SageTag className="shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                I've structured this path to build knowledge progressively — starting with a
                high-level plan benefits overview, then drilling into each topic individually before
                consolidating with a reference document and a knowledge check assessment. This
                sequencing helps learners build mental models before encountering detail.
              </p>
            </div>
          )}
        </div>
      </PageContainer>

      {/* Phase CTA bar */}
      <div className="sticky bottom-0 border-t border-border bg-background">
        {settingsOpen && (
          <div className="p-4 border-b border-border space-y-4 bg-muted/20">
            <div>
              <Label className="text-sm">Target module count: 5 – 8 modules</Label>
              <Slider defaultValue={[5, 8]} min={1} max={12} className="mt-2 max-w-sm" />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Session length</Label>
              <RadioGroup defaultValue="standard" className="flex gap-4">
                <div className="flex items-center gap-2"><RadioGroupItem value="short" id="ss" /><Label htmlFor="ss">Short (5–7 min)</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="standard" id="sst" /><Label htmlFor="sst">Standard (7–10 min)</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="long" id="sl" /><Label htmlFor="sl">Long (10–15 min)</Label></div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-sm mb-2 block">Content modalities</Label>
              <div className="flex gap-4">
                {[["v", "Video", true], ["a", "Article", true], ["r", "Role play", false], ["e", "Interactive exercise", false]].map(([id, l, def]) => (
                  <div key={id as string} className="flex items-center gap-2">
                    <Checkbox id={id as string} defaultChecked={def as boolean} />
                    <Label htmlFor={id as string}>{l as string}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setSettingsOpen(false)}>Apply settings</Button>
          </div>
        )}
        <div className="flex items-center justify-end p-4">
          {generate}
        </div>
      </div>

      <AiGenerateCurriculumDialog
        open={aiOpen}
        onOpenChange={setAiOpen}
        onGenerate={handleGenerate}
      />

      <ContentLibraryBrowserModal
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        addedTitles={addedTitles}
        sections={sections.map((s) => ({ id: s.id, name: s.name }))}
        onCreateSection={createSectionInline}
        onAdd={(items, targetSectionId) =>
          addItems(
            items.map((i) => ({
              id: `lib-${i.id}`,
              title: i.title,
              type: "Content" as const,
              duration: `${i.durationMin} min`,
            })),
            targetSectionId,
            "item",
          )
        }
      />

      <AssessmentBrowserModal
        open={assessmentsOpen}
        onOpenChange={setAssessmentsOpen}
        addedTitles={addedTitles}
        sections={sections.map((s) => ({ id: s.id, name: s.name }))}
        onCreateSection={createSectionInline}
        onAdd={(items, targetSectionId) =>
          addItems(
            items.map((i) => ({
              id: `asm-${i.id}`,
              title: i.title,
              type: "Assessment" as const,
              duration: `${i.questions} questions`,
            })),
            targetSectionId,
            "assessment",
          )
        }
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Section?</AlertDialogTitle>
            <AlertDialogDescription>
              '{pendingDelete?.name}' contains {pendingDelete?.items.length} item(s). Removing this
              section will also remove all items within it from the path. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSection}>Remove Section</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
