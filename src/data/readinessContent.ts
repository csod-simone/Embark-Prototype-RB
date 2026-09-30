import type { ReviewContentEntry } from "@/data/reviewContent";
import type { OrgId } from "@/hooks/use-organisation";

/**
 * Learning content for the Project Readiness journey. Mirrors the shape of
 * the upskiller content registry so the readiness session view can reuse the
 * same player, steps sidebar and completion gating.
 */
export const readinessContent: Record<string, ReviewContentEntry> = {
  a8: {
    id: "a8",
    title: "Data migration patterns and cutover planning",
    moduleName: "Project Readiness · Knowledge & Skills",
    programName: "Meridian Bank — Platform Migration",
    modality: "article",
    duration: 45,
    intro:
      "Migration strategies, reconciliation approaches, and how cutover windows are planned and rehearsed.",
    sections: [
      {
        heading: "Choosing a migration pattern",
        paragraphs: [
          "Most platform migrations land on one of three patterns: big-bang cutover, phased migration by domain, or parallel run with reconciliation. The pattern you choose is driven by tolerance for downtime and by how reversible the change needs to be.",
          "Meridian's cutover window is short and the client is sensitive to risk, so the programme is running a phased migration by data domain with a parallel run on balances.",
        ],
      },
      {
        heading: "Reconciliation approaches",
        bullets: [
          "Row counts per domain, taken at the same logical point on both sides.",
          "Control totals on monetary fields, reconciled to the penny before sign-off.",
          "Sampled record-level comparison for fields that carry business meaning.",
          "An exception log with a named owner for every unreconciled difference.",
        ],
      },
      {
        heading: "Planning and rehearsing the cutover",
        bullets: [
          "Write the runbook as a timed sequence with explicit go / no-go gates.",
          "Rehearse the full runbook at least twice against production-like volumes.",
          "Time every step in rehearsal — the plan is only credible with measured durations.",
          "Agree the rollback trigger and who is authorised to call it before the window opens.",
        ],
        ordered: true,
      },
    ],
    takeaways: [
      "The migration pattern follows downtime tolerance and reversibility.",
      "Reconciliation needs control totals, not just row counts.",
      "A cutover plan is only credible once it has been rehearsed and timed.",
    ],
  },

  a9: {
    id: "a9",
    title: "Meridian platform architecture essentials",
    moduleName: "Project Readiness · Knowledge & Skills",
    programName: "Meridian Bank — Platform Migration",
    modality: "video",
    duration: 35,
    intro:
      "The client's current architecture, integration surface and the constraints that shape the target state.",
    sections: [
      {
        heading: "The current estate",
        paragraphs: [
          "Meridian runs a core banking platform surrounded by a layer of integration services built over fifteen years. Most downstream systems read from a nightly extract rather than from the core directly.",
        ],
      },
      {
        heading: "The integration surface",
        bullets: [
          "Batch extracts consumed by reporting, risk and the data warehouse.",
          "A synchronous services layer used by the customer-facing channels.",
          "A message bus carrying events to the fraud and notification platforms.",
        ],
      },
      {
        heading: "Constraints that shape the target state",
        paragraphs: [
          "Regulatory reporting cannot be interrupted, the nightly batch window is fixed, and any change to the customer-facing channels needs a separate change approval. These three constraints explain most of the sequencing decisions in the programme plan.",
        ],
      },
    ],
    takeaways: [
      "Most downstream systems read the nightly extract, not the core.",
      "The batch window is fixed — sequencing is built around it.",
      "Channel changes carry a separate approval path.",
    ],
  },

  a10: {
    id: "a10",
    title: "Client communication in regulated environments",
    moduleName: "Project Readiness · Knowledge & Skills",
    programName: "Meridian Bank — Platform Migration",
    modality: "article",
    duration: 30,
    intro:
      "Practise presenting risk, delay and trade-offs to a regulated client without eroding confidence.",
    sections: [
      {
        heading: "Scenario brief",
        paragraphs: [
          "You are speaking with Meridian's implementation lead the day after a rehearsal overran its window. They are calm but pointed, and they will press for a firm commitment on the cutover date.",
        ],
      },
      {
        heading: "What you are practising",
        bullets: [
          "Leading with the fact and the impact before the mitigation.",
          "Separating what is known from what is still being confirmed.",
          "Offering a decision point with a date rather than an open-ended reassurance.",
        ],
      },
      {
        heading: "How you are assessed",
        paragraphs: [
          "Your structure, transparency and the credibility of your commitments are scored. Strong performance strengthens the SKILLS domain of your readiness score.",
        ],
      },
    ],
    takeaways: [
      "Fact, impact, mitigation — in that order.",
      "Never commit to a date you have not measured.",
      "Close with a decision point, not an open-ended reassurance.",
    ],
  },
};

