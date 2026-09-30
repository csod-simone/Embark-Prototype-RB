export type ReadinessDomainId =
  | "knowledge"
  | "skills"
  | "experience"
  | "relationships"
  | "context";

export type ActivityType =
  | "PROJECT"
  | "STAKEHOLDER"
  | "SHADOWING"
  | "EXPERIENTIAL"
  | "MENTORING"
  | "VALIDATION"
  | "LEARNING";

/** Learner-facing kind for journey-list badges (Rathbones showcase). */
export type ReadinessActivityKind =
  | "content"
  | "knowledge_check"
  | "roleplay"
  | "module_assessment"
  | "chapter_gate";

export type RoleplayKind = "practice" | "formative";

export type ReadinessActivity = {
  id: string;
  section: string;
  type: ActivityType;
  name: string;
  /** One-line completion criteria summary. */
  criteria: string;
  domain: ReadinessDomainId;
  duration: string;
  description: string;
  /** Optional module grouping label (e.g. Managing Clients). */
  moduleLabel?: string;
  /** Drives Contents / Knowledge check / ROLEPLAY / Module assessment badges. */
  activityKind?: ReadinessActivityKind;
  /** Practice (within module) vs Formative (before summative). */
  roleplayKind?: RoleplayKind;
};

export type ReadinessSection = {
  id: string;
  title: string;
  description: string;
};

import type { OrgId } from "@/hooks/use-organisation";

export type ReadinessProject = {
  name: string;
  client: string;
  role: string;
  startDate: string;
  assignedBy: string;
  assignedByRole: string;
  assignmentNote: string;
};

export type ReadinessUser = {
  name: string;
  firstName: string;
  email: string;
  initials: string;
  title: string;
};

export const READINESS_PROJECT: ReadinessProject = {
  name: "Meridian Bank — Platform Migration",
  client: "Meridian Bank",
  role: "Solutions Engineer",
  startDate: "28 September 2026",
  assignedBy: "Dana Whitfield",
  assignedByRole: "Engineering Manager, Delivery",
  assignmentNote:
    "You're joining Meridian as our second solutions engineer. Focus on the data migration workstream — the client is sensitive about cutover risk, so context and stakeholder time matter more than extra reading.",
};

export const READINESS_USER: ReadinessUser = {
  name: "Priya Raman",
  firstName: "Priya",
  email: "priya.raman@nexus.com",
  initials: "PR",
  title: "Solutions Engineer",
};

/** Rathbones IM Intake — Wealth Management / Investment Management readiness. */
export const RATHBONES_READINESS_PROJECT: ReadinessProject = {
  name: "IM Intake · February 2026 · London",
  client: "Rathbones Wealth Management",
  role: "Investment Manager",
  startDate: "1 February 2026",
  assignedBy: "Phoebe Kapoor",
  assignedByRole: "Senior Investment Manager",
  assignmentNote:
    "You're joining the February IM Intake in London. Work through the full Managing Clients competency — knowledge checks, three client role-plays, and the module assessment — before live meetings. CISI Level 4 is taken outside Embark. Diana Chambers sponsors the Institute pathway.",
};

export const RATHBONES_READINESS_USER: ReadinessUser = {
  name: "Andrew Burton",
  firstName: "Andrew",
  email: "andrew.burton@rathbones.com",
  initials: "AB",
  title: "Investment Manager · Investment Management",
};

export function getReadinessUser(org: OrgId = "nexus"): ReadinessUser {
  return org === "rathbones" ? RATHBONES_READINESS_USER : READINESS_USER;
}

export function getReadinessProject(org: OrgId = "nexus"): ReadinessProject {
  return org === "rathbones" ? RATHBONES_READINESS_PROJECT : READINESS_PROJECT;
}

