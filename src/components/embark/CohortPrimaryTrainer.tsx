import { useTrainerView } from "@/hooks/use-trainer-view";
import { cn } from "@/lib/utils";

/**
 * Shows "Primary trainer: <name>" beneath a cohort label.
 * Only rendered while the trainer is in the secondary trainer view.
 */
export function CohortPrimaryTrainer({
  cohort,
  className,
}: {
  cohort: string | undefined | null;
  className?: string;
}) {
  const { isSecondary, primaryTrainerFor } = useTrainerView();
  if (!isSecondary) return null;
  const name = primaryTrainerFor(cohort);
  if (!name) return null;
  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      Primary trainer: {name}
    </div>
  );
}