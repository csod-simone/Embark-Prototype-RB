import type { RolePlayScenario } from "./types";

const COACH_VISIBILITY =
  "Private to you. Nothing is shared unless you create a link.";

const ADVICE_SAFETY =
  "Do not give personalised investment advice that would require authorisation beyond your current permissions. Do not guarantee returns. Escalate if the client becomes abusive or demands an unsuitable instruction without process.";

const SUITABILITY_CONSTRAINTS =
  "You have 15 minutes (20 max). Confirm objectives and capacity for loss before discussing products. Document any advice given. You may not execute a full-cash instruction without a suitability review.";

const SUITABILITY_FOCUS = [
  {
    id: "empathy",
    label: "Acknowledge emotion without agreeing to an unsuitable instruction",
    touchKeywords: ["understand", "hear", "anxious", "unsettled", "concern"],
  },
  {
    id: "suitability",
    label: "Confirm objectives and capacity for loss before products",
    touchKeywords: ["objective", "capacity for loss", "risk tolerance", "goals", "mandate"],
  },
  {
    id: "clarity",
    label: "Explain risk in plain language",
    touchKeywords: ["risk", "volatility", "downside", "plain", "in other words"],
  },
  {
    id: "close",
    label: "Close with a clear next step and documentation",
    touchKeywords: ["next step", "follow up", "document", "file note", "summary"],
  },
] as const;

const helenFeedbackBase = {
  score: 78,
  confidence: "Medium" as const,
  skills: [
    {
      name: "Empathy",
      confidence: "High" as const,
      score: 86,
      evidence:
        "You acknowledged Helen's anxiety before steering back to objectives, which kept trust intact.",
    },
    {
      name: "Suitability Discipline",
      confidence: "High" as const,
      score: 82,
      evidence:
        "You refused to jump straight to a cash instruction and returned to objectives and capacity for loss.",
    },
    {
      name: "Clarity",
      confidence: "Medium" as const,
      score: 72,
      evidence:
        "Risk language was mostly plain, though one explanation still used jargon Helen may not follow.",
    },
    {
      name: "Close & Record",
      confidence: "Medium" as const,
      score: 74,
      evidence:
        "You proposed a next step, but the documentation of advice could have been stated more explicitly.",
    },
  ],
  worked: [
    "You acknowledged emotion without agreeing to an unsuitable instruction.",
    "You returned to objectives before discussing products.",
    "You kept the conversation calm under pressure.",
  ],
  improve: [
    "Avoid any residual jargon when explaining downside risk.",
    "State clearly what will be recorded in the suitability file note.",
    "Offer a dated follow-up rather than an open-ended check-in.",
  ],
  outcome:
    "You addressed Helen's distress and cash demand with empathy, but the plain-language risk explanation and an explicit suitability file-note remained incomplete.",
  workedHighlights: [
    {
      label: "Empathy and validation",
      detail:
        "You said 'I can hear how unsettled this feels,' and separated acknowledgement from agreeing to an unsuitable instruction.",
    },
    {
      label: "Suitability discipline",
      detail:
        "You redirected from the Friday cash demand to confirming objectives and capacity for loss before any product talk.",
    },
    {
      label: "Calm under pressure",
      detail:
        "You kept a steady tone when Helen escalated urgency, preserving trust while staying inside process.",
    },
  ],
  practiceNext: [
    {
      label: "Plain-language risk",
      detail:
        "One explanation still leaned on jargon; before closing, restate the downside in everyday terms Helen can repeat back.",
    },
    {
      label: "Documentation and follow-up",
      detail:
        "You proposed a next step, but didn't state what will be recorded in the suitability file note or offer a dated follow-up.",
    },
  ],
  goalEvidence: [
    {
      criterionId: "empathy",
      label: "Acknowledge emotion without agreeing to an unsuitable instruction",
      status: "achieved" as const,
      evidence:
        '"I can hear how unsettled this feels, Helen. Before we act on moving everything to cash, I want to make sure the decision fits your objectives — can we look at that together?"',
    },
    {
      criterionId: "suitability",
      label: "Confirm objectives and capacity for loss before products",
      status: "partial" as const,
      evidence:
        '"Let\'s revisit what you need this portfolio to do over the next few years before we change anything."',
    },
    {
      criterionId: "clarity",
      label: "Explain risk in plain language",
      status: "not-demonstrated" as const,
      evidence:
        "You had a relevant opportunity, but the risk explanation stayed in technical terms — the required behaviour wasn't demonstrated.",
    },
    {
      criterionId: "close",
      label: "Close with a clear next step and documentation",
      status: "partial" as const,
      evidence:
        '"I\'ll come back to you before Friday with a written summary of what we agreed."',
    },
  ],
  criterionReviews: [
    {
      criterionId: "empathy",
      ordinal: "Strong" as const,
      status: "achieved" as const,
      narrative:
        "You named Helen's anxiety early and separated empathy from agreement — that kept the relationship open while protecting suitability.",
      evidenceQuote: "I can hear how unsettled this feels",
    },
    {
      criterionId: "suitability",
      ordinal: "Proficient" as const,
      status: "partial" as const,
      narrative:
        "You redirected from the cash demand to objectives and capacity for loss before product talk. Strengthen by stating the mandate check aloud.",
      evidenceQuote: "confirm your objectives and capacity for loss",
    },
    {
      criterionId: "clarity",
      ordinal: "Developing" as const,
      status: "not-demonstrated" as const,
      narrative:
        "Most risk language was accessible, but one phrase still leaned on jargon. Rephrase downside in everyday terms next time.",
      evidenceQuote: "markets have been volatile",
    },
    {
      criterionId: "close",
      ordinal: "Proficient" as const,
      status: "partial" as const,
      narrative:
        "You proposed a next step. Make the file-note and dated follow-up explicit so the close is auditable.",
      evidenceQuote: "decide together on the next step",
    },
  ],
};

