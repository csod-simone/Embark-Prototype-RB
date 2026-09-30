import { useCallback, useMemo, useState } from "react";
import {
  COHORT_STATUSES,
  TRAINER_COHORT_META,
  cohortMetaFor,
  type CohortStatus,
} from "@/data/trainerLearners";
import { useTrainerView } from "@/hooks/use-trainer-view";
import type { DateRangeValue } from "@/components/embark/trainer/TrainerFilterPanel";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function inRange(iso: string, range: DateRangeValue) {
  if (!range.from && !range.to) return true;
  const value = startOfDay(new Date(iso)).getTime();
  if (range.from && value < startOfDay(range.from).getTime()) return false;
  if (range.to && value > startOfDay(range.to).getTime()) return false;
  return true;
}

/**
 * Shared filter state for the trainer workspace and trainer analytics pages.
 * Cohort options are always scoped to the active primary/secondary trainer view.
 */
export function useTrainerFilters() {
  const { inScope, isSecondary, primaryTrainerFor } = useTrainerView();

  const [cohorts, setCohorts] = useState<string[]>([]);
  const [primaryTrainers, setPrimaryTrainers] = useState<string[]>([]);
  const [journeyStart, setJourneyStart] = useState<DateRangeValue>({});
  const [journeyEnd, setJourneyEnd] = useState<DateRangeValue>({});
  const [statuses, setStatuses] = useState<string[]>([]);
  const [progress, setProgress] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [activity, setActivity] = useState<DateRangeValue>({});

  const cohortOptions = useMemo(
    () => TRAINER_COHORT_META.filter((c) => inScope(c.name)).map((c) => c.name),
    [inScope],
  );

  /** Primary trainers of the cohorts in scope — only offered in the secondary view. */
  const primaryTrainerOptions = useMemo(
    () =>
      isSecondary
        ? Array.from(
            new Set(
              TRAINER_COHORT_META.filter((c) => inScope(c.name))
                .map((c) => primaryTrainerFor(c.name))
                .filter((n): n is string => Boolean(n)),
            ),
          )
        : [],
    [inScope, isSecondary, primaryTrainerFor],
  );

  const topicOptions = useMemo(
    () =>
      Array.from(
        new Set(TRAINER_COHORT_META.filter((c) => inScope(c.name)).map((c) => c.topic)),
      ),
    [inScope],
  );

  const statusOptions: CohortStatus[] = COHORT_STATUSES;

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (value: string) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  /** True when the cohort passes the cohort-level filters (and the trainer view scope). */
  const cohortAllowed = useCallback(
    (cohort: string | undefined | null) => {
      if (!cohort) return true;
      if (!inScope(cohort)) return false;
      const meta = cohortMetaFor(cohort);
      if (cohorts.length && !cohorts.some((c) => cohort.toLowerCase().includes(c.toLowerCase()))) {
        return false;
      }
      if (statuses.length && (!meta || !statuses.includes(meta.status))) return false;
      if (topics.length && (!meta || !topics.includes(meta.topic))) return false;
      if (primaryTrainers.length) {
        const trainer = primaryTrainerFor(cohort);
        if (!trainer || !primaryTrainers.includes(trainer)) return false;
      }
      if (meta) {
        if (!inRange(meta.journeyStart, journeyStart)) return false;
        if (!inRange(meta.journeyEnd, journeyEnd)) return false;
      }
      return true;
    },
    [cohorts, statuses, topics, journeyStart, journeyEnd, inScope, primaryTrainers, primaryTrainerFor],
  );

  const clear = useCallback(() => {
    setCohorts([]);
    setPrimaryTrainers([]);
    setJourneyStart({});
    setJourneyEnd({});
    setStatuses([]);
    setProgress([]);
    setTopics([]);
    setActivity({});
  }, []);

  const active =
    cohorts.length > 0 ||
    primaryTrainers.length > 0 ||
    statuses.length > 0 ||
    progress.length > 0 ||
    topics.length > 0 ||
    Boolean(journeyStart.from || journeyStart.to) ||
    Boolean(journeyEnd.from || journeyEnd.to) ||
    Boolean(activity.from || activity.to);

  /** Whether a learner progress/risk status passes the learner filter. */
  const progressAllowed = useCallback(
    (status: string) => progress.length === 0 || progress.includes(status),
    [progress],
  );

  return {
    cohorts,
    toggleCohort: toggle(setCohorts),
    cohortOptions,
    primaryTrainers,
    togglePrimaryTrainer: toggle(setPrimaryTrainers),
    primaryTrainerOptions,
    journeyStart,
    setJourneyStart,
    journeyEnd,
    setJourneyEnd,
    statuses,
    toggleStatus: toggle(setStatuses),
    statusOptions,
    progress,
    toggleProgress: toggle(setProgress),
    topics,
    toggleTopic: toggle(setTopics),
    topicOptions,
    activity,
    setActivity,
    cohortAllowed,
    progressAllowed,
    active,
    clear,
  };
}
