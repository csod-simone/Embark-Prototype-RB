export type BandLabel = 'At Risk' | 'Needs Attention' | 'On Track' | 'Ready' | 'Fast Tracker';
export type ModuleStatus = 'completed' | 'in_progress' | 'locked' | 'skipped' | 'exempt' | 'remediation';
export type SessionModality = 'video' | 'article' | 'audio' | 'role_play' | 'exercise' | 'assessment';
export type HelpRequestStatus = 'open' | 'acknowledged' | 'resolved';
export type CurriculumStatus = 'draft' | 'under_review' | 'published' | 'archived';
export type CitationType = 'curriculum' | 'internal' | 'policy' | 'general';
export type NotificationType = 'help_request' | 'at_risk' | 'module_unlock' | 'nudge' | 'assessment' | 'event';

export interface Learner {
  id: string; name: string; email: string;
  role: string; lob: string; managerId: string; cohortId: string;
  enrollmentDate: string; readinessScore: number; readinessBand: BandLabel;
  dayInProgram: number; totalDays: number;
  modulesComplete: number; modulesTotal: number;
  sessionsComplete: number; sessionsTotal: number;
}
export interface CohortLearner {
  id: string; name: string; progress: number;
  readinessScore: number; band: BandLabel;
  lastActive: string; openItems: number; lob: string;
}
export interface Module {
  id: string; number: number; name: string;
  status: ModuleStatus; score?: number; completedDate?: string;
  sessions?: number; sessionsComplete?: number; sessionsTotal?: number;
  lob: string; skipReason?: 'people_graph' | 'equivalency_credit';
}
export interface Session {
  id: string; moduleId: string; number: number; name: string;
  status: 'completed' | 'in_progress' | 'available' | 'locked' | 'skipped';
  modality: SessionModality; duration: number; completedDate?: string;
  /** Rathbones showcase: practice vs formative role-play. */
  roleplayKind?: 'practice' | 'formative';
  /** Rathbones showcase: journey-list badge override. */
  sessionKind?: 'content' | 'knowledge_check' | 'roleplay' | 'module_assessment' | 'chapter_gate';
}
export interface TutorMessage {
  role: 'tutor' | 'learner'; text: string; citation?: CitationType;
  isProactive?: boolean; isEscalation?: boolean;
}
export interface HelpRequest {
  id: string; learnerId: string; learnerName: string;
  moduleId: string; moduleName: string; sessionName: string;
  message: string; status: HelpRequestStatus;
  raisedAt: string; aiSuggested: boolean;
  tutorContext: TutorMessage[];
  readinessScore: number; readinessBand: BandLabel;
  managerResponse?: string; respondedAt?: string;
}
export interface AtRiskFlag {
  learnerId: string; learnerName: string;
  conditions: { label: string; threshold: string }[];
  flaggedAt: string; acknowledged: boolean;
}
export interface ModuleSkipApproval {
  id: string; learnerId: string; learnerName: string;
  type: 'module_skip'; moduleName: string; rationale: string; suggestedAt: string;
}
export interface RetakeApproval {
  id: string; learnerId: string; learnerName: string;
  type: 'retake'; moduleName: string; attemptNumber: number;
  currentScore: number; requestedAt: string;
}
export interface CoachingNudge {
  id: string; learnerId: string; learnerName: string;
  nudgeType: 'persistent_failure' | 'at_risk_unacknowledged' | 'role_play_below_threshold';
  recommendation: string; rationale: string; createdAt: string;
}
export interface TrainerRosterEntry {
  id: string; name: string;
  prerequisiteStatus: 'complete' | 'incomplete';
  missingModules: string[]; readinessScore: number;
  lastActive: string;
  lastCheckpointScore?: number; lastCheckpointLabel?: string;
  rolePlayPerformance: 'Below threshold' | 'Meeting threshold' | 'Exceeding threshold';
  attendanceStatus?: 'Attended' | 'Absent' | 'Partial';
  attendanceNotes?: string;
}
export interface TrainerEvent {
  id: string; name: string; journeyName: string;
  date: string; format: 'In-person' | 'Virtual';
  location: string; registered: number; capacity: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  readinessSummary: { atRisk: number; needsAttention: number; onTrack: number; ready: number; fastTracker: number };
  roster: TrainerRosterEntry[];
}
export interface Notification {
  id: string; type: NotificationType;
  title: string; body: string; timestamp: string;
  read: boolean; mandatory: boolean;
  ctaLabel: string; ctaRoute: string;
}
export interface Curriculum {
  id: string; name: string; status: CurriculumStatus;
  journey: string; lastUpdated: string;
  version: string; enrolledLearners: number;
}

