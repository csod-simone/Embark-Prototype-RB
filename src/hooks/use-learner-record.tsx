import {
  IM_INTAKE_JOURNEY_NAME,
} from "@/pages/embark/admin/journeys/data";
import { lockedLaterPaths, weekFromSessions, getLearnerRecord, type LearnerRecord } from "@/data/learnerDirectory";
import { useJourneyAdaptation, applyAdaptation } from "@/hooks/use-journey-adaptation";
import { useModule3Progress } from "@/hooks/use-module3-progress";
import { buildMod3Flow } from "@/pages/embark/learner/home/JourneyTabs";

/** The learner opened on a profile page, or undefined when the id is unknown. */
export function useLearnerRecord(learnerId: string | undefined): LearnerRecord | undefined {
  const record = getLearnerRecord(learnerId);
  const { progress } = useModule3Progress();
  const { state } = useJourneyAdaptation();
  if (!record) return undefined;
  if (record.id !== "l1" && record.recordsId !== "l1") return record;
  const sessions = applyAdaptation(buildMod3Flow(progress, "rathbones"), state);
  return {
    ...record,
    journeyName: IM_INTAKE_JOURNEY_NAME,
    weeks: [weekFromSessions(sessions), ...lockedLaterPaths()],
  };
}
