import { cohortLearners } from "@/data/mockData";
import { swapRathbonesTerms } from "@/data/rathbonesTerms";
import { learnersForCohort } from "@/pages/embark/admin/cohorts/enrollmentData";
import { SEED_COHORTS } from "@/pages/embark/admin/cohorts/data";
import {
  CURRICULA_OPTIONS,
  IM_INTAKE_JOURNEY_NAME,
  IM_INTAKE_PATH_NAMES,
  JOURNEYS,
} from "@/pages/embark/admin/journeys/data";

export type StaffSageScope = "manager" | "admin";

export type StaffPrompt = { id: string; label: string };

const INTAKE_ITEMS = [
  "Client relationships foundations",
  "Knowledge check 1",
  "Discovery and objectives",
  "Practice — Discovery with James Whitfield",
  "Knowledge check 2",
  "Suitability under pressure",
  "Practice — Suitability under pressure",
  "Advice documentation",
  "Knowledge check 3",
  "Formative — Suitability with Daniel Ellison",
  "Module assessment",
  "Chapter gate",
] as const;

type Row = {
  id: string;
  name: string;
  cohortId: string;
  cohortName: string;
  journey: string;
  progress: number;
  readinessScore: number | null;
  band: string;
  lastActive: string;
  notStarted: boolean;
};

const rosterById = new Map(cohortLearners.map((learner) => [learner.id, learner]));

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  if (!year || !month || !day) return iso;
  return `${day} ${months[month - 1]} ${year}`;
}

function rowsFor(cohortId: string): Row[] {
  const cohort = SEED_COHORTS.find((item) => item.id === cohortId);
  if (!cohort) return [];
  const notStarted = cohort.status === "starting";
  return learnersForCohort(cohortId).map((learner) => {
    const roster = rosterById.get(learner.id);
    return {
      id: learner.id,
      name: learner.name,
      cohortId: cohort.id,
      cohortName: cohort.name,
      journey: cohort.journey,
      progress: notStarted ? 0 : learner.progress,
      readinessScore: notStarted ? null : roster?.readinessScore ?? null,
      band: notStarted ? "Not started" : roster?.band ?? "In progress",
      lastActive: notStarted ? "not started" : roster?.lastActive ?? "—",
      notStarted,
    };
  });
}

const COHORTS = SEED_COHORTS.map((cohort) => ({
  ...cohort,
  learners: rowsFor(cohort.id),
}));

function allRows(): Row[] {
  return COHORTS.flatMap((cohort) => cohort.learners);
}

function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function aliasesFor(name: string): string[] {
  const display = swapRathbonesTerms(name);
  const names = new Set([name, display]);
  for (const full of [name, display]) {
    const parts = full.split(" ").filter(Boolean);
    if (parts[0]) names.add(parts[0]);
    if (parts.length > 1) names.add(parts[parts.length - 1]);
  }
  return [...names].map((item) => item.toLowerCase());
}

const LEARNER_ALIASES = [...new Map(allRows().map((row) => [row.id, row])).values()].map((row) => ({
  id: row.id,
  aliases: aliasesFor(row.name),
}));

function mentions(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
}

type Focus =
  | { kind: "learner"; id: string }
  | { kind: "cohort"; id: string }
  | { kind: "path"; name: string }
  | { kind: "journey"; id: string }
  | { kind: "assessment"; name: string }
  | { kind: "all" };

function findLearner(text: string): string | null {
  const ranked = LEARNER_ALIASES.flatMap((learner) =>
    learner.aliases
      .filter((alias) => alias.length > 2 && mentions(text, alias))
      .map((alias) => ({ id: learner.id, length: alias.length })),
  ).sort((a, b) => b.length - a.length);
  return ranked[0]?.id ?? null;
}

function findCohort(text: string): string | null {
  if (mentions(text, "cohort b") || mentions(text, "im intake cohort b")) return "cohort-b";
  if (mentions(text, "q3") || mentions(text, "cohort q3")) return "cohort-q3";
  if (mentions(text, "cohort a") || mentions(text, "im intake cohort a")) return "cohort-a";
  return null;
}

