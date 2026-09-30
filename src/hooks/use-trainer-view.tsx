import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type TrainerViewMode = "primary" | "secondary";

/**
 * Cohorts on which the demo trainer (Marcus Hale) is assigned as a *secondary* trainer.
 * Matching is done on a normalised substring so it works across the different
 * cohort label formats used by the mock data ("Medicare CSR Cohort B",
 * "Cohort B — Feb 2025", "Cohort B").
 */
const SECONDARY_COHORT_KEYS = ["cohort b"];

/**
 * Primary trainer assigned to each cohort, matched on a normalised substring so
 * it works across the different cohort label formats used by the mock data.
 */
const PRIMARY_TRAINER_BY_COHORT: { key: string; trainer: string }[] = [
  { key: "cohort a", trainer: "Sarah Mitchell" },
  { key: "cohort b", trainer: "David Okafor" },
  { key: "cohort c", trainer: "Priya Shen" },
  { key: "cohort q3", trainer: "Sarah Mitchell" },
  { key: "new starter q3", trainer: "Sarah Mitchell" },
];

export function primaryTrainerForCohort(cohort: string | undefined | null): string | null {
  if (!cohort) return null;
  const value = cohort.toLowerCase();
  return PRIMARY_TRAINER_BY_COHORT.find((row) => value.includes(row.key))?.trainer ?? null;
}

export function isSecondaryCohort(cohort: string | undefined | null): boolean {
  if (!cohort) return false;
  const value = cohort.toLowerCase();
  return SECONDARY_COHORT_KEYS.some((key) => value.includes(key));
}

type Ctx = {
  mode: TrainerViewMode;
  setMode: (mode: TrainerViewMode) => void;
  isSecondary: boolean;
  /** True when the demo trainer holds at least one secondary assignment. */
  hasSecondaryAssignments: boolean;
  /** Whether a cohort-scoped item should be visible in the active mode. */
  inScope: (cohort: string | undefined | null) => boolean;
  /** Primary trainer assigned to a cohort, if known. */
  primaryTrainerFor: (cohort: string | undefined | null) => string | null;
};

const TrainerViewContext = createContext<Ctx>({
  mode: "primary",
  setMode: () => {},
  isSecondary: false,
  hasSecondaryAssignments: true,
  inScope: () => true,
  primaryTrainerFor: primaryTrainerForCohort,
});

export function TrainerViewProvider({ children }: { children: React.ReactNode }) {
  // Session-scoped only: always starts on "primary" after a full page load.
  const [mode, setMode] = useState<TrainerViewMode>("primary");

  const inScope = useCallback(
    (cohort: string | undefined | null) => (mode === "primary" ? true : isSecondaryCohort(cohort)),
    [mode],
  );

  const value = useMemo<Ctx>(
    () => ({
      mode,
      setMode,
      isSecondary: mode === "secondary",
      hasSecondaryAssignments: true,
      inScope,
      primaryTrainerFor: primaryTrainerForCohort,
    }),
    [mode, inScope],
  );

  return <TrainerViewContext.Provider value={value}>{children}</TrainerViewContext.Provider>;
}

export const useTrainerView = () => useContext(TrainerViewContext);
