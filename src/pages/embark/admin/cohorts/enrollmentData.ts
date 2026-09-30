import { learnerRowsForVersionedCohort } from "@/data/contentVersioning";

export type LearnerStatus = "in_progress" | "completed" | "not_started";

export type LearnerRow = {
  id: string;
  name: string;
  email: string;
  status: LearnerStatus;
  progress: number;
  enrolledDate: string; // ISO
};

/** Learners enrolled in the CSR Onboarding Cohort. */
export const CSR_COHORT_LEARNERS: LearnerRow[] = [
  { id: "csr-2", name: "Priya Sharma", email: "priya.sharma@cvshealth.com", status: "in_progress", progress: 54, enrolledDate: "2026-08-31" },
  { id: "csr-3", name: "Marcus Webb", email: "marcus.webb@cvshealth.com", status: "in_progress", progress: 21, enrolledDate: "2026-08-31" },
  { id: "csr-4", name: "Elena Torres", email: "elena.torres@cvshealth.com", status: "in_progress", progress: 72, enrolledDate: "2026-08-31" },
  { id: "csr-5", name: "Darius Osei", email: "darius.osei@cvshealth.com", status: "in_progress", progress: 48, enrolledDate: "2026-08-31" },
  { id: "csr-6", name: "Lily Zhang", email: "lily.zhang@cvshealth.com", status: "in_progress", progress: 83, enrolledDate: "2026-08-31" },
  { id: "csr-7", name: "Andre Baptiste", email: "andre.baptiste@cvshealth.com", status: "in_progress", progress: 35, enrolledDate: "2026-08-31" },
  { id: "csr-8", name: "Sofia Marino", email: "sofia.marino@cvshealth.com", status: "not_started", progress: 0, enrolledDate: "2026-09-02" },
  { id: "csr-9", name: "Noah Whitfield", email: "noah.whitfield@cvshealth.com", status: "in_progress", progress: 41, enrolledDate: "2026-08-31" },
  { id: "csr-10", name: "Amara Diallo", email: "amara.diallo@cvshealth.com", status: "in_progress", progress: 59, enrolledDate: "2026-08-31" },
  { id: "csr-11", name: "Ethan Brooks", email: "ethan.brooks@cvshealth.com", status: "in_progress", progress: 26, enrolledDate: "2026-08-31" },
  { id: "csr-12", name: "Maya Rodriguez", email: "maya.rodriguez@cvshealth.com", status: "not_started", progress: 0, enrolledDate: "2026-09-02" },
];

/** Learners enrolled in the CSR Onboarding Cohort - Demo. */
export const CSR_DEMO_COHORT_LEARNERS: LearnerRow[] = [
  { id: "l1", name: "Jordan Kim", email: "jordan.kim@cvs.com", status: "in_progress", progress: 67, enrolledDate: "2026-08-31" },
  { id: "csr-d2", name: "Priya Sharma", email: "priya.sharma@cvshealth.com", status: "in_progress", progress: 54, enrolledDate: "2026-08-31" },
  { id: "csr-d3", name: "Marcus Webb", email: "marcus.webb@cvshealth.com", status: "in_progress", progress: 21, enrolledDate: "2026-08-31" },
  { id: "csr-d4", name: "Elena Torres", email: "elena.torres@cvshealth.com", status: "in_progress", progress: 72, enrolledDate: "2026-08-31" },
  { id: "csr-d5", name: "Darius Osei", email: "darius.osei@cvshealth.com", status: "in_progress", progress: 48, enrolledDate: "2026-08-31" },
  { id: "csr-d6", name: "Lily Zhang", email: "lily.zhang@cvshealth.com", status: "in_progress", progress: 83, enrolledDate: "2026-08-31" },
  { id: "csr-d7", name: "Andre Baptiste", email: "andre.baptiste@cvshealth.com", status: "in_progress", progress: 35, enrolledDate: "2026-08-31" },
  { id: "csr-d8", name: "Sofia Marino", email: "sofia.marino@cvshealth.com", status: "not_started", progress: 0, enrolledDate: "2026-09-02" },
  { id: "csr-d9", name: "Noah Whitfield", email: "noah.whitfield@cvshealth.com", status: "in_progress", progress: 41, enrolledDate: "2026-08-31" },
  { id: "csr-d10", name: "Amara Diallo", email: "amara.diallo@cvshealth.com", status: "in_progress", progress: 59, enrolledDate: "2026-08-31" },
  { id: "csr-d11", name: "Ethan Brooks", email: "ethan.brooks@cvshealth.com", status: "in_progress", progress: 26, enrolledDate: "2026-08-31" },
  { id: "csr-d12", name: "Maya Rodriguez", email: "maya.rodriguez@cvshealth.com", status: "not_started", progress: 0, enrolledDate: "2026-09-02" },
];

/** Andrew Burton (Jordan Kim, l1) is enrolled only in IM Intake Cohort A. */
export function learnersForCohort(cohortId?: string): LearnerRow[] {
  if (cohortId === "cohort-suitability-a" || cohortId === "cohort-suitability-b") {
    return learnerRowsForVersionedCohort(cohortId);
  }
  if (cohortId === "cohort-a") return SEED_LEARNERS;
  if (cohortId === "cohort-q3") {
    return SEED_LEARNERS.filter((learner) => learner.id === "l4" || learner.id === "l5" || learner.id === "l6").map(
      (learner) => ({ ...learner, status: "not_started" as const, progress: 0 }),
    );
  }
  return SEED_LEARNERS.filter((learner) => learner.id !== "l1");
}

export const SEED_LEARNERS: LearnerRow[] = [
  { id: "l1", name: "Jordan Kim", email: "andrew.burton@rathbones.com", status: "in_progress", progress: 34, enrolledDate: "2026-07-14" },
  { id: "l2", name: "Priya Sharma", email: "hannah.okonkwo@rathbones.com", status: "in_progress", progress: 71, enrolledDate: "2026-07-14" },
  { id: "l3", name: "Marcus Webb", email: "daniel.adeyemi@rathbones.com", status: "in_progress", progress: 12, enrolledDate: "2026-07-14" },
  { id: "l4", name: "Elena Torres", email: "diana.chambers@rathbones.com", status: "in_progress", progress: 89, enrolledDate: "2026-07-14" },
  { id: "l5", name: "Darius Osei", email: "darius.osei@rathbones.com", status: "in_progress", progress: 55, enrolledDate: "2026-07-14" },
  { id: "l6", name: "Lily Zhang", email: "lily.zhang@rathbones.com", status: "in_progress", progress: 95, enrolledDate: "2026-07-14" },
];

export const STUB_SEARCH_RESULTS = [
  { id: "s-1", name: "Chris Evans", email: "chris.evans@company.com" },
  { id: "s-2", name: "Dana Kim", email: "dana.kim@company.com" },
  { id: "s-3", name: "Elliot Nguyen", email: "elliot.nguyen@company.com" },
];
