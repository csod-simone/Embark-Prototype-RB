import type { TreeModule } from "./CurriculumTree";

const intakeModules: TreeModule[] = [
  {
    id: "m1",
    name: "Client relationships",
    expandedDefault: true,
    sessions: [
      { id: "mc-c1", kind: "Article", name: "Client relationships foundations", meta: "20 min" },
      { id: "mc-k1", kind: "Assessment", name: "Knowledge check 1", meta: "10 min" },
      { id: "mc-c2", kind: "Article", name: "Discovery and objectives", meta: "20 min" },
      { id: "mc-rp1", kind: "Role play", name: "Practice — Discovery with James Whitfield", meta: "20 min" },
    ],
  },
  {
    id: "m2",
    name: "Suitability and advice",
    summary: "2 articles · 2 role-plays · 3 checks",
    sessions: [
      { id: "mc-k2", kind: "Assessment", name: "Knowledge check 2", meta: "10 min" },
      { id: "mc-c3", kind: "Article", name: "Suitability under pressure", meta: "20 min" },
      { id: "mc-rp2", kind: "Role play", name: "Practice — Suitability under pressure", meta: "20 min" },
      { id: "mc-c4", kind: "Article", name: "Advice documentation", meta: "15 min" },
      { id: "mc-k3", kind: "Assessment", name: "Knowledge check 3", meta: "10 min" },
      { id: "mc-rp-f", kind: "Role play", name: "Formative — Suitability with Daniel Ellison", meta: "30 min" },
      { id: "mc-ma", kind: "Assessment", name: "Module assessment", meta: "25 min" },
      { id: "mc-cg", kind: "Assessment", name: "Chapter gate", meta: "15 min" },
    ],
  },
];

const complianceModules: TreeModule[] = [
  {
    id: "c1",
    name: "Conduct",
    expandedDefault: true,
    sessions: [
      { id: "cmp-1", kind: "Article", name: "FCA conduct essentials", meta: "20 min" },
      { id: "cmp-2", kind: "Article", name: "Financial crime and market abuse", meta: "15 min" },
      { id: "cmp-a", kind: "Assessment", name: "Conduct knowledge check", meta: "10 min" },
    ],
  },
];

const discretionaryModules: TreeModule[] = [
  {
    id: "d1",
    name: "Discretionary portfolios",
    expandedDefault: true,
    sessions: [
      { id: "dpm-1", kind: "Article", name: "Discretionary mandate types", meta: "20 min" },
      { id: "dpm-2", kind: "Article", name: "Reporting a portfolio valuation", meta: "15 min" },
      { id: "dpm-a", kind: "Assessment", name: "Discretionary knowledge check", meta: "10 min" },
    ],
  },
];

const MODULES_BY_PATH: Record<string, TreeModule[]> = {
  "cur-medicare-onboarding": intakeModules,
  "cur-compliance-refresher": complianceModules,
  "cur-medicare-advantage": discretionaryModules,
};

export const defaultModules: TreeModule[] = intakeModules;

/** Builder ingest-step shapes (structure only — no learner progress). */
export type BuilderItem = { id: string; title: string; type: string; duration: string };
export type BuilderSection = { id: string; name: string; items: BuilderItem[]; threshold: string };

export function csrWeekModules(curriculumId: string): TreeModule[] | null {
  return MODULES_BY_PATH[curriculumId] ?? null;
}

/**
 * Existing paths open with the same week structure shown on Refine.
 * A new path starts empty.
 */
export function csrWeekSections(curriculumId: string): BuilderSection[] | null {
  if (curriculumId === "new") return null;
  const modules = MODULES_BY_PATH[curriculumId] ?? defaultModules;
  return modules.map((mod) => ({
    id: `sec-${mod.id}`,
    name: mod.name,
    threshold: "100",
    items: mod.sessions.map((session) => ({
      id: session.id,
      title: session.name,
      type: session.label ?? session.kind,
      duration: session.meta,
    })),
  }));
}