/** Rathbones IM Intake learning content (CISI IAD + Core Competencies). */
export const rathbonesReadinessContent: Record<string, ReviewContentEntry> = {
  a8: {
    id: "a8",
    title: "UK Regulation and Professional Integrity",
    moduleName: "Role Readiness · Professional Qualifications",
    programName: "IM Intake · February 2026 · London",
    modality: "article",
    duration: 45,
    intro:
      "UK regulatory environment, FCA principles, conduct of business, ethics, financial crime, and redress for Rathbones investment professionals.",
    sections: [
      {
        heading: "The UK regulatory environment",
        paragraphs: [
          "Investment advice at Rathbones sits under the Financial Conduct Authority. The Consumer Duty, COBS rules, and the Senior Managers & Certification Regime shape every client conversation you will have as an Investment Manager.",
          "Your IM Intake treats regulation as a living practice — not a one-time exam topic. Line manager Phoebe Kapoor will look for evidence that you can apply principles in role-play, not only recite them.",
        ],
      },
      {
        heading: "Conduct, integrity and financial crime",
        bullets: [
          "Treat clients fairly and communicate in clear, non-misleading language.",
          "Document suitability rationale before recommending a change of mandate.",
          "Recognise red flags for market abuse, money laundering and conflicts of interest.",
          "Know when to escalate to Compliance rather than resolve alone.",
        ],
      },
      {
        heading: "Redress and complaints",
        bullets: [
          "Acknowledge the client's concern promptly and without defensiveness.",
          "Separate the facts you can verify from what still needs investigation.",
          "Log the complaint through the firm process and own the follow-up date.",
          "Never trade speed of resolution for incomplete investigation.",
        ],
        ordered: true,
      },
    ],
    takeaways: [
      "FCA principles apply in every client conversation, not only assessments.",
      "Suitability documentation protects both the client and the firm.",
      "Escalate early when financial crime or conflict indicators appear.",
    ],
  },

  a9: {
    id: "a9",
    title: "Managing Investments — core competency",
    moduleName: "Role Readiness · Core Competencies",
    programName: "IM Intake · February 2026 · London",
    modality: "video",
    duration: 35,
    intro:
      "Investment principles, portfolio construction, and client-focused decision-making essential for Rathbones investment professionals.",
    sections: [
      {
        heading: "Investment principles in practice",
        paragraphs: [
          "Managing Investments at Rathbones means translating a client's objectives and risk tolerance into a coherent portfolio — not chasing returns in isolation. Construction decisions should be explainable in plain language to the client and defensible to faculty review.",
        ],
      },
      {
        heading: "Portfolio construction checkpoints",
        bullets: [
          "Objectives, time horizon and capacity for loss come before product selection.",
          "Asset allocation reflects the mandate, not the latest market narrative.",
          "Liquidity, tax wrappers and charges are part of suitability, not afterthoughts.",
          "Rebalancing rules are agreed up front so reviews stay disciplined.",
        ],
      },
      {
        heading: "Client-focused decision-making",
        paragraphs: [
          "When markets move, your job is to reconnect recommendations to the client's plan. Line managers look for Investment Managers who can hold a steady narrative under pressure rather than react to every headline.",
        ],
      },
    ],
    takeaways: [
      "Objectives and risk capacity come before instruments.",
      "Every construction choice should be explainable to the client.",
      "Discipline under market pressure is part of the competency.",
    ],
  },

  a10: {
    id: "a10",
    title: "Managing Clients — suitability role-play",
    moduleName: "Role Readiness · Core Competencies",
    programName: "IM Intake · February 2026 · London",
    modality: "article",
    duration: 30,
    intro:
      "Practise client relationships, communication, trust-building and empathetic engagement in a regulated advice setting.",
    sections: [
      {
        heading: "Scenario brief",
        paragraphs: [
          "You are meeting practice client Helen Ashford, a high-net-worth client who is anxious about market volatility and wants to move everything to cash. Line manager Phoebe Kapoor is observing. Your goal is a calm suitability conversation that explores objectives before recommending action.",
        ],
      },
      {
        heading: "What you are practising",
        bullets: [
          "Acknowledging emotion without letting it dictate the recommendation.",
          "Confirming objectives, time horizon and capacity for loss before product talk.",
          "Explaining risk and suitability in plain language without jargon.",
          "Closing with a clear next step and documentation of the advice given.",
        ],
      },
      {
        heading: "How you are assessed",
        paragraphs: [
          "Empathy, structure, suitability discipline and regulatory awareness are scored. Strong performance strengthens the SKILLS domain of your role readiness score.",
        ],
      },
    ],
    takeaways: [
      "Acknowledge emotion, then return to objectives.",
      "Suitability before products — every time.",
      "Close with a dated next step and a clear record.",
    ],
  },
};

