/**
 * Registry of reviewable content. Every "Review content" action across the
 * learner and graduating learner personas resolves an entry from here so the
 * completed content view window shows the content belonging to the item that
 * was clicked.
 */

export type ReviewSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Render the bullet list as a numbered list. */
  ordered?: boolean;
};

export type ReviewContentEntry = {
  id: string;
  title: string;
  /** Module / programme the item belongs to, used in breadcrumbs and subtitles. */
  moduleName: string;
  /** Programme or track name shown above the module. */
  programName: string;
  modality: "article" | "video";
  /** Minutes. */
  duration: number;
  completedDate?: string;
  score?: number;
  intro?: string;
  sections: ReviewSection[];
  /** Key takeaways shown by the video pane. */
  takeaways?: string[];
};

export const reviewContent: Record<string, ReviewContentEntry> = {
  "coverage-determination": {
    id: "coverage-determination",
    title: "Coverage Determination",
    moduleName: "Benefits Navigation",
    programName: "My Journey",
    modality: "article",
    duration: 8,
    completedDate: "2026-07-18",
    score: 88,
    intro:
      "Coverage determination is the process of deciding whether a service is covered, who pays first, and what the member owes.",
    sections: [
      {
        heading: "Part B Coverage Determination",
        paragraphs: [
          "Medicare Part B covers medically necessary services and preventive services. When determining coverage, the first step is to verify whether the service is a covered benefit under the member's specific plan, and then apply coordination of benefits rules where applicable.",
        ],
      },
      {
        heading: "Primary vs Secondary Coverage",
        paragraphs: [
          "When a member has both Medicare and a secondary insurance plan, Medicare typically acts as the primary payer. The secondary plan may cover costs that Medicare doesn't, such as the 20% coinsurance after Medicare pays.",
        ],
      },
      {
        heading: "Deductibles and Coinsurance",
        paragraphs: [
          "The Part B deductible resets each calendar year. Once the deductible is met, Medicare pays 80% of the approved amount for covered services.",
        ],
      },
    ],
  },

  "medicare-plan-types": {
    id: "medicare-plan-types",
    title: "Medicare Plan Types",
    moduleName: "Benefits Navigation",
    programName: "My Journey",
    modality: "video",
    duration: 6,
    completedDate: "2026-07-18",
    score: 88,
    intro:
      "A walkthrough of the four parts of Medicare and how each plan type changes what a member is covered for.",
    sections: [
      {
        heading: "The Four Parts of Medicare",
        bullets: [
          "Part A — inpatient hospital, skilled nursing and hospice care.",
          "Part B — outpatient care, preventive services and durable medical equipment.",
          "Part C — Medicare Advantage, a private plan that bundles Parts A and B.",
          "Part D — prescription drug coverage.",
        ],
      },
      {
        heading: "Choosing Between Original Medicare and Advantage",
        paragraphs: [
          "Original Medicare gives members nationwide provider access with separate Part D and supplement decisions. Medicare Advantage bundles benefits into one plan with a network, an out-of-pocket maximum and often extra benefits.",
        ],
      },
    ],
    takeaways: [
      "Parts A and B make up Original Medicare; Part C bundles them through a private plan.",
      "Medicare Advantage plans use networks and an annual out-of-pocket maximum.",
      "Always confirm the plan type before quoting coverage or cost share.",
    ],
  },

  "aetna-plan-basics": {
    id: "aetna-plan-basics",
    title: "Aetna Plan Basics",
    moduleName: "Module 1: Aetna Plan Basics",
    programName: "My Journey",
    modality: "article",
    duration: 7,
    completedDate: "2026-07-16",
    score: 88,
    intro:
      "This module covers the Aetna plan families you will see most often on calls, and how to read a member's plan record before answering any coverage question.",
    sections: [
      {
        heading: "Plan Families You Will See",
        paragraphs: [
          "Members fall into one of a small number of plan families. Identifying the family first tells you which benefit rules, networks and cost-share tables apply.",
        ],
        bullets: [
          "Commercial employer-sponsored plans — HMO, PPO and high-deductible variants.",
          "Individual and family marketplace plans, organised by metal tier.",
          "Medicare Advantage plans, including plans with Part D included.",
          "Medicaid and dual-eligible plans coordinated with state programmes.",
        ],
      },
      {
        heading: "Reading the Member Record",
        paragraphs: [
          "Every member record shows the plan name, effective dates, network tier and accumulators. Check the effective date before quoting anything — a service delivered outside the coverage window is handled differently.",
          "Accumulators tell you how much of the deductible and out-of-pocket maximum the member has already met this plan year.",
        ],
      },
      {
        heading: "In-Network vs Out-of-Network",
        paragraphs: [
          "In-network providers have negotiated rates and lower member cost share. Out-of-network care may be covered at a reduced level, or not at all on HMO plans, apart from emergency care.",
        ],
      },
      {
        heading: "Key Points",
        bullets: [
          "Identify the plan family before answering any benefit question.",
          "Always confirm effective dates and accumulators.",
          "HMO plans generally do not cover routine out-of-network care.",
        ],
      },
    ],
  },

  "claims-processing": {
    id: "claims-processing",
    title: "Claims Processing",
    moduleName: "Module 2: Claims Processing",
    programName: "My Journey",
    modality: "article",
    duration: 9,
    completedDate: "2026-07-17",
    score: 74,
    intro:
      "This module follows a claim from submission through adjudication to payment, and shows how to explain each stage to a member.",
    sections: [
      {
        heading: "The Claim Lifecycle",
        bullets: [
          "Submission — the provider sends the claim electronically or on paper.",
          "Intake and validation — member, provider and coding details are checked.",
          "Adjudication — benefits, network status and cost share are applied.",
          "Payment and remittance — the provider is paid and the member receives an EOB.",
        ],
        ordered: true,
      },
      {
        heading: "Adjudication Rules",
        paragraphs: [
          "Adjudication applies the plan's benefit rules in a fixed order: eligibility on the date of service, benefit coverage, network status, then accumulators. Only after those checks does the system calculate the allowed amount and the member's share.",
        ],
      },
      {
        heading: "Common Denial Reasons",
        bullets: [
          "CO-4 — the procedure code is inconsistent with the modifier used.",
          "CO-11 — the diagnosis is inconsistent with the procedure.",
          "Member not eligible on the date of service.",
          "Prior authorisation missing for a service that requires it.",
        ],
      },
      {
        heading: "Explaining an EOB",
        paragraphs: [
          "An Explanation of Benefits is not a bill. Walk the member through the billed amount, the allowed amount, what the plan paid and what they owe, then check whether the provider has already billed them.",
        ],
      },
    ],
  },

  "medicare-foundations": {
    id: "medicare-foundations",
    title: "Medicare Foundations",
    moduleName: "Module 1: Medicare Foundations",
    programName: "Medicare CSR Onboarding",
    modality: "article",
    duration: 9,
    completedDate: "2025-09-08",
    score: 92,
    intro:
      "The foundations module sets out what Medicare is, who administers it, and how the programme is structured.",
    sections: [
      {
        heading: "What Medicare Covers",
        paragraphs: [
          "Medicare is the federal health insurance programme for people aged 65 and over, and for certain younger people with disabilities or end-stage renal disease. It is administered by the Centers for Medicare & Medicaid Services (CMS).",
        ],
      },
      {
        heading: "Parts A, B, C and D",
        bullets: [
          "Part A — inpatient hospital, skilled nursing and hospice care.",
          "Part B — outpatient and preventive services.",
          "Part C — Medicare Advantage plans offered by private insurers.",
          "Part D — outpatient prescription drug coverage.",
        ],
      },
      {
        heading: "Medicare Advantage Overview",
        paragraphs: [
          "Medicare Advantage plans must cover everything Original Medicare covers, and usually add extras such as dental, vision or fitness benefits. In exchange, members use a defined network and follow plan rules for referrals and prior authorisation.",
        ],
      },
    ],
  },

  "eligibility-enrolment": {
    id: "eligibility-enrolment",
    title: "Eligibility & Enrolment",
    moduleName: "Module 2: Eligibility & Enrolment",
    programName: "Medicare CSR Onboarding",
    modality: "article",
    duration: 10,
    completedDate: "2025-09-15",
    score: 86,
    intro:
      "This module covers who qualifies for Medicare and the windows in which they can join or change a plan.",
    sections: [
      {
        heading: "Eligibility Rules",
        paragraphs: [
          "Most people qualify at 65 if they or their spouse paid Medicare taxes for at least ten years. People under 65 qualify after 24 months of disability benefits, or immediately with ALS or end-stage renal disease.",
        ],
      },
      {
        heading: "Enrolment Periods",
        bullets: [
          "Initial Enrolment Period — the seven months around the member's 65th birthday.",
          "Annual Enrolment Period — 15 October to 7 December each year.",
          "Medicare Advantage Open Enrolment — 1 January to 31 March.",
          "Special Enrolment Periods — triggered by qualifying life events.",
        ],
      },
      {
        heading: "Special Enrolment Periods and Exceptions",
        paragraphs: [
          "A Special Enrolment Period lets a member change coverage outside the standard windows. Common triggers include moving out of the plan's service area, losing employer coverage, or a change in Medicaid or Extra Help status.",
        ],
      },
      {
        heading: "Dual Eligibles and D-SNPs",
        paragraphs: [
          "Members with both Medicare and Medicaid may enrol in a Dual Eligible Special Needs Plan, which coordinates both programmes and typically has very low or no cost share.",
        ],
      },
    ],
  },

  "coverage-determination-cob": {
    id: "coverage-determination-cob",
    title: "Coverage Determination & COB",
    moduleName: "Module 3: Coverage Determination & COB",
    programName: "Medicare CSR Onboarding",
    modality: "article",
    duration: 10,
    completedDate: "2025-09-22",
    score: 88,
    intro:
      "This module explains how coverage decisions are made and how payment responsibility is ordered when a member has more than one plan.",
    sections: [
      {
        heading: "Understanding Coverage Determinations",
        paragraphs: [
          "A coverage determination is the plan's decision about whether a service or drug is covered, and how much the member must pay. Determinations can be standard or expedited when the member's health is at risk.",
        ],
      },
      {
        heading: "Coordination of Benefits Rules",
        paragraphs: [
          "When a member has more than one source of coverage, coordination of benefits decides which plan pays first. Medicare is usually secondary to active employer coverage for larger employers, and primary in most retiree situations.",
        ],
        bullets: [
          "Identify every active coverage on the member's record.",
          "Establish the primary payer before quoting any cost share.",
          "The secondary plan may pick up coinsurance the primary did not pay.",
        ],
      },
      {
        heading: "Documenting the Decision",
        paragraphs: [
          "Record the coverage rule you applied and the source you checked. Clear documentation protects the member if the decision is later appealed.",
        ],
      },
    ],
  },

  "claims-submission-billing": {
    id: "claims-submission-billing",
    title: "Claims Submission & Billing Basics",
    moduleName: "Module 4: Claims & Billing",
    programName: "Medicare CSR Onboarding",
    modality: "article",
    duration: 8,
    completedDate: "2025-09-29",
    score: 90,
    intro:
      "How claims reach the plan, how they are billed, and what a member sees afterwards.",
    sections: [
      {
        heading: "How Claims Are Submitted",
        paragraphs: [
          "Most claims arrive electronically from the provider within days of the service. Members only submit claims themselves in limited situations, such as care received abroad or from a non-participating provider.",
        ],
      },
      {
        heading: "Billing Basics",
        bullets: [
          "Billed amount — what the provider charges.",
          "Allowed amount — the contracted rate the plan recognises.",
          "Plan paid — the plan's share after benefits are applied.",
          "Member responsibility — deductible, copay or coinsurance owed.",
        ],
      },
      {
        heading: "Timely Filing",
        paragraphs: [
          "Claims must be filed within the plan's timely filing window, generally twelve months from the date of service. Late claims are denied and cannot be billed to the member when the provider is in network.",
        ],
      },
    ],
  },

  "dispute-resolution": {
    id: "dispute-resolution",
    title: "Dispute Resolution & Appeals",
    moduleName: "Module 4: Claims & Billing",
    programName: "Medicare CSR Onboarding",
    modality: "article",
    duration: 10,
    intro:
      "Understanding how to handle disputes and appeals is a critical part of your role as a Medicare CSR. When a member or provider disagrees with a coverage decision, they have the right to challenge it through a formal process.",
    sections: [
      {
        heading: "What is an Appeal?",
        paragraphs: [
          "An appeal is a formal request to review a decision that was made about a member's Medicare coverage or claim. Appeals can be filed by the member, their representative, or their treating provider.",
          "Common reasons for appeals include:",
        ],
        bullets: [
          "A claim was denied or only partially paid",
          "A service was determined not to be medically necessary",
          "A prior authorisation request was denied",
          "The member was discharged from a facility and disagrees with the decision",
        ],
      },
      {
        heading: "The Appeals Process",
        paragraphs: [
          "Medicare Advantage plans must follow a structured appeals process with defined timeframes:",
        ],
        ordered: true,
        bullets: [
          "Redetermination — the first level of appeal. The plan reviews the original decision. Standard timeframe: 60 days.",
          "Reconsideration — the case is sent to an Independent Review Entity (IRE). Timeframe: 60 days.",
          "Administrative Law Judge (ALJ) hearing — available if the amount in controversy meets the threshold. Timeframe: 90 days to request.",
          "Medicare Appeals Council — reviews ALJ decisions. Timeframe: 60 days to request.",
          "Federal District Court — final level of appeal, subject to the amount in controversy.",
        ],
      },
      {
        heading: "Expedited Appeals",
        paragraphs: [
          "When a member's health is at serious risk, an expedited (fast) appeal can be requested. The plan must respond within 72 hours for standard expedited requests and 24 hours when the member is still receiving the service in question.",
        ],
      },
      {
        heading: "Grievances vs Appeals",
        paragraphs: ["It is important to distinguish between grievances and appeals:"],
        bullets: [
          "A grievance is a complaint about the quality of care or service received — not about a coverage or payment decision.",
          "An appeal is specifically about a coverage, prior authorisation, or payment decision.",
        ],
      },
      {
        heading: "Your Role",
        paragraphs: [
          "As a CSR, you will often be the first point of contact when a member wants to dispute a decision. Your responsibilities include:",
        ],
        bullets: [
          "Listening carefully and documenting the member's concern",
          "Identifying whether the issue is a grievance or an appeal",
          "Explaining the appeals process clearly and compassionately",
          "Ensuring the member or their representative knows their rights and timeframes",
          "Escalating complex cases to the appropriate team",
        ],
      },
    ],
    takeaways: [
      "An appeal challenges a coverage or payment decision; a grievance is about quality of care or service.",
      "Appeals move through redetermination, reconsideration, ALJ hearing, Appeals Council and federal court.",
      "Expedited appeals must be answered within 72 hours, or 24 hours while the service is ongoing.",
    ],
  },
};

/** Legacy / mock session ids that map onto registry entries. */
const ALIASES: Record<string, string> = {
  s1: "medicare-plan-types",
  s2: "coverage-determination",
  "s-video": "medicare-plan-types",
  "s-article": "coverage-determination",
  mod1: "aetna-plan-basics",
  mod2: "claims-processing",
};

export function getReviewContent(
  id: string | undefined,
  fallbackId: string,
): ReviewContentEntry {
  if (id) {
    const resolved = ALIASES[id] ?? id;
    const entry = reviewContent[resolved];
    if (entry) return entry;
  }
  return reviewContent[fallbackId];
}