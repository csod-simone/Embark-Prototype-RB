import { cohortLearners } from "@/data/mockData";
import { getLearnerRecord, type LearnerWeekProgress } from "@/data/learnerDirectory";

/** Learners whose time on a module is far outside the usual range. */
const LONG_FACTOR: Record<string, number> = {
  l3: 7.5,
};

export type ModuleTime = {
  weekId: string;
  moduleName: string;
  spentMin: number;
  expectedMin: number;
  started: boolean;
  unusual: "long" | "short" | null;
};

export function formatModuleTime(minutes: number): string {
  if (minutes <= 0) return "0 min";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function expectedMinutes(week: LearnerWeekProgress): number {
  return week.items.reduce((sum, item, index) => {
    const state = week.states[index];
    if (state === "completed" || state === "in_progress" || state === "skipped") {
      return sum + item.duration;
    }
    return sum;
  }, 0);
}

function factorFor(learnerId: string): number {
  const fixed = LONG_FACTOR[learnerId];
  if (fixed != null) return fixed;
  let hash = 0;
  for (let i = 0; i < learnerId.length; i++) hash = (hash * 33 + learnerId.charCodeAt(i)) >>> 0;
  return 0.8 + (hash % 6) * 0.1;
}

export function timeForWeek(learnerId: string, week: LearnerWeekProgress): ModuleTime {
  const expectedMin = expectedMinutes(week);
  const started = expectedMin > 0;
  const spentMin = started ? Math.max(1, Math.round(expectedMin * factorFor(learnerId))) : 0;
  const unusual = !started
    ? null
    : spentMin > expectedMin * 2
      ? "long"
      : spentMin < expectedMin * 0.4
        ? "short"
        : null;
  return {
    weekId: week.id,
    moduleName: week.name,
    spentMin,
    expectedMin,
    started,
    unusual,
  };
}

export type UnusualModuleTime = ModuleTime & {
  learnerId: string;
  learnerName: string;
};

/** Unusual module time for learners on the manager roster. */
export function unusualModuleTimes(): UnusualModuleTime[] {
  const rows: UnusualModuleTime[] = [];
  for (const learner of cohortLearners) {
    const record = getLearnerRecord(learner.id);
    if (!record) continue;
    for (const week of record.weeks) {
      const time = timeForWeek(learner.id, week);
      if (!time.unusual) continue;
      rows.push({ ...time, learnerId: learner.id, learnerName: learner.name });
    }
  }
  return rows;
}

export function unusualTimeInsight(row: UnusualModuleTime): string {
  const spent = formatModuleTime(row.spentMin);
  const expected = formatModuleTime(row.expectedMin);
  if (row.unusual === "short") {
    return `${row.learnerName} has spent ${spent} on ${row.moduleName}, far less than the ${expected} that work usually takes. Check in to see whether the module landed.`;
  }
  return `${row.learnerName} has spent ${spent} on ${row.moduleName}, far longer than the ${expected} that work usually takes. Check in with them.`;
}
