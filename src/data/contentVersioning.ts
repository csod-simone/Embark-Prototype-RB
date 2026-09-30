/** Admin who publishes content versions in this prototype. */
export const VERSION_AUTHOR = "Alex Reyes";

export const VERSIONED_CONTENT_ID = "sf-article";
export const VERSIONED_CONTENT_TITLE = "Suitability file standards";
export const VERSIONED_PATH_ID = "cur-suitability-file";
export const VERSIONED_PATH_NAME = "Suitability File Standards Path";
export const VERSIONED_JOURNEY_ID = "j-suitability-file";
export const VERSIONED_JOURNEY_NAME = "Suitability File Standards Journey";
export const VERSIONED_COHORT_EXISTING = "cohort-suitability-a";
export const VERSIONED_COHORT_NEW = "cohort-suitability-b";

export const VERSION_RULE =
  "A cohort that starts after a version is published receives that version. A learner who has already started the content stays on the version they started. A learner who has not started is assigned the new version. They are not asked to retake it.";

export type ContentVersionRecord = {
  id: string;
  pathVersion: string;
  publishedAt: string;
  publishedBy: string;
  summary: string;
  body: string;
};

/** Oldest first. Add the next published version at the end. */
export const CONTENT_VERSIONS: ContentVersionRecord[] = [
  {
    id: "v1",
    pathVersion: "1.0",
    publishedAt: "2026-08-04",
    publishedBy: VERSION_AUTHOR,
    summary: "Original file-note standard.",
    body: "Record the client's objectives, the advice given, and the reasons it is suitable. A discretionary exception may be noted when the client has already agreed a standing instruction. File the note in the client record before the meeting is closed.",
  },
  {
    id: "v2",
    pathVersion: "1.1",
    publishedAt: "2026-09-16",
    publishedBy: VERSION_AUTHOR,
    summary: "Adds the evidence checklist and removes the discretionary exception.",
    body: "Record the client's objectives, the advice given, and the reasons it is suitable. Attach the evidence checklist, including costs, risks, and the client's confirmation. File the note before the meeting is closed. The discretionary exception no longer applies.",
  },
  {
    id: "v3",
    pathVersion: "1.2",
    publishedAt: "2026-09-28",
    publishedBy: VERSION_AUTHOR,
    summary: "Adds how to file an email confirmation.",
    body: "Record the client's objectives, the advice given, and the reasons it is suitable. Attach the evidence checklist, including costs, risks, and the client's confirmation. If the client confirms by email, file that message with the note. File the note before the meeting is closed.",
  },
];

export function currentContentVersion(): ContentVersionRecord {
  return CONTENT_VERSIONS[CONTENT_VERSIONS.length - 1];
}

export function contentVersionsNewestFirst(): ContentVersionRecord[] {
  return [...CONTENT_VERSIONS].reverse();
}

export function formatVersionDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export type VersionScope = "content" | "path" | "journey" | "cohort-existing" | "cohort-new";

export type VersionAssignment = {
  learnerId: string;
  name: string;
  email: string;
  cohortId: string;
  status: "in_progress" | "completed" | "not_started";
  progress: number;
  enrolledDate: string;
  versionId: string;
  reason: string;
};

const COHORT_NAME: Record<string, string> = {
  [VERSIONED_COHORT_EXISTING]: "Suitability File Cohort A",
  [VERSIONED_COHORT_NEW]: "Suitability File Cohort B",
};

const EXISTING_COHORT_LEARNERS: VersionAssignment[] = [
  {
    learnerId: "sf-sophie",
    name: "Sophie Hale",
    email: "sophie.hale@rathbones.com",
    cohortId: VERSIONED_COHORT_EXISTING,
    status: "completed",
    progress: 100,
    enrolledDate: "2026-09-01",
    versionId: "v1",
    reason: "Completed v1. Stays on the version already finished.",
  },
  {
    learnerId: "sf-owen",
    name: "Owen Brooks",
    email: "owen.brooks@rathbones.com",
    cohortId: VERSIONED_COHORT_EXISTING,
    status: "in_progress",
    progress: 40,
    enrolledDate: "2026-09-01",
    versionId: "v1",
    reason: "Started v1. Stays on it and is not asked to retake it.",
  },
  {
    learnerId: "sf-nina",
    name: "Nina Shah",
    email: "nina.shah@rathbones.com",
    cohortId: VERSIONED_COHORT_EXISTING,
    status: "not_started",
    progress: 0,
    enrolledDate: "2026-09-01",
    versionId: "v3",
    reason: "Had not started, so assigned the current version.",
  },
  {
    learnerId: "sf-leo",
    name: "Leo Grant",
    email: "leo.grant@rathbones.com",
    cohortId: VERSIONED_COHORT_EXISTING,
    status: "not_started",
    progress: 0,
    enrolledDate: "2026-09-01",
    versionId: "v3",
    reason: "Had not started, so assigned the current version.",
  },
];