function findPath(text: string): string | null {
  const paths = [...CURRICULA_OPTIONS].sort((a, b) => b.name.length - a.name.length);
  for (const path of paths) {
    if (mentions(text, path.name.toLowerCase())) return path.name;
  }
  if (mentions(text, "intake pathway") || mentions(text, "intake track")) {
    return IM_INTAKE_PATH_NAMES[0];
  }
  if (mentions(text, "compliance")) return "Compliance Refresher Path";
  if (mentions(text, "discretionary")) return "Discretionary Portfolio Management";
  if (mentions(text, "track") || mentions(text, "path")) return IM_INTAKE_PATH_NAMES[0];
  return null;
}

function findJourney(text: string): string | null {
  const journeys = [...JOURNEYS].sort((a, b) => b.name.length - a.name.length);
  for (const journey of journeys) {
    if (mentions(text, journey.name.toLowerCase())) return journey.id;
  }
  if (mentions(text, "full onboarding")) return "j-medicare-full";
  return null;
}

function findAssessment(text: string): string | null {
  if (mentions(text, "knowledge check 1") || mentions(text, "first knowledge check")) return "Knowledge check 1";
  if (mentions(text, "knowledge check 2")) return "Knowledge check 2";
  if (mentions(text, "knowledge check 3")) return "Knowledge check 3";
  if (mentions(text, "chapter gate")) return "Chapter gate";
  if (mentions(text, "module assessment")) return "Module assessment";
  if (mentions(text, "role-play") || mentions(text, "role play") || mentions(text, "roleplay")) return "Role-play";
  if (mentions(text, "assessment") || mentions(text, "knowledge check")) return "Assessment";
  return null;
}

function focusFor(text: string): Focus {
  const learnerId = findLearner(text);
  if (learnerId) return { kind: "learner", id: learnerId };
  const assessment = findAssessment(text);
  if (assessment && assessment !== "Assessment") return { kind: "assessment", name: assessment };
  const path = findPath(text);
  if (path) return { kind: "path", name: path };
  const cohortId = findCohort(text);
  if (cohortId) return { kind: "cohort", id: cohortId };
  const journeyId = findJourney(text);
  if (journeyId) return { kind: "journey", id: journeyId };
  if (assessment) return { kind: "assessment", name: assessment };
  return { kind: "all" };
}

