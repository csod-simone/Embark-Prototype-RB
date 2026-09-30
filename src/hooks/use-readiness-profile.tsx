import { useMemo } from "react";
import { useOrganisation } from "@/hooks/use-organisation";
import {
  getReadinessActivities,
  getReadinessProject,
  getReadinessSections,
  getReadinessUser,
  type ReadinessActivity,
  type ReadinessProject,
  type ReadinessSection,
  type ReadinessUser,
} from "@/data/readinessJourney";
import {
  getReadinessContentMap,
  getReadinessQuestionsMap,
  type ReadinessQuestion,
} from "@/data/readinessContent";
import type { ReviewContentEntry } from "@/data/reviewContent";

export function useReadinessProfile(): {
  org: ReturnType<typeof useOrganisation>["org"];
  user: ReadinessUser;
  project: ReadinessProject;
  sections: ReadinessSection[];
  activities: ReadinessActivity[];
  content: Record<string, ReviewContentEntry>;
  questions: Record<string, ReadinessQuestion[]>;
  findActivity: (id: string) => ReadinessActivity | undefined;
  activitiesInSection: (sectionId: string) => ReadinessActivity[];
} {
  const { org } = useOrganisation();

  return useMemo(() => {
    const activities = getReadinessActivities(org);
    return {
      org,
      user: getReadinessUser(org),
      project: getReadinessProject(org),
      sections: getReadinessSections(org),
      activities,
      content: getReadinessContentMap(org),
      questions: getReadinessQuestionsMap(org),
      findActivity: (id: string) => activities.find((a) => a.id === id),
      activitiesInSection: (sectionId: string) =>
        activities.filter((a) => a.section === sectionId),
    };
  }, [org]);
}