const marcusFeedbackBase = {
  score: 74,
  confidence: "Medium" as const,
  skills: [
    {
      name: "Empathy",
      confidence: "High" as const,
      score: 84,
      evidence:
        "You acknowledged Marcus's retirement anxiety before steering back to objectives, which kept trust intact.",
    },
    {
      name: "Suitability Discipline",
      confidence: "High" as const,
      score: 80,
      evidence:
        "You refused to jump straight to an all-gilt switch and returned to objectives and capacity for loss.",
    },
    {
      name: "Clarity",
      confidence: "Medium" as const,
      score: 70,
      evidence:
        "Risk language was mostly plain, though one explanation still used jargon Marcus may not follow.",
    },
    {
      name: "Close & Record",
      confidence: "Medium" as const,
      score: 72,
      evidence:
        "You proposed a next step, but the documentation of advice could have been stated more explicitly.",
    },
  ],
  worked: [
    "You acknowledged emotion without agreeing to an unsuitable instruction.",
    "You returned to objectives before discussing products.",
    "You kept the conversation calm under pressure.",
  ],
  improve: [
    "Avoid any residual jargon when explaining downside risk.",
    "State clearly what will be recorded in the suitability file note.",
    "Offer a dated follow-up rather than an open-ended check-in.",
  ],
  outcome:
    "In this formative you addressed Marcus's distress and gilt demand with empathy, but the plain-language risk explanation and an explicit suitability file-note remained incomplete — strengthen both before the module assessment.",
  workedHighlights: [
    {
      label: "Empathy and validation",
      detail:
        "You said 'I can hear how unsettling this feels after retiring,' and separated acknowledgement from agreeing to an unsuitable all-gilt switch.",
    },
    {
      label: "Suitability discipline",
      detail:
        "You redirected from the month-end gilt demand to confirming objectives and capacity for loss before any product talk.",
    },
    {
      label: "Calm under pressure",
      detail:
        "You kept a steady tone when Marcus escalated urgency, preserving trust while staying inside process.",
    },
  ],
  practiceNext: [
    {
      label: "Plain-language risk",
      detail:
        "One explanation still leaned on jargon; before closing, restate the downside in everyday terms Marcus can repeat back.",
    },
    {
      label: "Documentation and follow-up",
      detail:
        "You proposed a next step, but didn't state what will be recorded in the suitability file note or offer a dated follow-up.",
    },
  ],
  goalEvidence: [
    {
      criterionId: "empathy",
      label: "Acknowledge emotion without agreeing to an unsuitable instruction",
      status: "achieved" as const,
      evidence:
        '"I can hear how unsettling this feels after retiring, Marcus. Before we move everything into gilts, I want to make sure the decision fits your objectives — can we look at that together?"',
    },
    {
      criterionId: "suitability",
      label: "Confirm objectives and capacity for loss before products",
      status: "partial" as const,
      evidence:
        '"Let\'s revisit what you need this portfolio to do now that you\'ve stopped working before we change anything."',
    },
    {
      criterionId: "clarity",
      label: "Explain risk in plain language",
      status: "not-demonstrated" as const,
      evidence:
        "You had a relevant opportunity, but the risk explanation stayed in technical terms — the required behaviour wasn't demonstrated.",
    },
    {
      criterionId: "close",
      label: "Close with a clear next step and documentation",
      status: "partial" as const,
      evidence:
        '"I\'ll come back to you before month-end with a written summary of what we agreed."',
    },
  ],
  criterionReviews: [
    {
      criterionId: "empathy",
      ordinal: "Strong" as const,
      status: "achieved" as const,
      narrative:
        "You named Marcus's retirement anxiety early and separated empathy from agreement — that kept the relationship open while protecting suitability.",
      evidenceQuote: "I can hear how unsettling this feels after retiring",
    },
    {
      criterionId: "suitability",
      ordinal: "Proficient" as const,
      status: "partial" as const,
      narrative:
        "You redirected from the gilt demand to objectives and capacity for loss before product talk. Strengthen by stating the mandate check aloud.",
      evidenceQuote: "confirm your objectives and capacity for loss",
    },
    {
      criterionId: "clarity",
      ordinal: "Developing" as const,
      status: "not-demonstrated" as const,
      narrative:
        "Most risk language was accessible, but one phrase still leaned on jargon. Rephrase downside in everyday terms next time.",
      evidenceQuote: "duration risk",
    },
    {
      criterionId: "close",
      ordinal: "Proficient" as const,
      status: "partial" as const,
      narrative:
        "You proposed a next step. Make the file-note and dated follow-up explicit so the close is auditable.",
      evidenceQuote: "decide together on the next step",
    },
  ],
};

