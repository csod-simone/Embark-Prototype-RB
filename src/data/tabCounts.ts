/**
 * Derived counts used by tab/nav badges across personas.
 *
 * Each count reads from the same data the corresponding page renders so a
 * badge can never drift out of sync with the list behind it. The convention is
 * "actionable items only": unresolved hands, pending approvals, live coaching
 * prompts, upcoming events, cohorts that need attention.
 */
import { trainerEvents, helpRequests } from "@/data/mockData";
import { cohorts as managerCohorts } from "@/pages/embark/manager/Cohorts";
import { requests as approvalRequests } from "@/pages/embark/manager/Approvals";
import { prompts as coachingPrompts } from "@/pages/embark/manager/Coaching";
import { initialStatuses as managerHandStatuses } from "@/pages/embark/manager/HandsRaised";
import { graduationCandidates } from "@/pages/embark/manager/GraduationReview";
import { initialStatuses as trainerHandStatuses } from "@/pages/embark/trainer/HandsRaised";

const unresolved = (statuses: Record<string, string>) =>
  Object.values(statuses).filter((s) => s === "open" || s === "in_progress").length;

/** Cohorts currently showing at-risk learners. */
export const managerCohortsAttentionCount = managerCohorts.filter(
  (c) => (c.atRisk ?? 0) > 0,
).length;

/** Approval requests awaiting a decision. */
export const managerApprovalsPendingCount = approvalRequests.length;

/** Manager hands raised that are still open or in progress. */
export const managerHandsRaisedCount = unresolved(managerHandStatuses);

/** Learners waiting on a graduation decision. */
export const managerGraduationReviewCount = graduationCandidates.length;

/** Coaching prompts shown on the coaching page. */
export const managerCoachingCount = coachingPrompts.length;

/** Trainer hands raised that are still open or in progress. */
export const trainerHandsRaisedCount = unresolved(trainerHandStatuses);

/** Upcoming events assigned to the trainer. */
export const trainerEventsCount = trainerEvents.filter((e) => e.status === "upcoming").length;

/** Live events listed for the learner. */
export const learnerLiveEventsCount = trainerEvents.filter((e) => e.status === "upcoming").length;

/** Open hands raised shown on a learner profile's Hands Raised tab. */
export const learnerProfileHandsRaisedCount = helpRequests.slice(0, 1).length;
