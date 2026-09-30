export type ManagerProfileSignal = {
  id: string;
  learnerId: string;
  learnerName: string;
  tone: "success" | "warning";
  overview: string;
  detail: string;
};

/** Manager-only profile flags. Source names so the term swap can display them. */
export const MANAGER_PROFILE_SIGNALS: ManagerProfileSignal[] = [
  {
    id: "signal-high-performer-l6",
    learnerId: "l6",
    learnerName: "Lily Zhang",
    tone: "success",
    overview:
      "Lily Zhang is an early high performer on IM Intake Pathway. Readiness is 97 and she is already on the chapter gate, ahead of the cohort.",
    detail:
      "Lily Zhang is moving through IM Intake Pathway ahead of IM Intake Cohort A. Readiness is 97 (Fast Tracker) and progress is 95%. She was last active 1 hour ago and has no open hands. Knowledge checks and practice sessions are landing above the pass mark, and she is now on the chapter gate, the last activity in the path. A short note of recognition is worth making before graduation review. Compliance Refresher Path and Discretionary Portfolio Management stay locked until IM Intake Pathway is complete.",
  },
  {
    id: "signal-check-in-l5",
    learnerId: "l5",
    learnerName: "Darius Osei",
    tone: "warning",
    overview:
      "Darius Osei may need a 1:1. He is halfway through IM Intake Pathway on Advice documentation, with readiness at 72, and has not asked for help.",
    detail:
      "Darius Osei is On Track, with readiness at 72 and progress at 55%. He is currently on Advice documentation, and Knowledge check 3 is the next activity. He was last active 6 hours ago and has not raised a hand. A 1:1 before that knowledge check would show whether the advice documentation is landing, while there is still time to help.",
  },
];

export function profileSignalsFor(learnerId: string): ManagerProfileSignal[] {
  return MANAGER_PROFILE_SIGNALS.filter((signal) => signal.learnerId === learnerId);
}