/** Practice role-play 1 — Discovery (Managing Clients). */
export const RATHBONES_PRACTICE_DISCOVERY: RolePlayScenario = {
  scoringMode: "practice",
  inputMode: "choice",
  passThreshold: 80,
  maxAttempts: 3,
  attemptNumber: 1,
  scenarioId: "mc-rp1",
  personaName: "James Whitfield",
  personaRole: "Newly inherited HNW client",
  personaDescription:
    "Curious, slightly guarded, and unsure what he wants from Rathbones. Meeting you for a first discovery conversation.",
  situation:
    "James has inherited a discretionary portfolio and booked an introductory discovery call. He wants to understand how you work before sharing full financial details.",
  objective: "Pitch the relationship for new business without rushing to products.",
  objectiveDetail:
    "Build rapport, explore what matters to James, and leave with a clear next step — without recommending instruments.",
  visibilityNote: COACH_VISIBILITY,
  constraints:
    "You have 12 minutes (18 max). Stay in discovery mode. Do not recommend specific instruments. Confirm what he is comfortable sharing today.",
  safetyBoundary: ADVICE_SAFETY,
  scenarioTitle: "Pitching Sales (new business) — James Whitfield",
  timeBudget: { targetMinutes: 12, maxMinutes: 18 },
  focusCriteria: [
    {
      id: "rapport",
      label: "Build rapport and set the agenda",
      touchKeywords: ["agenda", "today", "comfortable", "thank you for"],
    },
    {
      id: "goals",
      label: "Explore goals and life context",
      touchKeywords: ["goal", "objective", "family", "inheritance", "what matters"],
    },
    {
      id: "concerns",
      label: "Surface concerns without rushing to solutions",
      touchKeywords: ["concern", "worry", "risk", "uncertain", "hesitat"],
    },
    {
      id: "next",
      label: "Agree a clear next step",
      touchKeywords: ["next step", "follow up", "schedule", "summary"],
    },
  ],
  openingLine:
    "Thanks for meeting me. I've inherited this portfolio and I'm still figuring out what I actually want from an adviser — where should we start?",
  voiceSampleResponse:
    "I'd like to start by understanding what matters most to you over the next few years, and any concerns you have about the portfolio as it stands — then we can agree what to cover today.",
  feedback: {
    score: 82,
    confidence: "High",
    skills: [
      {
        name: "Rapport",
        confidence: "High",
        score: 88,
        evidence: "You set a clear agenda and invited James to shape the conversation.",
      },
      {
        name: "Discovery depth",
        confidence: "High",
        score: 84,
        evidence: "You explored goals and life context before discussing products.",
      },
      {
        name: "Pacing",
        confidence: "Medium",
        score: 74,
        evidence: "One concern was met with a solution too early — stay curious a beat longer.",
      },
      {
        name: "Close",
        confidence: "High",
        score: 80,
        evidence: "You closed with a concrete follow-up.",
      },
    ],
    worked: [
      "Clear agenda setting early in the call.",
      "Goals explored before any product talk.",
      "Professional, calm tone throughout.",
    ],
    improve: [
      "Hold solutions until concerns are fully heard.",
      "Mirror his language when summarising goals.",
      "Confirm what will be documented after the call.",
    ],
    outcome:
      "You opened discovery with a clear agenda and explored James's goals, but one concern was met with a solution too early and the follow-up artefact was not named.",
    workedHighlights: [
      {
        label: "Agenda and rapport",
        detail:
          "You invited James to shape the conversation and set a calm discovery posture from the start.",
      },
      {
        label: "Goals before products",
        detail:
          "You explored what matters to him over the next few years before any instrument talk.",
      },
      {
        label: "Steady tone",
        detail: "You kept a professional, unhurried tone while he decided how much to share.",
      },
    ],
    practiceNext: [
      {
        label: "Hold the solution",
        detail:
          "When a concern surfaces, stay in listen mode a beat longer before offering any fix or reassurance.",
      },
      {
        label: "Name the follow-up artefact",
        detail:
          "Close by stating what you'll send after the call — a summary, agenda for next time, or discovery note.",
      },
    ],
    goalEvidence: [
      {
        criterionId: "rapport",
        label: "Build rapport and set the agenda",
        status: "achieved",
        evidence:
          '"Thanks for making time — where would you like to start, and what would make today useful for you?"',
      },
      {
        criterionId: "goals",
        label: "Explore goals and life context",
        status: "partial",
        evidence:
          '"What matters most to you over the next few years with this portfolio?"',
      },
      {
        criterionId: "concerns",
        label: "Surface concerns without rushing to solutions",
        status: "not-demonstrated",
        evidence:
          "You had a relevant opportunity, but one concern was met with a solution before James had finished describing it.",
      },
      {
        criterionId: "next",
        label: "Agree a clear next step",
        status: "partial",
        evidence:
          '"Let\'s agree what to cover today and schedule a follow-up." A specific artefact was not named.',
      },
    ],
    criterionReviews: [
      {
        criterionId: "rapport",
        ordinal: "Strong",
        status: "achieved",
        narrative: "You opened with agenda control and invited James in — strong discovery posture.",
        evidenceQuote: "where should we start",
      },
      {
        criterionId: "goals",
        ordinal: "Proficient",
        status: "partial",
        narrative: "Goals and context were explored; dig one layer deeper on time horizon next practice.",
        evidenceQuote: "what matters most to you",
      },
      {
        criterionId: "concerns",
        ordinal: "Developing",
        status: "not-demonstrated",
        narrative: "Concerns surfaced, but one was met with a fix too quickly. Stay in listen mode longer.",
        evidenceQuote: "any concerns you have",
      },
      {
        criterionId: "next",
        ordinal: "Proficient",
        status: "partial",
        narrative: "Next step was clear. Name the artefact you'll send afterwards.",
        evidenceQuote: "agree what to cover today",
      },
    ],
  },
};

