import { SageTag } from "@/components/embark/SageTag";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MAX = 1000;

export function AiGenerateJourneyDialog({
  open,
  onOpenChange,
  onGenerate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (description: string) => void;
}) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) setDescription("");
  }, [open]);

  const canGenerate = description.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <SageTag label="AI" />
            AI Generate Journey
          </DialogTitle>
          <DialogDescription>
            Describe the journey you want to create and Sage will generate all the details for you
            — including journey settings, path selection, and configuration. You can review
            and edit everything before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-2">
          <Label htmlFor="ai-journey-desc" className="text-sm">
            Describe Your Journey
          </Label>
          <Textarea
            id="ai-journey-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX))}
            rows={5}
            maxLength={MAX}
            placeholder="e.g. A comprehensive onboarding journey for new Aetna CSR agents covering member support, call handling, and plan benefits — designed to be completed in the first 30 days of employment."
          />
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              The more detail you provide, the more accurate Sage's output will be. Include the
              audience, goals, topics to cover, and any time constraints.
            </p>
            <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
              {description.length} / {MAX}
            </span>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canGenerate}
            onClick={() => {
              onGenerate(description);
              onOpenChange(false);
            }}
          >
            <Sparkles className="mr-1 h-4 w-4" />
            Generate Journey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