const NEW_COHORT_LEARNERS: VersionAssignment[] = [
  {
    learnerId: "sf-maya",
    name: "Maya Ellis",
    email: "maya.ellis@rathbones.com",
    cohortId: VERSIONED_COHORT_NEW,
    status: "not_started",
    progress: 0,
    enrolledDate: "2026-09-22",
    versionId: "v3",
    reason: "Had not started v2, so was moved to v3 when it was published.",
  },
  {
    learnerId: "sf-ben",
    name: "Ben Carter",
    email: "ben.carter@rathbones.com",
    cohortId: VERSIONED_COHORT_NEW,
    status: "in_progress",
    progress: 25,
    enrolledDate: "2026-09-22",
    versionId: "v2",
    reason: "Started v2 before v3 was published. Stays on v2.",
  },
  {
    learnerId: "sf-isla",
    name: "Isla Rahman",
    email: "isla.rahman@rathbones.com",
    cohortId: VERSIONED_COHORT_NEW,
    status: "completed",
    progress: 100,
    enrolledDate: "2026-09-22",
    versionId: "v2",
    reason: "Completed v2 before v3 was published. Stays on v2.",
  },
];

export const VERSION_ASSIGNMENTS: VersionAssignment[] = [
  ...EXISTING_COHORT_LEARNERS,
  ...NEW_COHORT_LEARNERS,
];

export function isVersionedContent(contentId: string | undefined): boolean {
  return contentId === VERSIONED_CONTENT_ID;
}

export function isVersionedPath(pathId: string | undefined): boolean {
  return pathId === VERSIONED_PATH_ID;
}

export function isVersionedJourney(journeyId: string | undefined): boolean {
  return journeyId === VERSIONED_JOURNEY_ID;
}

export function versionScopeForCohort(cohortId: string | undefined): VersionScope | null {
  if (cohortId === VERSIONED_COHORT_EXISTING) return "cohort-existing";
  if (cohortId === VERSIONED_COHORT_NEW) return "cohort-new";
  return null;
}

export function cohortIdForScope(scope: VersionScope): string | null {
  if (scope === "cohort-existing") return VERSIONED_COHORT_EXISTING;
  if (scope === "cohort-new") return VERSIONED_COHORT_NEW;
  return null;
}

export function assignmentsForCohort(cohortId: string | undefined): VersionAssignment[] {
  return VERSION_ASSIGNMENTS.filter((row) => row.cohortId === cohortId);
}

export function assignmentForLearner(learnerId: string | undefined): VersionAssignment | undefined {
  return VERSION_ASSIGNMENTS.find((row) => row.learnerId === learnerId);
}

export function learnerRowsForVersionedCohort(cohortId: string) {
  return assignmentsForCohort(cohortId).map((row) => ({
    id: row.learnerId,
    name: row.name,
    email: row.email,
    status: row.status,
    progress: row.progress,
    enrolledDate: row.enrolledDate,
  }));
}

function statusLabel(status: VersionAssignment["status"]): string {
  if (status === "completed") return "completed";
  if (status === "in_progress") return "in progress";
  return "not started";
}

export type VersionCohortUse = {
  cohortId: string;
  cohortName: string;
  learners: VersionAssignment[];
};

export function usageForVersion(versionId: string): VersionCohortUse[] {
  const rows = VERSION_ASSIGNMENTS.filter((row) => row.versionId === versionId);
  const ids = [...new Set(rows.map((row) => row.cohortId))];
  return ids.map((cohortId) => ({
    cohortId,
    cohortName: COHORT_NAME[cohortId] ?? cohortId,
    learners: rows.filter((row) => row.cohortId === cohortId),
  }));
}

export function learnerCountForVersion(versionId: string): number {
  return VERSION_ASSIGNMENTS.filter((row) => row.versionId === versionId).length;
}

/** Compact "v1 (2), v3 (2)" for the versions a cohort still has. */
export function cohortVersionCounts(cohortId: string): string {
  const counts = CONTENT_VERSIONS.map((version) => {
    const count = assignmentsForCohort(cohortId).filter((row) => row.versionId === version.id).length;
    return count > 0 ? `${version.id} (${count})` : null;
  }).filter((part): part is string => part != null);
  return counts.join(", ");
}

export function versionsStillInUse(): string {
  const parts = CONTENT_VERSIONS.map((version) => {
    const count = learnerCountForVersion(version.id);
    return count > 0 ? `${version.id} (${count})` : null;
  }).filter((part): part is string => part != null);
  return parts.length > 0 ? `Still in use: ${parts.join(", ")}.` : "No version is currently assigned.";
}

/** One or two lines for the hover. The full history lives in the dialog. */
export function scopeSummary(scope: VersionScope): string {
  const current = currentContentVersion();
  const cohortId = cohortIdForScope(scope);
  if (cohortId) {
    return `This cohort uses ${cohortVersionCounts(cohortId)}.`;
  }
  if (scope === "path") {
    return `This path is ${current.pathVersion}, which uses ${current.id}. Learners who started an earlier version stay on it.`;
  }
  if (scope === "journey") {
    return `Includes ${VERSIONED_PATH_NAME} at ${current.pathVersion}.`;
  }
  return `Used on ${VERSIONED_PATH_NAME} and ${VERSIONED_JOURNEY_NAME}.`;
}

export function usageNames(learners: VersionAssignment[]): string {
  const shown = learners.slice(0, 3).map((learner) => `${learner.name} (${statusLabel(learner.status)})`);
  const extra = learners.length - shown.length;
  return extra > 0 ? `${shown.join(", ")} +${extra} more` : shown.join(", ");
}