/** Practice role-play 2 — Suitability under pressure. */
export const RATHBONES_PRACTICE_SUITABILITY: RolePlayScenario = {
  scoringMode: "practice",
  inputMode: "choice",
  passThreshold: 80,
  maxAttempts: 3,
  attemptNumber: 1,
  scenarioId: "mc-rp2",
  personaName: "Helen Ashford",
  personaRole: "HNW client under market stress",
  personaDescription:
    "Anxious about market volatility and pressing to move her discretionary portfolio entirely to cash by Friday.",
  situation:
    "Helen has asked for an urgent meeting. Markets have been volatile and she wants everything moved to cash by Friday.",
  objective: "Keep suitability discipline while Helen is under pressure.",
  objectiveDetail:
    "Meet her emotion without agreeing to an unsuitable instruction, and don't change the mandate until objectives and capacity for loss are confirmed.",
  visibilityNote: COACH_VISIBILITY,
  constraints: SUITABILITY_CONSTRAINTS,
  safetyBoundary: ADVICE_SAFETY,
  scenarioTitle: "Suitability Meetings — Helen Ashford",
  timeBudget: { targetMinutes: 15, maxMinutes: 20 },
  focusCriteria: [...SUITABILITY_FOCUS],
  openingLine:
    "I don't care about the long-term story right now. I want everything in cash by Friday — can you just do that?",
  voiceSampleResponse:
    "I can hear how unsettled this feels, Helen. Before we change the mandate, I need to confirm your objectives and capacity for loss so any recommendation stays suitable — then we can decide together on the next step.",
  feedback: helenFeedbackBase,
};