export const READINESS_SECTIONS: ReadinessSection[] = [
  {
    id: "context",
    title: "Project Context",
    description:
      "Understand the project: charter, objectives, history, scope, and lessons learned from similar engagements.",
  },
  {
    id: "stakeholders",
    title: "Stakeholder Readiness",
    description:
      "Identify and engage key project stakeholders including the project sponsor, account executive, implementation lead, and client contacts.",
  },
  {
    id: "knowledge",
    title: "Knowledge & Skills",
    description:
      "Complete learning sessions targeted to the specific skills and knowledge gaps identified for this project role.",
  },
  {
    id: "shadowing",
    title: "Shadowing & Exposure",
    description:
      "Observe relevant meetings, kickoffs, or delivery activities before independent contribution.",
  },
  {
    id: "execution",
    title: "Practical Execution",
    description:
      "Complete hands-on project tasks or exercises that generate readiness evidence.",
  },
  {
    id: "validation",
    title: "Readiness Validation",
    description:
      "Manager review, mentor sign-off, and a project readiness checkpoint before the project begins.",
  },
];

export const RATHBONES_READINESS_SECTIONS: ReadinessSection[] = [
  {
    id: "context",
    title: "Intake Context",
    description:
      "Understand the IM Intake pathway: the Managing Clients competency, London cohort timing, and Institute expectations. CISI Level 4 sits outside Embark.",
  },
  {
    id: "stakeholders",
    title: "Manager & Client Readiness",
    description:
      "Meet your line manager, Institute sponsor, and practice client personas before live meetings.",
  },
  {
    id: "knowledge",
    title: "Qualifications & Core Competencies",
    description:
      "Managing Clients competency — contents, knowledge checks after each course, three role-plays, a single-attempt chapter gate, then the module assessment.",
  },
  {
    id: "shadowing",
    title: "Shadowing & Exposure",
    description:
      "Observe client reviews and line-manager coaching sessions before independent contribution.",
  },
  {
    id: "execution",
    title: "Practical Execution",
    description:
      "Complete hands-on portfolio and client tasks that generate readiness evidence.",
  },
  {
    id: "validation",
    title: "Readiness Validation",
    description:
      "Line-manager sign-off and Institute readiness checkpoint before you take live client meetings.",
  },
];