/** Learning activity ids in journey order. */
export const READINESS_LEARNING_ORDER = ["a8", "a9", "a10"] as const;

export const isReadinessLearningItem = (id: string) =>
  id in readinessContent || id in rathbonesReadinessContent;

/** Learning activities that require a knowledge check before completing. */
export const READINESS_ASSESSMENT_ITEMS = ["a8", "a9"] as const;

export const requiresAssessment = (id: string) =>
  (READINESS_ASSESSMENT_ITEMS as readonly string[]).includes(id);

export type ReadinessQuestion = {
  id: string;
  sectionLabel: string;
  scenario?: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
};

export const READINESS_QUESTIONS: Record<string, ReadinessQuestion[]> = {
  a8: [
    {
      id: "q1",
      sectionLabel: "Migration patterns",
      prompt:
        "Which two factors primarily drive the choice of migration pattern on a platform migration?",
      options: [
        { id: "A", text: "Team size and reporting cadence" },
        { id: "B", text: "Tolerance for downtime and how reversible the change needs to be" },
        { id: "C", text: "Contract value and renewal timing" },
        { id: "D", text: "The number of downstream systems only" },
      ],
      correctId: "B",
    },
    {
      id: "q2",
      sectionLabel: "Reconciliation",
      prompt: "Why are row counts alone insufficient as a reconciliation control?",
      options: [
        { id: "A", text: "They take too long to produce on large domains" },
        { id: "B", text: "They cannot be automated" },
        { id: "C", text: "They confirm volume but not the values carried in each record" },
        { id: "D", text: "They are only valid on a parallel run" },
      ],
      correctId: "C",
    },
    {
      id: "q3",
      sectionLabel: "Cutover planning",
      scenario:
        "The runbook has been written but never executed end to end. The client asks you to confirm the cutover duration.",
      prompt: "What is the correct response?",
      options: [
        { id: "A", text: "Give the estimate from the plan — it was reviewed by the team" },
        {
          id: "B",
          text: "State that durations are only credible once the runbook has been rehearsed and timed, and give a date for that rehearsal",
        },
        { id: "C", text: "Decline to answer until cutover is complete" },
        { id: "D", text: "Add a contingency buffer and commit to the padded number" },
      ],
      correctId: "B",
    },
    {
      id: "q4",
      sectionLabel: "Rollback",
      prompt: "When should the rollback trigger and its owner be agreed?",
      options: [
        { id: "A", text: "During the cutover, once the first exception appears" },
        { id: "B", text: "Before the cutover window opens" },
        { id: "C", text: "After the first rehearsal has failed" },
        { id: "D", text: "Only if the client requests it" },
      ],
      correctId: "B",
    },
  ],
  a9: [
    {
      id: "q1",
      sectionLabel: "Current estate",
      prompt: "How do most downstream systems at Meridian currently read core data?",
      options: [
        { id: "A", text: "Directly from the core banking platform" },
        { id: "B", text: "From a nightly extract" },
        { id: "C", text: "From the customer-facing channels" },
        { id: "D", text: "From the fraud platform's event store" },
      ],
      correctId: "B",
    },
    {
      id: "q2",
      sectionLabel: "Integration surface",
      prompt: "Which part of the integration surface serves the customer-facing channels?",
      options: [
        { id: "A", text: "The batch extracts" },
        { id: "B", text: "The synchronous services layer" },
        { id: "C", text: "The data warehouse" },
        { id: "D", text: "The notification platform" },
      ],
      correctId: "B",
    },
    {
      id: "q3",
      sectionLabel: "Constraints",
      prompt: "Which constraint explains most of the sequencing decisions in the programme plan?",
      options: [
        { id: "A", text: "The fixed nightly batch window" },
        { id: "B", text: "The size of the delivery team" },
        { id: "C", text: "The client's procurement calendar" },
        { id: "D", text: "The choice of message bus technology" },
      ],
      correctId: "A",
    },
    {
      id: "q4",
      sectionLabel: "Change control",
      prompt: "What is true of changes to the customer-facing channels?",
      options: [
        { id: "A", text: "They follow the same approval path as batch changes" },
        { id: "B", text: "They require a separate change approval" },
        { id: "C", text: "They are out of scope for the migration" },
        { id: "D", text: "They can be made during the cutover window without approval" },
      ],
      correctId: "B",
    },
  ],
};

