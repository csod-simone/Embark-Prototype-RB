import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type RescoreOption = "affected" | "all" | "none";

const OPTIONS: { value: RescoreOption; label: string; description: string }[] = [
  {
    value: "affected",
    label: "Rescore learners who chose the newly correct answer",
    description:
      "Learners who previously selected the answer you are now marking as correct — and were marked incorrect — will have their response updated to correct and their score recalculated. Learners who answered differently are not affected.",
  },
  {
    value: "all",
    label: "Rescore all previous attempts",
    description:
      "All learners who have previously answered this question will have their response rescored against the new correct answer. Learners who were previously marked correct may have their score reduced if their answer is no longer correct.",
  },
  {
    value: "none",
    label: "Don't rescore previous attempts",
    description:
      "Previous attempts are not changed. Only future attempts of this question will use the updated correct answer. Existing scores remain as recorded.",
  },
];

export function RescoreDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (option: RescoreOption) => void;
}) {
  const [choice, setChoice] = useState<RescoreOption>("affected");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setChoice("affected");
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rescore Previous Attempts?</DialogTitle>
          <DialogDescription>
            You have changed the correct answer for this question. Some learners may have previously
            answered this question based on the old configuration. Choose how you would like to
            handle their previous attempts.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2 text-sm text-warning-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Rescoring will permanently update affected learners' scores and cannot be undone.</p>
        </div>

        <RadioGroup
          value={choice}
          onValueChange={(v) => setChoice(v as RescoreOption)}
          className="space-y-4"
        >
          {OPTIONS.map((o) => (
            <div key={o.value} className="flex items-start gap-2">
              <RadioGroupItem id={`rescore-${o.value}`} value={o.value} className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor={`rescore-${o.value}`} className="text-sm font-medium">
                  {o.label}
                </Label>
                <p className="text-xs text-muted-foreground">{o.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(choice)}>
            {choice === "none" ? "Save Without Rescoring" : "Apply Rescoring"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