export const READINESS_ACTIVITIES: ReadinessActivity[] = [
  {
    id: "a1",
    section: "context",
    type: "PROJECT",
    name: "Review the Meridian project charter",
    criteria: "Activity completion + knowledge validation",
    domain: "context",
    duration: "25 min",
    description:
      "Read the signed charter covering scope, success measures, cutover windows and the agreed change-control process.",
  },
  {
    id: "a2",
    section: "context",
    type: "PROJECT",
    name: "Review project history and prior phases",
    criteria: "Activity completion + knowledge validation",
    domain: "context",
    duration: "20 min",
    description:
      "Walk the delivery timeline from discovery through phase one, including the two scope changes agreed with the client.",
  },
  {
    id: "a3",
    section: "context",
    type: "PROJECT",
    name: "Review lessons learned from similar migrations",
    criteria: "Activity completion + knowledge validation",
    domain: "context",
    duration: "15 min",
    description:
      "Retrospective notes from three comparable platform migrations, with the failure modes that cost the most time.",
  },
  {
    id: "a4",
    section: "stakeholders",
    type: "STAKEHOLDER",
    name: "Meet the project sponsor",
    criteria: "Meeting completed + reflection submitted",
    domain: "relationships",
    duration: "30 min",
    description:
      "Introductory conversation with the sponsor covering their definition of success and their escalation preferences.",
  },
  {
    id: "a5",
    section: "stakeholders",
    type: "STAKEHOLDER",
    name: "Meet the account executive",
    criteria: "Meeting completed + reflection submitted",
    domain: "relationships",
    duration: "30 min",
    description:
      "Commercial context: contract shape, renewal timing, and the topics that are sensitive with this client.",
  },
  {
    id: "a6",
    section: "stakeholders",
    type: "STAKEHOLDER",
    name: "Meet the implementation lead",
    criteria: "Meeting completed + reflection submitted",
    domain: "relationships",
    duration: "45 min",
    description:
      "Delivery mechanics: workstreams, environments, the current risk log and where your contribution fits.",
  },
  {
    id: "a7",
    section: "stakeholders",
    type: "MENTORING",
    name: "Meet your assigned project mentor",
    criteria: "Meeting completed + mentor acknowledgement",
    domain: "relationships",
    duration: "30 min",
    description:
      "Agree how you'll work together during ramp-up, including what you'll bring to each check-in.",
  },
  {
    id: "a8",
    section: "knowledge",
    type: "LEARNING",
    name: "Data migration patterns and cutover planning",
    criteria: "Session completed + assessment passed",
    domain: "knowledge",
    duration: "45 min",
    description:
      "Migration strategies, reconciliation approaches and how cutover windows are planned and rehearsed.",
  },
  {
    id: "a9",
    section: "knowledge",
    type: "LEARNING",
    name: "Meridian platform architecture essentials",
    criteria: "Session completed + assessment passed",
    domain: "knowledge",
    duration: "35 min",
    description:
      "The client's current architecture, integration surface and the constraints that shape the target state.",
  },
  {
    id: "a10",
    section: "knowledge",
    type: "LEARNING",
    name: "Client communication in regulated environments",
    criteria: "Session completed + role-play evaluation",
    domain: "skills",
    duration: "30 min",
    description:
      "How to present risk, delay and trade-offs to a regulated client without eroding confidence.",
  },
  {
    id: "a11",
    section: "shadowing",
    type: "SHADOWING",
    name: "Observe the project kickoff",
    criteria: "Attendance verified + reflection submitted",
    domain: "experience",
    duration: "60 min",
    description:
      "Attend the kickoff as an observer and capture how scope, roles and the first milestones are framed.",
  },
  {
    id: "a12",
    section: "shadowing",
    type: "SHADOWING",
    name: "Observe a client working session",
    criteria: "Attendance verified + reflection submitted",
    domain: "experience",
    duration: "45 min",
    description:
      "Sit in on a weekly working session with the client's platform team before contributing directly.",
  },
  {
    id: "a13",
    section: "execution",
    type: "EXPERIENTIAL",
    name: "Complete your first project task",
    criteria: "Work product submitted + manager validation",
    domain: "experience",
    duration: "2 hrs",
    description:
      "Produce a draft field-mapping review for one migration domain and submit it for feedback.",
  },
  {
    id: "a14",
    section: "execution",
    type: "EXPERIENTIAL",
    name: "Deliver your first contribution to the team",
    criteria: "Work product submitted + manager validation",
    domain: "skills",
    duration: "1 hr",
    description:
      "Present your mapping review in the delivery stand-up and log the follow-up actions you own.",
  },
  {
    id: "a15",
    section: "validation",
    type: "MENTORING",
    name: "Mentor sign-off coaching session",
    criteria: "Meeting completed + mentor acknowledgement",
    domain: "relationships",
    duration: "30 min",
    description:
      "Review your evidence with your mentor and agree anything to strengthen before the checkpoint.",
  },
  {
    id: "a16",
    section: "validation",
    type: "VALIDATION",
    name: "Manager readiness review",
    criteria: "Approved / additional evidence requested / rejected",
    domain: "skills",
    duration: "30 min",
    description:
      "Your manager reviews the evidence generated across the journey and records a decision.",
  },
  {
    id: "a17",
    section: "validation",
    type: "VALIDATION",
    name: "Project readiness checkpoint",
    criteria: "Approved / additional evidence requested / rejected",
    domain: "knowledge",
    duration: "45 min",
    description:
      "Final checkpoint with the implementation lead before you join the project independently.",
  },
];

export const READINESS_DOMAINS: {
  id: ReadinessDomainId;
  label: string;
  description: string;
}[] = [
  { id: "knowledge", label: "KNOWLEDGE", description: "Learning & assessments" },
  { id: "skills", label: "SKILLS", description: "Role-plays & evaluations" },
  { id: "experience", label: "EXPERIENCE", description: "Shadowing & practical tasks" },
  { id: "relationships", label: "RELATIONSHIPS", description: "Stakeholder & mentor activities" },
  { id: "context", label: "CONTEXT", description: "Project & customer activities" },
];

