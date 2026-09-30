import type { SessionStep } from "@/components/embark/SessionStepsSidebar";
import type { RolePlayScenario } from "./types";

/** Managing Clients role-play ids used on the learner route. */
export type McLearnerRoleplayId = "mc-rp1" | "mc-rp2" | "mc-rp-f";

/** Managing Clients role-play activity ids used on Role Readiness. */
export type McReadinessRoleplayId = "mc4" | "mc7" | "mc10";

export type McRoleplayKey = McLearnerRoleplayId | McReadinessRoleplayId;

type PrecedingStep = {
  id: string;
  name: string;
  subtitle: string;
  modality: SessionStep["modality"];
};

type McChrome = {
  /** Short name for the current rail step (matches scenario topic). */
  railName: string;
  preceding: PrecedingStep[];
};

const CHROME: Record<McRoleplayKey, McChrome> = {
  "mc-rp1": {
    railName: "Pitching Sales — James Whitfield",
    preceding: [
      {
        id: "mc-c1",
        name: "Client relationships foundations",
        subtitle: "Article · 20 min",
        modality: "article",
      },
      {
        id: "mc-k1",
        name: "Knowledge check 1",
        subtitle: "Assessment · 10 min",
        modality: "assessment",
      },
      {
        id: "mc-c2",
        name: "Discovery and objectives",
        subtitle: "Article · 20 min",
        modality: "article",
      },
    ],
  },
  mc4: {
    railName: "Pitching Sales — James Whitfield",
    preceding: [
      {
        id: "mc1",
        name: "Client relationships foundations",
        subtitle: "Article · 20 min",
        modality: "article",
      },
      {
        id: "mc2",
        name: "Knowledge check 1",
        subtitle: "Assessment · 10 min",
        modality: "assessment",
      },
      {
        id: "mc3",
        name: "Discovery and objectives",
        subtitle: "Article · 20 min",
        modality: "article",
      },
    ],
  },
  "mc-rp2": {
    railName: "Suitability Meetings — Helen Ashford",
    preceding: [
      {
        id: "mc-rp1",
        name: "Discovery with James Whitfield",
        subtitle: "Role play · 12 min",
        modality: "role_play",
      },
      {
        id: "mc-k2",
        name: "Knowledge check 2",
        subtitle: "Assessment · 10 min",
        modality: "assessment",
      },
      {
        id: "mc-c3",
        name: "Suitability under pressure",
        subtitle: "Article · 20 min",
        modality: "article",
      },
    ],
  },
  mc7: {
    railName: "Suitability Meetings — Helen Ashford",
    preceding: [
      {
        id: "mc4",
        name: "Discovery with James Whitfield",
        subtitle: "Role play · 12 min",
        modality: "role_play",
      },
      {
        id: "mc5",
        name: "Knowledge check 2",
        subtitle: "Assessment · 10 min",
        modality: "assessment",
      },
      {
        id: "mc6",
        name: "Suitability under pressure",
        subtitle: "Article · 20 min",
        modality: "article",
      },
    ],
  },
  "mc-rp-f": {
    railName: "Vulnerable Clients — Margaret Hale",
    preceding: [
      {
        id: "mc-rp2",
        name: "Suitability under pressure",
        subtitle: "Role play · 15 min",
        modality: "role_play",
      },
      {
        id: "mc-c4",
        name: "Advice documentation",
        subtitle: "Article · 15 min",
        modality: "article",
      },
      {
        id: "mc-k3",
        name: "Knowledge check 3",
        subtitle: "Assessment · 10 min",
        modality: "assessment",
      },
    ],
  },
  mc10: {
    railName: "Vulnerable Clients — Margaret Hale",
    preceding: [
      {
        id: "mc7",
        name: "Suitability under pressure",
        subtitle: "Role play · 15 min",
        modality: "role_play",
      },
      {
        id: "mc8",
        name: "Advice documentation",
        subtitle: "Article · 15 min",
        modality: "article",
      },
      {
        id: "mc9",
        name: "Knowledge check 3",
        subtitle: "Assessment · 10 min",
        modality: "assessment",
      },
    ],
  },
};

export function isMcRoleplayKey(id: string | null | undefined): id is McRoleplayKey {
  return !!id && id in CHROME;
}

export function buildManagingClientsRoleplaySteps(
  roleplayId: McRoleplayKey,
  scenario: RolePlayScenario,
  navigateToCurrent: () => void,
): SessionStep[] {
  const chrome = CHROME[roleplayId];
  const target = scenario.timeBudget?.targetMinutes ?? 15;

  return [
    ...chrome.preceding.map((step) => ({
      id: step.id,
      name: step.name,
      subtitle: step.subtitle,
      modality: step.modality,
      status: "completed" as const,
    })),
    {
      id: roleplayId,
      name: chrome.railName,
      subtitle: `Role play · ${target} min`,
      modality: "role_play" as const,
      status: "current" as const,
      onClick: navigateToCurrent,
    },
  ];
}

export const MC_JOURNEY_META = "Managing Clients · IM Intake";
export const MC_POSITION_LABEL = "Session 4 of 4";