// --- SEED DATA ---

export const learner: Learner = {
  id: 'l1', name: 'Jordan Kim', email: 'andrew.burton@rathbones.com',
  role: 'Customer Service Representative', lob: 'Medicare',
  managerId: 'm1', cohortId: 'cohort-a',
  enrollmentDate: '2026-07-14', readinessScore: 62, readinessBand: 'Needs Attention',
  dayInProgram: 5, totalDays: 15,
  modulesComplete: 2, modulesTotal: 8,
  sessionsComplete: 6, sessionsTotal: 24,
};

export const manager = {
  id: 'm1', name: 'Taylor Reyes', email: 'phoebe.kapoor@rathbones.com',
  cohortId: 'cohort-a', cohortName: 'Medicare CSR Cohort A', journeyName: 'Investment Manager Full Onboarding Journey',
};

export const cohortLearners: CohortLearner[] = [
  { id: 'l1', name: 'Jordan Kim', progress: 34, readinessScore: 62, band: 'Needs Attention', lastActive: '2 hours ago', openItems: 1, lob: 'Medicare' },
  { id: 'l2', name: 'Priya Sharma', progress: 71, readinessScore: 84, band: 'On Track', lastActive: '1 day ago', openItems: 0, lob: 'Medicare' },
  { id: 'l3', name: 'Marcus Webb', progress: 12, readinessScore: 38, band: 'At Risk', lastActive: '4 days ago', openItems: 2, lob: 'Medicare' },
  { id: 'l4', name: 'Elena Torres', progress: 89, readinessScore: 91, band: 'Ready', lastActive: '3 hours ago', openItems: 0, lob: 'Medicare' },
  { id: 'l5', name: 'Darius Osei', progress: 55, readinessScore: 72, band: 'On Track', lastActive: '6 hours ago', openItems: 0, lob: 'Medicare' },
  { id: 'l6', name: 'Lily Zhang', progress: 95, readinessScore: 97, band: 'Fast Tracker', lastActive: '1 hour ago', openItems: 0, lob: 'Medicare' },
];

export const modules: Module[] = [
  { id: 'mod1', number: 1, name: 'Aetna Plan Basics', status: 'completed', score: 88, completedDate: '2026-07-16', sessions: 3, lob: 'All' },
  { id: 'mod2', number: 2, name: 'Claims Processing', status: 'completed', score: 74, completedDate: '2026-07-17', sessions: 3, lob: 'All' },
  { id: 'mod3', number: 3, name: 'Benefits Navigation', status: 'in_progress', sessionsComplete: 2, sessionsTotal: 4, lob: 'Medicare' },
  { id: 'mod4', number: 4, name: 'Claims and Billing', status: 'locked', sessions: 4, lob: 'Medicare' },
  { id: 'mod5', number: 5, name: 'Denied Claims Handling', status: 'locked', sessions: 4, lob: 'All' },
  { id: 'mod6', number: 6, name: 'Commercial Plan Specifics', status: 'skipped', skipReason: 'equivalency_credit', sessions: 3, lob: 'Commercial' },
  { id: 'mod7', number: 7, name: 'Medicaid Coordination', status: 'locked', sessions: 3, lob: 'Medicaid' },
  { id: 'mod8', number: 8, name: 'Advanced Scenarios', status: 'locked', sessions: 5, lob: 'All' },
];

export const sessions: Session[] = [
  { id: 's1', moduleId: 'mod3', number: 1, name: 'Medicare Plan Types', status: 'completed', modality: 'video', duration: 6, completedDate: '2026-07-18' },
  { id: 's2', moduleId: 'mod3', number: 2, name: 'Coverage Determination', status: 'completed', modality: 'article', duration: 8, completedDate: '2026-07-18' },
  { id: 's3', moduleId: 'mod3', number: 3, name: 'Benefits Lookup Practice', status: 'in_progress', modality: 'role_play', duration: 10 },
  { id: 's4', moduleId: 'mod3', number: 4, name: 'Module 3 Assessment', status: 'locked', modality: 'assessment', duration: 15 },
];

