import { SageTag } from "@/components/embark/SageTag";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { makeAiStubQuestions, type Question } from "./assessmentStubs";
import { QuestionPreviewList } from "./QuestionPreviewList";

type Basis = "journey" | "topic";

const JOURNEY_OPTIONS = [
  "CSR Onboarding Journey",
  "New Hire Foundations Journey",
  "CSR Onboarding Week 1",
];

export function AiGenerateQuestionsDialog({
  open,
  onOpenChange,
  isInUse,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isInUse: boolean;
  onAdd: (qs: Question[]) => void;
}) {
  const [basis, setBasis] = useState<Basis>(isInUse ? "journey" : "topic");
  const [journey, setJourney] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [stage, setStage] = useState<"form" | "loading" | "review">("form");
  const [generated, setGenerated] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setBasis(isInUse ? "journey" : "topic");
      setJourney("");
      setTopic("");
      setCount(5);
      setStage("form");
      setGenerated([]);
      setSelected(new Set());
    }
  }, [open, isInUse]);

  const canGenerate =
    count >= 1 &&
    count <= 20 &&
    ((basis === "journey" && !!journey) || (basis === "topic" && topic.trim().length > 0));

  const runGenerate = () => {
    setStage("loading");
    window.setTimeout(() => {
      const qs = makeAiStubQuestions();
      setGenerated(qs);
      setSelected(new Set(qs.map((q) => q.id)));
      setStage("review");
    }, 2000);
  };

  const toggle = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (checked) n.add(id);
      else n.delete(id);
      return n;
    });
  };

  const addSelected = () => {
    const picked = generated.filter((q) => selected.has(q.id));
    onAdd(picked);
    toast.success(`${picked.length} questions added to the assessment.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <SageTag label="AI" />
            AI Generate Questions
          </DialogTitle>
          <DialogDescription>
            Sage will generate additional questions based on the journey or path this
            assessment is part of, or based on a topic you specify.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {stage === "form" && (
            <>
              <div className="space-y-2">
                <Label className="text-sm">Generate based on</Label>
                <RadioGroup
                  value={basis}
                  onValueChange={(v) => setBasis(v as Basis)}
                  className="space-y-1"
                >
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      {isInUse ? (
                        <>
                          <RadioGroupItem id="basis-journey" value="journey" />
                          <Label htmlFor="basis-journey" className="text-sm font-normal">
                            Journey or path this assessment is part of
                          </Label>
                        </>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 opacity-60">
                              <RadioGroupItem id="basis-journey" value="journey" disabled />
                              <Label htmlFor="basis-journey" className="text-sm font-normal">
                                Journey or path this assessment is part of
                              </Label>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            This assessment is not currently assigned to a journey or path.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="basis-topic" value="topic" />
                    <Label htmlFor="basis-topic" className="text-sm font-normal">
                      A topic or description I provide
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {basis === "journey" && (
                <div className="space-y-2">
                  <Label htmlFor="ai-journey" className="text-sm">
                    Select Journey or Path
                  </Label>
                  <Select value={journey} onValueChange={setJourney}>
                    <SelectTrigger id="ai-journey">
                      <SelectValue placeholder="Select a journey or path…" />
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
              )}

              {basis === "topic" && (
                <div className="space-y-2">
                  <Label htmlFor="ai-topic" className="text-sm">
                    Topic or Description
                  </Label>
                  <Textarea
                    id="ai-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Describe the topic or learning objectives you want questions to cover…"
                    rows={4}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ai-count" className="text-sm">
                  Number of Questions to Generate
                </Label>
                <Input
                  id="ai-count"
                  type="number"
                  min={1}
                  max={20}
                  value={count}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    setCount(Math.max(1, Math.min(20, n)));
                  }}
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground">
                  Generated questions will be added to your review list below. You can remove any
                  before saving.
                </p>
              </div>
            </>
          )}

          {stage === "loading" && (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Sage is generating questions…</p>
            </div>
          )}

          {stage === "review" && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-foreground">Review Generated Questions</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select the questions you want to add to the assessment. Deselect any you don't
                  want to include.
                </p>
              </div>
              <QuestionPreviewList
                questions={generated}
                selectedIds={selected}
                onToggle={toggle}
              />
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {stage === "form" && (
            <Button onClick={runGenerate} disabled={!canGenerate}>
              <Sparkles className="mr-1 h-4 w-4" />
              Generate Questions
            </Button>
          )}
          {stage === "review" && (
            <Button onClick={addSelected} disabled={selected.size === 0}>
              Add Selected Questions
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
