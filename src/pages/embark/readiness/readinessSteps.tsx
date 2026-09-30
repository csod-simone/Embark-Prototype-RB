import type { NavigateFunction } from "react-router-dom";
import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import { getReadinessContentMap, READINESS_LEARNING_ORDER } from "@/data/readinessContent";
import type { OrgId } from "@/hooks/use-organisation";

/** Steps sidebar entries for the readiness learning sessions. */
export function buildReadinessSteps(
  currentId: string,
  navigate: NavigateFunction,
  org: OrgId = "nexus",
): SessionStep[] {
  const content = getReadinessContentMap(org);
  return READINESS_LEARNING_ORDER.map((id) => {
    const entry = content[id];
    const isRolePlay = id === "a10";
    return {
      id,
      name: entry.title,
      subtitle: `${isRolePlay ? "Role play" : entry.modality === "video" ? "Video" : "Article"} · ${entry.duration} min`,
      modality: isRolePlay ? "role_play" : entry.modality,
      status: id === currentId ? "current" : "upcoming",
      onClick: () =>
        navigate(isRolePlay ? "/readiness/roleplay" : `/readiness/session/${id}`),
    } satisfies SessionStep;
  });
}
