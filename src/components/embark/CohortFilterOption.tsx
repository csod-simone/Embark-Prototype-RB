import { useTrainerView } from "@/hooks/use-trainer-view";

/**
 * Label for a cohort option inside a trainer cohort filter.
 * In the secondary trainer view it adds a muted "Primary trainer: <name>"
 * second line, matching the attribution shown on cohort displays.
 */
export function CohortFilterOption({ cohort }: { cohort: string }) {
  const { isSecondary, primaryTrainerFor } = useTrainerView();
  const name = isSecondary ? primaryTrainerFor(cohort) : null;
  if (!name) return <>{cohort}</>;
  return (
    <span className="flex flex-col">
      <span>{cohort}</span>
      <span className="text-xs text-muted-foreground">Primary trainer: {name}</span>
    </span>
  );
}
