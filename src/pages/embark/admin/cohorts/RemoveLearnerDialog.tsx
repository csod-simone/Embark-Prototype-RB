import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learnerName: string;
};

export function RemoveLearnerDialog({ open, onOpenChange, learnerName }: Props) {
  const handleRemove = () => {
    onOpenChange(false);
    toast.error(`${learnerName} has been removed from the cohort.`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Learner</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-foreground">
          Are you sure you want to remove {learnerName} from this cohort? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRemove}>
            Remove Learner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