/** Rathbones activities reuse the same ids so progress storage stays compatible. */
export const RATHBONES_READINESS_ACTIVITIES: ReadinessActivity[] = [
  {
    id: "a1",
    section: "context",
    type: "PROJECT",
    name: "Review the IM Intake charter",
    criteria: "Activity completion + knowledge validation",
    domain: "context",
    duration: "25 min",
    description:
      "Read the February 2026 London intake brief covering the Investment Management competency pathway, Day 1–179 milestones, and Institute expectations. CISI Level 4 is completed outside Embark.",
  },
  {
    id: "a2",
    section: "context",
    type: "PROJECT",
    name: "Review prior IM Intake cohorts",
    criteria: "Activity completion + knowledge validation",
    domain: "context",
    duration: "20 min",
    description:
      "Walk lessons learned from recent intakes — where associates stalled on suitability conversations and how line-manager coaching closed the gap.",
  },
  {
    id: "a3",
    section: "context",
    type: "PROJECT",
    name: "Review UK financial services sector overview",
    criteria: "Activity completion + knowledge validation",
    domain: "context",
    duration: "15 min",
    description:
      "The UK Financial Services Sector briefing that opens your Current track — markets, regulators, and Rathbones' place in wealth management.",
  },
  {
    id: "a4",
    section: "stakeholders",
    type: "STAKEHOLDER",
    name: "Meet Institute Director Diana Chambers",
    criteria: "Meeting completed + reflection submitted",
    domain: "relationships",
    duration: "30 min",
    description:
      "Introductory conversation covering Institute success measures and how role-play evidence feeds readiness decisions.",
  },
  {
    id: "a5",
    section: "stakeholders",
    type: "STAKEHOLDER",
    name: "Meet line manager Phoebe Kapoor",
    criteria: "Meeting completed + reflection submitted",
    domain: "relationships",
    duration: "30 min",
    description:
      "Agree coaching cadence, which Managing Clients role-plays to prioritise, and how feedback will be recorded.",
  },
  {
    id: "a6",
    section: "stakeholders",
    type: "STAKEHOLDER",
    name: "Meet your practice client persona",
    criteria: "Meeting completed + reflection submitted",
    domain: "relationships",
    duration: "45 min",
    description:
      "Walk the practice client's objectives, risk tolerance, and family context before your first suitability role-play.",
  },
  {
    id: "a7",
    section: "stakeholders",
    type: "MENTORING",
    name: "Line-manager mentoring kickoff",
    criteria: "Meeting completed + mentor acknowledgement",
    domain: "relationships",
    duration: "30 min",
    description:
      "Agree what you will bring to each check-in and how associate peer learning with Matteo Wu will work.",
  },
  {
    id: "a8",
    section: "knowledge",
    type: "LEARNING",
    name: "UK Regulation and Professional Integrity",
    criteria: "Session completed + knowledge check passed",
    domain: "knowledge",
    duration: "45 min",
    description:
      "Representative Institute content on UK regulation and professional integrity. This is competency material, not a hosted CISI qualification.",
    moduleLabel: "Regulation",
    activityKind: "content",
  },
  {
    id: "a9",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Investments — core competency",
    criteria: "Session completed + assessment passed",
    domain: "knowledge",
    duration: "35 min",
    description:
      "Investment principles, portfolio construction, and client-focused decision-making for Rathbones professionals.",
    moduleLabel: "Managing Investments",
    activityKind: "content",
  },
  // --- Managing Clients (interleaved showcase) ---
  {
    id: "mc1",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Client relationships foundations",
    criteria: "Contents completed",
    domain: "skills",
    duration: "20 min",
    description:
      "Core principles of client relationships, trust-building, and empathetic engagement for Rathbones Investment Managers.",
    moduleLabel: "Managing Clients",
    activityKind: "content",
  },
  {
    id: "mc2",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Knowledge check 1",
    criteria: "Knowledge check passed",
    domain: "knowledge",
    duration: "10 min",
    description: "Short check on relationship foundations before moving into discovery practice.",
    moduleLabel: "Managing Clients",
    activityKind: "knowledge_check",
  },
  {
    id: "mc3",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Discovery and objectives",
    criteria: "Contents completed",
    domain: "skills",
    duration: "20 min",
    description:
      "How to explore client objectives, time horizon, and capacity for loss before any recommendation.",
    moduleLabel: "Managing Clients",
    activityKind: "content",
  },
  {
    id: "mc4",
    section: "knowledge",
    type: "LEARNING",
    name: "Pitching Sales (new business) — James Whitfield",
    criteria: "Practice role-play completed",
    domain: "skills",
    duration: "20 min",
    description:
      "New-business conversation with James Whitfield. Coaching feedback from the text of the dialogue. Pass mark 80%. Up to 3 retakes. Does not gate the chapter.",
    moduleLabel: "Managing Clients",
    activityKind: "roleplay",
    roleplayKind: "practice",
  },
  {
    id: "mc5",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Knowledge check 2",
    criteria: "Knowledge check passed",
    domain: "knowledge",
    duration: "10 min",
    description: "Check understanding of discovery and objectives framing after practice.",
    moduleLabel: "Managing Clients",
    activityKind: "knowledge_check",
  },
  {
    id: "mc6",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Suitability under pressure",
    criteria: "Contents completed",
    domain: "skills",
    duration: "20 min",
    description:
      "Handling anxious clients who want to move to cash — acknowledging emotion without abandoning suitability.",
    moduleLabel: "Managing Clients",
    activityKind: "content",
  },
  {
    id: "mc7",
    section: "knowledge",
    type: "LEARNING",
    name: "Suitability Meetings — Helen Ashford",
    criteria: "Practice role-play completed",
    domain: "skills",
    duration: "20 min",
    description:
      "Suitability meeting with Helen Ashford, who wants to move to cash. Text scoring. Pass mark 80%. Up to 3 retakes.",
    moduleLabel: "Managing Clients",
    activityKind: "roleplay",
    roleplayKind: "practice",
  },
  {
    id: "mc8",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Advice documentation",
    criteria: "Contents completed",
    domain: "knowledge",
    duration: "15 min",
    description:
      "What belongs in a suitability file note and how to close a meeting with a clear next step.",
    moduleLabel: "Managing Clients",
    activityKind: "content",
  },
  {
    id: "mc9",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Knowledge check 3",
    criteria: "Knowledge check passed",
    domain: "knowledge",
    duration: "10 min",
    description: "Final knowledge check before formative role-play and the module assessment.",
    moduleLabel: "Managing Clients",
    activityKind: "knowledge_check",
  },
  {
    id: "mc10",
    section: "knowledge",
    type: "LEARNING",
    name: "Vulnerable Clients — Margaret Hale",
    criteria: "Scored role-play completed",
    domain: "skills",
    duration: "30 min",
    description:
      "Scored conversation with Margaret Hale, a recently bereaved client being pressed to gift money. Evaluation uses the text of the dialogue. Pass mark 80%. Up to 3 retakes, then the line manager is flagged.",
    moduleLabel: "Managing Clients",
    activityKind: "roleplay",
    roleplayKind: "formative",
  },
  {
    id: "mc11",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Module assessment",
    criteria: "Module assessment passed at 80%",
    domain: "knowledge",
    duration: "25 min",
    description:
      "Major assessment at the end of the Managing Clients module. Pass mark 80%. Up to 3 retakes. A sustained fail pauses the journey until the line manager reopens it.",
    moduleLabel: "Managing Clients",
    activityKind: "module_assessment",
  },
  {
    id: "mc-gate",
    section: "knowledge",
    type: "LEARNING",
    name: "Managing Clients — Chapter gate",
    criteria: "Single attempt. Pass mark 80%.",
    domain: "knowledge",
    duration: "15 min",
    description:
      "Readiness gate at the end of the Managing Clients chapter. One attempt only. A fail raises an at-risk flag for the line manager immediately.",
    moduleLabel: "Managing Clients",
    activityKind: "chapter_gate",
  },
  {
    id: "a11",
    section: "shadowing",
    type: "SHADOWING",
    name: "Observe a client annual review",
    criteria: "Attendance verified + reflection submitted",
    domain: "experience",
    duration: "60 min",
    description:
      "Sit in on a client review led by a Senior Investment Manager and capture how suitability and portfolio decisions are framed.",
  },
  {
    id: "a12",
    section: "shadowing",
    type: "SHADOWING",
    name: "Observe a line-manager coaching session",
    criteria: "Attendance verified + reflection submitted",
    domain: "experience",
    duration: "45 min",
    description:
      "Observe Phoebe Kapoor coaching an associate through a Managing Clients role-play debrief.",
  },
  {
    id: "a13",
    section: "execution",
    type: "EXPERIENTIAL",
    name: "Draft a suitability summary",
    criteria: "Work product submitted + manager validation",
    domain: "experience",
    duration: "2 hrs",
    description:
      "Produce a draft suitability and objectives summary for your practice client and submit it for line-manager feedback.",
  },
  {
    id: "a14",
    section: "execution",
    type: "EXPERIENTIAL",
    name: "Present your first portfolio recommendation",
    criteria: "Work product submitted + manager validation",
    domain: "skills",
    duration: "1 hr",
    description:
      "Present a draft recommendation to your line manager and log the follow-up actions you own.",
  },
  {
    id: "a15",
    section: "validation",
    type: "MENTORING",
    name: "Line-manager sign-off coaching session",
    criteria: "Meeting completed + mentor acknowledgement",
    domain: "relationships",
    duration: "30 min",
    description:
      "Review your evidence with Phoebe Kapoor and agree anything to strengthen before the Institute checkpoint.",
  },
  {
    id: "a16",
    section: "validation",
    type: "VALIDATION",
    name: "Line-manager readiness review",
    criteria: "Approved / additional evidence requested / rejected",
    domain: "skills",
    duration: "30 min",
    description:
      "Your line manager reviews role-play and learning evidence across the journey and records a decision.",
  },
  {
    id: "a17",
    section: "validation",
    type: "VALIDATION",
    name: "Institute readiness checkpoint",
    criteria: "Approved / additional evidence requested / rejected",
    domain: "knowledge",
    duration: "45 min",
    description:
      "Final checkpoint with Diana Chambers before you take live client meetings independently.",
  },
];

