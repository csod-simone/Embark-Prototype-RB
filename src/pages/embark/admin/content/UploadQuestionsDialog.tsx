import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeftBorderCard } from "@/components/embark/LeftBorderCard";
import { makeAiStubQuestions, type Question } from "./assessmentStubs";
import { QuestionPreviewList } from "./QuestionPreviewList";

export function UploadQuestionsDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (qs: Question[]) => void;
}) {
  const [stage, setStage] = useState<"empty" | "processing" | "done">("empty");
  const [fileName, setFileName] = useState("");
  const [detected, setDetected] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setStage("empty");
      setFileName("");
      setDetected([]);
      setSelected(new Set());
    }
  }, [open]);

  const handleFile = (name: string) => {
    setFileName(name);
    setStage("processing");
    window.setTimeout(() => {
      const qs = makeAiStubQuestions();
      setDetected(qs);
      setSelected(new Set(qs.map((q) => q.id)));
      setStage("done");
    }, 1500);
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
    const picked = detected.filter((q) => selected.has(q.id));
    onAdd(picked);
    toast.success(`${picked.length} questions added to the assessment.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-primary" />
            Upload Questions from File
          </DialogTitle>
          <DialogDescription>
            Upload a file containing additional questions to add to this assessment. Questions will
            be shown for review before being added.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <LeftBorderCard borderVariant="brand">
            <p className="text-sm text-foreground">
              Need a template? Download a sample file to ensure your questions are formatted
              correctly.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => toast("Template download started.")}
              >
                Download CSV Template
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => toast("Template download started.")}
              >
                Download Excel Template
              </Button>
            </div>
          </LeftBorderCard>

          {stage === "empty" && (
            <label
              htmlFor="upload-file"
              className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border py-10 cursor-pointer hover:bg-muted/40 transition-colors"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Drop file here or click to browse
              </span>
              <span className="text-xs text-muted-foreground">
                Accepted formats: QTI (.xml, .zip), CSV (.csv), Excel (.xlsx). Max file size: 50MB.
              </span>
              <input
                id="upload-file"
                type="file"
                className="hidden"
                accept=".xml,.zip,.csv,.xlsx"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f.name);
                  e.target.value = "";
                }}
              />
            </label>
          )}

          {stage === "processing" && (
            <div className="rounded-md border border-dashed border-border py-12 flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing file…</p>
            </div>
          )}

          {stage === "done" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{fileName}</div>
                    <div className="text-xs text-muted-foreground">2.4 MB</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStage("empty");
                    setFileName("");
                    setDetected([]);
                    setSelected(new Set());
                  }}
                >
                  <X className="mr-1 h-4 w-4" /> Remove
                </Button>
              </div>
              <LeftBorderCard borderVariant="success">
                <p className="text-sm text-success-dark">
                  File uploaded successfully. {detected.length} questions detected.
                </p>
              </LeftBorderCard>
              <div>
                <h3 className="text-sm font-medium text-foreground">Review Detected Questions</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select the questions you want to add to the assessment.
                </p>
              </div>
              <QuestionPreviewList
                questions={detected}
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
          {stage === "done" && (
            <Button onClick={addSelected} disabled={selected.size === 0}>
              Add Selected Questions
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