/** Scored role-play: Vulnerable Clients. Text of the conversation is scored; tone is not. */
export const RATHBONES_FORMATIVE: RolePlayScenario = {
  scoringMode: "assessment",
  inputMode: "choice",
  passThreshold: 80,
  maxAttempts: 3,
  attemptNumber: 1,
  scenarioId: "mc-rp-f",
  personaName: "Margaret Hale",
  personaRole: "Recently bereaved client",
  personaDescription:
    "Widowed last month and being pressed by a relative to gift a large part of her portfolio. She is anxious, unused to making financial decisions alone, and looking to you to tell her what to do.",
  situation:
    "Margaret has asked for an urgent meeting. A relative wants her to gift a substantial sum this week. She is distressed and keeps asking you to decide for her.",
  objective: "Recognise vulnerability and keep the client in control of the decision.",
  objectiveDetail:
    "Slow the conversation down, check whether Margaret is able to decide today, refuse to take an instruction that looks like financial abuse, and agree a safer next step she understands.",
  visibilityNote: COACH_VISIBILITY,
  constraints:
    "You have 15 minutes (20 max) and up to 3 attempts. Do not accept a large gift instruction in this meeting. Explain the concern in plain language. Offer to pause and involve someone she trusts. Score is based on the text of the conversation.",
  safetyBoundary: ADVICE_SAFETY,
  scenarioTitle: "Vulnerable Clients — Margaret Hale",
  timeBudget: { targetMinutes: 15, maxMinutes: 20 },
  focusCriteria: [...SUITABILITY_FOCUS],
  openingLine:
    "My nephew says I should just give him the money this week. I don't really follow all of this. Can you sort it out for me?",
  voiceSampleResponse:
    "I can hear this feels overwhelming, Margaret. I won't arrange a gift today. Let's slow down, check what you want, and agree a next step you are comfortable with before anyone moves money.",
  feedback: marcusFeedbackBase,
};

