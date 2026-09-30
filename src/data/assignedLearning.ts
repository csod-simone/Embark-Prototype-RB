/**
 * Facilitator-assigned additional learning, surfaced as real journey items.
 *
 * Assignments are created from the assessment follow-up screens and stored in
 * the assessment records store. This module turns them into `CsrItem`s so the
 * learner journey, the session sidebar and every journey view can render them
 * with the existing patterns. Reads localStorage directly to avoid a cycle with
 * the records hook.
 */
import type { CsrItem, CsrModality } from "./csrOnboarding";

const RECORDS_KEY = "embark:assessment-records:v1";
const ASSIGNED_PREFIX = "assigned";

/** Prototype learner whose journey is rendered (Jordan Kim). */
export const ASSIGNED_LEARNER_ID = "l1";

export type StoredAssignmentItem = {
  id: string;
  title: string;
  type: string;
  durationLabel: string;
};

export type StoredAssignment = {
  id: string;
  learnerId: string;
  itemId: string;
  items: StoredAssignmentItem[];
  rationale: string;
  assignedBy: string;
  assignedAt: string;
  completedItemIds: string[];
};

export function readAssignments(learnerId = ASSIGNED_LEARNER_ID): StoredAssignment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { assignments?: StoredAssignment[] };
    return (parsed.assignments ?? [])
      .filter((a) => a.learnerId === learnerId && a.items?.length)
      .sort((a, b) => (a.assignedAt ?? "").localeCompare(b.assignedAt ?? ""));
  } catch {
    return [];
  }
}

export function assignedItemId(assignmentId: string, contentId: string): string {
  return `${ASSIGNED_PREFIX}:${assignmentId}:${contentId}`;
}

export function parseAssignedItemId(
  id: string,
): { assignmentId: string; contentId: string } | undefined {
  if (!id.startsWith(`${ASSIGNED_PREFIX}:`)) return undefined;
  const [, assignmentId, ...rest] = id.split(":");
  if (!assignmentId || rest.length === 0) return undefined;
  return { assignmentId, contentId: rest.join(":") };
}

export function isAssignedItemId(id: string): boolean {
  return !!parseAssignedItemId(id);
}

/** Maps a content library type onto an existing journey modality. */
function modalityFor(type: string): CsrModality {
  const t = (type ?? "").toLowerCase();
  if (t.includes("role")) return "Role-play";
  if (t.includes("simulation")) return "Zenerate Simulation";
  if (t.includes("video")) return "Storyline Demo";
  if (t.includes("readiness")) return "Readiness Check";
  if (t.includes("benchmark")) return "Benchmark Check";
  if (t.includes("comprehension")) return "Comprehension Check";
  if (t.includes("proficiency")) return "Proficiency Check";
  return "eLearning";
}

function durationFor(label: string): number {
  const match = /(\d+)/.exec(label ?? "");
  const value = match ? Number(match[1]) : NaN;
  return Number.isFinite(value) && value > 0 && value <= 240 ? value : 10;
}

export type AssignedJourneyItem = {
  /** The assessment item the follow-up relates to — the insertion point. */
  anchorItemId: string;
  item: CsrItem;
};

/** All assigned learning for a learner, as journey items in assignment order. */
export function assignedJourneyItems(learnerId = ASSIGNED_LEARNER_ID): AssignedJourneyItem[] {
  const out: AssignedJourneyItem[] = [];
  for (const assignment of readAssignments(learnerId)) {
    for (const content of assignment.items) {
      out.push({
        anchorItemId: assignment.itemId,
        item: {
          id: assignedItemId(assignment.id, content.id),
          order: 0,
          modality: modalityFor(content.type),
          title: content.title,
          duration: durationFor(content.durationLabel),
          assignedBy: assignment.assignedBy,
          assignedReason: assignment.rationale,
        },
      });
    }
  }
  return out;
}

export function findAssignedJourneyItem(
  id: string,
  learnerId = ASSIGNED_LEARNER_ID,
): AssignedJourneyItem | undefined {
  return (
    assignedJourneyItems(learnerId).find((entry) => entry.item.id === id) ??
    adHocLearningItems(learnerId).find((entry) => entry.item.id === id)
  );
}

/** Ad-hoc additional learning assigned outside any assessment outcome. */
export type StoredAdHocAssignment = {
  id: string;
  learnerId: string;
  learnerName?: string;
  items: StoredAssignmentItem[];
  note?: string;
  assignedBy: string;
  assignedAt: string;
  completedItemIds: string[];
  startedItemIds?: string[];
};

export function readAdHocAssignments(learnerId = ASSIGNED_LEARNER_ID): StoredAdHocAssignment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { adHocAssignments?: StoredAdHocAssignment[] };
    return (parsed.adHocAssignments ?? [])
      .filter((a) => a.learnerId === learnerId && a.items?.length)
      .sort((a, b) => (a.assignedAt ?? "").localeCompare(b.assignedAt ?? ""));
  } catch {
    return [];
  }
}

/** Ad-hoc assignments as launchable items — never inserted into the journey. */
export function adHocLearningItems(learnerId = ASSIGNED_LEARNER_ID): AssignedJourneyItem[] {
  const out: AssignedJourneyItem[] = [];
  for (const assignment of readAdHocAssignments(learnerId)) {
    for (const content of assignment.items) {
      out.push({
        anchorItemId: "",
        item: {
          id: assignedItemId(assignment.id, content.id),
          order: 0,
          modality: modalityFor(content.type),
          title: content.title,
          duration: durationFor(content.durationLabel),
          assignedBy: assignment.assignedBy,
          assignedReason: assignment.note,
        },
      });
    }
  }
  return out;
}

/** Route for an assigned item — mirrors `routeForCsrItem` without the cycle. */
export function routeForAssignedItem(item: CsrItem): string {
  switch (item.modality) {
    case "Role-play":
    case "Zenerate Simulation":
      return `/learner/role-play/${item.id}`;
    case "Comprehension Check":
      return `/learner/comprehension/${item.id}`;
    case "Readiness Check":
    case "Benchmark Check":
    case "Proficiency Check":
      return `/learner/assessment/${item.id}`;
    default:
      return `/learner/session/${item.id}`;
  }
}