function intentFor(text: string): "behind" | "readiness" | "status" | "help" {
  if (/behind|at risk|struggl|lagging|falling behind|not on track|who is late/.test(text)) return "behind";
  if (/readiness|how ready|ready are|ready is/.test(text)) return "readiness";
  if (/status|update|progress|how (is|are|'s)|where (are|is)|overview|summary|report/.test(text)) return "status";
  return "help";
}

function bullets(lines: string[]): string {
  return lines.map((line) => `• ${line}`).join("\n");
}

function learnerRows(id: string): Row[] {
  return allRows().filter((row) => row.id === id);
}

function isBehind(row: Row): boolean {
  if (row.notStarted) return false;
  return row.band === "At Risk" || row.band === "Needs Attention" || row.progress < 40;
}

function describe(row: Row): string {
  if (row.notStarted) return `${row.name} — not started (${row.cohortName})`;
  const readiness = row.readinessScore == null ? "no score yet" : `${row.readinessScore} (${row.band})`;
  return `${row.name} — ${row.progress}% complete, readiness ${readiness}, last active ${row.lastActive} (${row.cohortName})`;
}

function knownGap(row: Row): string | null {
  if (row.notStarted) return null;
  if (row.id === "l1") {
    return "Knowledge check 1 is not passed (latest score 61%), and a hand is raised on Client relationships foundations.";
  }
  if (row.id === "l3") {
    return "Still on Knowledge check 1, with no pass on record, and no session completed in the last few days.";
  }
  return null;
}

function average(rows: Row[]): number {
  const active = rows.filter((row) => !row.notStarted);
  if (!active.length) return 0;
  return Math.round(active.reduce((sum, row) => sum + row.progress, 0) / active.length);
}

function cohortStatus(cohortId: string): string {
  const cohort = COHORTS.find((item) => item.id === cohortId);
  if (!cohort) return "I can't find that cohort.";
  const behind = cohort.learners.filter(isBehind);
  const lines = [
    `${cohort.name} is ${cohort.status} on ${cohort.journey}.`,
    `${cohort.learners.length} learners · started ${formatDate(cohort.startDate)} · target ${formatDate(cohort.targetDate)}.`,
  ];
  if (cohort.status === "starting") {
    lines.push("The cohort has not started, so there is no progress or readiness to report yet.");
    lines.push(bullets(cohort.learners.map((row) => row.name)));
    return lines.join("\n");
  }
  lines.push(`Average progress is ${average(cohort.learners)}%.`);
  if (behind.length) {
    lines.push(`${behind.length} ${behind.length === 1 ? "learner is" : "learners are"} behind:`);
    lines.push(bullets(behind.map(describe)));
  } else {
    lines.push("Nobody in this cohort is behind.");
  }
  const others = cohort.learners.filter((row) => !isBehind(row));
  if (others.length) {
    lines.push("Everyone else:");
    lines.push(bullets(others.map(describe)));
  }
  return lines.join("\n");
}

function cohortReadiness(cohortId: string): string {
  const cohort = COHORTS.find((item) => item.id === cohortId);
  if (!cohort) return "I can't find that cohort.";
  if (cohort.status === "starting") {
    return `${cohort.name} has not started. Readiness scores are not available until learners begin ${cohort.journey}.`;
  }
  const bands = ["At Risk", "Needs Attention", "On Track", "Ready", "Fast Tracker"];
  const counts = bands
    .map((band) => {
      const count = cohort.learners.filter((row) => row.band === band).length;
      return count ? `${count} ${band}` : null;
    })
    .filter(Boolean) as string[];
  return [
    `Readiness report for ${cohort.name} (${cohort.journey}).`,
    counts.join(" · ") + ".",
    bullets(cohort.learners.map(describe)),
  ].join("\n");
}

function learnerStatus(id: string): string {
  const rows = learnerRows(id);
  if (!rows.length) return "I can't find that learner in the cohorts I can see.";
  const primary = rows.find((row) => !row.notStarted) ?? rows[0];
  const gap = knownGap(primary);
  const enrolments = rows.map((row) => `${row.cohortName} · ${row.journey}`).join("; ");
  return [
    `${primary.name} is enrolled on ${enrolments}.`,
    describe(primary) + ".",
    gap ? gap : "No assessment follow-up is open for this learner.",
    `Current track: ${IM_INTAKE_PATH_NAMES[0]}. ${IM_INTAKE_PATH_NAMES[1]} and ${IM_INTAKE_PATH_NAMES[2]} stay locked until that path is complete.`,
  ].join("\n");
}

function learnerReadiness(id: string): string {
  const rows = learnerRows(id);
  if (!rows.length) return "I can't find that learner in the cohorts I can see.";
  const primary = rows.find((row) => !row.notStarted) ?? rows[0];
  if (primary.notStarted) {
    return `${primary.name} is enrolled on ${primary.cohortName}, which has not started. There is no readiness score yet.`;
  }
  const gap = knownGap(primary);
  return [
    `Readiness report for ${primary.name}.`,
    `Score ${primary.readinessScore} · ${primary.band}. Progress ${primary.progress}% on ${primary.journey}. Last active ${primary.lastActive}.`,
    gap ?? "Assessments on record are not flagging a gap.",
  ].join("\n");
}

function pathNote(pathName: string): string {
  const path = CURRICULA_OPTIONS.find((item) => item.name === pathName);
  const detail = path ? `${path.contentCount} items · ${path.estimatedDuration}` : "";
  if (pathName !== IM_INTAKE_PATH_NAMES[0]) {
    return `${pathName} (${detail}) is locked until ${IM_INTAKE_PATH_NAMES[0]} is complete. Nobody is on this track yet, so nobody is behind on it.`;
  }
  return "";
}

function behindOnPath(pathName: string): string {
  const locked = pathNote(pathName);
  if (locked) return locked;
  const behind = allRows().filter((row) => row.journey === IM_INTAKE_JOURNEY_NAME && isBehind(row));
  return [
    `On ${pathName}, ${behind.length} ${behind.length === 1 ? "learner is" : "learners are"} behind:`,
    bullets(behind.map((row) => `${describe(row)}. ${knownGap(row) ?? ""}`.trim())),
  ].join("\n");
}

function behindOnAssessment(name: string): string {
  if (name === "Knowledge check 1" || name === "Assessment") {
    const jordan = allRows().find((row) => row.id === "l1" && !row.notStarted);
    const marcus = allRows().find((row) => row.id === "l3" && !row.notStarted);
    const lines = [
      "Jordan Kim has not passed Knowledge check 1 (latest score 61%) and is on the follow-up list.",
      "Marcus Webb has not passed Knowledge check 1 and is still on that assessment.",
    ];
    if (name === "Assessment") {
      lines.push("No one else has an open assessment follow-up. Module assessment and the chapter gate have not been reached by the learners who are behind.");
    }
    const where = [jordan, marcus].filter(Boolean) as Row[];
    return [lines.join(" "), bullets(where.map(describe))].join("\n");
  }
  if (name === "Role-play") {
    return "Jordan Kim and Marcus Webb have not reached the discovery role-play on the IM Intake Pathway. Everyone else in IM Intake Cohort A is further along that track.";
  }
  return `${name} sits later on the IM Intake Pathway. The learners who are behind — Jordan Kim and Marcus Webb — have not reached it, so they are not yet behind on ${name} itself. They are behind earlier, on Knowledge check 1.`;
}

function journeyBlurb(journeyId: string, scope: StaffSageScope): string {
  const journey = JOURNEYS.find((item) => item.id === journeyId);
  if (!journey) return "I can't find that journey.";
  const cohorts = SEED_COHORTS.filter((cohort) => cohort.journey === journey.name);
  if (!cohorts.length && scope === "manager") {
    return `${journey.name} is ${journey.status} and is not assigned to a cohort on your manager view.`;
  }
  const paths = journey.curriculaIds
    .map((id) => CURRICULA_OPTIONS.find((path) => path.id === id)?.name)
    .filter(Boolean) as string[];
  const lines = [
    `${journey.name} is ${journey.status}.`,
    paths.length ? `Tracks: ${paths.join(", ")}.` : "No tracks are attached.",
  ];
  if (!cohorts.length) {
    lines.push("No cohort is assigned.");
    return lines.join("\n");
  }
  lines.push(cohorts.map((cohort) => cohortStatus(cohort.id)).join("\n\n"));
  return lines.join("\n");
}

function allJourneyStatus(scope: StaffSageScope): string {
  const journeys = scope === "admin"
    ? JOURNEYS
    : JOURNEYS.filter((journey) => SEED_COHORTS.some((cohort) => cohort.journey === journey.name));
  return [
    scope === "admin" ? "Status of every journey:" : "Status of the journeys on your cohorts:",
    bullets(
      journeys.map((journey) => {
        const cohorts = SEED_COHORTS.filter((cohort) => cohort.journey === journey.name);
        const assigned = cohorts.length
          ? cohorts.map((cohort) => cohort.name).join(", ")
          : "no cohort assigned";
        return `${journey.name} — ${journey.status} · ${assigned}`;
      }),
    ),
  ].join("\n");
}

function behindAll(): string {
  const seen = new Set<string>();
  const behind = allRows().filter((row) => {
    if (!isBehind(row) || seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
  if (!behind.length) return "Nobody is behind on the cohorts I can see.";
  return ["Learners who are behind:", bullets(behind.map((row) => `${describe(row)}. ${knownGap(row) ?? ""}`.trim()))].join("\n");
}

function readinessAll(): string {
  return ["Readiness across your cohorts:", ...COHORTS.map((cohort) => cohortReadiness(cohort.id))].join("\n\n");
}

function statusAll(scope: StaffSageScope): string {
  return [
    scope === "manager"
      ? "Status update across the cohorts on your manager view:"
      : "Status update across cohorts:",
    ...COHORTS.map((cohort) => cohortStatus(cohort.id)),
  ].join("\n\n");
}

function answerFor(intent: "behind" | "readiness" | "status", focus: Focus, scope: StaffSageScope): string {
  if (focus.kind === "learner") {
    if (intent === "behind") {
      const rows = learnerRows(focus.id).filter((row) => !row.notStarted);
      const row = rows[0];
      if (!row) return learnerStatus(focus.id);
      if (!isBehind(row)) return `${row.name} is not behind. ${describe(row)}.`;
      return `${row.name} is behind. ${describe(row)}. ${knownGap(row) ?? ""}`.trim();
    }
    return intent === "readiness" ? learnerReadiness(focus.id) : learnerStatus(focus.id);
  }
  if (focus.kind === "cohort") {
    if (intent === "behind") {
      const cohort = COHORTS.find((item) => item.id === focus.id);
      const behind = cohort?.learners.filter(isBehind) ?? [];
      if (!behind.length) return `Nobody is behind in ${cohort?.name ?? "that cohort"}.`;
      return [`Behind in ${cohort?.name}:`, bullets(behind.map((row) => `${describe(row)}. ${knownGap(row) ?? ""}`.trim()))].join("\n");
    }
    return intent === "readiness" ? cohortReadiness(focus.id) : cohortStatus(focus.id);
  }
  if (focus.kind === "path") {
    if (intent === "readiness" && focus.name !== IM_INTAKE_PATH_NAMES[0]) return pathNote(focus.name);
    if (intent === "behind") return behindOnPath(focus.name);
    if (intent === "readiness") return ["Readiness on the IM Intake Pathway:", readinessAll()].join("\n\n");
    const locked = pathNote(focus.name);
    if (locked) return locked;
    return [
      `${focus.name} is the active track on ${IM_INTAKE_JOURNEY_NAME}.`,
      `It has ${INTAKE_ITEMS.length} items, from ${INTAKE_ITEMS[0]} through ${INTAKE_ITEMS[INTAKE_ITEMS.length - 1]}.`,
      behindOnPath(focus.name),
    ].join("\n");
  }
  if (focus.kind === "journey") {
    if (intent === "behind") {
      const journey = JOURNEYS.find((item) => item.id === focus.id);
      const behind = allRows().filter((row) => row.journey === journey?.name && isBehind(row));
      if (!behind.length) return `Nobody is behind on ${journey?.name ?? "that journey"}.`;
      return [`Behind on ${journey?.name}:`, bullets(behind.map(describe))].join("\n");
    }
    if (intent === "readiness") {
      const journey = JOURNEYS.find((item) => item.id === focus.id);
      const cohorts = COHORTS.filter((cohort) => cohort.journey === journey?.name);
      if (!cohorts.length) return journeyBlurb(focus.id, scope);
      return cohorts.map((cohort) => cohortReadiness(cohort.id)).join("\n\n");
    }
    return journeyBlurb(focus.id, scope);
  }
  if (focus.kind === "assessment") {
    if (intent === "readiness") {
      return ["Readiness for learners with assessment follow-up:", behindOnAssessment(focus.name)].join("\n\n");
    }
    return behindOnAssessment(focus.name);
  }
  if (intent === "behind") return behindAll();
  if (intent === "readiness") return readinessAll();
  return statusAll(scope);
}

const HELP = [
  "I can answer three kinds of question about your learners:",
  "• A status update — for a learner, cohort, track, assessment, or journey.",
  "• A readiness report — scores and bands for a person, a cohort, or a track.",
  "• Who is behind — on a track, a learner, a cohort, an assessment, or a journey.",
  "Try “Who is behind on the IM Intake Pathway?” or “Readiness report for Jordan Kim.”",
].join("\n");

export function staffPrompts(scope: StaffSageScope): StaffPrompt[] {
  const prompts: StaffPrompt[] = [
    { id: "status-cohort", label: "Status update for IM Intake Cohort A" },
    { id: "behind-track", label: "Who is behind on the IM Intake Pathway?" },
    { id: "readiness-learner", label: "Readiness report for Jordan Kim" },
    { id: "behind-assessment", label: "Who is behind on Knowledge check 1?" },
    { id: "status-journey", label: "Status update for the Investment Manager Full Onboarding Journey" },
    { id: "readiness-cohorts", label: "Readiness report for my cohorts" },
  ];
  if (scope === "admin") {
    prompts.push({ id: "status-journeys", label: "Status update for every journey" });
  }
  return prompts;
}

export function answerStaffSage(question: string, scope: StaffSageScope): string {
  const text = normalise(question);
  if (!text) return HELP;
  if (/every journey|all journeys/.test(text) && intentFor(text) === "status") return allJourneyStatus(scope);
  const intent = intentFor(text);
  if (intent === "help") {
    const focus = focusFor(text);
    if (focus.kind === "all") return HELP;
    return answerFor("status", focus, scope);
  }
  return answerFor(intent, focusFor(text), scope);
}