/** Default learner Mod3 benefits scenario (Nexus / CVS). */
export const NEXUS_BENEFITS_NAV: RolePlayScenario = {
  scoringMode: "practice",
  inputMode: "choice",
  passThreshold: 70,
  maxAttempts: 3,
  attemptNumber: 1,
  scenarioId: "rp-benefits-nav",
  personaName: "Sandra",
  personaRole: "Medicare member",
  personaDescription: "A skeptical Medicare member frustrated by an unexpected bill",
  situation:
    "Sandra received a $60 bill from her doctor and doesn't understand why she owes anything when she thought Medicare covered her visits. She is calling your service line to sort it out.",
  objective: "Address Sandra's concerns and guide her toward a confident next step.",
  constraints: "Stay within plan benefits guidance. Do not invent coverage rules.",
  safetyBoundary: "Do not provide medical advice. Escalate abusive language to a supervisor path.",
  scenarioTitle: "Benefits Navigation — Medicare Member Call",
  timeBudget: { targetMinutes: 10, maxMinutes: 14 },
  focusCriteria: [
    {
      id: "listen",
      label: "Acknowledge the concern before explaining",
      touchKeywords: ["understand", "hear", "concern", "frustrating"],
    },
    {
      id: "explain",
      label: "Explain the bill in plain language",
      touchKeywords: ["copay", "because", "specifically", "here's why"],
    },
    {
      id: "next",
      label: "Confirm a clear next step",
      touchKeywords: ["next step", "follow up", "summary", "thank you"],
    },
  ],
  openingLine:
    "Hi, yes, I got a bill from my doctor and I don't understand why I owe $60 when I thought Medicare covered everything. Can you help me?",
  voiceSampleResponse:
    "I understand your concern, and here's why that happens — your plan has a copay for specialist visits, specifically $60 per visit.",
  feedback: {
    score: 78,
    confidence: "High",
    skills: [
      {
        name: "Active Listening",
        confidence: "High",
        score: 85,
        evidence:
          "You acknowledged the prospect's concern in turn 3 and reflected it back before responding — this demonstrated strong active listening.",
      },
      {
        name: "Objection Handling",
        confidence: "Medium",
        score: 72,
        evidence:
          "Your response in turn 5 addressed the cost objection but lacked a specific product example to reinforce the point.",
      },
      {
        name: "Product Knowledge",
        confidence: "High",
        score: 80,
        evidence:
          "You accurately referenced Medicare Part D coverage details in turn 4, consistent with the content you completed.",
      },
      {
        name: "Compliance Boundaries",
        confidence: "Medium",
        score: 65,
        evidence:
          "In turn 6, the simulated client asked for a direct investment recommendation. Your response came close to the compliance boundary — review the guidance on regulated advice.",
      },
    ],
    worked: [
      "Strong opening — you established rapport quickly and acknowledged the prospect's situation before diving in.",
      "Accurate and confident product knowledge — your references to Medicare coverage details were correct and well-placed.",
      "Good recovery in turn 7 — after the prospect escalated, you stayed calm and redirected professionally.",
    ],
    improve: [
      "Add more specific examples when handling cost objections — the prospect needed more concrete evidence before moving on.",
      "Be more explicit about next steps at the close — the conversation ended without a clear proposed action for the prospect.",
      "Review the compliance guidance on regulated advice — ensure you know where the boundary is before your next attempt.",
    ],
    criterionReviews: [
      {
        criterionId: "listen",
        ordinal: "Strong",
        narrative: "You acknowledged Sandra's frustration before explaining the bill.",
        evidenceQuote: "I understand your concern",
      },
      {
        criterionId: "explain",
        ordinal: "Proficient",
        narrative: "The copay explanation was clear; add one concrete example next time.",
        evidenceQuote: "copay for specialist visits, specifically $60",
      },
      {
        criterionId: "next",
        ordinal: "Developing",
        narrative: "Close lacked an explicit next action for Sandra.",
        evidenceQuote: "Can you help me?",
      },
    ],
  },
};

export function scenarioForLearnerSessionId(sessionId: string | undefined, org: string): RolePlayScenario {
  if (org === "rathbones") {
    if (sessionId === "mc-rp1") return RATHBONES_PRACTICE_DISCOVERY;
    if (sessionId === "mc-rp2") return RATHBONES_PRACTICE_SUITABILITY;
    if (sessionId === "mc-rp-f") return RATHBONES_FORMATIVE;
    // Legacy / generic role-play link for Rathbones → suitability practice
    if (sessionId === "s3") return RATHBONES_PRACTICE_SUITABILITY;
  }
  return NEXUS_BENEFITS_NAV;
}