export const coverageDeterminationTutorContext: TutorMessage[] = [
  { role: 'learner', text: 'Can you explain Part B deductibles again?' },
  { role: 'tutor', text: "Of course. The Part B deductible is $240 for 2026. Once that's met, Medicare pays 80% of approved amounts for covered services.", citation: 'curriculum' },
  { role: 'learner', text: 'What if they have secondary insurance?' },
  { role: 'tutor', text: 'Great question. If the member has secondary coverage, the secondary plan may cover the remaining 20% after Medicare pays, depending on the plan type. This is called coordination of benefits.', citation: 'curriculum' },
  { role: 'learner', text: 'I think I need to talk to someone, this is getting complicated' },
  { role: 'tutor', text: "It sounds like you're finding this tricky. Would you like me to raise a hand to your manager?", isEscalation: true },
];

export const helpRequests: HelpRequest[] = [
  {
    id: 'hr1', learnerId: 'l1', learnerName: 'Jordan Kim',
    moduleId: 'mod3', moduleName: 'IM Intake Pathway', sessionName: 'Client relationships foundations',
    message: "I'm not sure when Investment Management is primary for a retired client, or how to explain the 80/20 fee share after the risk budget is met.",
    status: 'open', raisedAt: '2026-07-19T09:14:00Z', aiSuggested: false,
    tutorContext: coverageDeterminationTutorContext,
    readinessScore: 62, readinessBand: 'Needs Attention',
  },
  {
    id: 'hr2', learnerId: 'l3', learnerName: 'Marcus Webb',
    moduleId: 'mod3', moduleName: 'IM Intake Pathway', sessionName: 'Knowledge check 1',
    message: "I failed the knowledge check twice. I still mix up when to check the mandate and when to record the file note.",
    status: 'open', raisedAt: '2026-07-17T14:32:00Z', aiSuggested: true,
    tutorContext: [],
    readinessScore: 38, readinessBand: 'At Risk',
  },
];

export const atRiskFlags: AtRiskFlag[] = [
  {
    learnerId: 'l3', learnerName: 'Marcus Webb',
    conditions: [
      { label: 'No login for 4 days', threshold: 'threshold: 3 days' },
      { label: 'Failed Module 2 assessment ×2', threshold: 'retake limit: 2' },
    ],
    flaggedAt: '2026-07-17T08:00:00Z', acknowledged: false,
  },
];

export const approvals = {
  moduleSkips: [
    {
      id: 'skip1', learnerId: 'l2', learnerName: 'Priya Sharma',
      type: 'module_skip' as const, moduleName: 'Discovery and objectives',
      rationale: 'People Graph shows existing proficiency in commercial insurance products based on prior role history.',
      suggestedAt: '2026-07-18T10:00:00Z',
    },
  ] as ModuleSkipApproval[],
  retakes: [
    {
      id: 'retake1', learnerId: 'l3', learnerName: 'Marcus Webb',
      type: 'retake' as const, moduleName: 'Knowledge check 1',
      attemptNumber: 3, currentScore: 54, requestedAt: '2026-07-19T11:00:00Z',
    },
  ] as RetakeApproval[],
};

export const coachingNudges: CoachingNudge[] = [
  {
    id: 'nudge1', learnerId: 'l3', learnerName: 'Marcus Webb',
    nudgeType: 'persistent_failure',
    recommendation: 'Daniel has missed the same suitability point three times. A check-in on the mandate and the file note would help before the next attempt.',
    rationale: 'Repeated misses on checking the mandate before quoting a cost',
    createdAt: '2026-07-19T08:30:00Z',
  },
  {
    id: 'nudge2', learnerId: 'l1', learnerName: 'Jordan Kim',
    nudgeType: 'at_risk_unacknowledged',
    recommendation: "Jordan's hand raised has been open for 28 hours with no acknowledgment. A quick response would prevent an escalation.",
    rationale: 'Hand raised unacknowledged approaching 24-hour SLA',
    createdAt: '2026-07-19T13:14:00Z',
  },
];