export const RATHBONES_READINESS_QUESTIONS: Record<string, ReadinessQuestion[]> = {
  a8: [
    {
      id: "q1",
      sectionLabel: "Regulatory environment",
      prompt:
        "Which regulator primarily governs investment advice delivered by Rathbones Investment Managers?",
      options: [
        { id: "A", text: "The Competition and Markets Authority" },
        { id: "B", text: "The Financial Conduct Authority (FCA)" },
        { id: "C", text: "HM Revenue & Customs" },
        { id: "D", text: "The Bank of England only" },
      ],
      correctId: "B",
    },
    {
      id: "q2",
      sectionLabel: "Suitability",
      prompt: "When should the suitability rationale be documented?",
      options: [
        { id: "A", text: "After the client has accepted the recommendation" },
        { id: "B", text: "Only if Compliance requests it" },
        { id: "C", text: "Before recommending a change of mandate" },
        { id: "D", text: "At the annual review only" },
      ],
      correctId: "C",
    },
    {
      id: "q3",
      sectionLabel: "Financial crime",
      scenario:
        "A practice client asks you to move a large unexplained cash deposit into a discretionary portfolio this week and avoid 'unnecessary paperwork'.",
      prompt: "What is the correct response?",
      options: [
        { id: "A", text: "Process the trade to protect the relationship, then document later" },
        {
          id: "B",
          text: "Pause, gather source-of-funds information, and escalate to Compliance if concerns remain",
        },
        { id: "C", text: "Refuse all future business with the client immediately" },
        { id: "D", text: "Ask a colleague to process the trade under their login" },
      ],
      correctId: "B",
    },
    {
      id: "q4",
      sectionLabel: "Complaints",
      prompt: "What should you do first when a client raises a complaint in a meeting?",
      options: [
        { id: "A", text: "Defend the original recommendation in detail" },
        { id: "B", text: "Acknowledge the concern promptly and without defensiveness" },
        { id: "C", text: "Offer a fee rebate before investigating" },
        { id: "D", text: "Ask them to put everything in writing before you will listen" },
      ],
      correctId: "B",
    },
  ],
  a9: [
    {
      id: "q1",
      sectionLabel: "Construction order",
      prompt: "What should come before product or instrument selection?",
      options: [
        { id: "A", text: "The latest market commentary" },
        { id: "B", text: "Objectives, time horizon and capacity for loss" },
        { id: "C", text: "Peer portfolio performance tables" },
        { id: "D", text: "The firm's house view alone" },
      ],
      correctId: "B",
    },
    {
      id: "q2",
      sectionLabel: "Suitability in construction",
      prompt: "Which factors are part of suitability when constructing a portfolio?",
      options: [
        { id: "A", text: "Liquidity, tax wrappers and charges" },
        { id: "B", text: "Only expected return" },
        { id: "C", text: "Only the adviser's preferred funds" },
        { id: "D", text: "Marketing materials from product providers" },
      ],
      correctId: "A",
    },
    {
      id: "q3",
      sectionLabel: "Market pressure",
      prompt: "When markets move sharply, what does faculty look for from an Investment Manager?",
      options: [
        { id: "A", text: "Immediate full switch to cash" },
        {
          id: "B",
          text: "A steady narrative that reconnects recommendations to the client's plan",
        },
        { id: "C", text: "Silence until volatility settles" },
        { id: "D", text: "Copying the most active peer's trades" },
      ],
      correctId: "B",
    },
    {
      id: "q4",
      sectionLabel: "Rebalancing",
      prompt: "Why agree rebalancing rules up front?",
      options: [
        { id: "A", text: "So reviews stay disciplined when markets are noisy" },
        { id: "B", text: "So Compliance never needs to be involved" },
        { id: "C", text: "So clients cannot ask questions" },
        { id: "D", text: "So charges can be increased quietly" },
      ],
      correctId: "A",
    },
  ],
};

export function getReadinessContentMap(org: OrgId = "nexus"): Record<string, ReviewContentEntry> {
  return org === "rathbones" ? rathbonesReadinessContent : readinessContent;
}

export function getReadinessQuestionsMap(org: OrgId = "nexus"): Record<string, ReadinessQuestion[]> {
  return org === "rathbones" ? RATHBONES_READINESS_QUESTIONS : READINESS_QUESTIONS;
}