export function getReadinessSections(org: OrgId = "nexus"): ReadinessSection[] {
  return org === "rathbones" ? RATHBONES_READINESS_SECTIONS : READINESS_SECTIONS;
}

export function getReadinessActivities(org: OrgId = "nexus"): ReadinessActivity[] {
  return org === "rathbones" ? RATHBONES_READINESS_ACTIVITIES : READINESS_ACTIVITIES;
}

export const activitiesInSection = (sectionId: string, org: OrgId = "nexus") =>
  getReadinessActivities(org).filter((a) => a.section === sectionId);

export const activitiesInDomain = (domainId: ReadinessDomainId, org: OrgId = "nexus") =>
  getReadinessActivities(org).filter((a) => a.domain === domainId);

export const findActivity = (id: string, org: OrgId = "nexus") =>
  getReadinessActivities(org).find((a) => a.id === id);

export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  PROJECT: "PROJECT",
  STAKEHOLDER: "STAKEHOLDER",
  SHADOWING: "SHADOWING",
  EXPERIENTIAL: "EXPERIENTIAL",
  MENTORING: "MENTORING",
  VALIDATION: "VALIDATION",
  LEARNING: "LEARNING",
};

export const ACTIVITY_KIND_LABEL: Record<ReadinessActivityKind, string> = {
  content: "Contents",
  knowledge_check: "Knowledge check",
  roleplay: "ROLEPLAY",
  module_assessment: "Module assessment",
  chapter_gate: "Chapter gate",
};

export function activityBadgeLabel(activity: ReadinessActivity): string {
  if (activity.activityKind) return ACTIVITY_KIND_LABEL[activity.activityKind];
  return ACTIVITY_TYPE_LABEL[activity.type];
}