export const trainerEvents: TrainerEvent[] = [
  {
    id: 'ev1', name: 'Investment Management intake workshop',
    journeyName: 'Investment Manager Full Onboarding Journey',
    date: '2026-07-20T09:00:00Z', format: 'In-person',
    location: 'Rathbones Institute, London',
    registered: 14, capacity: 20, status: 'upcoming',
    readinessSummary: { atRisk: 2, needsAttention: 4, onTrack: 6, ready: 2, fastTracker: 0 },
    roster: [
      { id: 'l1', name: 'Jordan Kim', prerequisiteStatus: 'incomplete', missingModules: ['IM Intake Pathway'], readinessScore: 62, lastActive: '2 hours ago', lastCheckpointScore: 61, lastCheckpointLabel: 'Knowledge check 1 — failed', rolePlayPerformance: 'Below threshold' },
      { id: 'l2', name: 'Priya Sharma', prerequisiteStatus: 'complete', missingModules: [], readinessScore: 84, lastActive: '1 day ago', rolePlayPerformance: 'Meeting threshold' },
      { id: 'l3', name: 'Marcus Webb', prerequisiteStatus: 'incomplete', missingModules: ['Knowledge check 1', 'IM Intake Pathway'], readinessScore: 38, lastActive: '4 days ago', lastCheckpointScore: 54, lastCheckpointLabel: 'Knowledge check 1 — failed', rolePlayPerformance: 'Below threshold' },
      { id: 'l4', name: 'Elena Torres', prerequisiteStatus: 'complete', missingModules: [], readinessScore: 91, lastActive: '3 hours ago', rolePlayPerformance: 'Exceeding threshold' },
      { id: 'l6', name: 'Lily Zhang', prerequisiteStatus: 'complete', missingModules: [], readinessScore: 97, lastActive: '1 hour ago', rolePlayPerformance: 'Exceeding threshold' },
    ],
  },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'help_request', title: 'Hand raised received', body: 'Jordan Kim needs help with the IM Intake Pathway — Client relationships foundations', timestamp: '2 hours ago', read: false, mandatory: true, ctaLabel: 'Respond', ctaRoute: '/manager/cohort' },
  { id: 'n2', type: 'at_risk', title: 'Learner flagged At Risk', body: 'Marcus Webb has been flagged at risk — no login for 4 days, failed assessment twice', timestamp: '1 day ago', read: false, mandatory: true, ctaLabel: 'Review learner', ctaRoute: '/manager/learner/l3' },
  { id: 'n3', type: 'module_unlock', title: 'Module unlocked', body: 'Knowledge check 1 is complete. Discovery and objectives is now unlocked.', timestamp: 'Yesterday at 3:14pm', read: true, mandatory: false, ctaLabel: 'Continue IM Intake Pathway', ctaRoute: '/learner/home' },
  { id: 'n4', type: 'nudge', title: 'Coaching recommendation', body: 'A coaching conversation would help Marcus Webb before his next assessment attempt.', timestamp: '4 hours ago', read: false, mandatory: false, ctaLabel: 'View nudge', ctaRoute: '/manager/cohort' },
];

export const curricula: Curriculum[] = [
  { id: 'cur-medicare-onboarding', name: 'IM Intake Pathway', status: 'published', journey: 'Investment Manager Full Onboarding Journey', lastUpdated: '3 days ago', version: '1.2', enrolledLearners: 6 },
  { id: 'cur-compliance-refresher', name: 'Compliance Refresher Path', status: 'published', journey: 'Investment Manager Full Onboarding Journey', lastUpdated: '3 days ago', version: '1.0', enrolledLearners: 6 },
  { id: 'cur-medicare-advantage', name: 'Discretionary Portfolio Management', status: 'published', journey: 'Investment Manager Full Onboarding Journey', lastUpdated: '3 days ago', version: '1.0', enrolledLearners: 6 },
  { id: 'cur-new-hire-foundations', name: 'New Hire Foundations Path', status: 'published', journey: 'New Hire Foundations Journey', lastUpdated: '6 days ago', version: '1.0', enrolledLearners: 3 },
  { id: 'cur-medicaid-onboarding', name: 'Custody Services Onboarding Path', status: 'draft', journey: 'Custody Services Investment Manager Onboarding Journey', lastUpdated: '1 week ago', version: '0.4', enrolledLearners: 5 },
  { id: 'cur-claims-billing', name: 'Trade and Settlement Essentials Path', status: 'published', journey: 'Private Client Lines Product Training Journey', lastUpdated: '2 weeks ago', version: '1.0', enrolledLearners: 0 },
  { id: 'cur-commercial-product', name: 'Private Client Product Path', status: 'draft', journey: 'Private Client Lines Product Training Journey', lastUpdated: '2 weeks ago', version: '0.2', enrolledLearners: 0 },
  { id: 'cur-suitability-file', name: 'Suitability File Standards Path', status: 'published', journey: 'Suitability File Standards Journey', lastUpdated: '28 Sep 2026', version: '1.2', enrolledLearners: 7 },
];